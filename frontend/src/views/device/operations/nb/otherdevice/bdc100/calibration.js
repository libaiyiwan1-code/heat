import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const calibration = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let notPass = false;
  let result1NotPass = await serialPortOperation(context, {
    actionType: 'settingEnergyError',
    operationName: '误差清零',
    cmdType: '0c',                         // afn 的命令类型
    cmdCode: '24-0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['settingEnergyError'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['settingEnergyError'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.settingEnergyError(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.settingEnergyError,
  }, type)
  if (result1NotPass) {
    await playErrorAudio(context)
    notPass = true
    return notPass
  }



  let readDeviceDataNotPass = await serialPortOperation(context, {
    actionType: 'readDeviceData',
    operationName: 'BDC100读功率',
    cmdType: '0c',                         // afn 的命令类型
    cmdCode: '11',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readDeviceData'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readDeviceData'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readDeviceData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readDeviceData,
  }, type)
  if (readDeviceDataNotPass) {
    await playErrorAudio(context)
    notPass = true
  }


  let readAmmeterPowerNotPass = await serialPortOperation(context, {
    actionType: 'readAmmeterPower',
    operationName: '电压表读功率',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: 'readAmmeterPower',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readAmmeterPower'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readAmmeterPower'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readAmmeterPower(context, context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readAmmeterPower,
  }, 'voltmeter')
  if (readAmmeterPowerNotPass) {
    await playErrorAudio(context)
    notPass = true
  }

  let getPower = context.deviceReadPower
  let power = context.voltmeterReadPower
  console.warn('电表功率', power)
  console.warn('设备功率', getPower)
  console.warn('功率绝对值', Math.abs((getPower - power)))
  console.warn('功率绝对值除数', Math.abs((getPower - power)) / power)
  console.warn('允许的功率误差', context.configDetail.power_error)
  let calibrationError = (((getPower - power) / power) * 100).toFixed(4)
  context.calibrationError = calibrationError
  console.warn('标定的功率误差:', calibrationError)
  context.createLeftSpanMessage('标定的功率误差:'+calibrationError, 'grey')
  let resultNotPass = await serialPortOperation(context, {
    actionType: 'settingEnergyError',
    operationName: '设置电能误差值',
    cmdType: '0c',                         // afn 的命令类型
    cmdCode: '24',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['settingEnergyError'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['settingEnergyError'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.settingEnergyError(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.settingEnergyError,
  }, type)
  if (resultNotPass) {
    await playErrorAudio(context)
    notPass = true
    return notPass
  }

  //标定成功或者失败的结果
  return notPass
}
