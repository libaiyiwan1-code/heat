import {
  decodeCheckInquireSelfTestWAC230CF, decodeCheckInquireSelfTestWAC300CD,
  decodeCheckInquireSelfTestWAC710CD
} from "@/packBuffer/decode/inquireSelfTest";
import {decodeCheckWriteTorqueConfigWAC710CD} from "@/packBuffer/decode/writeTorqueConfig";
import {
  decodeCheckWriteTemperatureProbesConfigWAC300CD,
  decodeCheckWriteTemperatureProbesConfigWAC710CD
} from "@/packBuffer/decode/writeTemperatureProbesConfig";
import {
  decodeCheckReadSelfTestStatusWAC230CF, decodeCheckReadSelfTestStatusWAC300CD,
  decodeCheckReadSelfTestStatusWAC710CD
} from "@/packBuffer/decode/readSelfTestStatus";
import {
  decodeCheckAwakenWAC230CF,
  decodeCheckAwakenWAC300CD,
  decodeCheckAwakenWAC710CD
} from "@/packBuffer/decode/awaken";
import {
  decodeCheckReadIMEIWAC230CF,
  decodeCheckReadIMEIWAC300CD,
  decodeCheckReadIMEIWAC710CD
} from "@/packBuffer/decode/readIMEI";
import {
  decodeCheckReadICCIDWAC230CF,
  decodeCheckReadICCIDWAC300CD,
  decodeCheckReadICCIDWAC710CD
} from "@/packBuffer/decode/readICCID";
import {decodeCheckReadTorqueConfigWAC710CD} from "@/packBuffer/decode/readTorqueConfig";
import {
  decodeCheckWriteAddressWAC230CF,
  decodeCheckWriteAddressWAC300CD,
  decodeCheckWriteAddressWAC710CD
} from "@/packBuffer/decode/writeAddress";
import {decodeCheckWritePressureProbesConfigWAC710CD} from "@/packBuffer/decode/writePressureProbesConfig";
import {decodeCheckReadAddressWAC230CF, decodeCheckReadAddressWAC710CD} from "@/packBuffer/decode/readAddress";


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
      readSelfTestStatus: (context,data) => {
        return decodeCheckReadSelfTestStatusWAC230CF(context,data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC230CF(data);
      },
      writeAddress: (generateAddress,data) => {
        return decodeCheckWriteAddressWAC230CF(generateAddress,data);
      },
      readIMEI: (context,data) => {
        return decodeCheckReadIMEIWAC230CF(context,data);
      },
      readICCID: (context,data) => {
        return decodeCheckReadICCIDWAC230CF(context,data);
      },
      readAddress: (context,data) => {
        return decodeCheckReadAddressWAC230CF(context,data);
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
      'readSelfTestStatus': 78,
      'returnSelfTestStatus': 34,
      'readAddress': 21,
      'selfTest': 99,
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
      readSelfTestStatus: (context,data) => {
        return decodeCheckReadSelfTestStatusWAC710CD(context,data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC710CD(data);
      },
      readIMEI: (context,data) => {
        return decodeCheckReadIMEIWAC710CD(context,data);
      },
      readICCID: (context,data) => {
        return decodeCheckReadICCIDWAC710CD(context,data);
      },
      readTorqueConfig: (context,data) => {
        return decodeCheckReadTorqueConfigWAC710CD(context,data);
      },
      writeAddress: (generateAddress,data) => {
        return decodeCheckWriteAddressWAC710CD(generateAddress,data);
      },
      readAddress: (context,data) => {
        return decodeCheckReadAddressWAC710CD(context,data);
      },
    },
  },
  'WAC300CD': {
    protocolCode: `EN1434_0175`,
    model: 80,
    joinMode: 2,
    isInfraredDevice: false,
    isDeviceActionTransparentTransmissionProtocol: {
      'writeTemperatureProbesConfig': true,
      'awaken': false,
      'inquireSelfTest': true,
      'selfTest': true,
      'writeAddress': false,
      'readICCID': false,
      'readIMEI': false,
      'readTorqueConfig': true,
      'readSelfTestStatus': true,
      'returnSelfTestStatus': true,
      'readAddress': false,
    },
    protocolId: 141,
    deviceActionResponseMessageLength: {
      'writeTemperatureProbesConfig': 99,
      'awaken': 99,
      'inquireSelfTest': 99,
      'writeAddress': 99,
      'readICCID': 99,
      'readIMEI': 99,
      'readTorqueConfig': 99,
      'readSelfTestStatus': 99,
      'returnSelfTestStatus': 99,
      'readAddress': 99,
      'selfTest': 99,
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
      readSelfTestStatus: (data) => {
        return decodeCheckReadSelfTestStatusWAC300CD(data);
      },
      awaken: (data) => {
        return decodeCheckAwakenWAC300CD(data);
      },
      readIMEI: (data) => {
        return decodeCheckReadIMEIWAC300CD(data);
      },
      readICCID: (data) => {
        return decodeCheckReadICCIDWAC300CD(data);
      },
      writeAddress: (data) => {
        return decodeCheckWriteAddressWAC300CD(data);
      }
    },
  },
  'WAC710C': {}
}
