import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";

export const exitSelfTest= async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let result = await serialPortOperation(context, {
    actionType: 'exitSelfTest',
    operationName: '退出自检',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '14',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['exitSelfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['exitSelfTest'],
    timeout: context.timeout,
    validateResponse: () => {
      return false
    },
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.exitSelfTest,
  }, type)
  if (result) {
    await playErrorAudio(context)
    return true
  }
  return false
}
