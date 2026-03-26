import {
  readCurrentAmmeterInputLoop,
  readCurrentAmmeterOutputLoop, readCurrentSource,
  sourceOutputs12mA,
  sourceOutputs20mA,
  sourceOutputs4mA,
} from "@/views/device/operations/wireDeviceOperations";

import {
  deviceReadsCurrent,
  output20MAActualCurrentValueCalibration,
  output4MAActualCurrentValueCalibration,
  writeFixedOutput20MA,
  writeFixedOutput4MA,
  writesActualInputCurrentValue20MA,
  writesActualInputCurrentValue4MA
} from "@/views/device/operations/cj88Operations.js";
import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";

export const doCurrent4To20mADemarcateAEC100 = async (context, protocolId, type) => {
  let result
  let buttonColor = 'calibration4to20mA'
  //输入标定
  result = await sourceOutputs4mA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    console.error('与电流源工装设备通信失败')
    context.createLeftSpanMessage('与电流源工装设备通信失败', 'red');
    return result
  }
  context.createLeftSpanMessage('请等待电流表值稳定...10s', 'grey');
  await new Promise(x => setTimeout(x, 10000)) //等待2s
  result = await readCurrentAmmeterInputLoop(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取输入电流表失败', 'red');
    return result
  }
  result = await writesActualInputCurrentValue4MA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('4ma标定AD值失败', 'red');
    return result
  }
  context.createLeftSpanMessage('4ma标定AD值成功', 'green');
  result = await sourceOutputs20mA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('与电流源工装设备通信失败', 'red');
    return result
  }
  context.createLeftSpanMessage('请等待电流表值稳定...10s', 'grey');
  await new Promise(x => setTimeout(x, 10000)) //等待10
  result = await readCurrentAmmeterInputLoop(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取电流表输入实际值失败', 'red');
    return result
  }
  result = await writesActualInputCurrentValue20MA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('20ma标定AD值失败', 'red');
    return result
  }
  context.createLeftSpanMessage('20ma标定AD值成功', 'green');
  context.createLeftSpanMessage('电流模拟量输入标定完成', 'green');
  context.buttonSuccess(buttonColor)


  //输出标定
  result = await writeFixedOutput4MA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    return result
  }
  context.createLeftSpanMessage('请等待电流表值稳定...10s', 'grey');
  await new Promise(x => setTimeout(x, 10000)) //等待10s
  result = await readCurrentAmmeterOutputLoop(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取输出电流表失败', 'red');
    return result
  }
  result = await output4MAActualCurrentValueCalibration(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('写入4mA电流值范围不合格', 'red');
    return result
  }
  context.createLeftSpanMessage('输出4ma标定完成', 'green');
  result = await writeFixedOutput20MA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    return result
  }
  context.createLeftSpanMessage('请等待电流表值稳定...10s', 'grey');
  await new Promise(x => setTimeout(x, 10000)) //等待10s
  result = await readCurrentAmmeterOutputLoop(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取电流表输出实际值失败', 'red');
    return result
  }
  result = await output20MAActualCurrentValueCalibration(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('写入电流值范围不合格', 'red');
    return result
  }
  context.createLeftSpanMessage('输出20ma标定完成', 'green');
  context.createLeftSpanMessage('电流模拟量输出标定完成', 'green');

  context.buttonSuccess(buttonColor)


  //验证
  result = await sourceOutputs12mA(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('与电流源工装设备通信失败', 'red');
    return result
  }
  context.createLeftSpanMessage('请等待电流表值稳定...10s', 'grey');
  await new Promise(x => setTimeout(x, 10000)) //等待10s
  result = await deviceReadsCurrent(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取设备电流失败', 'red');
    return result
  }
  let currentOutValue
  let currentEnterValue
  let currentSourceValue

  //读电流源
  result = await readCurrentSource(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取电流源失败', 'red');
    return result
  }
  currentSourceValue = context.currentSourceValue
  console.log('[标定验证] 电流源读取:', currentSourceValue)
  result = await readCurrentAmmeterInputLoop(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取输入电流表实际值失败', 'red');
    return result
  }
  currentEnterValue = parseFloat(context.ammeterReadCurrentValue)
  console.log('[标定验证] 电流表读输入电流:', currentEnterValue)
  result = await readCurrentAmmeterOutputLoop(protocolId, type, context)
  if (result) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage('读取输出电流表实际值失败', 'red');
    return result
  }
  // 电流表读取的输出电流值
  currentOutValue = parseFloat(context.ammeterReadCurrentValue)
  console.log('[标定验证] 电流表读输出电流:', currentOutValue)

  // 获取设备实际电流和允许误差范围
  // let tooling = parseFloat(context.aec100DeviceCurrentValue)
  let difference = parseFloat(context.configDetail.aec100_current_err) // 允许误差百分比
  let actualError1 = Math.abs(currentSourceValue - currentEnterValue)
  let actualError2 = Math.abs(currentEnterValue - currentOutValue)
  console.warn(
    '电流表输入:', currentEnterValue,
    '电流表输出:', currentOutValue,
    '电流源值:', currentSourceValue,
    '电流源与输入电流实际误差:', actualError1,
    '输入输出实际误差:', actualError2,
    '允许误差±:', difference
  )
  /*电流源与输入对比*/
  if (actualError1 >= difference) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage(
      `电流源电流值与输入电流值超出允许范围：误差 ${(actualError1 ).toFixed(3)} > ${difference}%`, 'red'
    );
    console.error(
      `电流源电流值与输入电流值超出允许范围：误差 ${(actualError1 ).toFixed(3)} > ${difference}%`
    )
    //通知失败
    let current4To20mACalibrationErrorResult = await serialPortOperation(context, {
      actionType: 'current4To20mACalibrationError',
      operationName: '标定失败通知设备',
      cmdType: 'cc',                         // afn 的命令类型
      cmdCode: '0e-error',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['current4To20mACalibrationError'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['current4To20mACalibrationError'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.current4To20mACalibrationError(context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.current4To20mACalibrationError,
    }, 'cj88')
    if (current4To20mACalibrationErrorResult) {
      context.buttonError(buttonColor)
      await playErrorAudio(context)
      return true
    }
    result = true
    return result
  }else{
    context.createLeftSpanMessage(
      `电流源电流值与输入电流值对比合格：误差 ${(actualError1 ).toFixed(3)} <= ${difference}`,'green'
    );
    console.log(
      `电流源电流值与输入电流值对比合格：误差 ${(actualError1 ).toFixed(3)} <= ${difference}`
    )

  }

  /* 输入与输出对比*/
  if (actualError2 >= difference) {
    context.buttonError(buttonColor)
    context.createLeftSpanMessage(
      `输出电流值与输入电流值超出允许范围：误差 ${(actualError2 ).toFixed(3)} > ${difference}%`, 'red'
    );
    console.error(
      `输出电流值与输入电流值超出允许范围：误差 ${(actualError2 ).toFixed(3)} > ${difference}%`
    )
    //通知失败
    let current4To20mACalibrationErrorResult = await serialPortOperation(context, {
      actionType: 'current4To20mACalibrationError',
      operationName: '标定失败通知设备',
      cmdType: 'cc',                         // afn 的命令类型
      cmdCode: '0e-error',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['current4To20mACalibrationError'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['current4To20mACalibrationError'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.current4To20mACalibrationError(context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.current4To20mACalibrationError,
    }, 'cj88')
    if (current4To20mACalibrationErrorResult) {
      context.buttonError(buttonColor)
      await playErrorAudio(context)
      return true
    }
    result = true
    return result
  }else{
    context.createLeftSpanMessage(
      `输出电流值与输入电流值对比合格：误差 ${(actualError2 ).toFixed(3)} <= ${difference}`,'green'
    );
    console.log(
      `输出电流值与输入电流值对比合格：误差 ${(actualError2 ).toFixed(3)} <= ${difference}`
    )
    //通知成功
    let current4To20mACalibrationErrorResult = await serialPortOperation(context, {
      actionType: 'current4To20mACalibrationSuccessful',
      operationName: '标定成功通知设备',
      cmdType: 'cc',                         // afn 的命令类型
      cmdCode: '0e-success',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['current4To20mACalibrationSuccessful'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['current4To20mACalibrationSuccessful'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.current4To20mACalibrationSuccessful(context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.current4To20mACalibrationSuccessful,
    }, 'cj88')
    if (current4To20mACalibrationErrorResult) {
      await playErrorAudio(context)
      return true
    }
  }

  context.buttonSuccess(buttonColor)
  return result

}
