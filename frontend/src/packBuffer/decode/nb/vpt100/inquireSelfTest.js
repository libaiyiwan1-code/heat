import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x51
    || dataView.getUint8(10) !== 0xF0
    || dataView.getUint8(12) !== 0x01
}
