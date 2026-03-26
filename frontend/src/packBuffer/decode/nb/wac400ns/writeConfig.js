import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeTemperatureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(35) !== 0x68
    || dataView.getUint8(38) !== 0x68
    || dataView.getUint8(39) !== 0x80
    || dataView.getUint8(38) !== 0x92
    || dataView.getUint8(45) !== 0x0C
    || dataView.getUint8(47) !== 0x01
    || dataView.getUint8(51) !== 0x68
    || dataView.getUint8(52) !== 0x92
    || dataView.getUint8(60) !== 0x84
    || dataView.getUint8(62) !== 0xA0
    || dataView.getUint8(63) !== 0x09;
}

