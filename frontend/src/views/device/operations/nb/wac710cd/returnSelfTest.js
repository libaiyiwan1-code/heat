import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";

export const returnSelfTestWAC710CD = async (context, protocolId, type) => {
  let result = await serialPortOperation(context, {
    actionType: 'returnSelfTestStatus',
    operationName: '退出自检',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'aa',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['returnSelfTestStatus'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['returnSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.returnSelfTestStatus,
  }, type)
  if (result) {
    await playErrorAudio(context)
    return true
  }
  return false
}
