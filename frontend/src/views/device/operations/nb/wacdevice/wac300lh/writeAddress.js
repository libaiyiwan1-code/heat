import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {generateAddressByLORA} from "@/utils/serviceUtils";
import {getIdByMacAddrLORAProduce} from "@/components/global/productdb";

export async function writeAddress(protocolId, type, context) {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  //读地址检测是否生产库注册过.
  let readAddressResult = await serialPortOperation(context, {
    actionType: undefined,
    operationName: '读地址',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'dd',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readAddress'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readAddress'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readAddress,
  }, 'cj88')
  if (readAddressResult) {
    await playErrorAudio(context)
    context.leftGenerateAddress = ''
    return readAddressResult
  }


  let readDataResult = await serialPortOperation(context, {
    actionType: 'readData',
    operationName: '读数据',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '20',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readData'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readData'],
    timeout: 6500,
    validateResponse: () => protocol.validateResponse.readData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readData,
  }, 'cj88')
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
      return true
    }
    context.createLeftSpanMessage('回温验证成功:' + context.readOutTemperature, 'grey')

  } else if (context.configDetail.temperatureProbe === '进温探头') {
    //进温探头
    if (!(context.readInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'进温温度误差过大' ,  context.readInTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readInTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('进温验证成功:' + context.readInTemperature, 'grey')

  }
  else if (context.configDetail.temperatureProbe === '双探头') {
    //双探头
    if (!(context.readOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'回温温度误差过大' , + context.readOutTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readOutTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('回温验证成功:' + context.readOutTemperature, 'grey')
    if (!(context.readInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'进温温度误差过大' ,  context.readInTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readInTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('进温验证成功:' + context.readInTemperature, 'grey')
  }
  //验证是否注册过
  let response = await getIdByMacAddrLORAProduce(context,context.leftReadAddress);
  // 连接超时或sql响应超时
  if (!response){
    await playErrorAudio(context)
    return true
  }
  if (response.length > 0) {
    context.leftWorkPrompt = `写地址失败`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + context.leftReadAddress, 'red');
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return true
  }
  let notPass = await generateAddressByLORA(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }
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
  }, 'cj88')
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


  let writeAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（写地址）',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '18',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeAddress'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeAddress'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeAddress(context.leftGenerateAddress, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeAddress,
  }, 'cj88')
  if (writeAddressResult) {
    await playErrorAudio(context)
    return true
  }
  return false

}
