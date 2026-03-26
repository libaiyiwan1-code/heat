import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const readSelfTestStatus = async (context, type) => {
  return await serialPortOperation(context, {
    actionType: 'readSelfTestStatus',
    operationName: 'PTC100-RS485-读自检',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '1e',               // fn 的命令码
    protocolId: protocolIDMap[context.configForm.produceModel].protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, type,'UTM100-NB');
}
