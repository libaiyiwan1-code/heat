import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const readWireDeviceAddress = async (protocolId, type, context, isInfraredDevice = false) => {
  return await serialPortOperation(context, {
    actionType: 'readWireDeviceAddress',
    operationName: '有线设备读地址',
    cmdType: '81',                         // afn 的命令类型
    cmdCode: '0a',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readWireDeviceAddress'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readWireDeviceAddress'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readWireDeviceAddress(context, type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, type, isInfraredDevice),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeUpperAndLowerTemperatureLimits'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeUpperAndLowerTemperatureLimits(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writePowerOffAndWirelessError = async (protocolId, type, context, isInfraredDevice = false) => {
  return await serialPortOperation(context, {
    actionType: 'writePowerOffAndWirelessError',
    operationName: '写电源断电、无线异常',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '26',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writePowerOffAndWirelessError'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writePowerOffAndWirelessError'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writePowerOffAndWirelessError(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, isInfraredDevice),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeHeatingDate'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeHeatingDate(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeCleaningValveCycle'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeCleaningValveCycle(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeProbesConfig(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeTargetAdjustmentValue'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeTargetAdjustmentValue(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const writeAllConfig = async (protocolId, type, context, isInfraredDevice = false) => {
  return await serialPortOperation(context, {
    actionType: 'writeAllConfig',
    operationName: '写入完整配置',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '02',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeAllConfig'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeAllConfig'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAllConfig(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, isInfraredDevice),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const writeForcedTemperatureSetting = async (protocolId, type, context, isInfraredDevice = false) => {
  return await serialPortOperation(context, {
    actionType: 'writeForcedTemperatureSetting',
    operationName: '写强制设温',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '22',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeForcedTemperatureSetting'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeForcedTemperatureSetting'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeForcedTemperatureSetting(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, isInfraredDevice),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const readVersion = async (protocolId, type, context, isInfraredDevice = false) => {
  return await serialPortOperation(context, {
    actionType: 'readVersion',
    operationName: '读版本',
    cmdType: 'b0',                         // afn 的命令类型
    cmdCode: '05',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readVersion'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readVersion'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readVersion(context, type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, type, isInfraredDevice),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['separationAlarmVerify'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readInAndBackTemperatureVerify(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, type, context),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readValveState'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.separationAlarm(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.readValveState(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, type, context),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeAddressOperations = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入',
    cmdType: 'a0',                         // afn 的命令类型
    cmdCode: '18',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeAddress'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeAddress'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAddress(type, type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, context, isInfraredDevice),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['factoryConditionFullyClose'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.factoryConditionFullyClose(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['factoryConditionFullyOpen'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.factoryConditionFullyOpen(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['outTemperatureCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.outTemperatureCalibration(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['inTemperatureCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.inTemperatureCalibration(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['mainAndAuxiliaryValvesVerify'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.mainAndAuxiliaryValvesVerify(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.mainAndAuxiliaryValvesState(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, context, type),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['faceplateCommunication'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.faceplateCommunication(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.panelDetectionLostNormalState(context, type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, type),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['creditCard'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.creditCard(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.creditCardState(context, type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, type),
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
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['separationAlarm'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.separationAlarm(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.separationAlarmState(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, close, context, type),
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const fullOpenCalibrationOperations = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'fullOpenCalibration',
    operationName: '全开标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ee',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['fullOpenCalibration'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['fullOpenCalibration'],
    timeout: 30000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.fullOpenCalibration(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, context, isInfraredDevice),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.fullOpenCalibrationState(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, context, type, isInfraredDevice),
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const fullOffCalibrationOperations = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'fullOffCalibration',
    operationName: '全关标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: 'ff',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['fullOffCalibration'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['fullOffCalibration'],
    timeout: 30000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.fullOffCalibration(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, context, isInfraredDevice),
    preprocess: () => protocolIDMap[context.configForm.produceModel].preprocess.fullOffCalibrationState(type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData, context, type, isInfraredDevice),
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};


export const sourceOutputs4mA = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: ' sourceOutputs4mA',
    operationName: '信号源输出4mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '06-4ma',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['signalSourceOutput'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['signalSourceOutput'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.signal4MASourceOutput(context.receivedData.globalReceivedCurrentSourceData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};

export const sourceOutputs1V = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: ' sourceOutputs1V',
    operationName: '信号源输出1V',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '06-1v',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['signalSourceOutput'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['signalSourceOutput'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.signal1VSourceOutput(context.receivedData.globalReceivedCurrentSourceData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};

export const sourceOutputs5V = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: ' sourceOutputs5V',
    operationName: '信号源输出5V',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '06-5v',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['signalSourceOutput'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['signalSourceOutput'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.signal5VSourceOutput(context.receivedData.globalReceivedCurrentSourceData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};

export const sourceOutputs10V = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: ' sourceOutputs10V',
    operationName: '信号源输出10V',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '06-10v',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['signalSourceOutput'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['signalSourceOutput'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.signal10VSourceOutput(context.receivedData.globalReceivedCurrentSourceData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};


export const sourceOutputs12mA = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: ' sourceOutputs12mA',
    operationName: '信号源输出12mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '06-12ma',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['signalSourceOutput'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['signalSourceOutput'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.signal12MASourceOutput(context.receivedData.globalReceivedCurrentSourceData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};

export const sourceOutputs20mA = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: ' sourceOutputs20mA',
    operationName: '信号源输出20mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '06-20ma',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['signalSourceOutput'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['signalSourceOutput'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.signal20MASourceOutput(context.receivedData.globalReceivedCurrentSourceData),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};


export const readCurrentAmmeterInputLoop = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readCurrentAmmeterInputLoop',
    operationName: '读取输入回路电流表电流',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '03',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readCurrentAmmeterInputLoop'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readCurrentAmmeterInputLoop'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readCurrentAmmeterInputLoop(context.receivedData.globalReceivedCurrentSourceData, context),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};

export const readVoltageAmmeterInputLoop = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readVoltageAmmeterInputLoop',
    operationName: '读取输入回路电压表电压',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '03',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readVoltageAmmeterInputLoop'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readVoltageAmmeterInputLoop'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readVoltageAmmeterInputLoop(context.receivedData.globalReceivedCurrentSourceData, context),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};


export const readCurrentAmmeterOutputLoop = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readCurrentAmmeterOutputLoop',
    operationName: '读取输出回路电流表电流',
    cmdType: '02',                         // afn 的命令类型
    cmdCode: '03',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readCurrentAmmeterOutputLoop'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readCurrentAmmeterOutputLoop'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readCurrentAmmeterOutputLoop(context.receivedData.globalReceivedCurrentSourceData, context),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};


/**
 * 读取电流源
 * */
export const readCurrentSource = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readCurrentSource',
    operationName: '读取电流源',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: '03-aec100',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readCurrentSource'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readCurrentSource'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readCurrentSource(context.receivedData.globalReceivedCurrentSourceData, context),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};


export const readVoltageAmmeterOutputLoop = async (protocolId, type, context) => {
  return await serialPortOperation(context, {
    actionType: 'readVoltageAmmeterOutputLoop',
    operationName: '读取输出回路电压表电压',
    cmdType: '02',                         // afn 的命令类型
    cmdCode: '03',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readVoltageAmmeterOutputLoop'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readVoltageAmmeterOutputLoop'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readVoltageAmmeterOutputLoop(context.receivedData.globalReceivedCurrentSourceData, context),
    preprocess: () => {
    },
    isInfraredDevice: false,
    isTransparentTransmissionProtocol: false,
    isWireDevice: false,
  }, 'currentSource')
};


export const writesActualInputCurrentValue4MA = async (protocolId, type, context, isInfraredDevice) => {
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
  }, type)
};

export const writesActualInputCurrentValue20MA = async (protocolId, type, context, isInfraredDevice) => {
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
  }, type)
};

export const writeFixedOutput4MA = async (protocolId, type, context, isInfraredDevice) => {
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
  }, type)
};
export const writeFixedOutput20MA = async (protocolId, type, context, isInfraredDevice) => {
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
  }, type)
};
export const output4MAActualCurrentValueCalibration = async (protocolId, type, context, isInfraredDevice) => {
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
  }, type)
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
  }, type)
};

export const deviceReadsCurrent = async (protocolId, type, context, isInfraredDevice) => {
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
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceReadsCurrent(context.receivedData.globalReceivedOneData, context),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const deviceReadsVoltage = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'deviceReadsVoltage',
    operationName: '读设备电压',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0d',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['deviceReadsVoltage'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['deviceReadsVoltage'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceReadsVoltage(context.receivedData.globalReceivedOneData, context),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const writeWorkChannel010V = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeWorkChannel0-10V',
    operationName: '写工作模式0~10V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '01-0~10V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeWorkChannel0-10V'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeWorkChannel0-10V'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeWorkChannel010V(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeWorkChannel110V = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeWorkChannel1-10V',
    operationName: '写工作模式1~10V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '01-1~10V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeWorkChannel1-10V'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeWorkChannel1-10V'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeWorkChannel110V(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeWorkChannel420mA = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeWorkChannel420mA',
    operationName: '写工作模式4~20mA',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '01-4~20MA',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeWorkChannel4-20mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeWorkChannel4-20mA'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeWorkChannel420mA(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeFixedOutput1V = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeFixedOutput1V',
    operationName: '写固定输出1V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '02-1V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeFixedOutput1V'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeFixedOutput1V'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeFixedOutput1V(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeFixedOutput10V = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeFixedOutput10V',
    operationName: '写固定输出10V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '02-10V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeFixedOutput10V'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writeFixedOutput10V'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeFixedOutput10V(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const writeInput1vActuals = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeInput1vActuals',
    operationName: '写输入1v实际值标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0b',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writesActualInputVoltageValue1V'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writesActualInputVoltageValue1V'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writesActualInputVoltageValue1V(context.receivedData.globalReceivedOneData, context),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeInput10vActuals = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeInput10vActuals',
    operationName: '写输入10v实际值标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0c',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writesActualInputVoltageValue10V'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['writesActualInputVoltageValue10V'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writesActualInputVoltageValue10V(context.receivedData.globalReceivedOneData, context),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};

export const writeOutput1vActuals = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeOutput1vActuals',
    operationName: '写输出1v实际值标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '05',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['output1VActualVoltageValueCalibration'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['output1VActualVoltageValueCalibration'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.output1VActualVoltageValueCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
    isTransparentTransmissionProtocol: false,
    isWireDevice: protocolIDMap[context.configForm.produceModel].isWireDevice,
  }, type)
};
export const writeOutput10vActuals = async (protocolId, type, context, isInfraredDevice) => {
  return await serialPortOperation(context, {
    actionType: 'writeOutput10vActuals',
    operationName: '写输出10v实际值标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['output10VActualVoltageValueCalibration'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['output10VActualVoltageValueCalibration'],
    timeout: 2000,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.output10VActualVoltageValueCalibration(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: isInfraredDevice,
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





