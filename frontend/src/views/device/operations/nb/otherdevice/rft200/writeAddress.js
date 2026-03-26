import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {generateAddressByCollector} from "@/utils/serviceUtils";
import {getIdByMacAddrCollector} from "@/components/global/productdb";

export async function writeAddress(protocolId, type, context) {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];

  //读地址检测是否生产库注册过.
  let readAddressResult = await serialPortOperation(context, {
    actionType: undefined,
    operationName: '读地址',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
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
  }, type)
  if (readAddressResult) {
    await playErrorAudio(context)
    context.leftGenerateAddress = ''
    return readAddressResult
  }

  //地址重复查询
  let response = await getIdByMacAddrCollector(context.leftReadAddress);
  if (response.length > 0) {
    context.leftWorkPrompt = `写地址失败`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + context.leftReadAddress, 'red');
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return true
  }

  let notPass = await generateAddressByCollector(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }
  //地址重复查询
  let response2 = await getIdByMacAddrCollector(context.leftGenerateAddress);
  if (response2.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + context.leftGenerateAddress, 'red');
    context.leftBadProductQuantity += 1;
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

  let writeAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（写地址）',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
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
  }, type)
  if (writeAddressResult) {
    await playErrorAudio(context)
    return true
  }
  return false

}
