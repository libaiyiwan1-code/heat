import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const readWireDeviceAddress = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readWireDeviceAddress',
    operationName: '有线设备读地址',
    cmdType: '81',                         // afn 的命令类型
    cmdCode: '0a',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readWireDeviceAddress'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readWireDeviceAddress(context, context.receivedData.globalReceivedOneData, type),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const writeUpperAndLowerTemperatureLimits = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeUpperAndLowerTemperatureLimits',
    operationName: '写温度上下限',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '11',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeUpperAndLowerTemperatureLimits'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeUpperAndLowerTemperatureLimits(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writePowerOffAndWirelessError = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writePowerOffAndWirelessError',
    operationName: '写电源断电、无线异常',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '26',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writePowerOffAndWirelessError'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writePowerOffAndWirelessError(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const writeHeatingDate = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeHeatingDate',
    operationName: '写供暖起始、结束日期',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '19',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeHeatingDate'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeHeatingDate(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const writeProbesConfig = async (protocolId, type, context)  => {
  return await serialPortOperation(context, {
    actionType: 'writeProbesConfig',
    operationName: '写探头配置参数',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeProbesConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeAllConfig = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeAllConfig',
    operationName: '写入完整配置',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '02',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeAllConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAllConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const readVersion = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readVersion',
    operationName: '写入完整配置',
    cmdType: 'b0',                         // afn 的命令类型
    cmdCode: '05',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readVersion'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readVersion(context,context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const factoryConditionFullyClose = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'factoryConditionFullyClose',
    operationName: '写出厂状态全关',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '17-close',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['factoryConditionFullyClose'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.factoryConditionFullyClose(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const factoryConditionFullyOpen = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'factoryConditionFullyOpen',
    operationName: '写出厂状态全开',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '17-open',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['factoryConditionFullyOpen'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.factoryConditionFullyOpen(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const outTemperatureCalibration = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'outTemperatureCalibration',
    operationName: '回温标定',
    cmdType: 'bb',                         // afn 的命令类型
    cmdCode: 'ff',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['outTemperatureCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.outTemperatureCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const inTemperatureCalibration = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'inTemperatureCalibration',
    operationName: '进温标定',
    cmdType: 'bb',                         // afn 的命令类型
    cmdCode: 'ee',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['inTemperatureCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.inTemperatureCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const mainAndAuxiliaryValvesVerify = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'mainAndAuxiliaryValvesVerify',
    operationName: '主副阀检测',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '22',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['mainAndAuxiliaryValvesVerify'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.mainAndAuxiliaryValvesVerify(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const faceplateCommunication = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'faceplateCommunication',
    operationName: '面板通信检测',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '1f',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['faceplateCommunication'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.faceplateCommunication(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const creditCard = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'creditCard',
    operationName: '刷卡检测',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '24',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['creditCard'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.creditCard(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const fullOpenCalibration = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'fullOpenCalibration',
    operationName: '全开标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ee',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['fullOpenCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.fullOpenCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const fullOffCalibration = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'fullOffCalibration',
    operationName: '全关标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ff',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['fullOffCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.fullOffCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const badPrompt = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'badPrompt',
    operationName: '不良品提示',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ff',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['badPrompt'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
    withStartFrame:true
  }, type)
};
