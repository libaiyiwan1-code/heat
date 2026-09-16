import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const verify = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let notPass = false;
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
  }, 'voltmeter','MODBUS')
  if (readAmmeterPowerNotPass) {
    await playErrorAudio(context)
    notPass = true
  }

  let getPower = context.deviceReadPower
  let power = context.voltmeterReadPower
  let powerError = context.configDetail.power_error
  console.warn('电表功率', power)
  console.warn('设备功率', getPower)
  console.warn('功率绝对值', Math.abs((getPower - power)))
  console.warn('功率绝对值除数', Math.abs((getPower - power)) / power)
  console.warn('允许的功率误差', context.configDetail.power_error)
  if (power === 0 && getPower === 0) {
    context.createLeftSpanMessage('电表与设备功率均为0，请确认设备是否正常启动', 'red')
    notPass = true
  } else if (power === 0) {
    context.createLeftSpanMessage('电表功率为0，请确认设备是否正常启动 功率误差:∞', 'red')
    notPass = true
  } else if (getPower===0){
    context.createLeftSpanMessage('设备功率为0，请确认设备是否正常启动 功率误差:∞', 'red')
    notPass = true
  }else {
    const errorPercent = (Math.abs(getPower - power) / power) * 100
    if (errorPercent > powerError) {
      context.createLeftSpanMessage('红外设备与电表功率超出误差限制,功率误差:' + errorPercent.toFixed(4) + '%', 'red')
      notPass = true
    } else {
      context.createLeftSpanMessage('红外设备与电表功率误差合格,功率误差:' + errorPercent.toFixed(4) + '%', 'grey')
    }
  }
  //标定成功或者失败的结果
  if (notPass) {
   let resultNotPass = await serialPortOperation(context, {
      actionType: 'calibration',
      operationName: '标定电流电压状态',
      cmdType: '0c',                         // afn 的命令类型
      cmdCode: '12-fail',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['calibration'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['calibration'],
      timeout: context.timeout,
      validateResponse: () => protocol.validateResponse.calibration( context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.calibration,
    }, type)
    if (resultNotPass) {
      await playErrorAudio(context)
      notPass = true
    }
  } else {
    let resultNotPass =   await serialPortOperation(context, {
      actionType: 'calibration',
      operationName: '标定电流电压状态',
      cmdType: '0c',                         // afn 的命令类型
      cmdCode: '12-success',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['calibration'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['calibration'],
      timeout: context.timeout,
      validateResponse: () => protocol.validateResponse.calibration( context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.calibration,
    }, type)
    if (resultNotPass) {
      await playErrorAudio(context)
      notPass = true
    }

  }


  return notPass

}
