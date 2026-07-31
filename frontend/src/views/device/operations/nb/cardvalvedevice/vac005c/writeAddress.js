import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {generateAddressByCardValve} from "@/utils/serviceUtils";
import {getIdByMacAddrCardValve} from "@/components/global/productdb";

const Log = require('ee-core/log');


export async function writeAddress(protocolId, type, context) {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  //读地址检测是否写过地址.
  let readAddressResult = await serialPortOperation(context, {
    actionType: 'readAddress',
    operationName: '读地址',
    cmdType: '81',                         // afn 的命令类型
    cmdCode: '0a',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength:  protocol.deviceActionResponseMessageLength['readAddress'],
    expectedLength2:  protocol.deviceActionResponseMessageLength2['readAddress'],
    timeout: context.timeout,
    validateResponse: () =>  protocol.validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice:  protocol.isInfraredDevice,
    isTransparentTransmissionProtocol:  protocol.isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, 'cj88')
  if (readAddressResult) {
    await playErrorAudio(context)
    return true
  }
  let readAddress = context.leftReadAddress
  let response = await getIdByMacAddrCardValve(readAddress);
  if (response.length > 0) {
    context.createLeftSpanMessage(`该设备已写过地址:${readAddress}`, 'red')
    Log.error('该设备已写过地址:', readAddress)
    return true
  }
  if (readAddress !== '12345678'){
    context.createLeftSpanMessage(`地址为 非12345678:${readAddress}`, 'red')
    Log.error('地址为 非12345678', readAddress)
    return true;
  }



  let notPass = await generateAddressByCardValve(context)
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
    expectedLength:  protocol.deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2:  protocol.deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () =>  protocol.validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice:  protocol.isInfraredDevice,
    isTransparentTransmissionProtocol:  protocol.isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, 'cj88')
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
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '18',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength:  protocol.deviceActionResponseMessageLength['writeAddress'],
    expectedLength2:  protocol.deviceActionResponseMessageLength2['writeAddress'],
    timeout: context.timeout,
    validateResponse: () =>  protocol.validateResponse.writeAddress(context.leftGenerateAddress, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice:  protocol.isInfraredDevice,
    isTransparentTransmissionProtocol:  protocol.isDeviceActionTransparentTransmissionProtocol.writeAddress,
  }, 'cj88')
  if (writeAddressResult) {
    await playErrorAudio(context)
    return true
  }
  return false

}
