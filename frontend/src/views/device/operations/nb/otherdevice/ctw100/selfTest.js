import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const selfTest = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let inquireFail = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '01',                         // fn 的命令码
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
  }, type ,'UTM100-NB')
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }


  let writeConfigResult = await serialPortOperation(context, {
    actionType: 'writeConfig',
    operationName: '写温度液位探头配置',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '23',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeConfig'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeConfig'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeConfig,
  }, type ,'UTM100-NB')
  if (writeConfigResult) {
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
    expectedLength: protocol.deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
      return false
    },
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.selfTest,
  }, type,'UTM100-NB' )
  return false

}
