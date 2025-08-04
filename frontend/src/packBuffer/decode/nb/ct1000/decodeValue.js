import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";



export function decodeGetReadOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return Number(dataView.getUint16(30, true)) * 0.01
}


