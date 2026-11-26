import {cj88Execute} from "@/packBuffer/commander";
import {arrayBuffer2Hex, checkSpontaneous, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {doWritePort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";

const Log = require('ee-core/log');

/**
 * 通用的串口通信组件
 * @param {Object} context - 上下文对象
 * @param {Object} config - 配置对象
 * @returns {Promise<boolean>} - 操作是否失败
 *
 */
export const serialPortOperation = async (context, config) => {

    let {
      actionType,                      // 操作类型
      operationName = '操作',           // 操作名称，用于日志和提示
      cmdType,                         // outlineExecute 的命令类型
      cmdCode,                         // outlineExecute 的命令码
      protocolId,                      // 协议ID
      maxRetries = 3,         // 最大重试次数
      expectedLength,                  // 预期响应长度1(带自发自收)
      expectedLength2 = -1,                  // 预期响应长度 2(不带自发自收)
      timeout = 3000,                  // 超时时间(ms)
      validateResponse = () => true,   // 自定义响应验证函数
      preprocess = () => true,
      isInfraredDevice = false,         // 是否为红外设备
    } = config;

    console.log(config.uplinkCommunicationTarget)
    context.buttonDisabled()
    let retries = 0;
    let notPass = true;
    let packBuffer
    packBuffer = cj88Execute(cmdType, cmdCode, protocolId, context)
  const reqLogData = arrayBuffer2Hex(packBuffer).replace(/(..)/g, '$1 ').trim().toUpperCase();
  console.log(`[请求报文] ${operationName}`, reqLogData);
  Log.info(`[请求报文] ${operationName}`, reqLogData);
    context.createLeftSpanMessage(`[请求报文] ${operationName}：${reqLogData}`, '#1976D2');   // 蓝色

    while (notPass && retries < maxRetries) {
      context.receivedData.globalReceivedOneData = '';
      // 写入串口
      try {
        await doWritePort(context.portAttributes.serialPortOne, packBuffer);
      } catch (error) {
        await handleError(context, operationName, '写入串口失败', actionType);
        console.error('Failed to write port:', error.message);
        break;
      }

      // 等待响应
      let response = false
      if (operationName !== '自检开启' && operationName !== '不良品提示' && operationName !== '热表温度标定') {

        if (operationName === '有线设备读地址') {
          response = await waitForResponseWireDevice(context, timeout, expectedLength, expectedLength2, operationName);
        } else {
          response = await waitForResponse(context, timeout, expectedLength, expectedLength2, operationName);
        }
        console.log(response)
        // 验证响应
        if (!response) {
          retries++;
          context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'grey');
          console.warn('等待响应超时，进行重试:', retries);
          //等待 1.5秒。
          await new Promise(resolve => setTimeout(resolve, 1500));
          continue;
        }

      }
      let data = context.receivedData.globalReceivedOneData; // 红外自发自收验证
      if (operationName !== '自检开启' && isInfraredDevice &&
        checkSpontaneous(data, arrayBuffer2Hex(packBuffer)) &&
        operationName !== '不良品提示') {
        retries++;
        context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'grey');
        await new Promise(resolve => setTimeout(resolve, 1500));
        continue;
      }


      if ((!data.toLowerCase().includes(arrayBuffer2Hex(packBuffer).toLowerCase())) && isInfraredDevice
        && operationName !== '自检开启' && operationName !== '热表温度标定') {
        console.warn('此红外设备回包不包含自发自收，单独处理报文合并！！！')
        data = arrayBuffer2Hex(mergeArrayBuffer(packBuffer, hex2arrayBuffer(data)))
        console.warn('合并自发自收：', data)
        context.receivedData.globalReceivedOneData = data
      }
      console.log(context.receivedData.globalReceivedOneData)
      // 自定义验证
      let result = validateResponse(data)
      console.warn('自定义验证：', result)
      if (result) {
        if (context.isNBDevice) {
          retries++;
          context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'grey');
          //等待 1.5秒。
          await new Promise(resolve => setTimeout(resolve, 1500));
          continue;
        } else {
          notPass = true;
          break
        }
      }

      if (!context.isNBDevice) {
        let preprocessResult = preprocess(data)
        if (preprocessResult && preprocessResult.notPass) {
          console.warn('验证失败：', preprocessResult.errorMessage)
          notPass = true
          break
        } else {
          notPass = false
          console.warn('验证成功', preprocessResult)
        }
      }
      break
    }

    if (actionType !== 'separationAlarm' && actionType !== 'creditCard' && actionType !== 'mainAndAuxiliaryValvesVerify' && actionType !== 'faceplateCommunication') {
      notPass = false;
    }
    // 处理结果
    if (retries >= maxRetries) {
      await badRecordUpload(context, operationName, '重试失败', actionType);
      return true;
    }

    if (!notPass) {
      context.receivedData.globalReceivedOneData = '';
      context.createLeftSpanMessage(operationName + '-操作成功', 'grey')

    }
    console.log('deviceAction返回结果：', notPass)
    return notPass;
  }
;

async function waitForResponse(context, timeout, expectedLength, expectedLength2, operationName) {
  const startTime = Date.now();
  let pass = false;

  while (Date.now() - startTime < timeout) {
    if (operationName === '有线设备读地址') {
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    let data = context.receivedData.globalReceivedOneData;
    console.log('报文', data)
    console.log('报文长度', data.length / 2)
    if (data && data.length / 2 === expectedLength || data.length / 2 === expectedLength2) {
      const logData = data.replace(/(..)/g, '$1 ').trim().toUpperCase();
      console.log(`[响应报文] =>`, logData);
      Log.info(`[响应报文] =>`, logData);
      context.createLeftSpanMessage(`[响应报文] ${operationName}：${logData}`, '#4CAF50');   // 绿色
      pass = true
      break
    }

  }
  const durationMs = Date.now() - startTime;
  const durationSec = (durationMs / 1000).toFixed(2);

  console.log(`执行时长: ${durationSec} 秒`);
  Log.info(`执行时长: ${durationSec} 秒`);


  return pass;
}

//串口硬件
//    ↓
// serialport库
//    ↓ (data事件)
// 监听函数
//    ↓
// 修改Vue数据
//    ↓
// Promise定时检测
//    ↓
// resolve()
//    ↓
// await继续执行

// 等待响应辅助函数 Promise 主动轮询检测 Proxy 数据
async function waitForResponseWireDevice(context, timeout, expectedLength, expectedLength2, type, operationName) {
  let awaitTime = 1500
  if (operationName === '有线设备读地址') {
    awaitTime = 50
  }
  return new Promise((resolve) => {  //事件等待机制
    const startTime = Date.now()
    const timer = setInterval(() => {
      let data = context.receivedData.globalReceivedOneData
      console.log('Promise等待响应:', type, data)


      // 防止 undefined 报错
      if (data && data.length > 0) {

        const len = data.length / 2

        console.log('报文长度:', len)


        if (len === expectedLength || len === expectedLength2) {

          console.log(`[响应报文] =>`, data)

          Log.info(`[响应报文] =>`, data)


          clearInterval(timer)


          const durationMs = Date.now() - startTime

          console.log(`执行时长: ${(durationMs / 1000).toFixed(2)} 秒`)

          Log.info(`执行时长: ${(durationMs / 1000).toFixed(2)} 秒`)


          resolve(true) //成功通知

        }

      }


      // timeout处理
      if (Date.now() - startTime >= timeout) {

        clearInterval(timer)


        const durationMs = Date.now() - startTime

        console.log(`执行时长: ${(durationMs / 1000).toFixed(2)} 秒`)

        Log.info(`执行时长: ${(durationMs / 1000).toFixed(2)} 秒`)


        resolve(false) //失败通知

      }

    }, awaitTime)

  })

}

export async function handleError(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作失败`;
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedOneData = '';
  await playErrorAudio(context)

}


export async function badRecordUpload(context, operationName, message, actionType) {
  if (actionType !== null) {
    context.leftWorkPrompt = `${operationName}-操作失败（${message}）`;
  } else {
    context.leftWorkPrompt = `${operationName}-操作失败（${message}）`;
  }
  // 拼接日志内容
  context.receivedData.globalReceivedOneData = '';
  if (operationName !== 'MES') {
    await playErrorAudio(context);
  }
}


export async function handleSuccess(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作成功`;
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedTwoData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }


}
