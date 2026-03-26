import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";

export const writesActualInputCurrentValue4MA = async (protocolId, type, context,isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writesActualInputCurrentValue4MA',
    operationName: '写入4MA实际输入电流值',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writesActualInputCurrentValue4MA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writesActualInputCurrentValue4MA'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writesActualInputCurrentValue4MA(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};

export const writesActualInputCurrentValue20MA = async (protocolId, type, context,isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writesActualInputCurrentValue20MA',
    operationName: '写入20MA实际输入电流值',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0a',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writesActualInputCurrentValue20MA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writesActualInputCurrentValue20MA'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writesActualInputCurrentValue20MA(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};

export const writeFixedOutput4MA = async (protocolId, type, context,isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeFixedOutput4MA',
    operationName: '写固定输出4ma',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '02-4ma',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeFixedOutput4MA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeFixedOutput4MA'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeFixedOutput4MA(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};
export const writeFixedOutput20MA = async (protocolId, type, context,isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeFixedOutput20MA',
    operationName: '写固定输出20ma',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '02-20ma',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeFixedOutput20MA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeFixedOutput20MA'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeFixedOutput20MA(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};
export const output4MAActualCurrentValueCalibration = async (protocolId, type, context,isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'output4MAActualCurrentValueCalibration',
    operationName: '输出4ma实际电流值标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '03',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['output4MAActualCurrentValueCalibration'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['output4MAActualCurrentValueCalibration'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.output4MAActualCurrentValueCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};
export const output20MAActualCurrentValueCalibration = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'output20MAActualCurrentValueCalibration',
    operationName: '输出20ma实际电流值标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '04',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['output20MAActualCurrentValueCalibration'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['output20MAActualCurrentValueCalibration'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.output20MAActualCurrentValueCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};

export const deviceReadsCurrent = async (protocolId, type, context,isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'deviceReadsCurrent',
    operationName: '读设备电流',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0d',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['deviceReadsCurrent'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['deviceReadsCurrent'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceReadsCurrent(context.receivedData.globalReceivedOneData,context),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, 'cj88')
};
