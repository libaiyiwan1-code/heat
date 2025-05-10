import {nbExecute, outlineExecute} from "@/packBuffer/commander";
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
 */
export const serialPortOperation = async (context, config,type) => {

  const {
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
    isTransparentTransmissionProtocol = false // 是否为透传协议
  } = config;

  context.buttonDisabled()
  let retries = 0;
  let notPass = true;
  let packBuffer
  if (isTransparentTransmissionProtocol) {
    packBuffer = outlineExecute(cmdType, cmdCode, protocolId, context);
  } else {
    packBuffer = nbExecute(cmdType, cmdCode, protocolId, context);
  }

  console.log(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));
  Log.info(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));

  context.receivedData.globalReceivedOneData = '';
  console.warn('deviceAction-Type：',type)
  while (notPass && retries < maxRetries) {
    context.receivedData.globalReceivedOneData = '';

    // 写入串口
    try {
      if (type==='one'){
        await doWritePort(context.portAttributes.serialPortOne, packBuffer,type);
      }else{
        await doWritePort(context.portAttributes.serialPortTwo, packBuffer,type);
      }
    } catch (error) {
      await handleLeftError(context, operationName, '写入串口失败', actionType);
      console.error('Failed to write port:', error.message);
      break;
    }

    // 等待响应
    let response = false
    console.log(operationName)
    if (operationName !== '自检开启') {
      response = await waitForResponse(context, timeout, expectedLength);
      // 验证响应
      if (!response) {
        console.log(`[响应报文] ${operationName}=>`, context.receivedData.globalReceivedOneData);
        Log.info(`[响应报文] ${operationName}=>`, context.receivedData.globalReceivedOneData);
        retries++;
        context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
        continue;
      }

    }


    // 红外设备额外验证
    if (operationName !== '自检开启' && isInfraredDevice && checkSpontaneous(context.receivedData.globalReceivedOneData, arrayBuffer2Hex(packBuffer))) {
      retries++;
      context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
      continue;
    }

    // 自定义验证
    if (validateResponse(context.receivedData.globalReceivedOneData)) {
      retries++;
      context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
      continue;
    }

    notPass = false;
  }

  // 处理结果
  if (retries >= maxRetries) {
    await handleLeftError(context, operationName, '操作超时', actionType);
    context.leftBadProductQuantity += 1;
    context.uploadMes(context.leftGenerateAddress === '' ? context.readAddress : context.leftGenerateAddress, 0, '设备重试失败:' + operationName)
    return true;
  }

  if (!notPass) {
    context.receivedData.globalReceivedOneData = '';
    context.createLeftSpanMessage(operationName + '-操作成功', 'green')
  }

  return notPass;
};

// 等待响应辅助函数
async function waitForResponse(context, timeout, expectedLength) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    console.log('报文长度', context.receivedData.globalReceivedOneData.length)
    console.log('报文', context.receivedData.globalReceivedOneData)
    if (context.receivedData.globalReceivedOneData && context.receivedData.globalReceivedOneData.length / 2 === expectedLength) {
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
  context.receivedData.globalReceivedOneData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }

}
