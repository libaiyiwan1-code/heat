import {nbExecute, outlineExecute, wireExecute} from "@/packBuffer/commander";
import {arrayBuffer2Hex, checkSpontaneous, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {doWritePort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {packMeter, packReadCurrent} from "@/packBuffer/encode/packOther";

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
      maxRetries = 3,         // 最大重试次数
      expectedLength,                  // 预期响应长度1(带自发自收)
      expectedLength2 = -1,                  // 预期响应长度 2(不带自发自收)
      timeout = 3000,                  // 超时时间(ms)
      validateResponse = () => true,   // 自定义响应验证函数
      preprocess = () => true,
      isInfraredDevice = false,         // 是否为红外设备
      isTransparentTransmissionProtocol = false, // 是否为透传协议
      isWireDevice = false,
      withStartFrame = true, //是否包含起始帧
    } = config;

    context.buttonDisabled()
    let retries = 0;
    let notPass = true;
    let packBuffer
    if (!isWireDevice && type !== 'four' && type !== 'meter') {
      //无线设备报文组包
      if (isTransparentTransmissionProtocol) {
        packBuffer = outlineExecute(cmdType, cmdCode, protocolId, context);
      } else {
        packBuffer = nbExecute(cmdType, cmdCode, protocolId, context);
      }
    } else if (isWireDevice) {
      //有线设备报文组包
      packBuffer = wireExecute(cmdType, cmdCode, protocolId, context, type, withStartFrame)
    } else if (type === 'four') {
      packBuffer = packReadCurrent()
    } else if (type === 'meter') {
      packBuffer = packMeter(cmdType, cmdCode, context)
    }

    console.log(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));
    Log.info(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));


    while (notPass && retries < maxRetries) {
      if (type === 'one' || type === 'meter') {
        context.receivedData.globalReceivedOneData = '';
      } else if (type === 'two') {
        context.receivedData.globalReceivedTwoData = '';
      } else if (type === 'three') {
        context.receivedData.globalReceivedSignalSourceData = '';
      } else if (type === 'four') {
        context.receivedData.globalReceivedCurrentSourceData = '';
      }
      // 写入串口
      try {
        if (type === 'one' || type === 'meter') {
          await doWritePort(context.portAttributes.serialPortOne, packBuffer, type);
        } else if (type === 'two') {
          await doWritePort(context.portAttributes.serialPortTwo, packBuffer, type);
        } else if (type === 'three') {
          await doWritePort(context.portAttributes.serialPortSignalSource, packBuffer, type);
        } else if (type === 'four') {
          await doWritePort(context.portAttributes.serialPortCurrentSource, packBuffer, type);
        }
      } catch (error) {
        await handleError(context, operationName, '写入串口失败', actionType);
        console.error('Failed to write port:', error.message);
        break;
      }

      // 等待响应
      let response = false
      if (operationName !== '自检开启' && operationName !== '不良品提示' && operationName !== '热表温度标定') {
        response = await waitForResponse(context, timeout, expectedLength, expectedLength2, type);
        // 验证响应
        if (!response) {
          retries++;
          if (type === 'one' || type === 'meter') {
            context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'grey');
          } else if (type === 'two') {
            context.createRightSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'grey');
          } else if (type === 'three') {
            context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'grey');
          } else if (type === 'four') {
            context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'grey');
          }
          console.warn('等待响应超时，进行重试:', retries);
          continue;
        }

      }
      let data
      if (type === 'one' || type === 'meter') {
        data = context.receivedData.globalReceivedOneData
      } else if (type === 'two') {
        data = context.receivedData.globalReceivedTwoData
      } else if (type === 'three') {
        data = context.receivedData.globalReceivedSignalSourceData
      } else if (type === 'four') {
        data = context.receivedData.globalReceivedCurrentSourceData
      }
      // 红外设备额外验证
      if (operationName !== '自检开启' && isInfraredDevice &&
        checkSpontaneous(data, arrayBuffer2Hex(packBuffer)) &&
        context.isNBDevice &&
        operationName !== '不良品提示') {
        retries++;
        if (type === 'one' || type === 'meter') {
          context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'grey');
        } else if (type === 'two') {
          context.createRightSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'grey');
        } else if (type === 'three') {
          context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'grey');
        } else if (type === 'four') {
          context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'grey');
        }
        await new Promise(resolve => setTimeout(resolve, 900));
        continue;
      }


      if ((!data.toLowerCase().includes(arrayBuffer2Hex(packBuffer).toLowerCase())) && isInfraredDevice
        && operationName !== '自检开启'&& operationName !== '热表温度标定') {
        console.warn('此红外设备回包不包含自发自收，单独处理报文合并！！！')
        data = arrayBuffer2Hex(mergeArrayBuffer(packBuffer, hex2arrayBuffer(data)))
        console.warn('合并自发自收：', data)
        if (type === 'one' || type === 'meter') {
          context.receivedData.globalReceivedOneData = data
        } else if (type === 'two') {
          context.receivedData.globalReceivedTwoData = data
        } else if (type === 'three') {
          context.receivedData.globalReceivedSignalSourceData = data
        } else if (type === 'four') {
          context.receivedData.globalReceivedCurrentSourceData = data
        }
      }
      // 自定义验证
      let result = validateResponse(data)
      console.warn('自定义验证：', result)
      if (result) {
        if (context.isNBDevice) {
          retries++;
          context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'grey');
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
      if (!context.routerParam.startsWithJ) {
        let address
        if (type === 'one' || type === 'meter') {
          address = context.leftGenerateAddress === undefined ? '' : context.leftGenerateAddress
        } else {
          address = context.rightGenerateAddress === undefined ? '' : context.rightGenerateAddress
        }
        await context.uploadMes(address, 0, '设备重试失败:' + operationName, type)
        if (context.isNBDevice) {
          context.leftBadProductQuantity += 1;
        }
      }
      return true;
    }

    if (!notPass) {
      if (type === 'one' || type === 'meter') {
        context.receivedData.globalReceivedOneData = '';
        context.createLeftSpanMessage(operationName + '-操作成功', 'grey')
      } else if (type === 'two') {
        context.receivedData.globalReceivedTwoData = '';
        context.createRightSpanMessage(operationName + '-操作成功', 'grey')
      } else if (type === 'three') {
        context.receivedData.globalReceivedSignalSourceData = '';
        context.createLeftSpanMessage(operationName + '-操作成功', 'grey')
      } else if (type === 'four') {
        context.receivedData.globalReceivedCurrentSourceData = '';
        context.createLeftSpanMessage(operationName + '-操作成功', 'grey')
      }

    }
    console.log('deviceAction返回结果：', notPass)
    return notPass;
  }
;

// 等待响应辅助函数
async function waitForResponse(context, timeout, expectedLength, expectedLength2, type) {
  const startTime = Date.now();
  let pass = false;

  while (Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    let data
    if (type === 'one' || type === 'meter') {
      data = context.receivedData.globalReceivedOneData;
    } else if (type === 'two') {
      data = context.receivedData.globalReceivedTwoData;
    } else if (type === 'three') {
      data = context.receivedData.globalReceivedSignalSourceData;
    } else if (type === 'four') {
      data = context.receivedData.globalReceivedCurrentSourceData;
    }
    console.log('报文', data)
    // console.log('报文长度', data.length / 2)
    if (data && data.length / 2 === expectedLength || data.length / 2 === expectedLength2) {
      console.log(`[响应报文] =>`, data);
      Log.info(`[响应报文] =>`, data);
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

export async function handleError(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作失败`;
  context.buttonError(actionType)
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedOneData = '';
  await playErrorAudio(context)

}


export async function badRecordUpload(context, operationName, message, actionType) {
  if (actionType !== null) {
    context.leftWorkPrompt = `${operationName}-操作失败（${message}）`;
    context.buttonError(actionType)
  } else {
    context.leftWorkPrompt = `${operationName}-操作失败（${message}）`;
  }
  let address = context.leftGenerateAddress === undefined ? '' : context.leftGenerateAddress
  context.badRecordList.push({
    address: address,
    badMemo: `${operationName}-${message}`
  });
  // 序号累加
  context.badRecordCounter = (context.badRecordCounter || 0) + 1;
  // 拼接日志内容
  const logMsg = `${context.badRecordCounter}、${address}、${operationName}-${message}`;
  context.createFailSpanMessage(logMsg, 'red');
  context.receivedData.globalReceivedOneData = '';
  if (operationName !== 'MES') {
    await playErrorAudio(context);
  }
}


export async function handleSuccess(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作成功`;
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess(actionType)
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedTwoData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }


}
