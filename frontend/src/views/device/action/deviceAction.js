import {nbExecute, outlineExecute, wireExecute} from "@/packBuffer/commander";
import {arrayBuffer2Hex, checkSpontaneous, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {doWritePort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {packReadCurrent} from "@/packBuffer/encode/packOther";

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
    if (!isWireDevice&&type!=='four') {
      //无线设备报文组包
      if (isTransparentTransmissionProtocol) {
        packBuffer = outlineExecute(cmdType, cmdCode, protocolId, context);
      } else {
        packBuffer = nbExecute(cmdType, cmdCode, protocolId, context);
      }
    } else if (isWireDevice)  {
      //有线设备报文组包
      packBuffer = wireExecute(cmdType, cmdCode, protocolId, context, type, withStartFrame)
    }else if (type==='four'){
      packBuffer = packReadCurrent()
    }

    console.log(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));
    Log.info(`[请求报文] ${operationName}`, arrayBuffer2Hex(packBuffer));


    while (notPass && retries < maxRetries) {
      if (type === 'one') {
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
        if (type === 'one') {
          await doWritePort(context.portAttributes.serialPortOne, packBuffer, type);
        } else if (type === 'two') {
          await doWritePort(context.portAttributes.serialPortTwo, packBuffer, type);
        } else if (type === 'three') {
          await doWritePort(context.portAttributes.serialPortSignalSource, packBuffer, type);
        } else if (type === 'four') {
          await doWritePort(context.portAttributes.serialPortCurrentSource, packBuffer, type);
        }
      } catch (error) {
        await handleLeftError(context, operationName, '写入串口失败', actionType);
        console.error('Failed to write port:', error.message);
        break;
      }

      // 等待响应
      let response = false
      if (operationName !== '自检开启' && operationName !== '不良品提示') {
        response = await waitForResponse(context, timeout, expectedLength, expectedLength2, type);
        // 验证响应
        if (!response) {
          retries++;
          if (type === 'one') {
            context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
          } else if (type === 'two') {
            context.createRightSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
          } else if (type === 'three') {
            context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
          } else if (type === 'four') {
            context.createLeftSpanMessage(`${operationName}失败-进行重试 次数:${retries}`, 'red');
          }
          console.warn('等待响应超时，进行重试:', retries);
          continue;
        }

      }
      let data
      if (type === 'one') {
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
        if (type === 'one') {
          context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
        } else if (type === 'two') {
          context.createRightSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
        } else if (type === 'three') {
          context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
        }else if (type === 'four') {
          context.createLeftSpanMessage(`${operationName}-红外检测失败,进行重试,次数:${retries}`, 'red');
        }
        await new Promise(resolve => setTimeout(resolve, 900));
        continue;
      }


      console.log('data:', data)
      console.log('发包:', arrayBuffer2Hex(packBuffer))
      if ((!data.toLowerCase().includes(arrayBuffer2Hex(packBuffer).toLowerCase())) && isInfraredDevice && operationName !== '自检开启') {
        console.warn('此红外设备回包不包含自发自收，单独处理报文合并！！！')
        data = arrayBuffer2Hex(mergeArrayBuffer(packBuffer, hex2arrayBuffer(data)))
        console.warn('合并自发自收：', data)
        if (type === 'one') {
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
          if (type === 'one') {
            context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
          } else if (type === 'two') {
            context.createRightSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
          } else if (type === 'three') {
            context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
          }else if (type === 'four') {
            context.createLeftSpanMessage(`${operationName}报文验证失败-进行重试,次数:${retries}`, 'red');
          }
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
      if (type === 'one' || type === 'three'|| type === 'four') {
        await handleLeftError(context, operationName, '重试失败', actionType);
      } else if (type === 'two') {
        await handleRightError(context, operationName, '重试失败', actionType);
      }
      if (type === 'one' || type === 'three'|| type === 'four') {
        context.leftBadProductQuantity += 1;
      } else if (type === 'two') {
        context.rightBadProductQuantity += 1;
      }
      if (context.isNBDevice&&!context.routerParam.startsWithJ) {
        if (type === 'one' || type === 'three'|| type === 'four') {
          await context.uploadMes(context.leftGenerateAddress === '' ? context.leftReadAddress : context.leftGenerateAddress, 0, '设备重试失败:' + operationName)
        } else if (type === 'two') {
          await context.uploadMes(context.rightGenerateAddress === '' ? context.rightReadAddress : context.rightGenerateAddress, 0, '设备重试失败:' + operationName)
        }
      }

      return true;
    }

    if (!notPass) {
      if (type === 'one') {
        context.receivedData.globalReceivedOneData = '';
        context.createLeftSpanMessage(operationName + '-操作成功', 'grey')
      } else if (type === 'two') {
        context.receivedData.globalReceivedTwoData = '';
        context.createRightSpanMessage(operationName + '-操作成功', 'grey')
      } else if (type === 'three') {
        context.receivedData.globalReceivedSignalSourceData = '';
        context.createLeftSpanMessage(operationName + '-操作成功', 'grey')
      }else if (type === 'four') {
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
    if (type === 'one') {
      data = context.receivedData.globalReceivedOneData;
    } else if (type === 'two') {
      data = context.receivedData.globalReceivedTwoData;
    } else if (type === 'three') {
      data = context.receivedData.globalReceivedSignalSourceData;
    }else if (type === 'four') {
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
  return pass;
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
  context.createRightSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedTwoData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }

}


export async function handleLeftSuccess(context, operationName, message, actionType) {
  context.leftWorkPrompt = `${operationName}-操作成功`;
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess(actionType)
  context.createLeftSpanMessage(`${operationName}-${message}`, 'grey');
  context.receivedData.globalReceivedOneData = '';
  if (operationName !== 'MES') {
    await playSuccessAudio(context)
  }

}
