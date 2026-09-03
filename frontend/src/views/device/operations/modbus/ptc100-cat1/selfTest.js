import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";

export const selfTest = async (context, protocolId, type) => {
  console.log(protocolId, type)
  const {configForm, maxRetries, receivedData} = context;
  const produceModel = configForm.produceModel;
  const protocolConfig = protocolIDMap[produceModel];
  const inquireSelfTestActionConfig = {
    actionType: 'inquireSelfTest',
    operationName: '自检询问',
    cmdType: 'f0',
    cmdCode: '01',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['inquireSelfTest'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['inquireSelfTest'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.inquireSelfTest(receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };

  const inquireSelfTestResult = await serialPortOperation(
    context,
    inquireSelfTestActionConfig,
    type,
    'UTM100-NB'
  );

  if (inquireSelfTestResult) {
    await playErrorAudio(context);
    return true;
  }


  const selfTestActionConfig = {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'f0',
    cmdCode: '02',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['selfTest'],
    timeout: 4000,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.selfTest,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };

  const selfTestResult = await serialPortOperation(
    context,
    selfTestActionConfig,
    type,
    'UTM100-NB'
  );

  if (selfTestResult) {
    await playErrorAudio(context);
    return true;
  }


}
