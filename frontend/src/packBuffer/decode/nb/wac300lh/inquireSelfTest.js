import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16) !== 0x68
    || dataView.getUint8(17) !== 0x78 ||
    dataView.getUint8(25) !== 0x84||
    dataView.getUint8(27) !== 0xDD||
    dataView.getUint8(28) !== 0xF0
}
