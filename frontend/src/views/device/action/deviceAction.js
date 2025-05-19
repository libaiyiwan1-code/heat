import {nbExecute, outlineExecute, wireExecute} from "@/packBuffer/commander";
import {arrayBuffer2Hex, checkSpontaneous} from "@/packBuffer/common/comUtil";
import {doWritePort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
const Log = require('ee-core/log');

/**
 * 通用的串口通信组件
 * @param {Object} context - 上下文对象
 * @param {Object} config - 配置对象
 * @param {string} type -  左或右侧工装
 * @returns {Promise<boolean>} - 操作是否失败
 *
 */
export const serialPortOperation = async (context, config, type) => {

  let {
    actionType,                      // 操作类型
    operationName = '操作',           // 操作名称，用于日志和提示
    cmdType,                         // outlineExecute 的命令类型
    cmdCode,                         // outlineExecute 的命令码
    protocolId,                      // 协议ID
    maxRetries = 3,                  // 最大重试次数
    expectedLength,                  // 预期响应长度(byte)
    timeout = 3000,                  // 超时时间(ms)
    validateResponse = () => true,   // 自定义响应验证函数
    preprocess = () => {
    },           // 预处理函数
    isInfraredDevice = false,         // 是否为红外设备
    isTransparentTransmissionProtocol = false, // 是否为透传协议
    isWireDevice = false,
    withStartFrame = false, //是否包含起始帧
  } = config;

  context.buttonDisabled()
  let retries = 0;
  let notPass = true;
  let packBuffer
  if (!isWireDevice) {
    //无线设备报文组包
    if (isTransparentTransmissionProtocol) {
      packBuffer = outlineExecute(cmdType, cmdCode, protocolId, context);
    } else {
      packBuffer = nbExecute(cmdType, cmdCode, protocolId, context);
    }
  } else {
    //有线设备报文组包
    packBuffer = wireExecute(cmdType, cmdCode, protocolId, context, type, withStartFrame)
  }

  console.log(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));
  Log.info(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));

  if (type === 'one') {
    context.receivedData.globalReceivedOneData = '';
  } else {
     context.receivedData.globalReceivedTwoData = '';
  }
  while (notPass && retries < maxRetries) {
    if (type === 'one') {
      context.receivedData.globalReceivedOneData = '';
    } else {
      context.receivedData.globalReceivedTwoData = '';
    }
    // 写入串口
    try {
      if (type === 'one') {
        await doWritePort(context.portAttributes.serialPortOne, packBuffer, type);
      } else {
        await doWritePort(context.portAttributes.serialPortTwo, packBuffer, type);
      }
    } catch (error) {
      await handleLeftError(context, operationName, '写入串口失败', actionType);
      console.error('Failed to write port:', error.message);
      break;
    }

    // 等待响应
    let response = false
    console.log('当前操作：', operationName)
    let data = type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData
    if (operationName !== '自检开启') {
      response = await waitForResponse(context, timeout, expectedLength, type);
      // 验证响应
      if (!response) {
        console.log(`[响应报文] ${operationName}=>`, data);
        Log.info(`[响应报文] ${operationName}=>`, data);
        retries++;
        if (type === 'one') {
          context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
        } else {
          context.createRightSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
        }
        continue;
      }

    }


    // 红外设备额外验证
    if (operationName !== '自检开启' && isInfraredDevice && checkSpontaneous(data, arrayBuffer2Hex(packBuffer))) {
      retries++;
      if (type === 'one') {
        context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
      } else {
        context.createRightSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
      }
      continue;
    }

    // 自定义验证
    if (validateResponse(data)) {
      retries++;
      if (type === 'one') {
        context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
      } else {
        context.createRightSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
      }
      continue;
    }

    notPass = false;
  }

  // 处理结果
  if (retries >= maxRetries) {
    if (type === 'one') {
      await handleLeftError(context, operationName, '操作超时', actionType);
    } else {
      await handleRightError(context, operationName, '操作超时', actionType);
    }
    if (type === 'one') {
      context.leftBadProductQuantity += 1;
    } else {
      context.rightBadProductQuantity += 1;
    }
    if (type === 'one') {
      context.uploadMes(context.leftGenerateAddress === '' ? context.leftReadAddress : context.leftGenerateAddress, 0, '设备重试失败:' + operationName)
    } else {
      context.uploadMes(context.rightGenerateAddress === '' ? context.rightReadAddress : context.rightGenerateAddress, 0, '设备重试失败:' + operationName)
    }

    return true;
  }

  if (!notPass) {
    if (type === 'one') {
      context.receivedData.globalReceivedOneData = '';
      context.createLeftSpanMessage(operationName + '-操作成功', 'green')
    } else {
      context.receivedData.globalReceivedTwoData = '';
      context.createRightSpanMessage(operationName + '-操作成功', 'green')
    }

  }

  return notPass;
};

// 等待响应辅助函数
async function waitForResponse(context, timeout, expectedLength, type) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    let data = type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData
    console.log('报文长度', data.length)
    console.log('报文', data)
    if (data && data.length / 2 === expectedLength) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
}

export async function handleLeftError(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作失败`;
  context.buttonError('leftWorkPromptColor')
  context.buttonError(actionType)
  context.createLeftSpanMessage(`${operationName}-${message}`, 'red');
  context.receivedData.globalReceivedOneData = '';
  await playErrorAudio(context)

}


export async function handleRightError(context, operationName, message, actionType) {
  context.rightWorkPrompt = `${operationName}-操作失败（${message}）`;
  context.buttonError('rightWorkPromptColor')
  context.buttonError(actionType)
  context.createRightSpanMessage(`${operationName}-${message}`, 'red');
  context.receivedData.globalReceivedOneData = '';
  if (operationName !== 'MES') {
    await playErrorAudio(context)
  }
}


export async function handleRightSuccess(context, operationName, message, actionType) {
  context.rightWorkPrompt = `${operationName}-操作成功`;
  context.buttonSuccess('rightWorkPromptColor')
  context.buttonSuccess(actionType)
  context.createRightSpanMessage(`${operationName}-${message}`, 'green');
  context.receivedData.globalReceivedTwoData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }

}


export async function handleLeftSuccess(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作成功`;
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess(actionType)
  context.createLeftSpanMessage(`${operationName}-${message}`, 'green');
  context.receivedData.globalReceivedOneData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }

}
