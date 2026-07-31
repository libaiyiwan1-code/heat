import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";

export const selfTest = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let inquireFail = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['inquireSelfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['inquireSelfTest'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.inquireSelfTest(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
  }, type)
  if (inquireFail) {
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
    expectedLength: protocol.deviceActionResponseMessageLength['writeTemperatureProbesConfig'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeTemperatureProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeTemperatureProbesConfig(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeTemperatureProbesConfig,
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
    expectedLength: protocol.deviceActionResponseMessageLength['meterEnterVerificationStatus'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['meterEnterVerificationStatus'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.meterEnterVerificationStatus(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.meterEnterVerificationStatus,
  }, 'meter')
  if (meterEnterVerificationStatusResult) {
    await playErrorAudio(context)
    return true
  }

  let forNotPass = false
  for (let i = 1; i <= 2; i++) {
    let result = await serialPortOperation(context, {
      actionType: 'selfTest',
      operationName: '热表温度标定',
      cmdType: '01',                         // afn 的命令类型
      cmdCode: '12',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['meterTemperatureCalibration'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['meterTemperatureCalibration'],
      timeout: context.timeout,
      validateResponse: () => {
      },
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.meterTemperatureCalibration,
    }, 'meter')
    await new Promise(x => setTimeout(x, 2000));
    if (result) {
      forNotPass = true
      break
    }
  }
  if (forNotPass) {
    return forNotPass
  }

  await new Promise(x => setTimeout(x, 6000));
  //读第一遍数据不合格循环读 最大读取三次，如果还不合格直接失败


  let notPass = true;
  for (let i = 1; i <= 3; i++) {
    let readDataResult = await serialPortOperation(context, {
      actionType: 'selfTest',
      operationName: '读数据',
      cmdType: '90',                         // afn 的命令类型
      cmdCode: '20',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['readData'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['readData'],
      timeout: context.timeout,
      validateResponse: () => protocol.validateResponse.readData(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readData,
    }, type)
    if (readDataResult) {
      await playErrorAudio(context)
      break
    }
    ``
    //判断热表进回温是否合格，不合格退出检定 ，合格也退出检定
    if (!(Number(context.readMeterOutTemperature).toFixed(2) >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      Number(context.readMeterOutTemperature).toFixed(2) <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      context.createLeftSpanMessage('第' + i + '次 热表回温验证失败:' + Number(context.readMeterOutTemperature).toFixed(2), 'grey')
      await new Promise(x => setTimeout(x, 2000));
      continue
    }
    if (!(Number(context.readMeterInTemperature).toFixed(2) >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      Number(context.readMeterInTemperature).toFixed(2) <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      context.createLeftSpanMessage('第' + i + '次 热表进温验证失败:' + Number(context.readMeterInTemperature).toFixed(2), 'grey')
      await new Promise(x => setTimeout(x, 2000));
      continue
    }

    context.createLeftSpanMessage('热表进回温验证成功,进温:' + Number(context.readMeterInTemperature).toFixed(2) + '回温:' + Number(context.readMeterOutTemperature).toFixed(2), 'grey')
    notPass = false
    break
  }

  if (notPass) {
    await badRecordUpload(context, '热表进回温温差过大,回温：', +Number(context.readMeterOutTemperature).toFixed(2) + ' 进温：' + Number(context.readMeterInTemperature).toFixed(2), '', 'selfTest')
    await context.uploadMes(context.leftGenerateAddress, 0, '热表进回温温差过大,回温：', +Number(context.readMeterOutTemperature).toFixed(2) + ' 进温：' + Number(context.readMeterInTemperature).toFixed(2))
    context.leftBadProductQuantity += 1
    //热表温度验证失败也退出检定
    await doMeterReturnVerificationStatus(context, protocolId, type,protocol)
    await playErrorAudio(context)
    return notPass
  }


  //热表温度验证成功退出检定
  let result = await doMeterReturnVerificationStatus(context, protocolId, type,protocol)
  if (result){
    return result
  }

  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f2',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.selfTest,
  }, type)
  return false
}


export const doMeterReturnVerificationStatus = async (context, protocolId, type,protocol) => {
  let meterReturnVerificationStatusResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '热表退出检定',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '10-return-verification',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['meterReturnVerificationStatus'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['meterReturnVerificationStatus'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.meterReturnVerificationStatus(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.meterReturnVerificationStatus,
  }, 'meter')
  if (meterReturnVerificationStatusResult) {
    await playErrorAudio(context)
    return true
  }
  return false
}
