import {doReadSwitchLifespanTestData} from "@/views/device/operations/deviceOperations";

export default {
  defaultColor: {
    waiting: '#FF770F', // 等待执行
    success: 'limegreen', // 成功
    error: 'red',  // 错误
    lightgray: 'lightgray'//禁用 浅灰色
  },

  color: {
    readData: '#FF770F',
    readSwitchLifespanTestData: '#FF770F',
    setElectricalAngleOffset: '#FF770F',
    selfTest: '#FF770F',
    exitSelfTest: '#FF770F',
    triggerAdaptive: '#FF770F',
    readAdaptiveInfo: '#FF770F',
    readProductionInformation: '#FF770F',
    readSN: '#FF770F',
    writeSN: '#FF770F',
    softReboot: '#FF770F',
    write4MAInputCurrent: '#FF770F',
    write20MAInputCurrent: '#FF770F',
    write2VInputVoltage: '#FF770F',
    write10VInputVoltage: '#FF770F',
    deviceOutputs4mA: '#FF770F',
    deviceOutputs20mA: '#FF770F',
    deviceOutputs1V: '#FF770F',
    deviceOutputs2V: '#FF770F',
    deviceOutputs10V: '#FF770F',
    outputs4mACurrentCalibration: '#FF770F',
    outputs20mACurrentCalibration: '#FF770F',
    outputs2VVoltageCalibration: '#FF770F',
    outputs10VVoltageCalibration: '#FF770F',
    readDeviceAnalogAcquisitionValue: '#FF770F',
    set420mACalibrationStatus: '#FF770F',
    set210VCalibrationStatus: '#FF770F',
  },
  disabledStatus: {
    readData: false,
    readSwitchLifespanTestData: false,
    setElectricalAngleOffset: false,
    cleanSwitchLifespanTestData: false,
    selfTest: false,
    exitSelfTest: false,
    triggerAdaptive: false,
    readAdaptiveInfo: false,
    readProductionInformation: false,
    readSN: false,
    writeSN: false,
    softReboot: false,
    write4MAInputCurrent: false,
    write20MAInputCurrent: false,
    write2VInputVoltage: false,
    write10VInputVoltage: false,
    deviceOutputs4mA: false,
    deviceOutputs20mA: false,
    deviceOutputs1V: false,
    deviceOutputs2V: false,
    deviceOutputs10V: false,
    outputs4mACurrentCalibration: false,
    outputs20mACurrentCalibration: false,
    outputs2VVoltageCalibration: false,
    outputs10VVoltageCalibration: false,
    readDeviceAnalogAcquisitionValue: false,
    set420mACalibrationStatus: false,
    set210VCalibrationStatus: false,
  }


};
