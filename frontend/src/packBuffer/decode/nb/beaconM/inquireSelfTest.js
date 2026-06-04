import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(4) !== 0x40
    || dataView.getUint8(5) !== 0x96
    || dataView.getUint8(10) !== 0x0c
    || dataView.getUint8(11) !== 0xff
    || dataView.getUint8(33) !== 0x68
    || dataView.getUint8(36) !== 0x68
    || dataView.getUint8(37) !== 0x80
    || dataView.getUint8(49) !== 0x68
    || dataView.getUint8(50) !== 0x96
    || dataView.getUint8(58) !== 0x84
    || dataView.getUint8(60) !== 0xDD
    || dataView.getUint8(61) !== 0xF0
}
