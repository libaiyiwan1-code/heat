import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";

export const doSelfTestWAC330HE = async (context, protocolId, type) => {
  let requireSelfTestResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['inquireSelfTest'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['inquireSelfTest'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.inquireSelfTest(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
  }, type)
  if (requireSelfTestResult) {
    await playErrorAudio(context)
    return true
  }

  let writeTemperatureProbesConfigResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '写温度探头配置',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeTemperatureProbesConfig'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeTemperatureProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeTemperatureProbesConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writeTemperatureProbesConfig,
  }, type)
  if (writeTemperatureProbesConfigResult) {
    await playErrorAudio(context)
    return true
  }

  //进入检定
  let meterEnterVerificationStatusResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '热表进入检定',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '10-enter-verification',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['meterEnterVerificationStatus'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['meterEnterVerificationStatus'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.meterEnterVerificationStatus(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.meterEnterVerificationStatus,
  }, type)
  if (meterEnterVerificationStatusResult) {
    await playErrorAudio(context)
    return true
  }


  for (let i = 1; i <= 2; i++) {
    await serialPortOperation(context, {
      actionType: 'selfTest',
      operationName: '热表温度标定',
      cmdType: '01',                         // afn 的命令类型
      cmdCode: '12',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['meterTemperatureCalibration'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['meterTemperatureCalibration'],
      timeout: context.timeout,
      validateResponse: () => {
      },
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.meterTemperatureCalibration,
    }, type)
    await new Promise(x => setTimeout(x, 2000));
  }


  let readDataResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '读数据',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '20',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readData'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readData'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readData(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readData,
  }, type)
  if (readDataResult) {
    await playErrorAudio(context)
    return true
  }
  //判断热表进回温是否合格，不合格退出检定 ，合格也退出检定
  if (!(context.readMeterOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
    context.readMeterOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
    await badRecordUpload(context, '回温温度误差过大', +context.readMeterOutTemperature, 'selfTest')
    await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readMeterOutTemperature)
    context.leftBadProductQuantity += 1
    await doMeterReturnVerificationStatus(context, protocolId, type)
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('热表回温验证成功:' + context.readMeterOutTemperature, 'grey')
  if (!(context.readMeterInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
    context.readMeterInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
    await badRecordUpload(context, '回温温度误差过大', +context.readMeterInTemperature, 'selfTest')
    await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readMeterInTemperature)
    context.leftBadProductQuantity += 1
    await doMeterReturnVerificationStatus(context, protocolId, type)
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('热表进温验证成功:' + context.readMeterInTemperature, 'grey')
  await doMeterReturnVerificationStatus(context, protocolId, type)

  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f2',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.selfTest,
  }, type)
  return false
}


export const doMeterReturnVerificationStatus = async (context, protocolId, type) => {
  let meterReturnVerificationStatusResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '热表退出检定',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '10-return-verification',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['meterReturnVerificationStatus'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['meterReturnVerificationStatus'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.meterReturnVerificationStatus(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.meterReturnVerificationStatus,
  }, type)
  if (meterReturnVerificationStatusResult) {
    await playErrorAudio(context)
    return true
  }
  return false
}
