import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {generateAddressByNB} from "@/utils/serviceUtils";

export const writeAddress = async (context, protocolId, type) => {
  const {configForm, maxRetries, receivedData} = context;
  const produceModel = configForm.produceModel;
  const protocolConfig = protocolIDMap[produceModel];

  let notPass = await generateAddressByNB(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }


  const readSelfTestStatusActionConfig = {
    actionType: 'readSelfTestStatus',
    operationName: '读自检状态',
    cmdType: 'f0',
    cmdCode: '1e',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.readSelfTestStatus(context,receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };

  const readSelfTestStatusResult = await serialPortOperation(
    context,
    readSelfTestStatusActionConfig,
    type,
    'UTM100-NB'
  );

  if (readSelfTestStatusResult) {
    await playErrorAudio(context);
    return true;
  }



  if (context.version.toString() !== context.configDetail.version.toString()) {
    await badRecordUpload(context,'版本号不一致' ,  '设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '版本号不一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version)
    context.leftBadProductQuantity += 1
    context.createLeftSpanMessage('版本号不一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version,'grey')
    await playErrorAudio(context)
    return true
  } else {
    context.createLeftSpanMessage('版本号一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'grey')
  }


  const readIMEIActionConfig = {
    actionType: 'readIMEI',
    operationName: '读IMEI',
    cmdType: '05',
    cmdCode: '0b',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['readIMEI'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['readIMEI'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.readIMEI(context,receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readIMEI,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };
  const readIMEIResult = await serialPortOperation(
    context,
    readIMEIActionConfig,
    type,
    'UTM100-NB'
  );

  if (readIMEIResult) {
    await playErrorAudio(context);
    return true;
  }

  const readICCIDActionConfig = {
    actionType: 'readICCID',
    operationName: '读ICCID',
    cmdType: '05',
    cmdCode: '08',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['readICCID'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['readICCID'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.readICCID(context,receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readICCID,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };
  const readICCIDResult = await serialPortOperation(
    context,
    readICCIDActionConfig,
    type,
    'UTM100-NB'
  );

  if (readICCIDResult) {
    await playErrorAudio(context);
    return true;
  }



  const writeAddressActionConfig = {
    actionType: 'writeAddress',
    operationName: '写地址',
    cmdType: '03',
    cmdCode: '06',
    protocolId: protocolId,
    maxRetries: maxRetries,
    expectedLength: protocolConfig.deviceActionResponseMessageLength['writeAddress'],
    expectedLength2: protocolConfig.deviceActionResponseMessageLength2['writeAddress'],
    timeout: 4000,
    validateResponse: () => protocolConfig.validateResponse.writeAddress(context.leftGenerateAddress,receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolConfig.isInfraredDevice,
    isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.writeAddress,
    uplinkCommunicationTarget: {
      baudRate: 2400,
      checkDigit: '偶校验',
      method: 'INFRARED',
      includeUTM100Device: true
    }
  };
  const writeAddressResult = await serialPortOperation(
    context,
    writeAddressActionConfig,
    type,
    'UTM100-NB'
  );

  if (writeAddressResult) {
    await playErrorAudio(context);
    return true;
  }


}
