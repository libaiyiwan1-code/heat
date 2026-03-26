import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {checkIMEIByTerminal, generateAddressByNB} from "@/utils/serviceUtils";
import {doMeterReturnVerificationStatus} from "@/views/device/operations/nb/wacdevice/wac330he/selfTest";

export async function writeAddress(protocolId, type, context) {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let readSelfTestStatusResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读自检状态）',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'dd',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, type)
  if (readSelfTestStatusResult) {
    await playErrorAudio(context)
    return true
  }

  if (context.version.toString() !== context.configDetail.version.toString()) {
    await badRecordUpload(context, '版本号不一致', '设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '版本号不一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version)
    context.leftBadProductQuantity += 1
    await playErrorAudio(context)
    return true
  } else {
    context.createLeftSpanMessage('版本号一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'grey')
  }

  //退出热表检定状态。
  let result = await doMeterReturnVerificationStatus(context, protocolId, type)
  if (result) {
    await playErrorAudio(context)
    return true
  }


  let readDataResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '读数据',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '20',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readData'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readData'],
    timeout: 3500,
    validateResponse: () => protocol.validateResponse.readData(context,context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readData,
  }, type)
  if (readDataResult) {
    await playErrorAudio(context)
    return true
  }
  //判断热表进回温是否合格，不合格退出检定 ，合格也退出检定
  if (!(context.readMeterOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
    context.readMeterOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
    await badRecordUpload(context, '回温温度误差过大', +context.readMeterOutTemperature, 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readMeterOutTemperature)
    context.leftBadProductQuantity += 1
    await doMeterReturnVerificationStatus(context, protocolId, type)
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('热表回温验证成功:' + context.readMeterOutTemperature, 'grey')
  if (!(context.readMeterInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
    context.readMeterInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
    await badRecordUpload(context, '进温温度误差过大', +context.readMeterInTemperature, 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readMeterInTemperature)
    context.leftBadProductQuantity += 1
    await doMeterReturnVerificationStatus(context, protocolId, type)
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('热表进回温验证成功,进温:' + context.readMeterInTemperature.toFixed(2) + '回温:' + Number(context.readMeterOutTemperature).toFixed(2), 'grey')

  //判断状态字退出检定是否成功
  if (context.whetherVerificationState) {
    await badRecordUpload(context, '热表退出检定', '退出失败', 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '热表退出检定:失败')
    context.leftBadProductQuantity += 1
    await playErrorAudio(context)
    return true
  }


  //热表设置时间
  let meterSettingDateResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '热表校时',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '15',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['meterSettingDate'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['meterSettingDate'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.meterSettingDate(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.meterSettingDate,
  }, 'meter')
  if (meterSettingDateResult) {
    await playErrorAudio(context)
    return true
  }

  let notPass = await generateAddressByNB(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }

  if (context.configDetail.communication === '无线') {
    let readIMEIResult = await serialPortOperation(context, {
      actionType: 'writeAddress',
      operationName: '地址写入（读IEMI）',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '0b',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['readIMEI'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['readIMEI'],
      timeout: context.timeout,
      validateResponse: () => protocol.validateResponse.readIMEI(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readIMEI,
    }, type)
    if (readIMEIResult) {
      await playErrorAudio(context)
      return true
    }
    //校验imei
    if (await checkIMEIByTerminal(context)) {
      await playErrorAudio(context)
      return true
    }
    //热表写地址 、阀门写地址
    let readICCIDResult = await serialPortOperation(context, {
      actionType: 'writeAddress',
      operationName: '地址写入（读ICCID）',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '08',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['readICCID'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['readICCID'],
      timeout: context.timeout,
      validateResponse: () => protocol.validateResponse.readICCID(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readICCID,
    }, type)
    if (readICCIDResult) {
      await playErrorAudio(context)
      return true
    }
  }


  // let readMeterAddress = await serialPortOperation(context, {
  //   actionType: 'writeAddress',
  //   operationName: '地址写入（读热表地址）',
  //   cmdType: '81',                         // afn 的命令类型
  //   cmdCode: '0a',                         // fn 的命令码
  //   protocolId: protocolId,
  //   maxRetries: context.maxRetries,
  //   expectedLength: protocol.deviceActionResponseMessageLength['meterReadAddress'],
  //   expectedLength2: protocol.deviceActionResponseMessageLength2['meterReadAddress'],
  //   timeout: context.timeout,
  //   validateResponse: () => protocol.validateResponse.meterReadAddress(context, context.receivedData.globalReceivedOneData),
  //   preprocess: () => {
  //   },
  //   isInfraredDevice: protocol.isInfraredDevice,
  //   isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.meterReadAddress,
  // }, 'meter')
  // if (readMeterAddress) {
  //   await playErrorAudio(context)
  //   return true
  // }
  let writeMeterAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（写热表地址）',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '18',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['meterWriteAddress'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['meterWriteAddress'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.meterWriteAddress(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.meterWriteAddress,
  }, 'meter')
  if (writeMeterAddressResult) {
    await playErrorAudio(context)
    return true
  }

  let writeAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（阀门写地址）',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeValveAddress'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeValveAddress'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeValveAddress(context.leftGenerateAddress, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeValveAddress,
  }, type)
  if (writeAddressResult) {
    await playErrorAudio(context)
    return true
  }
  return false

}
