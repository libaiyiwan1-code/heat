import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function exitSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(49) !== 0x68 ||
    dataView.getUint8(50) !== 0x8B ||
    dataView.getUint8(60) !== 0xDD ||
    dataView.getUint8(61) !== 0XAA
}
