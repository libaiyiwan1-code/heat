import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function exitSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
 return dataView.getUint8(33) !== 0x68
    || dataView.getUint8(36) !== 0x68
    || dataView.getUint8(37) !== 0x80
    || dataView.getUint8(38) !== 0x56
    || dataView.getUint8(43) !== 0x0C
    || dataView.getUint8(45) !== 0x01
    || dataView.getUint8(49) !== 0x68
    || dataView.getUint8(50) !== 0x56
    || dataView.getUint8(58) !== 0x84
    || dataView.getUint8(60) !== 0xDD
    || dataView.getUint8(61) !== 0xAA;
}
