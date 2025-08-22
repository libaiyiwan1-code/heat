import {
  decodeCheckInquireSelfTestCT1000,
  decodeCheckInquireSelfTestNTP100C,
  decodeCheckInquireSelfTestWAC230CF,
  decodeCheckInquireSelfTestWAC300CD,
  decodeCheckInquireSelfTestWAC300N,
  decodeCheckInquireSelfTestWAC300NH,
  decodeCheckInquireSelfTestWAC710CD
} from "@/packBuffer/decode/inquireSelfTest";
import {decodeCheckWriteTorqueConfigWAC710CD} from "@/packBuffer/decode/writeTorqueConfig";
import {
  decodeCheckWriteProbesConfigNTP100C,
  decodeCheckWriteTemperatureProbesConfigWAC300CD,
  decodeCheckWriteTemperatureProbesConfigWAC300N,
  decodeCheckWriteTemperatureProbesConfigWAC300NH,
  decodeCheckWriteTemperatureProbesConfigWAC710CD
} from "@/packBuffer/decode/writeTemperatureProbesConfig";

import {
  decodeCheckAwakenWAC230CF,
  decodeCheckAwakenWAC300CD,
  decodeCheckAwakenWAC710CD
} from "@/packBuffer/decode/awaken";
import {decodeCheckReadIMEIWAC230CF,} from "@/packBuffer/decode/nb/wac230cf/readIMEI";
import {decodeCheckReadICCIDWAC300CD,} from "@/packBuffer/decode/nb/wac300cd/readICCID";
import {decodeCheckReadTorqueConfigWAC710CD} from "@/packBuffer/decode/readTorqueConfig";
import {decodeCheckWritePressureProbesConfigWAC710CD} from "@/packBuffer/decode/writePressureProbesConfig";
import {
  decodeCheckReadAddressCT1000,
  decodeCheckReadAddressWAC230CF,
  decodeCheckReadAddressWAC300CD,
  decodeCheckReadAddressWAC710CD
} from "@/packBuffer/decode/readAddress";
import {decodeCheckReadSelfTestStatusWAC300CD} from "@/packBuffer/decode/nb/wac300cd/readSelfTestStatus";
import {decodeCheckReadSelfTestStatusWAC710CD} from "@/packBuffer/decode/nb/wac710cd/readSelfTestStatus";
import {decodeCheckReadSelfTestStatusWAC230CF} from "@/packBuffer/decode/nb/wac230cf/readSelfTestStatus";
import {
  decodeCheckForcedTemperatureSetting,
  decodeCheckReadAddress,
  decodeCheckWriteCleaningValveCycle,
  decodeCheckWriteTargetAdjustmentValue,
  decodeCreditCardState,
  decodeCreditCardVerify,
  decodeDetectPanelState,
  decodeFaceplateCommunicationVerify,
  decodeFactoryConditionFullyCloseVerify,
  decodeFactoryConditionFullyOpenVerify,
  decodeFullOffCalibrationState,
  decodeFullOffCalibrationVerify,
  decodeFullOpenCalibrationState,
  decodeFullOpenCalibrationVerify,
  decodeInTemperatureCalibrationVerify,
  decodeMainAndAuxiliaryValvesState,
  decodeMainAndAuxiliaryValvesVerify,
  decodeOutTemperatureCalibrationVerify,
  decodeReadInAndBackTemperatureVerify,
  decodeReadValveState,
  decodeReadVersionVerify,
  decodeSeparationAlarmState,
  decodeSeparationAlarmVerify,
  decodeWriteAddressVerify,
  decodeWriteAllConfigConfigurationVerify,
  decodeWriteHeatingDateVerify,
  decodeWritePowerOutagesAndWirelessAnomaliesVerify,
  decodeWriteProbeConfigurationVerify,
  decodeWriteUpperAndLowerTemperatureLimitsVerify
} from "@/packBuffer/decode/wire/vac200/wireDevice";
import {
  decodeCalibratedOpenPowerWAC710CD,
  decodeLowerLimitOf4mACalibratedWAC710CD,
  decodeUpperLimitOf20mACalibratedWAC710CD
} from "@/packBuffer/decode/nb/wac710cd/differentialPressureCalibration";
import {decodeReadDataWAC710CD} from "@/packBuffer/decode/nb/wac710cd/readData";
import {
  decodeCheckReadPressureProbesWAC710CD,
  decodeCheckReadTemperatureProbesWAC710CD
} from "@/packBuffer/decode/nb/wac710cd/readProbesConfig";
import {decodeReadDataWAC300CD} from "@/packBuffer/decode/nb/wac300cd/readData";
import {decodeCheckReadTemperatureProbesWAC300CD} from "@/packBuffer/decode/nb/wac300cd/readProbesConfig";
import {decodeReadDataNTP100C} from "@/packBuffer/decode/nb/ntp100c/readData";
import {decodeCheckReadSelfTestStatusNTP100C} from "@/packBuffer/decode/nb/ntp100c/readSelfTestStatus";
import {decodeCheckReadIMEIWAC300CD} from "@/packBuffer/decode/nb/wac300cd/readIMEI";
import {decodeCheckReadIMEIWAC710CD} from "@/packBuffer/decode/nb/wac710cd/readIMEI";
import {decodeCheckReadICCIDWAC710CD} from "@/packBuffer/decode/nb/wac710cd/readICCID";
import {decodeCheckReadICCIDWAC230CF} from "@/packBuffer/decode/nb/wac230cf/readICCID";
import {decodeCheckReadIMEINTP100C} from "@/packBuffer/decode/nb/ntp100c/readIMEI";
import {decodeCheckReadICCIDNTP100C} from "@/packBuffer/decode/nb/ntp100c/readICCID";
import {decodeCheckWriteAddressWAC230CF} from "@/packBuffer/decode/nb/wac230cf/writeAddress";
import {decodeCheckWriteAddressWAC710CD} from "@/packBuffer/decode/nb/wac710cd/writeAddress";
import {decodeCheckWriteAddressWAC300CD} from "@/packBuffer/decode/nb/wac300cd/writeAddress";
import {decodeCheckReadProbesNTP100C} from "@/packBuffer/decode/nb/ntp100c/readProbesConfig";
import {decodeCheckWriteAddressNTP100C} from "@/packBuffer/decode/nb/ntp100c/writeAddress";
import {decodeCheckAwakenNTP100C} from "@/packBuffer/decode/nb/ntp100c/awaken";
import {decodeCheckReturnSelfTestNTP100C} from "@/packBuffer/decode/nb/ntp100c/returnSelfTest";
import {decodeCheckReadAddressNTP100C} from "@/packBuffer/decode/nb/ntp100c/readAddress";
import {
  decodeGenerate10mACurrent,
  decodeGenerate20mACurrent,
  decodeGenerate4mACurrent,
  decodeReadCurrent
} from "@/packBuffer/decode/nb/wac710cd/productionCurrent";
import {decodeCheckReadAddressDongYuan} from "@/packBuffer/decode/wire/dongyuan/readAddress";
import {decodeCheckReadAddressNBT200} from "@/packBuffer/decode/nb/nbt200/readAddress";
import {decodeReadVersionVerifyNBT200} from "@/packBuffer/decode/nb/nbt200/readVersion";
import {decodeCheckReadSelfTestStatusCT1000} from "@/packBuffer/decode/nb/ct1000/readSelfTestStatus";
import {decodeCheckAwakenCT1000} from "@/packBuffer/decode/nb/ct1000/awaken";
import {decodeCheckReadIMEICT1000} from "@/packBuffer/decode/nb/ct1000/readIMEI";
import {decodeCheckReadICCIDCT1000} from "@/packBuffer/decode/nb/ct1000/readICCID";
import {decodeCheckWriteAddressCT1000} from "@/packBuffer/decode/nb/ct1000/writeAddress";
import {decodeReadDataCT1000} from "@/packBuffer/decode/nb/ct1000/readData";
import {decodeCheckReturnSelfTestCPT1000} from "@/packBuffer/decode/nb/ct1000/returnSelfTest";
import {decodeCheckAwakenWAC300N} from "@/packBuffer/decode/nb/wac300n/awaken";
import {decodeCheckReadSelfTestStatusWAC300N} from "@/packBuffer/decode/nb/wac300n/readSelfTestStatus";
import {decodeCheckReadICCIDWAC300N} from "@/packBuffer/decode/nb/wac300n/readICCID";
import {decodeCheckReadIMEIWAC300N} from "@/packBuffer/decode/nb/wac300n/readIMEI";
import {decodeCheckWriteAddressWAC300N} from "@/packBuffer/decode/nb/wac300n/writeAddress";
import {decodeReadDataWAC300N} from "@/packBuffer/decode/nb/wac300n/readData";
import {decodeCheckReadTemperatureProbesWAC300N} from "@/packBuffer/decode/nb/wac300n/readProbesConfig";
import {decodeCheckReadSelfTestStatusWAC300NH} from "@/packBuffer/decode/nb/wac300nh/readSelfTestStatus";
import {decodeCheckReadICCIDWAC300NH} from "@/packBuffer/decode/nb/wac300nh/readICCID";
import {decodeCheckReadIMEIWAC300NH} from "@/packBuffer/decode/nb/wac300nh/readIMEI";
import {decodeCheckWriteAddressWAC300NH} from "@/packBuffer/decode/nb/wac300nh/writeAddress";
import {decodeCheckAwakenWAC300NH} from "@/packBuffer/decode/nb/wac300nh/awaken";
import {decodeReadDataWAC300NH} from "@/packBuffer/decode/nb/wac300nh/readData";
import {decodeCheckReadTemperatureProbesWAC300NH} from "@/packBuffer/decode/nb/wac300nh/readProbesConfig";
import {decodeCheckReadAddressWAC300NH} from "@/packBuffer/decode/nb/wac300nh/readAddress";
import {decodeCheckReadAddressWAC300N} from "@/packBuffer/decode/nb/wac300n/readAddress";
import {decodeCheckInquireSelfTestWAC330HE} from "@/packBuffer/decode/nb/wac330he/inquireSelfTest";
import {
  decodeCheckWriteTemperatureProbesConfigWAC330HE
} from "@/packBuffer/decode/nb/wac330he/writeTemperatureProbesConfig";
import {decodeCheckMeterEnterVerificationStatusWAC330HE,decodeCheckMeterReturnVerificationStatusWAC330HE,decodeCheckMeterSettingDateWAC330HE} from "@/packBuffer/decode/nb/wac330he/meterVerificationStatus";
import {decodeReadDataWAC330HE} from "@/packBuffer/decode/nb/wac330he/readData";
import {decodeCheckReadSelfTestStatusWAC330HE} from "@/packBuffer/decode/nb/wac330he/readSelfTestStatus";
import {decodeCheckReadIMEIWAC330HE} from "@/packBuffer/decode/nb/wac330he/readIMEI";
import {decodeCheckReadICCIDWAC330HE} from "@/packBuffer/decode/nb/wac330he/readICCID";
import {decodeCheckMeterReadAddressWAC330HE} from "@/packBuffer/decode/nb/wac330he/readMeterAddress";
import {decodeCheckMeterWriteAddressWAC330HE} from "@/packBuffer/decode/nb/wac330he/writeMeterAddress";
import {decodeCheckWriteAddressWAC330HE} from "@/packBuffer/decode/nb/wac330he/valveWriteAddress";
import {decodeCheckAwakenWAC300HE} from "@/packBuffer/decode/nb/wac330he/awaken";
import {decodeCheckReadAddressWAC330HE} from "@/packBuffer/decode/nb/wac330he/readValveAddress";


/**
 * 协议id map  key：     型号 value：协议id
 * */
export const protocolIDMap = {
  'WAC230CF': {
    protocolCode: `EN1434_0173`,
    model: 76,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'awaken': false,
      'inquireSelfTest': true,
      'selfTest': true,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readSelfTestStatus': true,
      'readAddress': false,
    },
    protocolId: 139,
    deviceActionResponseMessageLength: {
      'awaken': 32,
      'inquireSelfTest': 51,
      'writeAddress': 37,
      'readICCID': 52,
      'readIMEI': 47,
      'readSelfTestStatus': 107,
      'returnSelfTestStatus': 67,
      'readAddress': 37,
      'selfTest': 34,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestWAC230CF(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusWAC230CF(context, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC230CF(data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressWAC230CF(leftGenerateAddress, data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEIWAC230CF(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDWAC230CF(context, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressWAC230CF(context, data);
      },
    }
  },
  'WAC710CD': {
    protocolCode: `EN1434_0176`,
    model: 79,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'awaken': false,
      'inquireSelfTest': true,
      'writeTorqueConfig': true,
      'writePressureProbesConfig': true,
      'writeTemperatureProbesConfig': true,
      'selfTest': true,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readTorqueConfig': true,
      'readSelfTestStatus': true,
      'returnSelfTestStatus': true,
      'readAddress': false,
      'readData': true,
      'readTemperatureProbes': true,
      'readPressureProbes': true,
      'lowerLimitOf4mACalibrated': true,
      'upperLimitOf20mACalibrated': true,
      'generates4mACurrent': false,
      'generates10mACurrent': false,
      'generates20mACurrent': false,
      'calibratedOpenPower': true,
      'readCurrent': false,
    },
    protocolId: 141,
    deviceActionResponseMessageLength: {
      'writeTemperatureProbesConfig': 34,
      'writeTorqueConfig': 34,
      'writePressureProbesConfig': 34,
      'awaken': 16,
      'inquireSelfTest': 34,
      'writeAddress': 16,
      'readICCID': 36,
      'readIMEI': 31,
      'readTorqueConfig': 35,
      'readSelfTestStatus': 81,
      'returnSelfTestStatus': 34,
      'readAddress': 21,
      'selfTest': 99,
      'readData': 85,
      'readTemperatureProbes': 36,
      'readPressureProbes': 35,
      'lowerLimitOf4mACalibrated': 36,
      'upperLimitOf20mACalibrated': 36,
      'calibratedOpenPower': 36,
      'generate4mACurrent': 16,
      'generate10mACurrent': 16,
      'generate20mACurrent': 16,
      'readCurrent': 9,
    },
    deviceActionResponseMessageLength2: {
      'writeTemperatureProbesConfig': 34,
      'writeTorqueConfig': 34,
      'writePressureProbesConfig': 34,
      'awaken': 16,
      'inquireSelfTest': 34,
      'writeAddress': 16,
      'readICCID': 36,
      'readIMEI': 31,
      'readTorqueConfig': 35,
      'readSelfTestStatus': 81,
      'returnSelfTestStatus': 34,
      'readAddress': 21,
      'selfTest': 99,
      'readData': 85,
      'readTemperatureProbes': 36,
      'readPressureProbes': 35,
      'lowerLimitOf4mACalibrated': 36,
      'upperLimitOf20mACalibrated': 36,
      'calibratedOpenPower': 36,
      'generate4mACurrent': 16,
      'generate10mACurrent': 16,
      'generate20mACurrent': 16,
      'readCurrent': 9,
    },

    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestWAC710CD(data);
      },
      writeTorqueConfig: (data) => {
        return decodeCheckWriteTorqueConfigWAC710CD(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return decodeCheckWriteTemperatureProbesConfigWAC710CD(data);
      },
      writePressureProbesConfig: (data) => {
        return decodeCheckWritePressureProbesConfigWAC710CD(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusWAC710CD(context, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC710CD(data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEIWAC710CD(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDWAC710CD(context, data);
      },
      readTorqueConfig: (context, data) => {
        return decodeCheckReadTorqueConfigWAC710CD(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressWAC710CD(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressWAC710CD(context, data);
      },
      readData: (context, data) => {
        return decodeReadDataWAC710CD(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return decodeCheckReadTemperatureProbesWAC710CD(context, data);
      },
      readPressureProbes: (context, data) => {
        return decodeCheckReadPressureProbesWAC710CD(context, data);
      },
      lowerLimitOf4mACalibrated: (context, data) => {
        return decodeLowerLimitOf4mACalibratedWAC710CD(context, data);
      },
      upperLimitOf20mACalibrated: (context, data) => {
        return decodeUpperLimitOf20mACalibratedWAC710CD(context, data);
      },
      calibratedOpenPower: (context, data) => {
        return decodeCalibratedOpenPowerWAC710CD(context, data);
      },
      generate4mACurrent: (data) => {
        return decodeGenerate4mACurrent(data);

      },
      generate10mACurrent: (data) => {
        return decodeGenerate10mACurrent(data);

      },
      generate20mACurrent: (data) => {
        return decodeGenerate20mACurrent(data);
      },
      readCurrent: (data, context) => {
        return decodeReadCurrent(data, context);
      }
    },
  },
  'WAC300CD': {
    protocolCode: `EN1434_0175`,
    model: 80,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'writeTemperatureProbesConfig': true,
      'awaken': false,
      'inquireSelfTest': true,
      'selfTest': true,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readSelfTestStatus': true,
      'returnSelfTestStatus': true,
      'readAddress': false,
      'readData': true,
      'readTemperatureProbes': true
    },
    protocolId: 142,
    deviceActionResponseMessageLength: {
      'writeTemperatureProbesConfig': 69,
      'awaken': 32,
      'inquireSelfTest': 67,
      'writeAddress': 37,
      'readICCID': 52,
      'readIMEI': 47,
      'readSelfTestStatus': 114,
      'returnSelfTestStatus': 67,
      'readAddress': 37,
      'selfTest': 99,
      'readData': 98,
      'readTemperatureProbes': 69
    },
    deviceActionResponseMessageLength2: {
      'writeTemperatureProbesConfig': 34,
      'awaken': 16,
      'inquireSelfTest': 34,
      'writeAddress': 16,
      'readICCID': 36,
      'readIMEI': 31,
      'readSelfTestStatus': 81,
      'returnSelfTestStatus': 34,
      'readAddress': 21,
      'selfTest': 99,
      'readData': 65,
      'readTemperatureProbes': 36
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestWAC300CD(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return decodeCheckWriteTemperatureProbesConfigWAC300CD(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusWAC300CD(context, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC300CD(data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEIWAC300CD(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDWAC300CD(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressWAC300CD(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressWAC300CD(context, data);
      },
      readData: (context, data) => {
        return decodeReadDataWAC300CD(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return decodeCheckReadTemperatureProbesWAC300CD(context, data);
      },
    },
  },
  'CT1000': {
    protocolCode: `EN1434_0177`,
    model: 81,
    joinMode: 2,
    protocolId: 145,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'awaken': false,
      'returnSelfTestStatus': false,
      'readData': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 32,
      'selfTest': 99,
      'readSelfTestStatus': 72,
      'readAddress': 37,
      'writeAddress': 37,
      'readICCID': 52,
      'readIMEI': 47,
      'awaken': 32,
      'returnSelfTestStatus': 32,
      'readData': 42
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'selfTest': 99,
      'readSelfTestStatus': 16,
      'readAddress': 16,
      'writeAddress': 21,
      'readICCID': 16,
      'readIMEI': 16,
      'awaken': 16,
      'returnSelfTestStatus': 16,
      'readData': 16
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestCT1000(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusCT1000(context, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenCT1000(data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEICT1000(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDCT1000(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressCT1000(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressCT1000(context, data);
      },
      returnSelfTestStatus: (data) => {
        return decodeCheckReturnSelfTestCPT1000(data);
      },
      readData: (context, data) => {
        return decodeReadDataCT1000(context, data);
      },
    },
  },
  'ET01': {
    protocolCode: `EN1434_0177`,
    model: 81,
    joinMode: 2,
    protocolId: 145,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'awaken': false,
      'returnSelfTestStatus': false,
      'readData': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 32,
      'selfTest': 99,
      'readSelfTestStatus': 72,
      'readAddress': 37,
      'writeAddress': 37,
      'readICCID': 52,
      'readIMEI': 47,
      'awaken': 32,
      'returnSelfTestStatus': 32,
      'readData': 42
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'selfTest': 99,
      'readSelfTestStatus': 16,
      'readAddress': 16,
      'writeAddress': 21,
      'readICCID': 16,
      'readIMEI': 16,
      'awaken': 16,
      'returnSelfTestStatus': 16,
      'readData': 16
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestCT1000(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusCT1000(context, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenCT1000(data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEICT1000(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDCT1000(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressCT1000(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressCT1000(context, data);
      },
      returnSelfTestStatus: (data) => {
        return decodeCheckReturnSelfTestCPT1000(data);
      },
      readData: (context, data) => {
        return decodeReadDataCT1000(context, data);
      },
    },
  },
  'NTP100C': {
    protocolCode: `EN1434_0121`,
    protocolId: 70,
    model: 55,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeProbesConfig': false,
      'selfTest': false,
      'readData': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'readProbesConfig': false,
      'writeAddress': false,
      'returnSelfTestStatus': false,
      'readAddress': false,
      'awaken': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 32,
      'writeProbesConfig': 34,
      'selfTest': -1,
      'readData': 46,
      'readSelfTestStatus': 72,
      'readICCID': 52,
      'readIMEI': 47,
      'readProbesConfig': 34,
      'writeAddress': 37,
      'returnSelfTestStatus': 32,
      'readAddress': 37,
      'awaken': 32
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeProbesConfig': 16,
      'selfTest': -1,
      'readData': 30,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readProbesConfig': 18,
      'writeAddress': 16,
      'returnSelfTestStatus': 16,
      'readAddress': 21,
      'awaken': 16
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestNTP100C(data);
      },
      writeProbesConfig: (data) => {
        return decodeCheckWriteProbesConfigNTP100C(data);
      },
      readData: (context, data) => {
        return decodeReadDataNTP100C(context, data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusNTP100C(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDNTP100C(context, data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEINTP100C(context, data);
      },
      readProbesConfig: (context, data) => {
        return decodeCheckReadProbesNTP100C(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressNTP100C(leftGenerateAddress, data);
      },
      returnSelfTestStatus: (data) => {
        return decodeCheckReturnSelfTestNTP100C(data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressNTP100C(context, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenNTP100C(data);
      },


    },
  },
  'WAC300N': {
    protocolCode: `EN1434_9993`,
    model: 1,  /*1移动|6电信*/
    joinMode: 2,/*2移动|8电信*/
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbesConfig': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'readAddress': false,
      'writeAddress': false,
      'returnSelfTestStatus': true,
      'awaken': false,
      'readData': true,
      'readTemperatureProbes': true
    },
    protocolId: 71,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 67,
      'writeTemperatureProbesConfig': 69,
      'selfTest': 99,
      'readSelfTestStatus': 106,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 47,
      'writeAddress': 37,
      'returnSelfTestStatus': 67,
      'awaken': 32,
      'readData': 105,
      'readTemperatureProbes': 69
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 33,
      'writeTemperatureProbesConfig': 35,
      'selfTest': 99,
      'readSelfTestStatus': 33,
      'readICCID': 16,
      'readIMEI': 16,
      'readAddress': 16,
      'writeAddress': 21,
      'returnSelfTestStatus': 33,
      'awaken': 16,
      'readData': 33,
      'readTemperatureProbes': 33
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestWAC300N(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return decodeCheckWriteTemperatureProbesConfigWAC300N(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusWAC300N(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDWAC300N(context, data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEIWAC300N(context, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressWAC300N(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressWAC300N(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC300N(data);
      },
      readData: (context, data) => {
        return decodeReadDataWAC300N(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return decodeCheckReadTemperatureProbesWAC300N(context, data);
      },

    },
  },
  'WAC300NH': {
    protocolCode: `EN1434_9993`,
    model: 1,  /*1移动|6电信*/
    joinMode: 2,/*2移动|8电信*/
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbesConfig': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'readAddress': false,
      'writeAddress': false,
      'returnSelfTestStatus': true,
      'awaken': false,
      'readData': true,
      'readTemperatureProbes': true
    },
    protocolId: 71,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 67,
      'writeTemperatureProbesConfig': 69,
      'selfTest': 99,
      'readSelfTestStatus': 106,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 47,
      'writeAddress': 37,
      'returnSelfTestStatus': 67,
      'awaken': 32,
      'readData': 105,
      'readTemperatureProbes': 69
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 33,
      'writeTemperatureProbesConfig': 35,
      'selfTest': 99,
      'readSelfTestStatus': 33,
      'readICCID': 16,
      'readIMEI': 16,
      'readAddress': 16,
      'writeAddress': 21,
      'returnSelfTestStatus': 33,
      'awaken': 16,
      'readData': 33,
      'readTemperatureProbes': 33
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestWAC300NH(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return decodeCheckWriteTemperatureProbesConfigWAC300NH(data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusWAC300NH(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDWAC300NH(context, data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEIWAC300NH(context, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressWAC300NH(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressWAC300NH(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC300NH(data);
      },
      readData: (context, data) => {
        return decodeReadDataWAC300NH(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return decodeCheckReadTemperatureProbesWAC300NH(context, data);
      },

    },
  },
  'WAC330HE': {
    protocolCode: `EN1434_0100`,
    model: 38,  /*84移动|38电信*/
    joinMode: 8,/*2移动|8电信*/
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbesConfig': true,
      'readData': true,
      'selfTest': true,
      'readAddress': false,
      'writeValveAddress': false,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'returnSelfTestStatus': true,
      'awaken': false,
      'meterSettingDate': false,
      'meterReadAddress': false,
      'meterWriteAddress': false,
      'meterEnterVerificationStatus': false,
      'meterReturnVerificationStatus': false,
      'meterTemperatureCalibration': false,
    },
    protocolId: 102,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 37,
      'writeTemperatureProbesConfig': 37,
      'readData': 132,
      'selfTest': -1,
      'readAddress': 21,
      'writeValveAddress': 16,
      'readSelfTestStatus': 76,
      'readICCID': 36,
      'readIMEI': 16,
      'returnSelfTestStatus': 33,
      'awaken': 16,
      'meterSettingDate': 19,
      'meterReadAddress': 20,
      'meterWriteAddress': 19,
      'meterEnterVerificationStatus': 21,
      'meterReturnVerificationStatus': 21,
      'meterTemperatureCalibration': -1,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 70,
      'writeTemperatureProbesConfig': 72,
      'readData': 165,
      'selfTest': -1,
      'readAddress': 37,
      'writeValveAddress': 37,
      'readSelfTestStatus': 109,
      'readICCID': 52,
      'readIMEI': 47,
      'returnSelfTestStatus': 70,
      'awaken': 32,
      'meterSettingDate': 42,
      'meterReadAddress': 37,
      'meterWriteAddress': 42,
      'meterEnterVerificationStatus': 39,
      'meterReturnVerificationStatus': 39,
      'meterTemperatureCalibration': -1,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return decodeCheckInquireSelfTestWAC330HE(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return decodeCheckWriteTemperatureProbesConfigWAC330HE(data);
      },
      meterEnterVerificationStatus: (data) => {
        return decodeCheckMeterEnterVerificationStatusWAC330HE(data);
      },
      meterReturnVerificationStatus: (data) => {
        return decodeCheckMeterReturnVerificationStatusWAC330HE(data);
      },
      meterSettingDate: (data) => {
        return decodeCheckMeterSettingDateWAC330HE(data);
      },
      meterReadAddress: (context,data) => {
        return decodeCheckMeterReadAddressWAC330HE(context,data);
      },
      meterWriteAddress: (context,data) => {
        return decodeCheckMeterWriteAddressWAC330HE(context,data);
      },
      readData: (context, data) => {
        return decodeReadDataWAC330HE(context, data);
      },
      readSelfTestStatus: (context, data) => {
        return decodeCheckReadSelfTestStatusWAC330HE(context, data);
      },
      readICCID: (context, data) => {
        return decodeCheckReadICCIDWAC330HE(context, data);
      },
      readIMEI: (context, data) => {
        return decodeCheckReadIMEIWAC330HE(context, data);
      },
      readAddress: (context, data) => {
        return decodeCheckReadAddressWAC330HE(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return decodeCheckWriteAddressWAC330HE(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC300HE(data);
      },
    },
  },
  // 'WAC710C': {},
  'VAC200': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC200Y': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC201': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC300': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC300Z': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC300H': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC300HC': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC400': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC100': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writeUpperAndLowerTemperatureLimits': false,
      'writePowerOffAndWirelessError': false,
      'writeHeatingDate': false,
      'writeProbesConfig': false,
      'writeAllConfig': false,
      'readVersion': false,
      'factoryConditionFullyClose': false,
      'factoryConditionFullyOpen': false,
      'outTemperatureCalibration': false,
      'inTemperatureCalibration': false,
      'mainAndAuxiliaryValvesVerify': false,
      'faceplateCommunication': false,
      'creditCard': false,
      'fullOpenCalibration': false,
      'fullOffCalibration': false,
      'writeAddress': false,
      'badPrompt': false,
      'writeTargetAdjustmentValue': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeTargetAdjustmentValue': 19,
      'writeForcedTemperatureSetting': 19,
      'writeCleaningValveCycle': 19
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 19,
      'writeUpperAndLowerTemperatureLimits': 19,
      'writePowerOffAndWirelessError': 19,
      'writeHeatingDate': 19,
      'writeProbesConfig': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'factoryConditionFullyClose': 21,
      'factoryConditionFullyOpen': 21,
      'outTemperatureCalibration': 19,
      'inTemperatureCalibration': 19,
      'faceplateCommunication': 55,
      'separationAlarmVerify': 55,
      'readValveState': 55,
      'creditCard': 84,
      'separationAlarm': 55,
      'mainAndAuxiliaryValvesVerify': 58,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'badPrompt': 0,
      'writeForcedTemperatureSetting': 19,
      'writeTargetAdjustmentValue': 19,
      'writeCleaningValveCycle': 19
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type) => {
        return decodeCheckReadAddress(context, data, type);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return decodeWriteUpperAndLowerTemperatureLimitsVerify(data);
      },
      writePowerOffAndWirelessError: (data) => {
        return decodeWritePowerOutagesAndWirelessAnomaliesVerify(data);
      },
      writeHeatingDate: (data) => {
        return decodeWriteHeatingDateVerify(data);
      },
      writeProbesConfig: (data) => {
        return decodeWriteProbeConfigurationVerify(data);
      },
      writeAllConfig: (data) => {
        return decodeWriteAllConfigConfigurationVerify(data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerify(context, data, type);
      },
      factoryConditionFullyClose: (data) => {
        return decodeFactoryConditionFullyCloseVerify(data);
      },
      factoryConditionFullyOpen: (data) => {
        return decodeFactoryConditionFullyOpenVerify(data);
      },
      outTemperatureCalibration: (data) => {
        return decodeOutTemperatureCalibrationVerify(data);
      },
      inTemperatureCalibration: (data) => {
        return decodeInTemperatureCalibrationVerify(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return decodeReadInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return decodeFaceplateCommunicationVerify(data);
      },
      creditCard: (data) => {
        return decodeCreditCardVerify(data);
      },
      separationAlarm: (data) => {
        return decodeSeparationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return decodeMainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context) => {
        return decodeFullOpenCalibrationVerify(data, context);
      },
      fullOffCalibration: (data, context) => {
        return decodeFullOffCalibrationVerify(data, context);
      },
      writeAddress: (type, data, context) => {
        return decodeWriteAddressVerify(type, data, context);
      },
      writeForcedTemperatureSetting: (data) => {
        return decodeCheckForcedTemperatureSetting(data);
      },
      writeTargetAdjustmentValue: (data) => {
        return decodeCheckWriteTargetAdjustmentValue(data);
      },
      writeCleaningValveCycle: (data) => {
        return decodeCheckWriteCleaningValveCycle(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return decodeReadValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type) => {
        return decodeFullOffCalibrationState(data, context, type)
      },
      fullOpenCalibrationState: (data, context, type) => {
        return decodeFullOpenCalibrationState(data, context, type)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return decodeDetectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return decodeCreditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return decodeSeparationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return decodeMainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  '东元热表': {
    protocolCode: undefined,
    protocolId: 85,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'readAddress': false,
    },
    deviceActionResponseMessageLength: {
      'readAddress': 20,
    },
    deviceActionResponseMessageLength2: {
      'readAddress': 20,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readAddress: (context, data) => {
        return decodeCheckReadAddressDongYuan(context, data);
      },
    },
  },
  'NBT200': {
    protocolCode: undefined,
    protocolId: 75,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readAddress': false,
      'readVersion': false
    },
    deviceActionResponseMessageLength: {
      'readAddress': 37,
      'readVersion': 33
    },
    deviceActionResponseMessageLength2: {
      'readAddress': 16,
      'readVersion': 16
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readAddress: (context, data) => {
        return decodeCheckReadAddressNBT200(context, data);
      },
      readVersion: (context, data, type) => {
        return decodeReadVersionVerifyNBT200(context, data, type);
      },
    },
  }

}
