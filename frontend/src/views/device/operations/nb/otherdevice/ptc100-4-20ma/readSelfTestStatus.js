import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const readSelfTestStatus = async (context, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  return await serialPortOperation(context, {
    actionType: 'readSelfTestStatus',
    operationName: 'PTC100-4-20MA-读自检',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '1e',               // fn 的命令码
    protocolId: protocol.protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, type);
}
