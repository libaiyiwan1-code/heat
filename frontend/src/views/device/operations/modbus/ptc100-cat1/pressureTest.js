import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";

export const pressureTest = async (context, type) => {
  const {configForm, maxRetries, receivedData} = context;
  const produceModel = configForm.produceModel;
  const protocolConfig = protocolIDMap[produceModel];
  const readPressureGaugePressureActionConfig = {
    actionType: 'readPressureGaugePressure',
    operationName: '压力表读压力',
    cmdType: '03',
    cmdCode: 'readPressureGaugePressure',
    protocolId: null,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['readPressureGaugePressure'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['readPressureGaugePressure'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.readPressureGaugePressure(context, receivedData.globalReceivedOneData, true),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readPressureGaugePressure,
    uplinkCommunicationTarget: {
      baudRate: 4800,
      checkDigit: '无校验',
      method: 'RS485',
      includeUTM100Device: true
    }
  };

  const readPressureGaugePressureResult = await serialPortOperation(
    context,
    readPressureGaugePressureActionConfig,
    type,
    'MODBUS'
  );

  if (readPressureGaugePressureResult) {
    await playErrorAudio(context);
    return true;
  }


  const readDevicePressureActionConfig = {
    actionType: 'readDevicePressure',
    operationName: '设备读压力',
    cmdType: '03',
    cmdCode: 'readDevicePressure',
    protocolId: null,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['readDevicePressure'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['readDevicePressure'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.readDevicePressure(context, receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readDevicePressure,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };

  const readDevicePressureResult = await serialPortOperation(
    context,
    readDevicePressureActionConfig,
    type,
    'MODBUS'
  );
  if (readDevicePressureResult) {
    await playErrorAudio(context);
    return true;
  }


}
