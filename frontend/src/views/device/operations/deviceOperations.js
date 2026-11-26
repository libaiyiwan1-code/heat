import {serialPortOperation,} from "@/views/device/action/deviceAction";
import {checkPort} from "@/views/device/handler/portHandler";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {set420mACalibrationStatus} from "@/packBuffer/decode/nb/actuator";

const Log = require('ee-core/log');

export const doReadData = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let result = await serialPortOperation(context, {
    actionType: 'readData',
    operationName: '数据读取',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '20',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['readData'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['readData'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.readData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (result) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('读数据成功', 'green')
  await playSuccessAudio(context)


}
export const doSetElectricalAngleOffset = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let result = await serialPortOperation(context, {
    actionType: 'setElectricalAngleOffset',
    operationName: '设置电角度偏移量',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '20',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['setElectricalAngleOffset'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['setElectricalAngleOffset'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.setElectricalAngleOffset(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (result) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('设置电角度偏移量', 'green')
  await playSuccessAudio(context)


}
export const doCleanSwitchLifespanTestData = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let result = await serialPortOperation(context, {
    actionType: 'cleanSwitchLifespanTestData',
    operationName: '',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '31',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['cleanSwitchLifespanTestData'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['cleanSwitchLifespanTestData'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.cleanSwitchLifespanTestData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (result) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('清开关寿命测试数据', 'green')
  await playSuccessAudio(context)


}
export const doSelfTest = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'selfCheckInquiry',
    operationName: '自检询问',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['selfCheckInquiry'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['selfCheckInquiry'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.selfCheckInquiry(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }

  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f2',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  context.createLeftSpanMessage('自检开启', 'green')
  await playSuccessAudio(context)
  return false
};
export const doReadSN = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'readSN',
    operationName: '读SN序列号',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'e0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['readSN'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['readSN'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.readSN(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('读SN序列号', 'green')
  await playSuccessAudio(context)
  return false
}
export const doWrite4MAInputCurrent = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'write4MAInputCurrent',
    operationName: '写 4MA实际输入电流值',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['write4MAInputCurrent'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['write4MAInputCurrent'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.write4MAInputCurrent(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('写 4MA实际输入电流值', 'green')
  await playSuccessAudio(context)
  return false
};
export const doWrite2VInputVoltage = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    "actionType": 'write2VInputVoltage',
    "operationName": '写 2V实际输入电压值',
    "cmdType": 'cc',                         // afn 的命令类型
    "cmdCode": '13',                         // fn 的命令码
    "protocolId": protocolId,
    "maxRetries": context.maxRetries,
    "expectedLength": protocolIDMap[produceModel].deviceActionResponseMessageLength['write2VInputVoltage'],
    "expectedLength2": protocolIDMap[produceModel].deviceActionResponseMessageLength2['write2VInputVoltage'],
    "timeout": context.timeout,
    "validateResponse": () => protocolIDMap[produceModel].validateResponse.write2VInputVoltage(context, context.receivedData.globalReceivedOneData),
    "preprocess": () => {
    },
    "isInfraredDevice": protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('写 2V实际输入电压值', 'green')
  await playSuccessAudio(context)
  return false
};
export const doWrite10VInputVoltage = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    "actionType": 'write10VInputVoltage',
    "operationName": '写 10V实际输入电压值',
    "cmdType": 'cc',                         // afn 的命令类型
    "cmdCode": '0c',                         // fn 的命令码
    "protocolId": protocolId,
    "maxRetries": context.maxRetries,
    "expectedLength": protocolIDMap[produceModel].deviceActionResponseMessageLength['write10VInputVoltage'],
    "expectedLength2": protocolIDMap[produceModel].deviceActionResponseMessageLength2['write10VInputVoltage'],
    "timeout": context.timeout,
    "validateResponse": () => protocolIDMap[produceModel].validateResponse.write10VInputVoltage(context, context.receivedData.globalReceivedOneData),
    "preprocess": () => {
    },
    "isInfraredDevice": protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('写 10V实际输入电压值', 'green')
  await playSuccessAudio(context)
  return false
};
export const doDeviceOutputs4mA = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    "actionType": 'deviceOutputs4mA',
    "operationName": '设备固定输出4mA',
    "cmdType": 'cc',                         // afn 的命令类型
    "cmdCode": '11-4mA',                         // fn 的命令码
    "protocolId": protocolId,
    "maxRetries": context.maxRetries,
    "expectedLength": protocolIDMap[produceModel].deviceActionResponseMessageLength['deviceOutputs4mA'],
    "expectedLength2": protocolIDMap[produceModel].deviceActionResponseMessageLength2['deviceOutputs4mA'],
    "timeout": context.timeout,
    "validateResponse": () => protocolIDMap[produceModel].validateResponse.deviceOutputs4mA(context, context.receivedData.globalReceivedOneData),
    "preprocess": () => {
    },
    "isInfraredDevice": protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('设备固定输出4mA', 'green')
  await playSuccessAudio(context)
  return false
};
export const doDeviceOutputs20mA = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'deviceOutputs20mA',
    operationName: '设备固定输出20mA',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '11-20mA',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['deviceOutputs20mA'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['deviceOutputs20mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.deviceOutputs20mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('设备固定输出20mA', 'green')
  await playSuccessAudio(context)
  return false
};
export const doDeviceOutputs1V = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'deviceOutputs1V',
    operationName: '设备固定输出1V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '11-1V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['deviceOutputs1V'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['deviceOutputs1V'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.deviceOutputs1V(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('设备固定输出1V', 'green')
  await playSuccessAudio(context)
  return false
};
export const doDeviceOutputs2V = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'deviceOutputs2V',
    operationName: '设备固定输出2V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '11-2V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['deviceOutputs2V'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['deviceOutputs2V'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.deviceOutputs2V(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('设备固定输出2V', 'green')
  await playSuccessAudio(context)
  return false
};
export const doDeviceOutputs10V = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'deviceOutputs10V',
    operationName: '设备固定输出10V',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '11-10V',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['deviceOutputs10V'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['deviceOutputs10V'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.deviceOutputs10V(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('设备固定输出10V', 'green')
  await playSuccessAudio(context)
  return false
};
export const doOutputs4mACurrentCalibration = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'outputs4mACurrentCalibration',
    operationName: '输出4mA电流标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '03',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['outputs4mACurrentCalibration'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['outputs4mACurrentCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.outputs4mACurrentCalibration(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('输出4mA电流标定', 'green')
  await playSuccessAudio(context)
  return false
};
export const doOutputs20mACurrentCalibration = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'outputs20mACurrentCalibration',
    operationName: '输出20mA电流标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '04',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['outputs20mACurrentCalibration'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['outputs20mACurrentCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.outputs20mACurrentCalibration(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('输出20mA电流标定', 'green')
  await playSuccessAudio(context)
  return false
};
export const doOutputs2VVoltageCalibration = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'outputs2VVoltageCalibration',
    operationName: '输出2V电压标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '10',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['outputs2VVoltageCalibration'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['outputs2VVoltageCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.outputs2VVoltageCalibration(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('输出2V电压标定', 'green')
  await playSuccessAudio(context)
  return false
};
export const doOutputs10VVoltageCalibration = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'outputs10VVoltageCalibration',
    operationName: '输出10V电压标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['outputs10VVoltageCalibration'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['outputs10VVoltageCalibration'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.outputs10VVoltageCalibration(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('输出10V电压标定', 'green')
  await playSuccessAudio(context)
  return false
};
export const doReadDeviceAnalogAcquisitionValue = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'readDeviceAnalogAcquisitionValue',
    operationName: '读设备模拟量采集值',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0f',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['readDeviceAnalogAcquisitionValue'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['readDeviceAnalogAcquisitionValue'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.readDeviceAnalogAcquisitionValue(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('读设备模拟量采集值', 'green')
  await playSuccessAudio(context)
  return false
};
export const doSet420mACalibrationStatus = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'set420mACalibrationStatus',
    operationName: '4-20mA验证标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0e',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['set420mACalibrationStatus'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['set420mACalibrationStatus'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.set420mACalibrationStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('4-20mA验证标定', 'green')
  await playSuccessAudio(context)
  return false
};
export const doSet210VCalibrationStatus = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'set210VCalibrationStatus',
    operationName: '2-10V验证标定',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '12',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['set210VCalibrationStatus'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['set210VCalibrationStatus'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.set210VCalibrationStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('2-10V验证标定', 'green')
  await playSuccessAudio(context)
  return false
};
export const doWrite20MAInputCurrent = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'write20MAInputCurrent',
    operationName: '写 20MA实际输入电流值',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '0a',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['write20MAInputCurrent'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['write20MAInputCurrent'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.write20MAInputCurrent(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('写 20MA实际输入电流值', 'green')
  await playSuccessAudio(context)
  return false
};
export const doWriteSN = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'writeSN',
    operationName: '写SN序列号',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'e1',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['writeSN'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['writeSN'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.writeSN(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('写SN序列号', 'green')
  await playSuccessAudio(context)
  return false
};
export const doReadAdaptiveInfo = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'readAdaptiveInfo',
    operationName: '读自适应信息',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'df',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['readAdaptiveInfo'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['readAdaptiveInfo'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.readAdaptiveInfo(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('读自适应信息', 'green')
  await playSuccessAudio(context)
  return false
};
export const doExitSelfTest = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'exitSelfTest',
    operationName: '退出自检',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'aa',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['exitSelfTest'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['exitSelfTest'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.exitSelfTest(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('退出自检', 'green')
  await playSuccessAudio(context)
  return false
};
export const doTriggerAdaptive = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let inquireFail = await serialPortOperation(context, {
    actionType: 'triggerAdaptive',
    operationName: '触发自适应',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f4',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['triggerAdaptive'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['triggerAdaptive'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.triggerAdaptive(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('触发自适应', 'green')
  await playSuccessAudio(context)
  return false
};
export const doReadSwitchLifespanTestData = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let result = await serialPortOperation(context, {
    actionType: 'readSwitchLifespanTestData',
    operationName: '读开关寿命测试数据',
    cmdType: 'cc',                         // afn 的命令类型
    cmdCode: '30',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['readSwitchLifespanTestData'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['readSwitchLifespanTestData'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.readSwitchLifespanTestData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (result) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('读开关寿命测试数据', 'green')
  await playSuccessAudio(context)


}
export const doReadProductionInformation = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let result = await serialPortOperation(context, {
    actionType: 'readProductionInformation',
    operationName: '读生产信息',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['readProductionInformation'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['readProductionInformation'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.readProductionInformation(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (result) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('读生产信息', 'green')
  await playSuccessAudio(context)


}
export const doSoftReboot = async (context, protocolId) => {
  if (!checkPort(context)) {
    await playErrorAudio(context)
    return
  }
  let produceModel = 'ACTUATOR'
  let result = await serialPortOperation(context, {
    actionType: 'softReboot',
    operationName: '软重启',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[produceModel].deviceActionResponseMessageLength['softReboot'],
    expectedLength2: protocolIDMap[produceModel].deviceActionResponseMessageLength2['softReboot'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[produceModel].validateResponse.softReboot(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[produceModel].isInfraredDevice,
  })
  if (result) {
    await playErrorAudio(context)
    return
  }
  context.createLeftSpanMessage('软重启', 'green')
  await playSuccessAudio(context)


}






