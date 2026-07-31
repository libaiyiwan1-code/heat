import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const selfTest = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];

  // 1️⃣ 自检询问
  const inquireFail = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'dd',
    cmdCode: 'f0',
    protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['inquireSelfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['inquireSelfTest'],
    timeout: context.timeout,
    validateResponse: () =>
      protocol.validateResponse.inquireSelfTest(
        context.receivedData.globalReceivedOneData
      ),
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol:
    protocol.isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
  }, type);

  if (inquireFail) {
    await playErrorAudio(context);
    return true;
  }

  // 2️⃣ 自检开启
  const startFail = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'dd',
    cmdCode: 'f2',
    protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol:
    protocol.isDeviceActionTransparentTransmissionProtocol.selfTest,
  }, type);

  if (startFail) {
    await playErrorAudio(context);
    return true;
  }

  return false;
};
