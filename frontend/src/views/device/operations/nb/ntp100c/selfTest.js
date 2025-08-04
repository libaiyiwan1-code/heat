import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const doSelfTestNTP100C = async (context, protocolId, type) => {
  let requireSelfTestResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '01',                         // fn 的命令码
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
    return
  }
  let writeProbesConfigResult = await serialPortOperation(context, {
    actionType: 'writeProbesConfig',
    operationName: '设置温度压力探头',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'fc',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeProbesConfig'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeProbesConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writeProbesConfig,
  }, type)
  if (writeProbesConfigResult) {
    await playErrorAudio(context)
    return true
  }


  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '02',                         // fn 的命令码
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
