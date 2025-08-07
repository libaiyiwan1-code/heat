import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";


export function decodeGetReadInTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return Number(dataView.getUint16(69, true).toString(16)) * 0.01
}


export function decodeGetReadOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return Number(dataView.getUint16(71, true).toString(16)) * 0.01
}


export function decodeGetTemperatureProbesWAC300NConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64)
}
