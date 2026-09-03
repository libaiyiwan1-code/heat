import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";

export const exitSelfTest = async (context, protocolId, type) => {
  const {configForm, maxRetries, receivedData} = context;
  const produceModel = configForm.produceModel;
  const protocolConfig = protocolIDMap[produceModel];

  const exitSelfTestActionConfig = {
    actionType: 'exitSelfTest',
    operationName: '退出自检',
    cmdType: 'f0',
    cmdCode: '14',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['exitSelfTest'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['exitSelfTest'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.exitSelfTest(receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.exitSelfTest,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };
  const result = await serialPortOperation(
    context,
    exitSelfTestActionConfig,
    type,
    'UTM100-NB'
  );

  if (result) {
    await playErrorAudio(context);
    return true;
  }

  return false
}
