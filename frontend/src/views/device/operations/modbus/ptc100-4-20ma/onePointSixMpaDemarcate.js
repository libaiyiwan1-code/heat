import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const doOnePointSixMpaDemarcatePTC100420MA = async (context, type) => {
  let readPressureResult = await serialPortOperation(context, {
    actionType: 'readPressureGaugePressure',
    operationName: '压力表-读压力',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'readPressureGaugePressure',               // fn 的命令码
    protocolId: null,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readPressureGaugePressure'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readPressureGaugePressure'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readPressureGaugePressure(context,context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readPressureGaugePressure,
  }, type)
  if (readPressureResult) {
    return true
  }



  let onePointSixMpaDemarcateResult = await serialPortOperation(context, {
    actionType: 'onePointSixMpaDemarcate',
    operationName: '1.6Mpa标定',
    cmdType: '06',                         // afn 的命令类型
    cmdCode: 'onePointSixMpaDemarcate',                         // fn 的命令码
    protocolId: null,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['onePointSixMpaDemarcate'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['onePointSixMpaDemarcate'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.onePointSixMpaDemarcate(context,context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.onePointSixMpaDemarcate,
  }, 'one','MODBUS')
  if (onePointSixMpaDemarcateResult) {
    await playErrorAudio(context)
    return true
  }
  return false
}
