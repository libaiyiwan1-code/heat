import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {decodeGetProtocolId} from "@/packBuffer/decode/decode";

export function notHasSelfTestCompletedWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) === 0XFF || dataView.getUint8(54) === 0X00;
}


export function getDeviceProtocolIdWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16)
}

export function decodeGetNetProviderWAC710CD(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeGetVersionWAC710CD(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(57).toString(16), 16)
}

export function decodeCheckEEPWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) === 0x00 || dataView.getUint8(58) === 0xFF;

}

export function decodeCheckNetworkWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) === 0x00 || dataView.getUint8(59) === 0xFF;

}

export function decodeCheckMinimumValveOpeningWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) === 0x00 || dataView.getUint8(60) === 0xFF;

}

export function decodeCheckMaximumValveOpeningWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) === 0x00 || dataView.getUint8(61) === 0xFF;

}

export function decodeCheckOutTemperatureCalibrationWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) === 0x00 || dataView.getUint8(62) === 0xFF;

}

export function decodeCheckInTemperatureCalibrationWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) === 0x00 || dataView.getUint8(63) === 0xFF;

}

export function decodeCheckVoltageWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) === 0x00 || dataView.getUint8(64) === 0xFF;

}

export function decodeCheckBarometricPressureSensorWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) === 0x00 || dataView.getUint8(65) === 0xFF;

}

export function decodeCheckInPressureWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66) === 0x00 || dataView.getUint8(66) === 0xFF;

}

export function decodeCheckOutPressureWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(67) === 0x00 || dataView.getUint8(67) === 0xFF;

}

export function decodeCheckMagneticSensorsWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(68) === 0x00 || dataView.getUint8(68) === 0xFF;

}

export function decodeCheckOutTemperatureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(69) === 0x00 || dataView.getUint8(69) === 0xFF;

}

export function decodeCheckInTemperatureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(70) === 0x00 || dataView.getUint8(70) === 0xFF;

}

export function decodeCheckOutPressureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(71) === 0x00 || dataView.getUint8(71) === 0xFF;

}

export function decodeCheckInPressureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(72) === 0x00 || dataView.getUint8(72) === 0xFF;

}
export function decodeReadSelfTestAddressWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16) ;

}
export function decodeGetProductNameWAC710CD(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 30; i <= 53; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}
