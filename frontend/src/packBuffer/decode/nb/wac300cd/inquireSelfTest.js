import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(37) !== 0x80
    || dataView.getUint8(38) !== 0x8E
    || dataView.getUint8(60) !== 0xDD
    || dataView.getUint8(61) !== 0xF0
}
