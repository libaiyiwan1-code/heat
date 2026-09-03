import { protocolIDMap } from "@/views/device/enum/enum";
import { playErrorAudio } from "@/utils/audioUtils";
import { serialPortOperation } from "@/views/device/action/deviceAction";

/**
 * 0Mpa标定
 * @param {Object} context - 上下文对象
 * @param {string} type - 操作类型
 * @returns {Promise<boolean>} - true: 标定失败, false: 标定成功
 */
export const zeroMpaDemarcate = async (context, type) => {
  const { configForm, maxRetries, receivedData } = context;
  const produceModel = configForm.produceModel;
  const protocolConfig = protocolIDMap[produceModel];

  const actionConfig = {
    actionType: 'zeroMpaDemarcate',
    operationName: '0Mpa标定',
    cmdType: '06',
    cmdCode: 'calibratedZeroMegapascals',
    protocolId: null,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['zeroMpaDemarcate'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['zeroMpaDemarcate'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.zeroMpaDemarcate(context, receivedData.globalReceivedOneData),
    preprocess: () => {},
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.zeroMpaDemarcate ,
    uplinkCommunicationTarget:{
      baudRate: 2400,
      method: 'INFRARED',
      checkDigit: '偶校验',
      includeUTM100Device: true
    }
  };

  const zeroMpaDemarcateResult = await serialPortOperation(
    context,
    actionConfig,
    type,
    'MODBUS'
  );

  if (zeroMpaDemarcateResult) {
    await playErrorAudio(context);
    return true;
  }

  return false;
};



/**
 * 1.6Mpa标定
 * @param {Object} context - 上下文对象
 * @param {string} type - 操作类型
 * @returns {Promise<boolean>} - true: 标定失败, false: 标定成功
 */
export const onePointSixMpaDemarcate = async (context, type) => {
  const { configForm, maxRetries, receivedData } = context;
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
    validateResponse: () => protocolConfig.validateResponse.readPressureGaugePressure(context, receivedData.globalReceivedOneData,false),
    preprocess: () => {},
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readPressureGaugePressure ,
    uplinkCommunicationTarget:{
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


  const onePointSixMpaDemarcateActionConfig = {
    actionType: 'readPressureGaugePressure',
    operationName: '1.6Mpa标定',
    cmdType: '06',
    cmdCode: 'onePointSixMpaDemarcate',
    protocolId: null,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['onePointSixMpaDemarcate'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['onePointSixMpaDemarcate'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.onePointSixMpaDemarcate(context, receivedData.globalReceivedOneData),
    preprocess: () => {},
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.onePointSixMpaDemarcate ,
    uplinkCommunicationTarget:{
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };

  const onePointSixMpaDemarcateResult = await serialPortOperation(
    context,
    onePointSixMpaDemarcateActionConfig,
    type,
    'MODBUS'
  );

  if (onePointSixMpaDemarcateResult) {
    await playErrorAudio(context);
    return true;
  }

  return false;
};
