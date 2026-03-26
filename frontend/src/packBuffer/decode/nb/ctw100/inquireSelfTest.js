import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0x80
    || dataView.getUint8(26) !== 0xF0 ||
    dataView.getUint8(28) !== 0x01
}
