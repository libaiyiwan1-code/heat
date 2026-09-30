import {
  cj88Execute,
  modbusExecute,
  nbExecute,
  outlineExecute, utt100NBExecute,
  wireExecute
} from "@/packBuffer/commander";
import {arrayBuffer2Hex, checkSpontaneous, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {doWritePort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {packCurrentSource, packMeter, packReadCurrent} from "@/packBuffer/encode/packOther";

const Log = require('ee-core/log');

// ============================================================
// 【优化1】type → 串口/数据字段/提示侧的集中映射，消除 8 处 if/else 分发
// ============================================================
const TYPE_CONFIG = {
  one:          { portKey: 'serialPortOne',           dataKey: 'globalReceivedOneData',           side: 'left'  },
  meter:        { portKey: 'serialPortOne',           dataKey: 'globalReceivedOneData',           side: 'left'  },
  cj88:         { portKey: 'serialPortOne',           dataKey: 'globalReceivedOneData',           side: 'left'  },
  two:          { portKey: 'serialPortTwo',           dataKey: 'globalReceivedTwoData',           side: 'right' },
  three:        { portKey: 'serialPortSignalSource',  dataKey: 'globalReceivedSignalSourceData',  side: 'left'  },
  four:         { portKey: 'serialPortCurrentSource', dataKey: 'globalReceivedCurrentSourceData', side: 'left'  },
  currentSource:{ portKey: 'serialPortCurrentSource', dataKey: 'globalReceivedCurrentSourceData', side: 'left'  },
  voltmeter:    { portKey: 'serialPortVoltageSource', dataKey: 'globalReceivedVoltageSourceData', side: 'left'  },
};

const getTypeConf = (type) => TYPE_CONFIG[type] ?? TYPE_CONFIG.one;
const getData     = (context, type) => context.receivedData[getTypeConf(type).dataKey] ?? '';
const setData     = (context, type, v) => { context.receivedData[getTypeConf(type).dataKey] = v; };
const clearData   = (context, type) => setData(context, type, '');
const writePort   = (context, type, buf) => doWritePort(context.portAttributes[getTypeConf(type).portKey], buf, type);

const pushMessage = (context, type, msg, color = 'grey') => {
  getTypeConf(type).side === 'right'
    ? context.createRightSpanMessage(msg, color)
    : context.createLeftSpanMessage(msg, color);
};

// 【优化3】统一重试延时
const RETRY_DELAY = 1500;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 【优化9】无需等待响应的操作
const SKIP_RESPONSE_OPERATIONS = new Set(['自检开启', '不良品提示', '热表温度标定']);
const shouldSkipResponse = (operationName) => SKIP_RESPONSE_OPERATIONS.has(operationName);

// 【优化12】这几类操作即使响应校验失败也视为流程完成，不阻塞后续步骤
const ALWAYS_PASS_ACTIONS = new Set([
  'separationAlarm', 'creditCard', 'mainAndAuxiliaryValvesVerify', 'faceplateCommunication',
]);

/**
 * 通用的串口通信组件
 * @param {Object} context - 上下文对象
 * @param {Object} config - 配置对象
 * @param {string} type - 左或右侧工装 串口类型
 * @param {string} protocolType - 协议类型 NB / 485 / MODBUS / UTM100-NB
 * @returns {Promise<boolean>} - true 表示操作失败，false 表示成功
 */
export const serialPortOperation = async (context, config, type, protocolType = 'NB') => {

  const {
    actionType,                      // 操作类型
    operationName = '操作',           // 操作名称，用于日志和提示
    cmdType,                         // outlineExecute 的命令类型
    cmdCode,                         // outlineExecute 的命令码
    protocolId,                      // 协议ID
    maxRetries = 3,                  // 最大重试次数
    expectedLength,                  // 预期响应长度1(带自发自收)
    expectedLength2 = -1,            // 预期响应长度2(不带自发自收)
    timeout = 3000,                  // 超时时间(ms)
    validateResponse = () => true,   // ⚠️ 返回 true 表示【校验失败，需要重试】
    preprocess = () => true,
    isInfraredDevice = false,         // 是否为红外设备
    isTransparentTransmissionProtocol = false, // 是否为透传协议
    isWireDevice = false,
    withStartFrame = true,            // 是否包含起始帧
    uplinkCommunicationTarget = {
      baudRate: 2400,
      method: 'MODBUS',
      checkDigit: '偶校验',
      includeUTM100Device: false
    },
  } = config;

  // 【优化5】原接口 validateResponse 返回 true=失败，语义反直觉。内部立刻改名为 isInvalidResponse
  const isInvalidResponse = validateResponse;

  context.buttonDisabled();

  let retries = 0;
  let notPass = true;   // true = 失败

  // 【优化8】组包逻辑抽成独立函数
  const packBuffer = buildPackBuffer(context, {
    type, protocolType, isWireDevice, isTransparentTransmissionProtocol,
    cmdType, cmdCode, protocolId, uplinkCommunicationTarget, withStartFrame,
  });

  console.log(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));
  Log.info(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));

  while (notPass && retries < maxRetries) {
    clearData(context, type);   // 【优化1】一处代替五处 if/else

    // 写入串口
    try {
      await writePort(context, type, packBuffer);
    } catch (error) {
      // 【优化2】传入 type，让 handleError 清理正确的数据字段
      await handleError(context, operationName, '写入串口失败', actionType, type);
      console.error('Failed to write port:', error.message);
      break;
    }

    // 等待响应
    if (!shouldSkipResponse(operationName)) {
      const interval = operationName === '有线设备读地址' ? 50 : RETRY_DELAY;
      // 【优化4】两个 waitForResponse 合并为一个，用 interval 参数区分
      const response = await waitForResponse(
        context, timeout, expectedLength, expectedLength2, type, operationName, interval
      );

      if (!response) {
        retries++;
        pushMessage(context, type, `${operationName}失败-进行重试 次数:${retries}`);
        console.warn('等待响应超时，进行重试:', retries);
        await sleep(RETRY_DELAY);
        continue;
      }
    }

    let data = getData(context, type);

    // 红外自发自收验证
    if (operationName !== '自检开启' && isInfraredDevice &&
      checkSpontaneous(data, arrayBuffer2Hex(packBuffer)) &&
      operationName !== '不良品提示') {
      retries++;
      pushMessage(context, type, `${operationName}-红外检测失败,进行重试,次数:${retries}`);
      await sleep(RETRY_DELAY);
      continue;
    }

    // 红外设备回包不包含自发自收 → 合并报文
    if (isInfraredDevice
      && !data.toLowerCase().includes(arrayBuffer2Hex(packBuffer).toLowerCase())
      && operationName !== '自检开启' && operationName !== '热表温度标定') {
      console.warn('此红外设备回包不包含自发自收，单独处理报文合并！！！');
      data = arrayBuffer2Hex(mergeArrayBuffer(packBuffer, hex2arrayBuffer(data)));
      console.warn('合并自发自收：', data);
      setData(context, type, data);
    }

    // 自定义验证（返回 true = 校验失败）
    let result = isInvalidResponse(data);
    console.warn('自定义验证(返回true=失败)：', result);
    if (result) {
      if (context.isNBDevice) {
        retries++;
        pushMessage(context, type, `${operationName}报文验证失败-进行重试,次数:${retries}`);
        await sleep(RETRY_DELAY);
        continue;
      } else {
        notPass = true;
        break;
      }
    }

    if (!context.isNBDevice) {
      // 【优化6】去掉双否定写法
      const { notPass: isPreprocessFailed = false, errorMessage } = preprocess(data) ?? {};
      if (isPreprocessFailed) {
        console.warn('验证失败：', errorMessage);
        notPass = true;
        break;
      }
      notPass = false;
      console.warn('验证成功');
    }
    break;
  }

  // 【优化12】这几类 actionType 即便校验失败也视为流程完成
  if (ALWAYS_PASS_ACTIONS.has(actionType)) {
    notPass = false;
  }

  // 处理结果：重试耗尽
  if (retries >= maxRetries) {
    await badRecordUpload(context, operationName, '重试失败', actionType, type);
    if (!context.routerParam.startsWithJ) {
      const address = (type === 'one' || type === 'meter' || type === 'cj88' || type === 'voltmeter')
        ? (context.leftGenerateAddress ?? '')
        : (context.rightGenerateAddress ?? '');
      await context.uploadMes(address, 0, '设备重试失败:' + operationName, type);
      if (context.isNBDevice) {
        context.leftBadProductQuantity += 1;
      }
    }
    return true;
  }

  // 成功
  if (!notPass) {
    clearData(context, type);
    pushMessage(context, type, `${operationName}-操作成功`);
  }

  console.log('deviceAction返回结果：', notPass);
  return notPass;
};

// ============================================================
// 【优化8】组包逻辑独立
// ============================================================
function buildPackBuffer(context, cfg) {
  const {
    type, protocolType, isWireDevice, isTransparentTransmissionProtocol,
    cmdType, cmdCode, protocolId, uplinkCommunicationTarget, withStartFrame,
  } = cfg;

  // 有线设备优先
  if (isWireDevice) {
    return wireExecute(cmdType, cmdCode, protocolId, context, type, withStartFrame);
  }

  // 特殊设备类型（与协议无关）
  if (type === 'four')          return packReadCurrent();
  if (type === 'meter')         return packMeter(cmdType, cmdCode, context);
  if (type === 'currentSource') return packCurrentSource(cmdType, cmdCode, context);
  if (type === 'cj88')          return cj88Execute(cmdType, cmdCode, protocolId, context);

  // 无线设备按协议分发
  if (type === 'one' && protocolType === 'NB') {
    return isTransparentTransmissionProtocol
      ? outlineExecute(cmdType, cmdCode, protocolId, context)
      : nbExecute(cmdType, cmdCode, protocolId, context);
  }
  if (type === 'one' && protocolType === 'MODBUS') {
    return modbusExecute(cmdType, cmdCode, context, uplinkCommunicationTarget);
  }
  if (type === 'voltmeter' && protocolType === 'MODBUS') {
    return modbusExecute(cmdType, cmdCode, context, uplinkCommunicationTarget);
  }
  if (type === 'one' && protocolType === 'UTM100-NB') {
    return utt100NBExecute(cmdType, cmdCode, context, uplinkCommunicationTarget, protocolId);
  }

  return undefined;
}

// ============================================================
// 【优化4】合并原 waitForResponse + waitForResponseWireDevice
// 【优化3】用 sleep 代替 setTimeout / setInterval
// ============================================================
async function waitForResponse(context, timeout, expectedLength, expectedLength2, type, operationName, intervalMs = RETRY_DELAY) {
  const startTime = Date.now();
  const expected = new Set([expectedLength, expectedLength2].filter(n => n >= 0));

  while (Date.now() - startTime < timeout) {
    await sleep(intervalMs);

    const data = getData(context, type);
    const len = data.length / 2;

    if (len > 0 && expected.has(len)) {
      console.log(`[响应报文] =>`, data);
      Log.info(`[响应报文] =>`, data);
      Log.info(`执行时长: ${((Date.now() - startTime) / 1000).toFixed(2)} 秒`);
      return true;
    }
  }

  Log.info(`执行时长: ${((Date.now() - startTime) / 1000).toFixed(2)} 秒`);
  return false;
}

// ============================================================
// 【优化2】handleError / badRecordUpload 接收 type，清理正确数据字段
// ============================================================
export async function handleError(context, operationName, message, actionType, type) {
  context.leftWorkPrompt = `${operationName}-操作失败`;
  context.buttonError(actionType);
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  if (type) clearData(context, type);
  await playErrorAudio(context);
}

export async function badRecordUpload(context, operationName, message, actionType, type) {
  if (actionType !== null) {
    context.leftWorkPrompt = `${operationName}-操作失败（${message}）`;
    context.buttonError(actionType);
  } else {
    context.leftWorkPrompt = `${operationName}-操作失败（${message}）`;
  }

  const address = context.leftGenerateAddress ?? '';
  context.badRecordList.push({
    address,
    badMemo: `${operationName}-${message}`,
  });

  // 序号累加
  context.badRecordCounter = (context.badRecordCounter || 0) + 1;

  // 拼接日志内容
  const logMsg = `${context.badRecordCounter}、${address}、${operationName}-${message}`;
  context.createFailSpanMessage(logMsg, 'red');

  if (type) clearData(context, type);

  if (operationName !== 'MES') {
    await playErrorAudio(context);
  }
}

export async function handleSuccess(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作成功`;
  context.buttonSuccess('leftWorkPromptColor');
  context.buttonSuccess(actionType);
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedTwoData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context);
  }
}
