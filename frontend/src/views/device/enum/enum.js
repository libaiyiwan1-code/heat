/**
 * 无线
 * */
import * as ACTUATOR from "@/packBuffer/decode/nb/actuator";

/**
 * 协议id map  key：     型号 value：协议id
 * */
export const protocolIDMap = {
  'ACTUATOR': {
    protocolId: 70,
    isInfraredDevice: true,
    deviceActionResponseMessageLength: {
      'readData': 116,
      'readSwitchLifespanTestData': 43,
      'setElectricalAngleOffset': 19,
      'cleanSwitchLifespanTestData': -1,
      'selfCheckInquiry': -1,
      'selfTest': -1,
      'exitSelfTest': -1,
      'triggerAdaptive': -1,
      'readProductionInformation': -1,
      'readSN': -1,
      'readAdaptiveInfo': -1,
      'writeSN': -1,
      'softReboot': -1,
      'write4MAInputCurrent': 22,
      'write20MAInputCurrent': 22,
      'write2VInputVoltage': 22,
      'write10VInputVoltage': 22,
      'deviceOutputs4mA': 19,
      'deviceOutputs20mA': 19,
      'deviceOutputs1V': 19,
      'deviceOutputs2V': 19,
      'deviceOutputs10V': 19,
      'outputs4mACurrentCalibration': 19,
      'outputs20mACurrentCalibration': 19,
      'outputs2VVoltageCalibration': 19,
      'outputs10VVoltageCalibration': 19,
      'readDeviceAnalogAcquisitionValue': 24,
      'set420mACalibrationStatus': 19,
      'set210VCalibrationStatus': 19,
    },
    deviceActionResponseMessageLength2: {
      'readData': 135,
      'readSwitchLifespanTestData': 62,
      'cleanSwitchLifespanTestData': -1,
      'selfTest': -1,
      'exitSelfTest': -1,
      'triggerAdaptive': -1,
      'readProductionInformation': -1,
      'readSN': -1,
      'readAdaptiveInfo': -1,
      'writeSN': -1,
      'softReboot': -1,
      'write4MAInputCurrent': 45,
      'write20MAInputCurrent': 45,
      'write2VInputVoltage': 45,
      'write10VInputVoltage': 45,
      'deviceOutputs4mA': 40,
      'deviceOutputs20mA': 40,
      'deviceOutputs1V': 40,
      'deviceOutputs2V': 40,
      'deviceOutputs10V': 40,
      'outputs4mACurrentCalibration': 42,
      'outputs20mACurrentCalibration': 42,
      'outputs2VVoltageCalibration': 42,
      'outputs10VVoltageCalibration': 42,
      'readDeviceAnalogAcquisitionValue': 44,
      'set420mACalibrationStatus': 39,
      'set210VCalibrationStatus': 39,
    },

    validateResponse: {
      readData: (context, data) => {
        return ACTUATOR.readData(context, data);
      },
      readSwitchLifespanTestData: (context, data) => {
        return ACTUATOR.readSwitchLifespanTestData(context, data);
      },
      setElectricalAngleOffset: (context, data) => {
        return ACTUATOR.setElectricalAngleOffset(context, data);
      },
      cleanSwitchLifespanTestData: (context, data) => {
        return ACTUATOR.cleanSwitchLifespanTestData(context, data);
      },
      selfCheckInquiry: (context, data) => {
        return ACTUATOR.selfCheckInquiry(context, data);
      },
      exitSelfTest: (context, data) => {
        return ACTUATOR.exitSelfTest(context, data);
      },
      triggerAdaptive: (context, data) => {
        return ACTUATOR.triggerAdaptive(context, data);
      },
      readProductionInformation: (context, data) => {
        return ACTUATOR.readProductionInformation(context, data);
      },
      readSN: (context, data) => {
        return ACTUATOR.readSN(context, data);
      },
      readAdaptiveInfo: (context, data) => {
        return ACTUATOR.readAdaptiveInfo(context, data);
      },
      writeSN: (context, data) => {
        return ACTUATOR.writeSN(context, data);
      },
      softReboot: (context, data) => {
        return ACTUATOR.softReboot(context, data);
      },
      write4MAInputCurrent: (context, data) => {
        return ACTUATOR.write4MAInputCurrent(context, data);
      },
      write20MAInputCurrent: (context, data) => {
        return ACTUATOR.write20MAInputCurrent(context, data);
      },
      write2VInputVoltage: (context, data) => {
        return ACTUATOR.write2VInputVoltage(context, data);
      },
      write10VInputVoltage: (context, data) => {
        return ACTUATOR.write10VInputVoltage(context, data);
      },
      deviceOutputs4mA: (context, data) => {
        return ACTUATOR.deviceOutputs4mA(context, data);
      },
      deviceOutputs20mA: (context, data) => {
        return ACTUATOR.deviceOutputs20mA(context, data);
      },
      deviceOutputs1V: (context, data) => {
        return ACTUATOR.deviceOutputs1V(context, data);
      },
      deviceOutputs2V: (context, data) => {
        return ACTUATOR.deviceOutputs2V(context, data);
      },
      deviceOutputs10V: (context, data) => {
        return ACTUATOR.deviceOutputs10V(context, data);
      },
      outputs4mACurrentCalibration: (context, data) => {
        return ACTUATOR.outputs4mACurrentCalibration(context, data);
      },
      outputs20mACurrentCalibration: (context, data) => {
        return ACTUATOR.outputs20mACurrentCalibration(context, data);
      },
      outputs2VVoltageCalibration: (context, data) => {
        return ACTUATOR.outputs2VVoltageCalibration(context, data);
      },
      outputs10VVoltageCalibration: (context, data) => {
        return ACTUATOR.outputs10VVoltageCalibration(context, data);
      },
      readDeviceAnalogAcquisitionValue: (context, data) => {
        return ACTUATOR.readDeviceAnalogAcquisitionValue(context, data);
      },
      set420mACalibrationStatus: (context, data) => {
        return ACTUATOR.set420mACalibrationStatus(context, data);
      },
      set210VCalibrationStatus: (context, data) => {
        return ACTUATOR.set210VCalibrationStatus(context, data);
      },


    }
  }

}
