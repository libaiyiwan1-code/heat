import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {generateAddressByNB, nbDeviceRegister,checkIMEIByTerminal} from "@/utils/serviceUtils";
import {getIdByMacAddrNB} from "@/components/global/productdb";

export async function writeAddress(protocolId, type, context) {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let notPass = await generateAddressByNB(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }

  //读地址后判断生产库是否存在，不存在则走写地址流程
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
    context.leftGenerateAddress = ''
    return readAddressResult
  }

  let response = await getIdByMacAddrNB(context.leftReadAddress);
  console.log(response.length)
  if (response.length > 0) {
    context.leftWorkPrompt = `写地址失败`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + context.leftReadAddress, 'red');
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
