import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";
import {decodeSeparationAlarmState} from "@/packBuffer/decode/wire/vac200/wireDevice";

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

    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readWireDeviceAddress(context, type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, type),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeUpperAndLowerTemperatureLimits(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writePowerOffAndWirelessError(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeHeatingDate(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeCleaningValveCycle = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeCleaningValveCycle',
    operationName: '写清洗周期',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '2C',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeCleaningValveCycle'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeCleaningValveCycle(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};



export const writeProbesConfig = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeProbesConfig',
    operationName: '写探头配置参数',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeProbesConfig(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const writeTargetAdjustmentValue = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeTargetAdjustmentValue',
    operationName: '写目标调节值',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '04',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeTargetAdjustmentValue'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeTargetAdjustmentValue(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAllConfig(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const writeForcedTemperatureSetting = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeForcedTemperatureSetting',
    operationName: '写强制设温',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '22',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeForcedTemperatureSetting'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeForcedTemperatureSetting(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    operationName: '读版本',
    cmdType: 'b0',                         // afn 的命令类型
    cmdCode: '05',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readVersion'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readVersion(context, type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData,type),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const readInAndOutTemperature = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readInAndOutTemperature',
    operationName: '读取进回温',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '1f',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['separationAlarmVerify'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readInAndBackTemperatureVerify(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, type, context),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const readValveState = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readValveState',
    operationName: '读阀门状态',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '1f',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readValveState'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.separationAlarm(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.readValveState(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, type, context),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeAddressOperations = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '18',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeAddress'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAddress(type, type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, context),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.factoryConditionFullyClose(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.factoryConditionFullyOpen(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.outTemperatureCalibration(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.inTemperatureCalibration(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.mainAndAuxiliaryValvesVerify(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.mainAndAuxiliaryValvesState(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData,context,type),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.faceplateCommunication(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.panelDetectionLostNormalState(context,type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData,type),
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.creditCard(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.creditCardState(context,type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData,type),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const separationAlarm = async (protocolId, type, context, close) => {
  return await serialPortOperation(context, {
    actionType: 'separationAlarm',
    operationName: '分离报警',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '1f',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['separationAlarm'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.separationAlarm(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.separationAlarmState(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, close,context,type),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const fullOpenCalibrationOperations = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'fullOpenCalibration',
    operationName: '全开标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ee',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['fullOpenCalibration'],
    timeout: 30000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.fullOpenCalibration(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, context),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.fullOpenCalibrationState(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData,context,type),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const fullOffCalibrationOperations = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'fullOffCalibration',
    operationName: '全关标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ff',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['fullOffCalibration'],
    timeout: 30000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.fullOffCalibration(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData, context),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.fullOffCalibrationState(type==='one'?context.receivedData.globalReceivedOneData:context.receivedData.globalReceivedTwoData,context,type),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const badPrompt = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'badPrompt',
    operationName: '不良品提示',
    cmdType: '0c',                         // afn 的命令类型
    cmdCode: '0c',                         // fn 的命令码
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
    withStartFrame: true
  }, type)
};





