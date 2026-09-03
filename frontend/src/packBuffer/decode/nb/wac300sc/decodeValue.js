import {hex2arrayBuffer,arrayBuffer2Hex} from "@/packBuffer/common/comUtil";


export function decodeGetReadInTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  console.log(dataView.getUint16(105, true).toString(16))
  return parseFloat((Number(dataView.getUint16(105, true).toString(10)) * 0.01).toFixed(2))
}


export function decodeGetReadOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  console.log(dataView.getUint16(107, true).toString(16))
  return parseFloat((Number(dataView.getUint16(107, true).toString(10)) * 0.01).toFixed(2))
}


export function decodeGetTemperatureProbesWAC300SCConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64)
}
