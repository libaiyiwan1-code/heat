import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";


export function writeProbesConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return   dataView.getUint8(18) !== 0X68 ||
    dataView.getUint8(21) !== 0X68 ||
    dataView.getUint8(22) !== 0X80 ||
    dataView.getUint8(28) !== 0x00 ||
    dataView.getUint8(30) !== 0X01
}

