import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const doZeroMpaDemarcatePTC100RS485 = async (context, type) => {
  let zeroMpaDemarcateResult = await serialPortOperation(context, {
    actionType: 'zeroMpaDemarcate',
    operationName: '0Mpa标定',
    cmdType: '06',                         // afn 的命令类型
    cmdCode: 'calibratedZeroMegapascals',                         // fn 的命令码
    protocolId: null,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['zeroMpaDemarcate'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['zeroMpaDemarcate'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.zeroMpaDemarcate(context,context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.zeroMpaDemarcate,
  }, type,'UTM100-CPT100-MODBUS')
  if (zeroMpaDemarcateResult) {
    await playErrorAudio(context)
    return true
  }
  return false
}
