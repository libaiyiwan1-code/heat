import {hex2arrayBuffer, hexToFloat} from "@/packBuffer/common/comUtil";

export function decodeGetDifferentialPressure(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return hexToFloat(dataView.getUint32(30, true).toString(16).padStart(8,'0'))
}


export function decodeGetReadInTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint16(50, true) * 0.01
}


export function decodeGetReadOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint16(52, true) * 0.01
}


export function decodeGetTemperatureProbesWAC710CDConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(31)
}

export function decodeGetPressureProbesWAC710CDConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(30)
}

