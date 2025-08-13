import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {checkIMEI, generateAddress} from "@/utils/serviceUtils";

export async function writeAddressNTP100C(protocolId, type, context) {

  //进回温验证
  //回温探头
  //等待2s 读取压差
  // await new Promise(resolve => setTimeout(resolve, 2000));
  let readDataResult = await serialPortOperation(context, {
    actionType: 'readData',
    operationName: '读数据',
    cmdType: '0c',                         // afn 的命令类型
    cmdCode: '0a',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readData'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readData'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readData,
  }, type)
  if (readDataResult) {
    await playErrorAudio(context)
    return true
  }


  console.warn('温度探头：', context.configDetail.temperatureProbe)
  console.warn('温度误差：', context.configDetail.temperatureDiff)
  console.warn('回温：', context.readOutTemperature)
  console.warn('进温：', context.readInTemperature)
  if (context.configDetail.temperatureProbe === '回温探头') {
    if (!(context.readOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'回温温度误差过大' , + context.readOutTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readOutTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return
    }
    context.createLeftSpanMessage('回温验证成功:' + context.readOutTemperature, 'grey')

  } else if (context.configDetail.temperatureProbe === '进温探头') {
    //进温探头
    if (!(context.readInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'进温温度误差过大' , + context.readInTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readInTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return
    }
    context.createLeftSpanMessage('进温验证成功:' + context.readInTemperature, 'grey')

  } else if (context.configDetail.temperatureProbe === '双探头') {
    //双探头
    if (!(context.readOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'回温温度误差过大' , + context.readOutTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readOutTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return
    }
    context.createLeftSpanMessage('回温验证成功:' + context.readOutTemperature, 'grey')
    if (!(context.readInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'进温温度误差过大' , + context.readInTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readInTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return
    }
    context.createLeftSpanMessage('进温验证成功:' + context.readInTemperature, 'grey')
  }
  let notPass = await generateAddress(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }
  let readSelfTestStatusResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读自检状态）',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '1e',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, type)
  if (readSelfTestStatusResult) {
    await playErrorAudio(context)
    return true
  }
  if (context.version.toString() !== context.configDetail.version.toString()) {
    await badRecordUpload(context,'版本号不一致' ,  '设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '版本号不一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version)
    context.leftBadProductQuantity += 1
    await playErrorAudio(context)
    return true
  } else {
    context.createLeftSpanMessage('版本号一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'grey')
  }
  let readIMEIResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读IEMI）',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '0b',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readIMEI'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readIMEI'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readIMEI(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readIMEI,
  }, type)
  if (readIMEIResult) {
    await playErrorAudio(context)
    return true
  }
  //校验imei
  if (await checkIMEI(context)) {
    await playErrorAudio(context)
    return true
  }

  let readICCIDResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读ICCID）',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '08',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readICCID'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readICCID'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readICCID(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readICCID,
  }, type)
  if (readICCIDResult) {
    await playErrorAudio(context)
    return true
  }


  let readPressureProbesProbesResult = await serialPortOperation(context, {
    actionType: 'readProbesConfig',
    operationName: '读探头配置',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: 'fc',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readProbesConfig'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readProbesConfig(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readProbesConfig,
  }, type)
  if (readPressureProbesProbesResult) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('读压力探头配置成功', 'grey');

  let writeAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（写地址）',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeAddress'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeAddress'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAddress(context.leftGenerateAddress, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writeAddress,
  }, type)
  if (writeAddressResult) {
    await playErrorAudio(context)
    return true
  }
  return false

}
