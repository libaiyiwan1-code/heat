/**
 * 无线
 * */
import * as WAC230CF from "@/packBuffer/decode/nb/wac230cf";
import * as DPC100420mA from "@/packBuffer/decode/nb/dpc100-4-20ma";
import * as WAC710CD from "@/packBuffer/decode/nb/wac710cd";
import * as WAC300CD from "@/packBuffer/decode/nb/wac300cd";
import * as BEACONM from "@/packBuffer/decode/nb/beaconM";
import * as WAC710C from "@/packBuffer/decode/nb/wac710c";
import * as VAC710 from "@/packBuffer/decode/nb/vac710";
import * as WAC400N from "@/packBuffer/decode/nb/wac400n";
import * as WAC100N from "@/packBuffer/decode/nb/wac100n";
import * as WAC300NS from "@/packBuffer/decode/nb/wac300ns";
import * as WAC400NS from "@/packBuffer/decode/nb/wac400ns";
import * as VAC710S from "@/packBuffer/decode/nb/vac710s";
import * as CTW100 from "@/packBuffer/decode/nb/ctw100";
import * as WAC300LH from "@/packBuffer/decode/nb/wac300lh";
import * as VAC005C from "@/packBuffer/decode/nb/vac005c";
import * as CT1000 from "@/packBuffer/decode/nb/ct1000";
import * as ET01 from "@/packBuffer/decode/nb/ct1000";
import * as RFT200CAT1 from "@/packBuffer/decode/nb/rft200-cat1";
import * as RFT200 from "@/packBuffer/decode/nb/rft200";
import * as NTP100C from "@/packBuffer/decode/nb/ntp100c";
import * as NTR300C from "@/packBuffer/decode/nb/ntr300c";
import * as LPC210 from "@/packBuffer/decode/nb/lpc210";
import * as LPC210E from "@/packBuffer/decode/nb/lpc210";
import * as CAT400 from "@/packBuffer/decode/nb/cat400";
import * as CAT200 from "@/packBuffer/decode/nb/cat200";
import * as CAT200P from "@/packBuffer/decode/nb/cat200p";
import * as CAT400S from "@/packBuffer/decode/nb/cat400s";
import * as CPT100 from "@/packBuffer/decode/nb/cpt100";
import * as VPT100 from "@/packBuffer/decode/nb/vpt100";
import * as LPC230 from "@/packBuffer/decode/nb/lpc230";
import * as LPC230E from "@/packBuffer/decode/nb/lpc230";
import * as AEC100 from "@/packBuffer/decode/nb/aec100";
import * as WAC300N from "@/packBuffer/decode/nb/wac300n";
import * as WAC300SC from "@/packBuffer/decode/nb/wac300sc";
import * as WAC300NH from "@/packBuffer/decode/nb/wac300nh";
import * as WAC300NY from "@/packBuffer/decode/nb/wac300ny";
import * as WAC330HE from "@/packBuffer/decode/nb/wac330he";
import * as WAC330CE from "@/packBuffer/decode/nb/wac330ce";
import * as WAC730C from "@/packBuffer/decode/nb/wac730c";
import * as PTC100420MA from "@/packBuffer/decode/nb/ptc100-4-20ma";
import * as PTC100RS485 from "@/packBuffer/decode/nb/ptc100-4-20ma";
import * as PTC100CAT1 from "@/packBuffer/decode/nb/ptc100-cat1";
import * as NBT400 from "@/packBuffer/decode/nb/nbt400";
import * as WAC300C from "@/packBuffer/decode/nb/wac300c";
import * as NTR300 from "@/packBuffer/decode/nb/ntr300";
import * as WAC330N from "@/packBuffer/decode/nb/wac330n";
import * as WAC710N from "@/packBuffer/decode/nb/wac710n";
import * as WAC730N from "@/packBuffer/decode/nb/wac730n";
/**
 * 其它
 * */
import * as NBT200 from "@/packBuffer/decode/nb/nbt200";
import * as DongYuan from "@/packBuffer/decode/wire/dongyuan";

/**
 * 有线
 * */
import * as wireDeviceCommon from "@/packBuffer/decode/wire/common";
import * as VAC130 from "@/packBuffer/decode/wire/vac130";
import {readDeviceData} from "@/packBuffer/decode/nb/cpt100/readDeviceData";
import {readSelfTestStatus} from "@/packBuffer/decode/nb/wac710c";
import {zeroMpaDemarcate} from "@/packBuffer/decode/nb/ptc100-cat1";

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
      'exitSelfTest': true,
      'readAddress': false,
    },
    protocolId: 139,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'selfTest': -1,
      'readSelfTestStatus': 74,
      'readIMEI': 31,
      'readICCID': 36,
      'writeAddress': 16,
      'awaken': 16,
      'exitSelfTest': 34,
      'readAddress': 21,

    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'selfTest': -1,
      'readSelfTestStatus': 107,
      'readIMEI': 47,
      'readICCID': 52,
      'writeAddress': 37,
      'awaken': 32,
      'exitSelfTest': 67,
      'readAddress': 37,

    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC230CF.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC230CF.readSelfTestStatus(context, data);
      },
      readIMEI: (context, data) => {
        return WAC230CF.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return WAC230CF.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC230CF.writeAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC230CF.awaken(data);
      },
      readAddress: (context, data) => {
        return WAC230CF.readAddress(context, data);
      },
      exitSelfTest: (data) => {
        return WAC230CF.exitSelfTest(data);
      }
    }
  },
  'DPC100-4/20mA': {
    //采集器不注册平台
    protocolCode: null,
    model: null,
    joinMode: null,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'deviceOutputs4mA': false,
      'readTemperatureCurrent': false,
      'device4mACalibrated': false,
      'deviceOutputs20mA': false,
      'device20mACalibrated': false,
      'deviceOutputs12mA': false,
      'inquireSelfTest': false,
      'selfTest': false,
      'readAddress': false,
      'readSelfTestStatus': false,
      'writeAddress': false,
    },
    protocolId: 141,
    deviceActionResponseMessageLength: {
      'deviceOutputs4mA': 17,
      'readTemperatureCurrent': 9,
      'device4mACalibrated': 19,
      'deviceOutputs20mA': 17,
      'device20mACalibrated': 19,
      'deviceOutputs12mA': 17,
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readAddress': 51,
      'readSelfTestStatus': 51,
      'writeAddress': 16,
    },
    deviceActionResponseMessageLength2: {
      'deviceOutputs4mA': 17,
      'readTemperatureCurrent': 9,
      'device4mACalibrated': 19,
      'deviceOutputs20mA': 17,
      'device20mACalibrated': 19,
      'deviceOutputs12mA': 17,
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readAddress': 67,
      'readSelfTestStatus': 67,
      'writeAddress': 37,
    },

    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      deviceOutputs4mA: (data) => {
        return DPC100420mA.deviceOutputs4m(data);
      },
      readTemperatureCurrent: (context, data) => {
        return DPC100420mA.readTemperatureCurrent(context, data);
      },
      device4mACalibrated: (data) => {
        return DPC100420mA.device4mACalibrated(data);
      },
      deviceOutputs20mA: (data) => {
        return DPC100420mA.deviceOutputs20mA(data);
      },
      device20mACalibrated: (data) => {
        return DPC100420mA.device20mACalibrated(data);
      },
      deviceOutputs12mA: (data) => {
        return DPC100420mA.deviceOutputs12mA(data);
      },
      inquireSelfTest: (data) => {
        return DPC100420mA.inquireSelfTest(data);
      },
      readAddress: (context, data) => {
        return DPC100420mA.readAddress(context, data);
      },
      readSelfTestStatus: (context, data) => {
        return DPC100420mA.readSelfTestStatus(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return DPC100420mA.writeAddress(leftGenerateAddress, data);
      },

    },
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
      'exitSelfTest': true,
      'readAddress': false,
      'readData': true,
      'readTemperatureProbes': true,
      'readPressureProbes': true,
      'lowerLimitOf4mACalibrated': true,
      'upperLimitOf20mACalibrated': true,
      'generates4mACurrent': false,
      'generates10mACurrent': false,
      'generates20mACurrent': false,
      'openPower': true,
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
      'exitSelfTest': 34,
      'readAddress': 21,
      'selfTest': 99,
      'readData': 85,
      'readTemperatureProbes': 36,
      'readPressureProbes': 35,
      'lowerLimitOf4mACalibrated': 36,
      'upperLimitOf20mACalibrated': 36,
      'openPower': 36,
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
      'exitSelfTest': 34,
      'readAddress': 21,
      'selfTest': 99,
      'readData': 85,
      'readTemperatureProbes': 36,
      'readPressureProbes': 35,
      'lowerLimitOf4mACalibrated': 36,
      'upperLimitOf20mACalibrated': 36,
      'openPower': 36,
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
        return WAC710CD.inquireSelfTest(data);
      },
      writeTorqueConfig: (data) => {
        return WAC710CD.writeTorqueConfig(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC710CD.writeTemperatureProbesConfig(data);
      },
      writePressureProbesConfig: (data) => {
        return WAC710CD.writePressureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC710CD.readSelfTestStatus(context, data);
      },
      awaken: (data) => {
        return WAC710CD.awaken(data);
      },
      readIMEI: (context, data) => {
        return WAC710CD.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return WAC710CD.readICCID(context, data);
      },
      readTorqueConfig: (context, data) => {
        return WAC710CD.readTorqueConfig(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC710CD.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return WAC710CD.readAddress(context, data);
      },
      readData: (context, data) => {
        return WAC710CD.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC710CD.readTemperatureProbesConfig(context, data);
      },
      readPressureProbes: (context, data) => {
        return WAC710CD.readPressureProbesConfig(context, data);
      },
      lowerLimitOf4mACalibrated: (context, data) => {
        return WAC710CD.calibratedLowerLimit4mA(context, data);
      },
      upperLimitOf20mACalibrated: (context, data) => {
        return WAC710CD.calibratedUpperLimit20mA(context, data);
      },
      openPower: (context, data) => {
        return WAC710CD.openPower(context, data);
      },
      generate4mACurrent: (data) => {
        return WAC710CD.generate4mACurrent(data);

      },
      generate10mACurrent: (data) => {
        return WAC710CD.generate10mACurrent(data);

      },
      generate20mACurrent: (data) => {
        return WAC710CD.generate20mACurrent(data);
      },
      readCurrent: (data, context) => {
        return WAC710CD.readCurrent(data, context);
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
      'exitSelfTest': true,
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
      'exitSelfTest': 67,
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
      'exitSelfTest': 34,
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
        return WAC300CD.inquireSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC300CD.writeTemperatureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC300CD.readSelfTestStatus(context, data);
      },
      awaken: (data) => {
        return WAC300CD.awaken(data);
      },
      readIMEI: (context, data) => {
        return WAC300CD.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return WAC300CD.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300CD.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return WAC300CD.readAddress(context, data);
      },
      readData: (context, data) => {
        return WAC300CD.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC300CD.readTemperatureProbesConfig(context, data);
      },
    },
  },
  'BeaconM': {
    protocolCode: `EN1434_0204`,
    model: 87,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'writeTemperatureProbesConfig': true,
      'writePressureProbesConfig': true,
      'awaken': false,
      'inquireSelfTest': true,
      'selfTest': true,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readSelfTestStatus': true,
      'exitSelfTest': true,
      'readAddress': false,
      'readData': true,
      'readTemperatureProbes': true
    },
    protocolId: 150,
    deviceActionResponseMessageLength: {
      'writeTemperatureProbesConfig': 69,
      'writePressureProbesConfig': 68,
      'awaken': 32,
      'inquireSelfTest': 67,
      'writeAddress': 37,
      'readICCID': 52,
      'readIMEI': 47,
      'readSelfTestStatus': 114,
      'exitSelfTest': 67,
      'readAddress': 37,
      'selfTest': 99,
      'readData': 132,
    },
    deviceActionResponseMessageLength2: {
      'writeTemperatureProbesConfig': 34,
      'writePressureProbesConfig': 34,
      'awaken': 16,
      'inquireSelfTest': 34,
      'writeAddress': 16,
      'readICCID': 36,
      'readIMEI': 31,
      'readSelfTestStatus': 81,
      'exitSelfTest': 34,
      'readAddress': 21,
      'selfTest': 99,
      'readData': 99,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return BEACONM.inquireSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return BEACONM.writeTemperatureProbesConfig(data);
      },
      writePressureProbesConfig: (data) => {
        return BEACONM.writePressureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return BEACONM.readSelfTestStatus(context, data);
      },
      awaken: (data) => {
        return BEACONM.awaken(data);
      },
      readIMEI: (context, data) => {
        return BEACONM.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return BEACONM.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return BEACONM.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return BEACONM.readAddress(context, data);
      },
      readData: (context, data) => {
        return BEACONM.readData(context, data);
      },
    },
  },
  'WAC710C': {
    protocolCode: `EN1434_0146`,
    model: 63,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'writePressureProbe': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'readVersion': false,
      'readSelfTestStatus2': true,
      'exitSelfTest': true,
      'readData': true,
    },
    protocolId: 117,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'writePressureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'readAddress': 21,
      'readVersion': 17,
      'readSelfTestStatus2': 81,
      'exitSelfTest': 34,
      'readData': 84
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'writePressureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'readAddress': 21,
      'readVersion': 17,
      'readSelfTestStatus2': 81,
      'exitSelfTest': 34,
      'readData': 84
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC710C.inquireSelfTest(data);
      },
      writeTemperatureProbe: (data) => {
        return WAC710C.writeTemperatureProbe(data);
      },
      writePressureProbe: (data) => {
        return WAC710C.writePressureProbe(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC710C.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC710C.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC710C.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC710C.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return WAC710C.readAddress(context, data);
      },
      readVersion: (context, data) => {
        return WAC710C.readVersion(context, data);
      },
      readSelfTestStatus2: (context, data) => {
        return WAC710C.readSelfTestStatus2(context, data);
      },
      exitSelfTest: (data) => {
        return WAC710C.exitSelfTest(data);
      },
      readData: (context, data) => {
        return WAC710C.readData(context, data);
      }


    },
  },
  'WAC300NS': {
    protocolCode: `EN1434_0171`,
    model: -1,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': true,
      'exitSelfTest': true,
      'readData': true,
      'awaken': false,
    },
    protocolId: 137,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'exitSelfTest': 34,
      'readData': 72,
      'readAddress': 72,
      'awaken':16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'writeTemperatureProbe': 69,
      'selfTest': -1,
      'readSelfTestStatus': 106,
      'readICCID': 52,
      'readIMEI': 47,
      'writeAddress': 37,
      'exitSelfTest': 67,
      'readData': 105,
      'readAddress': 105,
      'awaken':32
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC300NS.inquireSelfTest(data);
      },
      writeTemperatureProbe: (data) => {
        return WAC300NS.writeTemperatureProbe(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC300NS.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC300NS.readICCID(context, data);
      },

      readIMEI: (context, data) => {
        return WAC300NS.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300NS.writeAddress(leftGenerateAddress, data);
      },
      exitSelfTest: (data) => {
        return WAC300NS.exitSelfTest(data);
      },
      readData: (context, data) => {
        return WAC300NS.readData(context, data);
      },

      readAddress: (context, data) => {
        return WAC300NS.readData(context, data);
      },
      awaken: (context, data) => {
        return WAC300NS.awaken(context, data);
      },

    },
  },
  'WAC400NS': {
    protocolCode: `EN1434_0178`,
    model: 82,  //82电信 83移动
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true,
      'readData': true,
    },
    protocolId: 146,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'exitSelfTest': 34,
      'readData': 72,
      'readAddress': 72,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'writeTemperatureProbe': 69,
      'selfTest': -1,
      'readSelfTestStatus': 106,
      'readICCID': 52,
      'readIMEI': 47,
      'writeAddress': 37,
      'exitSelfTest': 67,
      'readData': 105,
      'readAddress': 105,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC400NS.inquireSelfTest(data);
      },
      writeTemperatureProbe: (data) => {
        return WAC400NS.writeTemperatureProbe(data)(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC400NS.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC400NS.readICCID(context, data);
      },

      readIMEI: (context, data) => {
        return WAC400NS.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC400NS.writeAddress(leftGenerateAddress, data);
      },
      exitSelfTest: (data) => {
        return WAC400NS.exitSelfTest(data);
      },
      readData: (context, data) => {
        return WAC400NS.readData(context, data);
      },

      readAddress: (context, data) => {
        return WAC400NS.readData(context, data);
      },

    },
  },
  'VAC710S': {
    //不注册平台
    protocolCode: null,
    model: null,
    joinMode: null,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'readData': true,
    },
    protocolId: 60,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'writePressureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'writeAddress': 16,
      'readData': 84,
      'readAddress': 84,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'writePressureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'writeAddress': 16,
      'readData': 84,
      'readAddress': 84,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return VAC710S.inquireSelfTest(data);
      },
      writeTemperatureProbe: (data) => {
        return VAC710S.writeTemperatureProbe(data);
      },
      writePressureProbe: (data) => {
        return VAC710S.writePressureProbe(data);
      },
      readSelfTestStatus: (context, data) => {
        return VAC710S.readSelfTestStatus(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return VAC710S.writeAddress(leftGenerateAddress, data);
      },
      readData: (context, data) => {
        return VAC710S.readData(context, data);
      },
      readAddress: (context, data) => {
        return VAC710S.readData(context, data);
      },

    },
  },
  'CTW100': {
    protocolCode: `EN1434_0174`,
    model: 77,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeConfig': false,
      'awaken': false,
      'selfTest': false,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readSelfTestStatus': false,
      'exitSelfTest': false,
      'readAddress': false,
      'readData': false,
    },
    protocolId: 140,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeConfig': 16,
      'readSelfTestStatus': 58,
      'readIMEI': 47,
      'readICCID': 52,
      'writeAddress': 37,
      'awaken': 32,
      'exitSelfTest': 16,
      'readAddress': 37,
      'selfTest': -1,
      'readData': 24,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'writeConfig': 34,
      'readSelfTestStatus': 74,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'awaken': 16,
      'exitSelfTest': 32,
      'readAddress': 21,
      'selfTest': -1,
      'readData': 40,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CTW100.inquireSelfTest(data);
      },
      writeConfig: (data) => {
        return CTW100.writeConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return CTW100.readSelfTestStatus(context, data);
      },
      readIMEI: (context, data) => {
        return CTW100.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return CTW100.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CTW100.writeAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return CTW100.awaken(data);
      },
      readAddress: (context, data) => {
        return CTW100.readAddress(context, data);
      },
      readData: (context, data) => {
        return CTW100.readData(context, data);
      },
      exitSelfTest:(data) => {
        return CTW100.exitSelfTest(data);
      },

    },
  },
  'WAC300LH': {
    //不注册平台
    protocolCode: undefined,
    model: -1,
    joinMode: -1,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeConfig': false,
      'selfTest': false,
      'readAddress': false,
      'readData': false,
      'readSelfTestStatus': false,
      'writeAddress': false,
    },
    protocolId: 120,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeConfig': 16,
      'selfTest': -1,
      'readAddress': 55,//使用读自检取地址
      'readData': 50,
      'readSelfTestStatus': 55,
      'writeAddress': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'writeConfig': 34,
      'selfTest': -1,
      'readAddress': 71,//使用读自检取地址
      'readData': 66,
      'readSelfTestStatus': 71,
      'writeAddress': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC300LH.inquireSelfTest(data);
      },
      writeConfig: (data) => {
        return WAC300LH.writeConfig(data);
      },
      readAddress: (context, data) => {
        return WAC300LH.readAddress(context, data);
      },
      readData: (context, data) => {
        return WAC300LH.readData(context, data);
      },

      readSelfTestStatus: (context, data) => {
        return WAC300LH.readSelfTestStatus(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300LH.writeAddress(leftGenerateAddress, data);
      },


    },
  },
  'VAC005C': {
    //不注册平台
    protocolCode: null,
    model: -1,
    joinMode: -1,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'awaken': false,
      'selfTest': false,
      'writeAddress': false,
      'readSelfTestStatus': false,
      'readAddress': false,
    },
    protocolId: 101,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 19,
      'writeTemperatureProbe': 19,
      'selfTest': -1,
      'readSelfTestStatus': 58,
      'writeAddress': 19,
      'readAddress': 19,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 19,
      'writeTemperatureProbe': 19,
      'selfTest': -1,
      'readSelfTestStatus': 58,
      'writeAddress': 19,
      'readAddress': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return VAC005C.inquireSelfTest(data);
      },
      writeTemperatureProbe: (data) => {
        return VAC005C.writeTemperatureProbe(data);
      },
      readSelfTestStatus: (context, data) => {
        return VAC005C.readSelfTestStatus(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return VAC005C.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return VAC005C.readAddress(context, data);
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
      'exitSelfTest': false,
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
      'exitSelfTest': 32,
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
      'exitSelfTest': 16,
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
        return CT1000.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CT1000.readSelfTestStatus(context, data);
      },
      awaken: (data) => {
        return CT1000.awaken(data);
      },
      readIMEI: (context, data) => {
        return CT1000.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return CT1000.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CT1000.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CT1000.readAddress(context, data);
      },
      exitSelfTest: (data) => {
        return CT1000.exitSelfTest(data);
      },
      readData: (context, data) => {
        return CT1000.readData(context, data);
      },
    },
  },
  'RFT200-CAT1': {
    //采集器需要注册平台
    protocolCode: null,
    model: null,
    joinMode: null,
    protocolId: 127,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      '485sendSuccess': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'awaken': false,
      'exitSelfTest': false,
      'readData': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 18,
      'selfTest': -1,
      '485sendSuccess': -1,
      'readSelfTestStatus': 48,
      'readIMEI': 33,
      'readICCID': 38,
      'writeAddress': 18,
      'readAddress': 19,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 36,
      'selfTest': -1,
      '485sendSuccess': -1,
      'readSelfTestStatus': 69,
      'readIMEI': 51,
      'readICCID': 56,
      'writeAddress': 43,
      'readAddress': 37,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return RFT200CAT1.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return RFT200CAT1.readSelfTestStatus(context, data);
      },
      readIMEI: (context, data) => {
        return RFT200CAT1.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return RFT200CAT1.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return RFT200CAT1.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return RFT200CAT1.readAddress(context, data);
      },

    },
  },
  'RFT200': {
    //此采集器不需要注册平台
    protocolCode: null,
    model: null,
    joinMode: null,
    protocolId: 136,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      '485sendSuccess': false,
      'readSelfTestStatus': false,
      'readIMEI': false,
      'readICCID': false,
      'writeAddress': false,
      'readAddress': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 18,
      'selfTest': -1,
      '485sendSuccess': -1,
      'readSelfTestStatus': 48,
      'readIMEI': 33,
      'readICCID': 38,
      'writeAddress': 18,
      'readAddress': 19,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 36,
      'selfTest': -1,
      '485sendSuccess': -1,
      'readSelfTestStatus': 69,
      'readIMEI': 51,
      'readICCID': 56,
      'writeAddress': 43,
      'readAddress': 37,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return RFT200.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return RFT200.readSelfTestStatus(context, data);
      },
      readIMEI: (context, data) => {
        return RFT200.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return RFT200.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return RFT200.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return RFT200.readAddress(context, data);
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
      'exitSelfTest': false,
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
      'exitSelfTest': 32,
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
      'exitSelfTest': 16,
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
        return ET01.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return ET01.readSelfTestStatus(context, data);
      },
      awaken: (data) => {
        return ET01.awaken(data);
      },
      readIMEI: (context, data) => {
        return ET01.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return ET01.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return ET01.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return ET01.readAddress(context, data);
      },
      exitSelfTest: (data) => {
        return ET01.exitSelfTest(data);
      },
      readData: (context, data) => {
        return ET01.readData(context, data);
      },
    },

  },
  'NTP100C': {
    protocolCode: `EN1434_0121`,
    protocolId: 112,
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
      'exitSelfTest': false,
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
      'exitSelfTest': 32,
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
      'exitSelfTest': 16,
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
        return NTP100C.inquireSelfTest(data);
      },
      writeProbesConfig: (data) => {
        return NTP100C.writeProbesConfig(data);
      },
      readData: (context, data) => {
        return NTP100C.readData(context, data);
      },
      readSelfTestStatus: (context, data) => {
        return NTP100C.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return NTP100C.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return NTP100C.readIMEI(context, data);
      },
      readProbesConfig: (context, data) => {
        return NTP100C.readProbesConfig(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return NTP100C.writeAddress(leftGenerateAddress, data);
      },
      exitSelfTest: (data) => {
        return NTP100C.exitSelfTest(data);
      },
      readAddress: (context, data) => {
        return NTP100C.readAddress(context, data);
      },
      awaken: (data) => {
        return NTP100C.awaken(data);
      },


    },
  },
  'LPC210': {
    protocolCode: 'EN1434_0154',
    protocolId: 121,
    model: 66,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 48,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 33,
      'writeAddress': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 64,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 51,
      'writeAddress': 37,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return LPC210.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return LPC210.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return LPC210.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return LPC210.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return LPC210.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return LPC210.readAddress(context, data);
      },


    },
  },
  'LPC210E': {
    protocolCode: 'EN1434_0154',
    protocolId: 121,
    model: 66,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 48,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 33,
      'writeAddress': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 64,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 51,
      'writeAddress': 37,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return LPC210E.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return LPC210E.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return LPC210E.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return LPC210E.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return LPC210E.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return LPC210E.readAddress(context, data);
      },


    },
  },
  'CAT400': {
    protocolCode: 'EN1434_0145',
    protocolId: 123,
    model: 64,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'awaken': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 57,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'awaken': 16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 32,
      'awaken': 32
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CAT400.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CAT400.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return CAT400.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return CAT400.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CAT400.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CAT400.readAddress(context, data);
      },
      awaken(data) {
        return CAT400.awaken(data);
      },

    },
  },
  'CAT400S': {
    protocolCode: 'EN1434_0172',
    protocolId: 138,
    model: 75,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'awaken': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 57,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'awaken': 16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 32,
      'awaken': 32
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CAT400S.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CAT400S.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return CAT400S.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return CAT400S.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CAT400S.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CAT400S.readAddress(context, data);
      },
      awaken(data) {
        return CAT400S.awaken(data);
      },
    }
  },
  'CPT100': {
    protocolCode: 'EN1434_0164',
    protocolId: 132,
    model: 68,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'readDeviceData': false,
      'readAmmeterPower': false,
      'calibration': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'readDeviceData': 28,
      'readAmmeterPower': 9,
      'calibration': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 75,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 43,
      'readDeviceData': 44,
      'readAmmeterPower': 9,
      'calibration': 33,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CPT100.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CPT100.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return CPT100.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return CPT100.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CPT100.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CPT100.readAddress(context, data);
      },
      readDeviceData: (context, data) => {
        return CPT100.readDeviceData(context, data);
      },
      readAmmeterPower: (context, data) => {
        return CPT100.readAmmeterPower(context, data);
      },
      calibration: (data) => {
        return CPT100.calibration(data);
      },
    },
  },
  'BDC100&C17': {
    protocolCode: null,
    protocolId: 132,
    model: null,
    joinMode: null,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'writeAddress': false,
      'readAddress': false,
      'readDeviceData': false,
      'readAmmeterPower': false,
      'calibration': false,
      'settingEnergyError': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'readAddress': 21,
      'writeAddress': 16,
      'readDeviceData': 28,
      'readAmmeterPower': 9,
      'calibration': 16,
      'settingEnergyError': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 75,
      'readAddress': 37,
      'writeAddress': 43,
      'readDeviceData': 44,
      'readAmmeterPower': 9,
      'calibration': 33,
      'settingEnergyError': 36,
    },
    portAttribute: {
      dataBits: 8,
      parity: '偶校验',
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CPT100.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CPT100.readSelfTestStatus(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CPT100.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CPT100.readAddress(context, data);
      },
      readDeviceData: (context, data) => {
        return CPT100.readDeviceData(context, data);
      },
      readAmmeterPower: (context, data) => {
        return CPT100.readAmmeterPower(context, data);
      },
      calibration: (data) => {
        return CPT100.calibration(data);
      },
      settingEnergyError: (data) => {
        return CPT100.settingEnergyError(data)
      }
    },
  },
  'NTR300C': {
    protocolCode: 'EN1434_0170',
    protocolId: 125,
    model: 72,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 72,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 32,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return NTR300C.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return NTR300C.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return NTR300C.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return NTR300C.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return NTR300C.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return NTR300C.readAddress(context, data);
      },
      exitSelfTest: (context) => {
        return NTR300C.exitSelfTest(context);
      },
    },
  },
  /**
   * WAC100 ->NB_WLV101锁闭阀 所有model 待定。
   * */
  //TODO
  'WAC100N': {
    protocolCode: 'EN1434_9992',
    protocolId: 72,
    model: 1,  /*2移动|7电信*/
    joinMode: 2,/*2移动|8电信*/
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbesConfig': true,
      'selfTest': true,
      'readData': true,
      'readSelfTestStatus': true,
      'readIMEI': false,
      'readICCID': false,
      'readTemperatureProbes': true,
      'writeAddress': false,
      'awaken': false,
      'exitSelfTest': true,
      'readAddress': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbesConfig': 34,
      'selfTest': -1,
      'readData': 59,
      'readSelfTestStatus': 73,
      'readIMEI': 31,
      'readICCID': 36,
      'readTemperatureProbes': 36,
      'writeAddress': 16,
      'awaken': 16,
      'exitSelfTest': 34,
      'readAddress': 21,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'writeTemperatureProbesConfig': 69,
      'selfTest': -1,
      'readData': 92,
      'readSelfTestStatus': 106,
      'readIMEI': 47,
      'readICCID': 52,
      'readTemperatureProbes': 69,
      'writeAddress': 37,
      'awaken': 32,
      'exitSelfTest': 67,
      'readAddress': 37,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC100N.inquireSelfTest(data)
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC100N.writeTemperatureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC100N.readSelfTestStatus(context,data)
      },
      readICCID: (context, data) => {
        return WAC100N.readICCID(context,data)
      },
      readIMEI: (context, data) => {
        return WAC100N.readIMEI(context,data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC100N.writeAddress(leftGenerateAddress,data)
      },
      awaken: (data) => {
        return WAC100N.awaken(data);
      },
      readData: (context, data) => {
        return WAC100N.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC100N.readProbesConfig(context, data);
      },
      readAddress: (context, data) => {
        return WAC100N.readAddress(context,data)
      },
      exitSelfTest: (data) => {
        return WAC100N.exitSelfTest(data)
      },
    },
  },
  //TODO
  'WAC100NY': {
    protocolCode: 'EN1434_9992',
    protocolId: 72,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC200N': {
    protocolCode: 'EN1434_9993',
    protocolId: 71,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC300NZ': {
    protocolCode: 'EN1434_9993',
    protocolId: 71,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC330N': {
    protocolCode: 'EN1434_9981',
    protocolId: 86,
    model: -1,//22 电信  56 移动
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readIMEI': 31,
      'readICCID': 36,
      'writeAddress': 16,
      'readAddress': 21,
      'exitSelfTest': 34,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'selfTest': -1,
      'readSelfTestStatus': 106,
      'readIMEI': 47,
      'readICCID': 52,
      'writeAddress': 37,
      'readAddress': 37,
      'exitSelfTest': 67,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC330N.inquireSelfTest(data)
      },
      readSelfTestStatus: (context, data) => {
        return WAC330N.readSelfTestStatus(context, data)
      },
      readIMEI: (context, data) => {
        return WAC330N.readIMEI(context, data)
      },
      readICCID: (context, data) => {
        return WAC330N.readICCID(context, data)
      },

      writeAddress: (leftGenerateAddress, data) => {
        return WAC330N.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return WAC330N.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return WAC330N.exitSelfTest(data)
      },
    },
  },
  //TODO
  'WAC300NC': {
    protocolCode: 'EN1434_9993',
    protocolId: 71,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  'WAC300SC': {
    protocolCode: 'EN1434_0215',
    protocolId: 155,
    model: 93,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true,
      'readData': true,
      'readTemperatureProbes': true,
      'awaken':false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 34,
      'readData': 106,
      'readTemperatureProbes': 36,
      'awaken':16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'writeTemperatureProbe': 69,
      'selfTest': -1,
      'readSelfTestStatus': 106,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 67,
      'readData': 139,
      'readTemperatureProbes': 69,
      'awaken':32,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC300SC.inquireSelfTest(data)
      },
      writeTemperatureProbe: (data) => {
        return WAC300SC.writeTemperatureProbe(data)
      },
      readSelfTestStatus: (context, data) => {
        return WAC300SC.readSelfTestStatus(context, data)
      },
      readICCID: (context, data) => {
        return WAC300SC.readICCID(context, data)
      },
      readIMEI: (context, data) => {
        return WAC300SC.readIMEI(context, data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300SC.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return WAC300SC.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return WAC300SC.exitSelfTest(data)
      },
      readData: (context, data) => {
        return WAC300SC.readData(context, data)
      },
      readTemperatureProbes: (context, data) => {
        return WAC300SC.readProbesConfig(context, data);
      },
      awaken:(data)=>{
        return WAC300SC.awaken(data)
      }
    },
  },
  'WAC300C': {
    protocolCode: 'EN1434_0117',
    protocolId: 109,
    model: 50,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'selfTest': true,
      'readSelfTestStatus': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true,
      'readData': true,
      'readSignal': false,
      'readBatteryVoltage': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'selfTest': -1,
      'readSelfTestStatus': 81,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 34,
      'readData': 65,
      'readSignal': 17,
      'readBatteryVoltage': 18,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'writeTemperatureProbe': 69,
      'selfTest': -1,
      'readSelfTestStatus': 114,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 67,
      'readData': 98,
      'readSignal': 33,
      'readBatteryVoltage': 34,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC300C.inquireSelfTest(data)
      },
      writeTemperatureProbe: (data) => {
        return WAC300C.writeTemperatureProbe(data)
      },
      readSelfTestStatus: (context, data) => {
        return WAC300C.readSelfTestStatus(context, data)
      },
      readICCID: (context, data) => {
        return WAC300C.readICCID(context, data)
      },
      readIMEI: (context, data) => {
        return WAC300C.readIMEI(context, data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300C.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return WAC300C.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return WAC300C.exitSelfTest(data)
      },
      readSignal: (context, data) => {
        return WAC300C.readSignal(context, data)
      },
      readBatteryVoltage: (context, data) => {
        return WAC300C.readBatteryVoltage(context, data)
      },
      readData: (context, data) => {
        return WAC300C.readData(context, data)
      },
    },
  },
  //TODO
  'WAC300C-LG': {
    protocolCode: 'EN1434_9993',
    protocolId: 71,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC300CY': {
    protocolCode: 'EN1434_9993',
    protocolId: 71,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC300CS': {
    protocolCode: 'EN1434_9993',
    protocolId: 71,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },

  'VAC710': {
    protocolCode: null,
    protocolId: 96,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'writePressureProbe': true,
      'selfTest': true,
      'readVersion': false,
      'readSelfTestStatus': true,
      'readSelfTestStatus2': true,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true,
      'readData': true,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 37,
      'writeTemperatureProbe': 37,
      'writePressureProbe': 37,
      'selfTest': -1,
      'readVersion': 17,
      'readSelfTestStatus': 76,
      'readSelfTestStatus2': 84,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 37,
      'readData': 87,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 37,
      'writeTemperatureProbe': 37,
      'writePressureProbe': 37,
      'selfTest': -1,
      'readVersion': 17,
      'readSelfTestStatus': 76,
      'readSelfTestStatus2': 84,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 37,
      'readData': 87,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return VAC710.inquireSelfTest(data)
      },
      writeTemperatureProbe: (data) => {
        return VAC710.writeTemperatureProbe(data)
      },
      writePressureProbe: (data) => {
        return VAC710.writePressureProbe(data)
      },
      readVersion: (context, data) => {
        return VAC710.readVersion(context, data)
      },
      readSelfTestStatus: (context, data) => {
        return VAC710.readSelfTestStatus(context, data)
      },
      readSelfTestStatus2: (context, data) => {
        return VAC710.readSelfTestStatus2(context, data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return VAC710.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return VAC710.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return VAC710.exitSelfTest(data)
      },
      readData: (context, data) => {
        return VAC710.readData(context, data)
      },
    },
  },
  //TODO
  'VAC710-JL': {
    protocolCode: 'EN1434_0156',
    protocolId: 126,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC500N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC510N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC520N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC530N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC710N': {
    protocolCode: 'EN1434_0096',
    protocolId: 96,
    model: 36, //36 电信 57 移动
    joinMode: 2, //接入模式根据解析读自检状态动态变化
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbe': true,
      'writePressureProbe': true,
      'selfTest': true,
      'readVersion': false,
      'readSelfTestStatus': true,
      'readSelfTestStatus2': true,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true,
      'readData': true,
      'readIMEI': false,
      'readICCID': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'writePressureProbe': 34,
      'selfTest': -1,
      'readVersion': 17,
      'readSelfTestStatus': 73,
      'readSelfTestStatus2': 81,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 34,
      'readData': 84,
      'readICCID': 36,
      'readIMEI': 31,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 34,
      'writeTemperatureProbe': 34,
      'writePressureProbe': 34,
      'selfTest': -1,
      'readVersion': 17,
      'readSelfTestStatus': 73,
      'readSelfTestStatus2': 81,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 34,
      'readData': 84,
      'readICCID': 36,
      'readIMEI': 31,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC710N.inquireSelfTest(data)
      },
      writeTemperatureProbe: (data) => {
        return WAC710N.writeTemperatureProbe(data)
      },
      writePressureProbe: (data) => {
        return WAC710N.writePressureProbe(data)
      },
      readVersion: (context, data) => {
        return WAC710N.readVersion(context, data)
      },
      readSelfTestStatus: (context, data) => {
        return WAC710N.readSelfTestStatus(context, data)
      },
      readSelfTestStatus2: (context, data) => {
        return WAC710N.readSelfTestStatus2(context, data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC710N.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return WAC710N.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return WAC710N.exitSelfTest(data)
      },
      readData: (context, data) => {
        return WAC710N.readData(context, data)
      },
      readIMEI: (context, data) => {
        return WAC710N.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return WAC710N.readICCID(context, data);
      },
    },
  },
  //TODO
  'WAC710NS': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC710CS': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC730N': {
    protocolCode: 'EN1434_0106',
    protocolId: 105,
    model: -1,//电信42,移动46
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writePressureProbesConfig': true,
      'selfTest': true,
      'readVersion': false,
      'readSelfTestStatus': true,
      'readSelfTestStatus2': true,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': true,
      'awaken': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writePressureProbesConfig': 34,
      'selfTest': -1,
      'readVersion': 17,
      'readSelfTestStatus': 73,
      'readSelfTestStatus2': 81,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'readAddress': 21,
      'exitSelfTest': 34,
      'awaken': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 34,
      'writePressureProbesConfig': 34,
      'selfTest': -1,
      'readVersion': 17,
      'readSelfTestStatus': 73,
      'readSelfTestStatus2': 81,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'readAddress': 21,
      'exitSelfTest': 34,
      'awaken': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC730N.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC730N.readSelfTestStatus(context, data);
      },
      readIMEI: (context, data) => {
        return WAC730N.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return WAC730N.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC730N.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return WAC730N.readAddress(context, data);
      },
      exitSelfTest: (data) => {
        return WAC730N.exitSelfTest(data);
      },

      writePressureProbesConfig: (data) => {
        return WAC730N.writePressureProbesConfig(data);
      },
      readVersion: (context, data) => {
        return WAC730N.readVersion(context, data);
      },
      readSelfTestStatus2: (context, data) => {
        return WAC730N.readSelfTestStatus2(context, data);
      },
      awaken: (data) => {
        return WAC730N.awaken(data);
      },
    },
  },
  //TODO
  'WAC710L': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC550N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC600N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAC610N': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'NBT100-AC': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },  //TODO
  'NTC100': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },  //TODO
  'NBT400-AC': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  'NBT400': {
    protocolCode: 'EN1434_0103',
    protocolId: 103,
    model: 41, //41 电信、49 移动
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readIMEI': false,
      'readICCID': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readIMEI': 31,
      'readICCID': 36,
      'writeAddress': 16,
      'readAddress': 21,
      'exitSelfTest': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 72,
      'readIMEI': 47,
      'readICCID': 52,
      'writeAddress': 37,
      'readAddress': 37,
      'exitSelfTest': 32,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return NBT400.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return NBT400.readSelfTestStatus(context, data)
      },
      readIMEI: (context, data) => {
        return NBT400.readIMEI(context, data)
      },
      readICCID: (context, data) => {
        return NBT400.readICCID(context, data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return NBT400.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return NBT400.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return NBT400.exitSelfTest(data)
      },
    },
  },  //TODO
  'NTR200': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  'CAT200': {
    protocolCode: 'EN1434_0126',
    protocolId: 116,
    model: 59,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'awaken': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 54,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'awaken': 16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 70,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 32,
      'awaken': 32
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CAT200.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CAT200.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return CAT200.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return CAT200.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CAT200.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CAT200.readAddress(context, data);
      },
      awaken(data) {
        return CAT200.awaken(data);
      },
    },
  },
  'CAT200P': {
    protocolCode: '-',
    protocolId: 152,
    model: -1,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'awaken': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 54,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'awaken': 16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 70,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 37,
      'exitSelfTest': 32,
      'awaken': 32
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CAT200P.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CAT200P.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return CAT200P.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return CAT200P.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CAT200P.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CAT200P.readAddress(context, data);
      },
      awaken(data) {
        return CAT200P.awaken(data);
      },
    },
  },

  //TODO
  'NTR300': {
    protocolCode: 'EN1434_0044',
    protocolId: 74,
    model: -1, //9 NTR200_NB电信测量点, 10 NTR200_NB移动测量点
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'writeAddress': 16,
      'readAddress': 21,
      'exitSelfTest': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 72,
      'readICCID': 52,
      'readIMEI': 47,
      'writeAddress': 37,
      'readAddress': 37,
      'exitSelfTest': 32,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return NTR300.inquireSelfTest(data)
      },
      readSelfTestStatus: (context, data) => {
        return NTR300.readSelfTestStatus(context, data)
      },
      readICCID: (context, data) => {
        return NTR300.readICCID(context, data)
      },
      readIMEI: (context, data) => {
        return NTR300.readIMEI(context, data)
      },
      writeAddress: (leftGenerateAddress, data) => {
        return NTR300.writeAddress(leftGenerateAddress, data)
      },
      readAddress: (context, data) => {
        return NTR300.readAddress(context, data)
      },
      exitSelfTest: (data) => {
        return NTR300.exitSelfTest(data)
      },
    },
  },
  //TODO
  'NTR300GZ': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'WAT300NH': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'VAT100': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'NTP100': {
    protocolCode: null,
    protocolId: null,
    model: -1,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'writeTemperatureProbe': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'exitSelfTest': false,
      'readData': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'writeTemperatureProbe': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 15,
      'writeAddress': 16,
      'exitSelfTest': 16,
      'readData': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return null
      },
      readSelfTestStatus: (context, data) => {
        return null
      },
      readICCID: (context, data) => {
        return null
      },
      readIMEI: (context, data) => {
        return null
      },
      writeAddress: (leftGenerateAddress, data) => {
        return null
      },
      readAddress: (context, data) => {
        return null
      },
      exitSelfTest: (context, data) => {
        return null
      },
    },
  },
  //TODO
  'CPT100-10A': {
    protocolCode: 'EN1434_0164',
    protocolId: 132,
    model: 68,
    joinMode: 2,
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'readAddress': false,
      'readDeviceData': false,
      'readAmmeterPower': false,
      'calibration': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'readICCID': 36,
      'readIMEI': 31,
      'readAddress': 21,
      'writeAddress': 16,
      'readDeviceData': 28,
      'readAmmeterPower': 9,
      'calibration': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 75,
      'readICCID': 52,
      'readIMEI': 47,
      'readAddress': 37,
      'writeAddress': 43,
      'readDeviceData': 44,
      'readAmmeterPower': 9,
      'calibration': 33,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return CPT100.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return CPT100.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return CPT100.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return CPT100.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return CPT100.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return CPT100.readAddress(context, data);
      },
      readDeviceData: (context, data) => {
        return CPT100.readDeviceData(context, data);
      },
      readAmmeterPower: (context, data) => {
        return CPT100.readAmmeterPower(context, data);
      },
      calibration: (data) => {
        return CPT100.calibration(data);
      },
    }
  },
  'VPT100': {
    protocolCode: undefined, //不注册平台
    protocolId: 51,
    model: 68,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'writeAddress': false,
      'readAddress': false,
      'writeTemperaturePressureProbe': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readAddress': 21,
      'writeAddress': 16,
      'writeTemperaturePressureProbe': 16
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'readAddress': 21,
      'writeAddress': 16,
      'writeTemperaturePressureProbe': 16
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return VPT100.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return VPT100.readSelfTestStatus(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return VPT100.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return VPT100.readAddress(context, data);
      },
      writeTemperaturePressureProbe: (context, data) => {
        return VPT100.writeTemperaturePressureProbe(context, data)
      }
    },
  },
  'LPC230': {
    protocolCode: ``,//TODO 不注册平台
    protocolId: 128,
    model: -1,//TODO 不注册平台
    joinMode: 2,//TODO 不注册平台
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'exitSelfTest': false,
      'readAddress': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 18,
      'selfTest': -1,
      'readSelfTestStatus': 55,
      'readICCID': 38,
      'readIMEI': 33,
      'readAddress': 33,
      'writeAddress': 20,
      'exitSelfTest': 18,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 36,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 56,
      'readIMEI': 51,
      'readAddress': 51,
      'writeAddress': 43,
      'exitSelfTest': 36,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return LPC230.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return LPC230.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return LPC230.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return LPC230.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return LPC230.writeAddress(leftGenerateAddress, data);
      },
      exitSelfTest: (data) => {
        return LPC230.exitSelfTest(data);
      },
      readAddress: (context, data) => {
        return LPC230.readAddress(context, data);
      },


    },
  },
  'LPC230E': {
    protocolCode: ``,//TODO 不注册平台
    protocolId: 128,
    model: -1,//TODO 不注册平台
    joinMode: 2,//TODO 不注册平台
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readICCID': false,
      'readIMEI': false,
      'writeAddress': false,
      'exitSelfTest': false,
      'readAddress': false,
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 18,
      'selfTest': -1,
      'readSelfTestStatus': 55,
      'readICCID': 38,
      'readIMEI': 33,
      'readAddress': 33,
      'writeAddress': 20,
      'exitSelfTest': 18,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 36,
      'selfTest': -1,
      'readSelfTestStatus': 73,
      'readICCID': 56,
      'readIMEI': 51,
      'readAddress': 51,
      'writeAddress': 43,
      'exitSelfTest': 36,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return LPC230E.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return LPC230E.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return LPC230E.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return LPC230E.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return LPC230E.writeAddress(leftGenerateAddress, data);
      },
      exitSelfTest: (data) => {
        return LPC230E.exitSelfTest(data);
      },
      readAddress: (context, data) => {
        return LPC230E.readAddress(context, data);
      },


    },
  },
  'AEC100': {
    protocolCode: ``,//TODO 不注册平台
    protocolId: 149,
    model: -1,//TODO 不注册平台
    joinMode: -1,//TODO 不注册平台
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readCurrentAmmeterInputLoop': false, //读取电流表输入回路
      'readCurrentAmmeterOutputLoop': false,// 读取电流表输出回路
      'writesActualInputCurrentValue4MA': false,//设备4mA输入标定
      'writesActualInputCurrentValue20MA': false,//设备20mA输入标定
      'output4MAActualCurrentValueCalibration': false,//设备4mA输出标定
      'output20MAActualCurrentValueCalibration': false,//设备20mA输出标定
      'writeFixedOutput4MA': false, //设备输出4mA
      'writeFixedOutput20MA': false, //设备输出20mA
      'current4To20mACalibrationSuccessful': false,//4-20mA标定成功
      'current4To20mACalibrationError': false,//4-20mA标定失败
      'deviceReadsCurrent': false, //读取当前电流值
      'inquireSelfTest': false, //自检查询
      'selfTest': false,//自检开启
      'readSelfTestStatus': false,//读取自检状态
      'readICCID': false, //读取ICCID
      'readIMEI': false, // 读取IMEI
      'writeAddress': false, //写地址
      'readAddress': false, //读地址
      'signalSourceOutput': false,//信号源输出
      'readCurrentSource': false,//读取电流源
      'exitSelfTest': false// 退出自检
    },
    deviceActionResponseMessageLength: {
      'readCurrentAmmeterInputLoop': 9, //读取电流表输入回路
      'readCurrentAmmeterOutputLoop': 9,// 读取电流表输出回路
      'writesActualInputCurrentValue4MA': 19,//设备4mA输入标定
      'writesActualInputCurrentValue20MA': 19,//设备20mA输入标定
      'output4MAActualCurrentValueCalibration': 16,//设备4mA输出标定
      'output20MAActualCurrentValueCalibration': 16,//设备20mA输出标定
      'writeFixedOutput4MA': 16, //设备输出4mA
      'writeFixedOutput20MA': 16, //设备输出20mA
      'current4To20mACalibrationSuccessful': 16,//4-20mA标定成功
      'current4To20mACalibrationError': 16,//4-20mA标定失败
      'deviceReadsCurrent': 20, //读取当前电流值
      'inquireSelfTest': 18, //自检查询
      'selfTest': -1,//自检开启
      'readSelfTestStatus': 53,//读取自检状态
      'readICCID': 38, //读取ICCID
      'readIMEI': 33, // 读取IMEI
      'writeAddress': 18, //写地址
      'readAddress': 19, //读地址
      'signalSourceOutput': 8,//信号源输出
      'readCurrentSource': 7,//读取电流源
      'exitSelfTest': 18
    },
    deviceActionResponseMessageLength2: {
      'readCurrentAmmeterInputLoop': 9, //读取电流表输入回路
      'readCurrentAmmeterOutputLoop': 9,// 读取电流表输出回路
      'writesActualInputCurrentValue4MA': 39,//设备4mA输入标定
      'writesActualInputCurrentValue20MA': 39,//设备20mA输入标定
      'output4MAActualCurrentValueCalibration': 36,//设备4mA输出标定
      'output20MAActualCurrentValueCalibration': 36,//设备20mA输出标定
      'writeFixedOutput4MA': 33, //设备输出4mA
      'writeFixedOutput20MA': 33, //设备输出20mA
      'current4To20mACalibrationSuccessful': 33,//4-20mA标定成功
      'current4To20mACalibrationError': 33,//4-20mA标定失败
      'deviceReadsCurrent': 36, //读取当前电流值
      'inquireSelfTest': 36, //自检查询
      'selfTest': -1,//自检开启
      'readSelfTestStatus': 71,//读取自检状态
      'readICCID': 56, //读取ICCID
      'readIMEI': 51, // 读取IMEI
      'writeAddress': 43, //写地址
      'readAddress': 37, //读地址
      'signalSourceOutput': 8,//信号源输出
      'readCurrentSource': 7,
      'exitSelfTest': 36
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return AEC100.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return AEC100.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return AEC100.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return AEC100.readIMEI(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return AEC100.writeAddress(leftGenerateAddress, data);
      },

      readAddress: (context, data) => {
        return AEC100.readAddress(context, data);
      },
      readCurrentAmmeterInputLoop: (data, context) => {
        return AEC100.readCurrentAmmeter(data, context);
      },
      readCurrentAmmeterOutputLoop: (data, context) => {
        return AEC100.readCurrentAmmeter(data, context);
      },
      readCurrentSource: (data, context) => {
        return AEC100.readCurrentSource(data, context);
      },
      writesActualInputCurrentValue4MA: (data) => {
        return AEC100.writesActualInputCurrentValue4mA(data);
      },
      writesActualInputCurrentValue20MA: (data) => {
        return AEC100.writesActualInputCurrentValue20mA(data);
      },
      writeFixedOutput4MA: (data) => {
        return AEC100.writeFixedOutput4mA(data);
      },
      writeFixedOutput20MA: (data) => {
        return AEC100.writeFixedOutput20mA(data);
      },
      output4MAActualCurrentValueCalibration: (data) => {
        return AEC100.writesActualInputCurrentValue4mA(data);
      },
      output20MAActualCurrentValueCalibration: (data) => {
        return AEC100.writesActualInputCurrentValue20mA(data);
      },
      deviceReadsCurrent: (data, context) => {
        return AEC100.readDeviceCurrent(data, context);
      },
      signal4MASourceOutput: (data) => {
        return AEC100.signal4MASourceOutput(data)
      },
      signal12MASourceOutput: (data) => {
        return AEC100.signal12MASourceOutput(data)
      },
      signal20MASourceOutput: (data) => {
        return AEC100.signal20MASourceOutput(data)
      },
      current4To20mACalibrationSuccessful: (data) => {
        return AEC100.calibrationCurrent4To20mASuccessful(data)
      },
      current4To20mACalibrationError: (data) => {
        return AEC100.calibrationCurrent4To20mAError(data)
      }

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
      'exitSelfTest': true,
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
      'exitSelfTest': 67,
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
      'exitSelfTest': 33,
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
        return WAC300N.inquireSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC300N.writeTemperatureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC300N.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC300N.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC300N.readIMEI(context, data);
      },
      readAddress: (context, data) => {
        return WAC300N.readAddress(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300N.writeAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC300N.awaken(data);
      },
      readData: (context, data) => {
        return WAC300N.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC300N.readProbesConfig(context, data);
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
      'exitSelfTest': true,
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
      'exitSelfTest': 67,
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
      'exitSelfTest': 33,
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
        return WAC300NH.inquireSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC300NH.writeTemperatureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC300NH.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC300NH.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC300NH.readIMEI(context, data);
      },
      readAddress: (context, data) => {
        return WAC300NH.readAddress(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300NH.writeAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC300NH.awaken(data);
      },
      readData: (context, data) => {
        return WAC300NH.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC300NH.readProbesConfig(context, data);
      },

    },
  },

  'WAC400N': {
    protocolCode: `EN1434_9992`,
    model: 1,  /*2移动|7电信*/
    joinMode: 2,/*2移动|8电信*/
    isInfraredDevice: true,
    protocolId: 72,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'writeTemperatureProbesConfig': true,
      'selfTest': true,
      'readData': true,
      'readSelfTestStatus': true,
      'readIMEI': false,
      'readICCID': false,
      'readTemperatureProbes': true,
      'writeAddress': false,
      'awaken': false,
      'exitSelfTest': true,
      'readAddress': false
    },
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeTemperatureProbesConfig': 34,
      'selfTest': -1,
      'readData': 59,
      'readSelfTestStatus': 73,
      'readIMEI': 31,
      'readICCID': 36,
      'readTemperatureProbes': 36,
      'writeAddress': 16,
      'awaken': 16,
      'exitSelfTest': 34,
      'readAddress': 21,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 67,
      'writeTemperatureProbesConfig': 69,
      'selfTest': -1,
      'readData': 92,
      'readSelfTestStatus': 106,
      'readIMEI': 47,
      'readICCID': 52,
      'readTemperatureProbes': 69,
      'writeAddress': 37,
      'awaken': 32,
      'exitSelfTest': 67,
      'readAddress': 37,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC400N.inquireSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC400N.writeTemperatureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC400N.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC400N.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC400N.readIMEI(context, data);
      },
      readAddress: (context, data) => {
        return WAC400N.readAddress(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC400N.writeAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC400N.awaken(data);
      },
      readData: (context, data) => {
        return WAC400N.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC400N.readProbesConfig(context, data);
      },
      exitSelfTest: (data) => {
        return WAC400N.exitSelfTest(data);
      },

    },
  },
  'WAC300NY': {
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
      'exitSelfTest': true,
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
      'exitSelfTest': 67,
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
      'exitSelfTest': 33,
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
        return WAC300NY.inquireSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC300NY.writeTemperatureProbesConfig(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC300NY.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC300NY.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC300NY.readIMEI(context, data);
      },
      readAddress: (context, data) => {
        return WAC300NY.readAddress(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC300NY.writeAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC300NY.awaken(data);
      },
      readData: (context, data) => {
        return WAC300NY.readData(context, data);
      },
      readTemperatureProbes: (context, data) => {
        return WAC300NY.readProbesConfig(context, data);
      },

    },
  },
  'WAC330CE': {
    protocolCode: `EN1434_0211`,
    model: 90,
    joinMode: 2,
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
      'exitSelfTest': true,
      'awaken': false,
      'meterSettingDate': false,
      'meterReadAddress': false,
      'meterWriteAddress': false,
      'meterEnterVerificationStatus': false,
      'meterReturnVerificationStatus': false,
      'meterTemperatureCalibration': false,
    },
    protocolId: 154,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 37,
      'writeTemperatureProbesConfig': 37,
      'readData': 132,
      'selfTest': -1,
      'readAddress': 21,
      'writeValveAddress': 16,
      'readSelfTestStatus': 76,
      'readICCID': 36,
      'readIMEI': 31,
      'exitSelfTest': 33,
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
      'exitSelfTest': 70,
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
      inquireSelfTest: (context, data) => {
        return WAC330CE.inquireSelfTest(context, data);
      },
      writeTemperatureProbesConfig: (context, data) => {
        return WAC330CE.writeTemperatureProbesConfig(context, data);
      },
      meterEnterVerificationStatus: (data) => {
        return WAC330CE.meterVerificationStatusEnter(data);
      },
      meterReturnVerificationStatus: (data) => {
        return WAC330CE.meterVerificationStatusExit(data);
      },
      meterSettingDate: (data) => {
        return WAC330CE.meterSetTime(data);
      },
      // meterReadAddress: (context, data) => {
      // return decodeCheckMeterReadAddressWAC330HE(context, data);
      // },
      meterWriteAddress: (context, data) => {
        return WAC330CE.writeMeterAddress(context, data);
      },
      readData: (context, data) => {
        return WAC330CE.readData(context, data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC330CE.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC330CE.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC330CE.readIMEI(context, data);
      },
      readAddress: (context, data) => {
        return WAC330CE.readValveAddress(context, data);
      },
      writeValveAddress: (leftGenerateAddress, data) => {
        return WAC330CE.writeValveAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC330CE.awaken(data);
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
      'exitSelfTest': true,
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
      'readIMEI': 31,
      'exitSelfTest': 33,
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
      'exitSelfTest': 70,
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
      inquireSelfTest: (context, data) => {
        return WAC330HE.inquireSelfTest(context, data);
      },
      writeTemperatureProbesConfig: (context, data) => {
        return WAC330HE.writeTemperatureProbesConfig(context, data);
      },
      meterEnterVerificationStatus: (data) => {
        return WAC330HE.meterVerificationStatusEnter(data);
      },
      meterReturnVerificationStatus: (data) => {
        return WAC330HE.meterVerificationStatusExit(data);
      },
      meterSettingDate: (data) => {
        return WAC330HE.meterSetTime(data);
      },
      // meterReadAddress: (context, data) => {
      // return decodeCheckMeterReadAddressWAC330HE(context, data);
      // },
      meterWriteAddress: (context, data) => {
        return WAC330HE.writeMeterAddress(context, data);
      },
      readData: (context, data) => {
        return WAC330HE.readData(context, data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC330HE.readSelfTestStatus(context, data);
      },
      readICCID: (context, data) => {
        return WAC330HE.readICCID(context, data);
      },
      readIMEI: (context, data) => {
        return WAC330HE.readIMEI(context, data);
      },
      readAddress: (context, data) => {
        return WAC330HE.readValveAddress(context, data);
      },
      writeValveAddress: (leftGenerateAddress, data) => {
        return WAC330HE.writeValveAddress(leftGenerateAddress, data);
      },
      awaken: (data) => {
        return WAC330HE.awaken(data);
      },
    },
  },
  'WAC730C': {
    protocolCode: `EN1434_0187`,
    model: 85,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'selfTest': true,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readSelfTestStatus': true,
      'exitSelfTest': true,
      'readAddress': false,
      'writePressureProbesConfig': true,
      'writeTemperatureProbesConfig': true,
      'readVersion': false,
      'readSelfTestStatus2': true,
      'awaken': false,
    },
    protocolId: 148,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 34,
      'writeAddress': 16,
      'readICCID': 36,
      'readIMEI': 31,
      'readSelfTestStatus': 73,
      'exitSelfTest': 34,
      'readAddress': 21,
      'selfTest': -1,
      'writeTemperatureProbesConfig': 34,
      'writePressureProbesConfig': 34,
      'readVersion': 17,
      'readSelfTestStatus2': 81,
      'awaken': 16,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 34,
      'writeAddress': 16,
      'readICCID': 36,
      'readIMEI': 31,
      'readSelfTestStatus': 73,
      'exitSelfTest': 34,
      'readAddress': 21,
      'selfTest': -1,
      'writeTemperatureProbesConfig': 34,
      'writePressureProbesConfig': 34,
      'readVersion': 17,
      'readSelfTestStatus2': 81,
      'awaken': 16,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return WAC730C.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return WAC730C.readSelfTestStatus(context, data);
      },
      readIMEI: (context, data) => {
        return WAC730C.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return WAC730C.readICCID(context, data);
      },
      writeAddress: (leftGenerateAddress, data) => {
        return WAC730C.writeAddress(leftGenerateAddress, data);
      },
      readAddress: (context, data) => {
        return WAC730C.readAddress(context, data);
      },
      exitSelfTest: (data) => {
        return WAC730C.exitSelfTest(data);
      },
      writeTemperatureProbesConfig: (data) => {
        return WAC730C.writeTemperatureProbesConfig(data);
      },
      writePressureProbesConfig: (data) => {
        return WAC730C.writePressureProbesConfig(data);
      },
      readVersion: (context, data) => {
        return WAC730C.readVersion(context, data);
      },
      readSelfTestStatus2: (context, data) => {
        return WAC730C.readSelfTestStatus2(context, data);
      },
      awaken: (data) => {
        return WAC730C.awaken(data);
      },
    },
  },
  'PTC100-4-20MA': {
    protocolCode: null,
    model: null,  /*1移动|6电信*/
    joinMode: null,/*2移动|8电信*/
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': true,
      'selfTest': true,
      'readSelfTestStatus': false,
      'zeroMpaDemarcate': false,
      'readPressureGaugePressure': false,
      'onePointSixMpaDemarcate': false,
      'readDevicePressure': false,
      'deviceOutputs4mA': false,
      'readTemperatureCurrent': false,
      'temperatureChannelCalibrated4mA': false,
      'deviceOutputs20mA': false,
      'temperatureChannelCalibrated20mA': false,
      'deviceOutputs12mA': false,
      'readPressureCurrent': false,
      'pressureChannelCalibrated4mA': false,
      'pressureChannelCalibrated20mA': false,
    },
    protocolId: 122,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 16,
      'selfTest': -1,
      'readSelfTestStatus': 56,
      'zeroMpaDemarcate': 9,
      'readPressureGaugePressure': 9,
      'onePointSixMpaDemarcate': 9,
      'readDevicePressure': 9,
      'deviceOutputs4mA': 9,
      'readTemperatureCurrent': 9,
      'temperatureChannelCalibrated4mA': 9,
      'deviceOutputs20mA': 9,
      'temperatureChannelCalibrated20mA': 9,
      'deviceOutputs12mA': 9,
      'readPressureCurrent': 9,
      'pressureChannelCalibrated4mA': 9,
      'pressureChannelCalibrated20mA': 9,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 32,
      'selfTest': -1,
      'readSelfTestStatus': 72,
      'zeroMpaDemarcate': 23,
      'readPressureGaugePressure': 9,
      'onePointSixMpaDemarcate': 23,
      'readDevicePressure': 17,
      'deviceOutputs4mA': 17,
      'readTemperatureCurrent': 9,
      'temperatureChannelCalibrated4mA': 19,
      'deviceOutputs20mA': 17,
      'temperatureChannelCalibrated20mA': 19,
      'deviceOutputs12mA': 17,
      'readPressureCurrent': 9,
      'pressureChannelCalibrated4mA': 19,
      'pressureChannelCalibrated20mA': 19,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return PTC100420MA.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return PTC100420MA.readSelfTestStatus(context, data);
      },
      exitSelfTest: (data) => {
        return PTC100420MA.exitSelfTest(data);
      },

      zeroMpaDemarcate: (context, data) => {
        return PTC100420MA.zeroMpaDemarcate(context, data);
      },
      readPressureGaugePressure: (context, data) => {
        return PTC100420MA.readVoltmeter(data, context);
      },
      onePointSixMpaDemarcate: (context, data) => {
        return PTC100420MA.onePointSixMpaDemarcate(data, context);
      },
      readDevicePressure: (context, data) => {
        return PTC100420MA.readDevicePressure(data, context);
      },
      deviceOutputs4mA: (context, data) => {
        return PTC100420MA.deviceOutputs4mA(data);
      },
      readTemperatureCurrent: (context, data) => {
        return PTC100420MA.readTemperatureGaugeCurrent(data, context);
      },
      temperatureChannelCalibrated4mA: (context, data) => {
        return PTC100420MA.calibrateTemperatureChannel4mA(data, context);
      },
      deviceOutputs20mA: (context, data) => {
        return PTC100420MA.deviceOutputs20mA(data);
      },
      temperatureChannelCalibrated20mA: (context, data) => {
        return PTC100420MA.calibrateTemperatureChannel20mA(data, context);
      },
      deviceOutputs12mA: (context, data) => {
        return PTC100420MA.deviceOutputs12mA(data, context);
      },
      readPressureCurrent: (context, data) => {
        return PTC100420MA.readPressureGaugeCurrent(data, context);
      },
      pressureChannelCalibrated4mA: (context, data) => {
        return PTC100420MA.calibratePressureChannel4mA(data, context);
      },
      pressureChannelCalibrated20mA: (context, data) => {
        return PTC100420MA.calibratePressureChannel20mA(data, context);
      }

    },
  },
  'PTC100-RS485': {
    protocolCode: null,
    model: null,  /*1移动|6电信*/
    joinMode: null,/*2移动|8电信*/
    isInfraredDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'zeroMpaDemarcate': false,
      'readPressureGaugePressure': false,
      'onePointSixMpaDemarcate': false,
      'readDevicePressure': false,
      'readTemperature': false,
    },
    protocolId: 122,
    deviceActionResponseMessageLength: {
      'inquireSelfTest': 20,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'zeroMpaDemarcate': 13,
      'readPressureGaugePressure': 13,
      'onePointSixMpaDemarcate': 13,
      'readDevicePressure': 13,
      'readTemperature': 13,
    },
    deviceActionResponseMessageLength2: {
      'inquireSelfTest': 20,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'zeroMpaDemarcate': 13,
      'readPressureGaugePressure': 13,
      'onePointSixMpaDemarcate': 13,
      'readDevicePressure': 13,
      'readTemperature': 13,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      inquireSelfTest: (data) => {
        return PTC100RS485.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return PTC100RS485.readSelfTestStatus(context, data);
      },
      exitSelfTest: (data) => {
        return PTC100RS485.exitSelfTest(data);
      },
      zeroMpaDemarcate: (context, data) => {
        return PTC100RS485.zeroMpaDemarcate(context, data);
      },
      readPressureGaugePressure: (context, data) => {
        return PTC100RS485.readVoltmeter(data, context);
      },
      onePointSixMpaDemarcate: (context, data) => {
        return PTC100RS485.onePointSixMpaDemarcate(data, context);
      },
      readDevicePressure: (context, data) => {
        return PTC100RS485.readDevicePressure(data, context);
      },
      // readTemperature:(context,data) => {
      //   return decodeReadTemperature(data,context);
      // },


    }

  },

  'PTC100-CAT1': {
    protocolCode: 'EN1434_0142',
    model: 62,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'zeroMpaDemarcate': false,
      'readPressureGaugePressure': false,
      'onePointSixMpaDemarcate': false,
      'readDevicePressure': false,
      'inquireSelfTest': false,
      'selfTest': false,
      'readSelfTestStatus': false,
      'readIMEI':false,
      'readICCID':false,
      'writeAddress':false,
      'exitSelfTest':false,
      'readAddress':false,
      'readTemperature': false,
    },
    protocolId: 122,
    deviceActionResponseMessageLength: {
      'zeroMpaDemarcate': 13,
      'readPressureGaugePressure': 13,
      'onePointSixMpaDemarcate': 13,
      'readDevicePressure': 13,
      'inquireSelfTest': 20,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'readIMEI':35,
      'readICCID':40,
      'writeAddress':20,
      'exitSelfTest':20,
      'readAddress':25,
      'readTemperature': 13,
    },
    deviceActionResponseMessageLength2: {
      'zeroMpaDemarcate': 13,
      'readPressureGaugePressure': 13,
      'onePointSixMpaDemarcate': 13,
      'readDevicePressure': 13,
      'inquireSelfTest': 20,
      'selfTest': -1,
      'readSelfTestStatus': 59,
      'readIMEI':35,
      'readICCID':40,
      'writeAddress':20,
      'exitSelfTest':20,
      'readAddress':25,
      'readTemperature': 13,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      zeroMpaDemarcate: (context, data) => {
        return PTC100CAT1.zeroMpaDemarcate(context, data);
      },
      readPressureGaugePressure: (context, data,isInspection) => {
        return PTC100CAT1.readPressureGaugePressure(data, context,isInspection);
      },
      onePointSixMpaDemarcate: (context, data) => {
        return PTC100CAT1.onePointSixMpaDemarcate(context,data);
      },
      readDevicePressure: (context, data) => {
        return PTC100CAT1.readDevicePressure(data, context);
      },
      inquireSelfTest: (data) => {
        return PTC100CAT1.inquireSelfTest(data);
      },
      readSelfTestStatus: (context, data) => {
        return PTC100CAT1.readSelfTestStatus(context, data);
      },

      readIMEI: (context, data) => {
        return PTC100CAT1.readIMEI(context, data);
      },
      readICCID: (context, data) => {
        return PTC100CAT1.readICCID(context, data);
      },
      writeAddress: (context, data) => {
        return PTC100CAT1.writeAddress(context, data);
      },
      exitSelfTest: (data) => {
        return PTC100CAT1.exitSelfTest(data);
      },
      readAddress: (context,data) => {
        return PTC100CAT1.readAddress(context,data);
      },

      // readTemperature:(context,data) => {
      //   return decodeReadTemperature(data,context);
      // },


    }

  },
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC200P': {
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC130-4/20mA': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writePowerOffAndWirelessError': false,
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
      'readCurrentAmmeterInputLoop': false,
      'readCurrentAmmeterOutputLoop': false,
      'writesActualInputCurrentValue4MA': false,
      'writesActualInputCurrentValue20MA': false,
      'writeFixedOutput4MA': false,
      'writeFixedOutput20MA': false,
      'output4MAActualCurrentValueCalibration': false,
      'output20MAActualCurrentValueCalibration': false,
      'deviceReadsCurrent': false,
      'writeWorkChannel0-10V': false,
      'writeWorkChannel1-10V': false,
      'writeWorkChannel4-20mA': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writePowerOffAndWirelessError': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'writeForcedTemperatureSetting': 19,
      'writesActualInputCurrentValue4MA': 23,
      'writesActualInputCurrentValue20MA': 23,
      'writeFixedOutput4MA': 20,
      'writeFixedOutput20MA': 20,
      'output4MAActualCurrentValueCalibration': 23,
      'output20MAActualCurrentValueCalibration': 23,
      'deviceReadsCurrent': 19,
      'signalSourceOutput': 8,
      'readCurrentAmmeterInputLoop': 9,
      'readCurrentAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 19,
      'writeWorkChannel1-10V': 19,
      'writeWorkChannel4-20mA': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 38,
      'writePowerOffAndWirelessError': 39,
      'writeAllConfig': 66,
      'writeForcedTemperatureSetting': 44,
      'readVersion': 39,
      'fullOpenCalibration': 41,
      'fullOffCalibration': 41,
      'writeAddress': 45,
      'writesActualInputCurrentValue4MA': 45,
      'writesActualInputCurrentValue20MA': 45,
      'writeFixedOutput4MA': 39,
      'writeFixedOutput20MA': 39,
      'output4MAActualCurrentValueCalibration': 42,
      'output20MAActualCurrentValueCalibration': 42,
      'deviceReadsCurrent': 42,
      'signalSourceOutput': 8,
      'readCurrentAmmeterInputLoop': 9,
      'readCurrentAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 39,
      'writeWorkChannel1-10V': 39,
      'writeWorkChannel4-20mA': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },

      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      readCurrentAmmeterInputLoop: (data, context) => {
        return VAC130.readCurrentAmmeterInputLoop(data, context);
      },
      readCurrentAmmeterOutputLoop: (data, context) => {
        return VAC130.readCurrentAmmeterInputLoop(data, context);
      },
      writesActualInputCurrentValue4MA: (data) => {
        return VAC130.writesActualInputCurrentValue4MA(data);
      },
      writesActualInputCurrentValue20MA: (data) => {
        return VAC130.writesActualInputCurrentValue20MA(data);
      },
      writeFixedOutput4MA: (data) => {
        return VAC130.writeFixedOutput4MA(data);
      },
      writeFixedOutput20MA: (data) => {
        return VAC130.writeFixedOutput20MA(data);
      },
      output4MAActualCurrentValueCalibration: (data) => {
        return VAC130.output4MAActualCurrentValueCalibration(data);
      },
      output20MAActualCurrentValueCalibration: (data) => {
        return VAC130.output20MAActualCurrentValueCalibration(data);
      },
      deviceReadsCurrent: (data, context) => {
        return VAC130.deviceReadsCurrent(data, context);
      },
      signal4MASourceOutput: (data) => {
        return VAC130.signal4MASourceOutput(data)
      },
      signal12MASourceOutput: (data) => {
        return VAC130.signal12MASourceOutput(data)
      },
      signal20MASourceOutput: (data) => {
        return VAC130.signal20MASourceOutput(data)
      },
      writeWorkChannel010V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel110V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel420mA: (data) => {
        return VAC130.writeWorkChannel(data)
      },
    },
    preprocess: {
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },

    },
  },
  'VAC130H-4/20mA': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writePowerOffAndWirelessError': false,
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
      'readCurrentAmmeterInputLoop': false,
      'readCurrentAmmeterOutputLoop': false,
      'writesActualInputCurrentValue4MA': false,
      'writesActualInputCurrentValue20MA': false,
      'writeFixedOutput4MA': false,
      'writeFixedOutput20MA': false,
      'output4MAActualCurrentValueCalibration': false,
      'output20MAActualCurrentValueCalibration': false,
      'deviceReadsCurrent': false,
      'writeWorkChannel0-10V': false,
      'writeWorkChannel1-10V': false,
      'writeWorkChannel4-20mA': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writePowerOffAndWirelessError': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'writeForcedTemperatureSetting': 19,
      'writesActualInputCurrentValue4MA': 23,
      'writesActualInputCurrentValue20MA': 23,
      'writeFixedOutput4MA': 20,
      'writeFixedOutput20MA': 20,
      'output4MAActualCurrentValueCalibration': 23,
      'output20MAActualCurrentValueCalibration': 23,
      'deviceReadsCurrent': 19,
      'signalSourceOutput': 8,
      'readCurrentAmmeterInputLoop': 9,
      'readCurrentAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 19,
      'writeWorkChannel1-10V': 19,
      'writeWorkChannel4-20mA': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 38,
      'writePowerOffAndWirelessError': 39,
      'writeAllConfig': 66,
      'writeForcedTemperatureSetting': 44,
      'readVersion': 39,
      'fullOpenCalibration': 41,
      'fullOffCalibration': 41,
      'writeAddress': 45,
      'writesActualInputCurrentValue4MA': 45,
      'writesActualInputCurrentValue20MA': 45,
      'writeFixedOutput4MA': 39,
      'writeFixedOutput20MA': 39,
      'output4MAActualCurrentValueCalibration': 42,
      'output20MAActualCurrentValueCalibration': 42,
      'deviceReadsCurrent': 42,
      'signalSourceOutput': 8,
      'readCurrentAmmeterInputLoop': 9,
      'readCurrentAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 39,
      'writeWorkChannel1-10V': 39,
      'writeWorkChannel4-20mA': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      readCurrentAmmeterInputLoop: (data, context) => {
        return VAC130.readCurrentAmmeterInputLoop(data, context);
      },
      readCurrentAmmeterOutputLoop: (data, context) => {
        return VAC130.readCurrentAmmeterInputLoop(data, context);
      },
      writesActualInputCurrentValue4MA: (data) => {
        return VAC130.writesActualInputCurrentValue4MA(data);
      },
      writesActualInputCurrentValue20MA: (data) => {
        return VAC130.writesActualInputCurrentValue20MA(data);
      },
      writeFixedOutput4MA: (data) => {
        return VAC130.writeFixedOutput4MA(data);
      },
      writeFixedOutput20MA: (data) => {
        return VAC130.writeFixedOutput20MA(data);
      },
      output4MAActualCurrentValueCalibration: (data) => {
        return VAC130.output4MAActualCurrentValueCalibration(data);
      },
      output20MAActualCurrentValueCalibration: (data) => {
        return VAC130.output20MAActualCurrentValueCalibration(data);
      },
      deviceReadsCurrent: (data, context) => {
        return VAC130.deviceReadsCurrent(data, context);
      },
      signal4MASourceOutput: (data) => {
        return VAC130.signal4MASourceOutput(data)
      },
      signal12MASourceOutput: (data) => {
        return VAC130.signal12MASourceOutput(data)
      },
      signal20MASourceOutput: (data) => {
        return VAC130.signal20MASourceOutput(data)
      },
      writeWorkChannel010V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel110V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel420mA: (data) => {
        return VAC130.writeWorkChannel(data)
      },
    },
    preprocess: {
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },

    },
  },
  'VAC130-0/10V': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writePowerOffAndWirelessError': false,
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
      'readVoltageAmmeterInputLoop': false,
      'readVoltageAmmeterOutputLoop': false,
      'writesActualInputVoltageValue1V': false,
      'writesActualInputVoltageValue10V': false,
      'writeFixedOutput1V': false,
      'writeFixedOutput10V': false,
      'output1VActualVoltageValueCalibration': false,
      'output10VActualVoltageValueCalibration': false,
      'deviceReadsVoltage': false,
      'writeWorkChannel0-10V': false,
      'writeWorkChannel1-10V': false,
      'writeWorkChannel4-20mA': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writePowerOffAndWirelessError': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'writeForcedTemperatureSetting': 19,
      'writesActualInputVoltageValue1V': 23,
      'writesActualInputVoltageValue10V': 23,
      'writeFixedOutput1V': 19,
      'writeFixedOutput10V': 19,
      'output1VActualVoltageValueCalibration': 23,
      'output10VActualVoltageValueCalibration': 23,
      'deviceReadsVoltage': 19,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 19,
      'writeWorkChannel1-10V': 19,
      'writeWorkChannel4-20mA': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 38,
      'writePowerOffAndWirelessError': 39,
      'writeAllConfig': 66,
      'writeForcedTemperatureSetting': 44,
      'readVersion': 39,
      'fullOpenCalibration': 41,
      'fullOffCalibration': 41,
      'writeAddress': 45,
      'writesActualInputVoltageValue1V': 45,
      'writesActualInputVoltageValue10V': 45,
      'writeFixedOutput1V': 39,
      'writeFixedOutput10V': 39,
      'output1VActualVoltageValueCalibration': 42,
      'output10VActualVoltageValueCalibration': 42,
      'deviceReadsVoltage': 42,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 39,
      'writeWorkChannel1-10V': 39,
      'writeWorkChannel4-20mA': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },

      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      readVoltageAmmeterInputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      readVoltageAmmeterOutputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      writesActualInputVoltageValue1V: (data, context) => {
        return VAC130.writesActualInputVoltageValue1V(data, context);
      },
      writesActualInputVoltageValue10V: (data, context) => {
        return VAC130.writesActualInputVoltageValue10V(data, context);
      },
      writeFixedOutput1V: (data) => {
        return VAC130.writeFixedOutput1V(data);
      },
      writeFixedOutput10V: (data) => {
        return VAC130.writeFixedOutput10V(data);
      },
      output1VActualVoltageValueCalibration: (data) => {
        return VAC130.output1VActualVoltageValueCalibration(data);
      },
      output10VActualVoltageValueCalibration: (data) => {
        return VAC130.output10VActualVoltageValueCalibration(data);
      },
      deviceReadsVoltage: (data, context) => {
        return VAC130.deviceReadsVoltage(data, context);
      },
      signal1VSourceOutput: (data) => {
        return VAC130.signal1VSourceOutput(data)
      },
      signal5VSourceOutput: (data) => {
        return VAC130.signal5VSourceOutput(data)
      },
      signal10VSourceOutput: (data) => {
        return VAC130.signal10VSourceOutput(data)
      },
      writeWorkChannel010V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel110V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel420mA: (data) => {
        return VAC130.writeWorkChannel(data)
      },
    },
    preprocess: {
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },

    },
  },
  'VAC130H-0/10V': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writePowerOffAndWirelessError': false,
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
      'readVoltageAmmeterInputLoop': false,
      'readVoltageAmmeterOutputLoop': false,
      'writesActualInputVoltageValue1V': false,
      'writesActualInputVoltageValue10V': false,
      'writeFixedOutput1V': false,
      'writeFixedOutput10V': false,
      'output1VActualVoltageValueCalibration': false,
      'output10VActualVoltageValueCalibration': false,
      'deviceReadsVoltage': false,
      'writeWorkChannel0-10V': false,
      'writeWorkChannel1-10V': false,
      'writeWorkChannel4-20mA': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writePowerOffAndWirelessError': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'writeForcedTemperatureSetting': 19,
      'writesActualInputVoltageValue1V': 23,
      'writesActualInputVoltageValue10V': 23,
      'writeFixedOutput1V': 19,
      'writeFixedOutput10V': 19,
      'output1VActualVoltageValueCalibration': 23,
      'output10VActualVoltageValueCalibration': 23,
      'deviceReadsVoltage': 19,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 19,
      'writeWorkChannel1-10V': 19,
      'writeWorkChannel4-20mA': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 38,
      'writePowerOffAndWirelessError': 39,
      'writeAllConfig': 66,
      'writeForcedTemperatureSetting': 44,
      'readVersion': 39,
      'fullOpenCalibration': 41,
      'fullOffCalibration': 41,
      'writeAddress': 45,
      'writesActualInputVoltageValue1V': 45,
      'writesActualInputVoltageValue10V': 45,
      'writeFixedOutput1V': 39,
      'writeFixedOutput10V': 39,
      'output1VActualVoltageValueCalibration': 42,
      'output10VActualVoltageValueCalibration': 42,
      'deviceReadsVoltage': 42,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 39,
      'writeWorkChannel1-10V': 39,
      'writeWorkChannel4-20mA': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },

      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      readVoltageAmmeterInputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      readVoltageAmmeterOutputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      writesActualInputVoltageValue1V: (data, context) => {
        return VAC130.writesActualInputVoltageValue1V(data, context);
      },
      writesActualInputVoltageValue10V: (data, context) => {
        return VAC130.writesActualInputVoltageValue10V(data, context);
      },
      writeFixedOutput1V: (data) => {
        return VAC130.writeFixedOutput1V(data);
      },
      writeFixedOutput10V: (data) => {
        return VAC130.writeFixedOutput10V(data);
      },
      output1VActualVoltageValueCalibration: (data) => {
        return VAC130.output1VActualVoltageValueCalibration(data);
      },
      output10VActualVoltageValueCalibration: (data) => {
        return VAC130.output10VActualVoltageValueCalibration(data);
      },
      deviceReadsVoltage: (data, context) => {
        return VAC130.deviceReadsVoltage(data, context);
      },
      signal1VSourceOutput: (data) => {
        return VAC130.signal1VSourceOutput(data)
      },
      signal5VSourceOutput: (data) => {
        return VAC130.signal5VSourceOutput(data)
      },
      signal10VSourceOutput: (data) => {
        return VAC130.signal10VSourceOutput(data)
      },
      writeWorkChannel010V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel110V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel420mA: (data) => {
        return VAC130.writeWorkChannel(data)
      },
    },
    preprocess: {
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },

    },
  },
  'VAC130-1/10V': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writePowerOffAndWirelessError': false,
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
      'readVoltageAmmeterInputLoop': false,
      'readVoltageAmmeterOutputLoop': false,
      'writesActualInputVoltageValue1V': false,
      'writesActualInputVoltageValue10V': false,
      'writeFixedOutput1V': false,
      'writeFixedOutput10V': false,
      'output1VActualVoltageValueCalibration': false,
      'output10VActualVoltageValueCalibration': false,
      'deviceReadsVoltage': false,
      'writeWorkChannel0-10V': false,
      'writeWorkChannel1-10V': false,
      'writeWorkChannel4-20mA': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writePowerOffAndWirelessError': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'writeForcedTemperatureSetting': 19,
      'writesActualInputVoltageValue1V': 23,
      'writesActualInputVoltageValue10V': 23,
      'writeFixedOutput1V': 19,
      'writeFixedOutput10V': 19,
      'output1VActualVoltageValueCalibration': 23,
      'output10VActualVoltageValueCalibration': 23,
      'deviceReadsVoltage': 19,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 19,
      'writeWorkChannel1-10V': 19,
      'writeWorkChannel4-20mA': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 38,
      'writePowerOffAndWirelessError': 39,
      'writeAllConfig': 66,
      'writeForcedTemperatureSetting': 44,
      'readVersion': 39,
      'fullOpenCalibration': 41,
      'fullOffCalibration': 41,
      'writeAddress': 45,
      'writesActualInputVoltageValue1V': 45,
      'writesActualInputVoltageValue10V': 45,
      'writeFixedOutput1V': 39,
      'writeFixedOutput10V': 39,
      'output1VActualVoltageValueCalibration': 42,
      'output10VActualVoltageValueCalibration': 42,
      'deviceReadsVoltage': 42,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 39,
      'writeWorkChannel1-10V': 39,
      'writeWorkChannel4-20mA': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },

      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      readVoltageAmmeterInputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      readVoltageAmmeterOutputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      writesActualInputVoltageValue1V: (data, context) => {
        return VAC130.writesActualInputVoltageValue1V(data, context);
      },
      writesActualInputVoltageValue10V: (data, context) => {
        return VAC130.writesActualInputVoltageValue10V(data, context);
      },
      writeFixedOutput1V: (data) => {
        return VAC130.writeFixedOutput1V(data);
      },
      writeFixedOutput10V: (data) => {
        return VAC130.writeFixedOutput10V(data);
      },
      output1VActualVoltageValueCalibration: (data) => {
        return VAC130.output1VActualVoltageValueCalibration(data);
      },
      output10VActualVoltageValueCalibration: (data) => {
        return VAC130.output10VActualVoltageValueCalibration(data);
      },
      deviceReadsVoltage: (data, context) => {
        return VAC130.deviceReadsVoltage(data, context);
      },
      signal1VSourceOutput: (data) => {
        return VAC130.signal1VSourceOutput(data)
      },
      signal5VSourceOutput: (data) => {
        return VAC130.signal5VSourceOutput(data)
      },
      signal10VSourceOutput: (data) => {
        return VAC130.signal10VSourceOutput(data)
      },
      writeWorkChannel010V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel110V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel420mA: (data) => {
        return VAC130.writeWorkChannel(data)
      },
    },
    preprocess: {
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },

    },
  },
  'VAC130H-1/10V': {
    protocolCode: undefined,
    model: undefined,
    joinMode: undefined,
    isInfraredDevice: true,
    isWireDevice: true,
    isDeviceActionTransparentTransmissionProtocol: {
      'readWireDeviceAddress': false,
      'writePowerOffAndWirelessError': false,
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
      'readVoltageAmmeterInputLoop': false,
      'readVoltageAmmeterOutputLoop': false,
      'writesActualInputVoltageValue1V': false,
      'writesActualInputVoltageValue10V': false,
      'writeFixedOutput1V': false,
      'writeFixedOutput10V': false,
      'output1VActualVoltageValueCalibration': false,
      'output10VActualVoltageValueCalibration': false,
      'deviceReadsVoltage': false,
      'writeWorkChannel0-10V': false,
      'writeWorkChannel1-10V': false,
      'writeWorkChannel4-20mA': false,
    },
    protocolId: 70, //hex:46
    deviceActionResponseMessageLength: {
      'readWireDeviceAddress': 19,
      'writePowerOffAndWirelessError': 19,
      'writeAllConfig': 19,
      'readVersion': 20,
      'fullOpenCalibration': 22,
      'fullOffCalibration': 22,
      'writeAddress': 19,
      'writeForcedTemperatureSetting': 19,
      'writesActualInputVoltageValue1V': 23,
      'writesActualInputVoltageValue10V': 23,
      'writeFixedOutput1V': 19,
      'writeFixedOutput10V': 19,
      'output1VActualVoltageValueCalibration': 23,
      'output10VActualVoltageValueCalibration': 23,
      'deviceReadsVoltage': 19,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 19,
      'writeWorkChannel1-10V': 19,
      'writeWorkChannel4-20mA': 19,
    },
    deviceActionResponseMessageLength2: {
      'readWireDeviceAddress': 38,
      'writePowerOffAndWirelessError': 39,
      'writeAllConfig': 66,
      'writeForcedTemperatureSetting': 44,
      'readVersion': 39,
      'fullOpenCalibration': 41,
      'fullOffCalibration': 41,
      'writeAddress': 45,
      'writesActualInputVoltageValue1V': 45,
      'writesActualInputVoltageValue10V': 45,
      'writeFixedOutput1V': 39,
      'writeFixedOutput10V': 39,
      'output1VActualVoltageValueCalibration': 42,
      'output10VActualVoltageValueCalibration': 42,
      'deviceReadsVoltage': 42,
      'signalSourceOutput': 8,
      'readVoltageAmmeterInputLoop': 9,
      'readVoltageAmmeterOutputLoop': 9,
      'writeWorkChannel0-10V': 39,
      'writeWorkChannel1-10V': 39,
      'writeWorkChannel4-20mA': 39,
    },
    portAttribute: {
      parity: '偶校验',
      dataBits: 8,
      baudRate: 2400,
      stopBits: 1
    },
    validateResponse: {
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },

      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      readVoltageAmmeterInputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      readVoltageAmmeterOutputLoop: (data, context) => {
        return VAC130.readVoltageAmmeterInputLoop(data, context);
      },
      writesActualInputVoltageValue1V: (data, context) => {
        return VAC130.writesActualInputVoltageValue1V(data, context);
      },
      writesActualInputVoltageValue10V: (data, context) => {
        return VAC130.writesActualInputVoltageValue10V(data, context);
      },
      writeFixedOutput1V: (data) => {
        return VAC130.writeFixedOutput1V(data);
      },
      writeFixedOutput10V: (data) => {
        return VAC130.writeFixedOutput10V(data);
      },
      output1VActualVoltageValueCalibration: (data) => {
        return VAC130.output1VActualVoltageValueCalibration(data);
      },
      output10VActualVoltageValueCalibration: (data) => {
        return VAC130.output10VActualVoltageValueCalibration(data);
      },
      deviceReadsVoltage: (data, context) => {
        return VAC130.deviceReadsVoltage(data, context);
      },
      signal1VSourceOutput: (data) => {
        return VAC130.signal1VSourceOutput(data)
      },
      signal5VSourceOutput: (data) => {
        return VAC130.signal5VSourceOutput(data)
      },
      signal10VSourceOutput: (data) => {
        return VAC130.signal10VSourceOutput(data)
      },
      writeWorkChannel010V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel110V: (data) => {
        return VAC130.writeWorkChannel(data)
      },
      writeWorkChannel420mA: (data) => {
        return VAC130.writeWorkChannel(data)
      },
    },
    preprocess: {
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      writeTargetAdjustmentValue: (data) => {
        return wireDeviceCommon.writeTargetAdjustmentValue(data);
      },
      writeCleaningValveCycle: (data) => {
        return wireDeviceCommon.writeCleaningValveCycle(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC100R': {
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      writeTargetAdjustmentValue: (data) => {
        return wireDeviceCommon.writeTargetAdjustmentValue(data);
      },
      writeCleaningValveCycle: (data) => {
        return wireDeviceCommon.writeCleaningValveCycle(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
      },
    },
  },
  'VAC101': {
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
      readWireDeviceAddress: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readAddress(context, data, type, isInfraredDevice);
      },
      writeUpperAndLowerTemperatureLimits: (data) => {
        return wireDeviceCommon.writeUpperAndLowerTemperatureLimits(data);
      },
      writePowerOffAndWirelessError: (data, isInfraredDevice) => {
        return wireDeviceCommon.writePowerOutagesAndWirelessAnomalies(data, isInfraredDevice);
      },
      writeHeatingDate: (data) => {
        return wireDeviceCommon.writeHeatingPeriod(data);
      },
      writeProbesConfig: (data) => {
        return wireDeviceCommon.writeProbeConfiguration(data);
      },
      writeAllConfig: (data, isInfraredDevice) => {
        return wireDeviceCommon.writeAllConfigConfiguration(data, isInfraredDevice);
      },
      readVersion: (context, data, type, isInfraredDevice) => {
        return wireDeviceCommon.readVersionVerify(context, data, type, isInfraredDevice);
      },
      factoryConditionFullyClose: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyClose(data);
      },
      factoryConditionFullyOpen: (data) => {
        return wireDeviceCommon.writeFactoryConditionFullyOpen(data);
      },
      outTemperatureCalibration: (data) => {
        return wireDeviceCommon.outTemperatureCalibration(data);
      },
      inTemperatureCalibration: (data) => {
        return wireDeviceCommon.inTemperatureCalibration(data);
      },
      readInAndBackTemperatureVerify: (data, type, context) => {
        return wireDeviceCommon.readInAndBackTemperatureVerify(data, type, context)
      },

      faceplateCommunication: (data) => {
        return wireDeviceCommon.faceplateCommunication(data);
      },
      creditCard: (data) => {
        return wireDeviceCommon.creditCardVerify(data);
      },
      separationAlarm: (data) => {
        return wireDeviceCommon.separationAlarmVerify(data);
      },
      mainAndAuxiliaryValvesVerify: (data) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesVerify(data);
      },
      fullOpenCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationVerify(data, context, isInfraredDevice);
      },
      fullOffCalibration: (data, context, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationVerify(data, context, isInfraredDevice);
      },
      writeAddress: (type, data, context, isInfraredDevice) => {
        return wireDeviceCommon.writeAddressVerify(type, data, context, isInfraredDevice);
      },
      writeForcedTemperatureSetting: (data, isInfraredDevice) => {
        return wireDeviceCommon.forcedTemperatureSetting(data, isInfraredDevice);
      },
      writeTargetAdjustmentValue: (data) => {
        return wireDeviceCommon.writeTargetAdjustmentValue(data);
      },
      writeCleaningValveCycle: (data) => {
        return wireDeviceCommon.writeCleaningValveCycle(data);
      }

    },
    preprocess: {
      readValveState: (data, type, context) => {
        return wireDeviceCommon.readValveState(data, type, context)
      },
      fullOffCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOffCalibrationState(data, context, type, isInfraredDevice)
      },
      fullOpenCalibrationState: (data, context, type, isInfraredDevice) => {
        return wireDeviceCommon.fullOpenCalibrationState(data, context, type, isInfraredDevice)
      },
      panelDetectionLostNormalState: (context, data, type) => {
        return wireDeviceCommon.detectPanelState(context, data, type)
      },
      creditCardState: (context, data, type) => {
        return wireDeviceCommon.creditCardState(context, data, type)
      },
      separationAlarmState: (data, close, context, type) => {
        return wireDeviceCommon.separationAlarmState(data, close, context, type)
      },
      mainAndAuxiliaryValvesState: (data, context, type) => {
        return wireDeviceCommon.mainAndAuxiliaryValvesState(data, context, type)
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
        return DongYuan.readAddress(context, data);
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
        return NBT200.readAddress(context, data);
      },
      readVersion: (context, data, type) => {
        return NBT200.readVersion(context, data, type);
      },
    },
  }

}
