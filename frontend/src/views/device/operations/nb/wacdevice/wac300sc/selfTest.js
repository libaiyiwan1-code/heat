import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";
import {writeTemperatureProbe} from "@/packBuffer/decode/nb/wac300sc";

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
    validateResponse: () => protocol.validateResponse.inquireSelfTest(context.receivedData.globalReceivedOneData),
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
    operationName: '写温度探头配置:'+context.configDetail.temperatureProbe,
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeTemperatureProbe'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeTemperatureProbe'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeTemperatureProbe(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeTemperatureProbe,
  }, type)
  if (writeTemperatureProbesConfigResult) {
    await playErrorAudio(context)
    return true
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
