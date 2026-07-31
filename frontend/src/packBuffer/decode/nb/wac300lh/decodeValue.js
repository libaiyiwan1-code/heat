import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";


export function decodeGetReadInTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return (parseInt(dataView.getUint16(35, true).toString(16), 10) * 0.01).toFixed(2);
}


export function decodeGetReadOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return (parseInt(dataView.getUint16(37, true).toString(16), 10) * 0.01).toFixed(2)
}


