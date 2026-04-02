import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeTemperatureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x68
    || dataView.getUint8(3) !== 0x68
    || dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x60
    || dataView.getUint8(10) !== 0x0c
    || dataView.getUint8(11) !== 0xff
    || dataView.getUint8(12) !== 0x01
    || dataView.getUint8(19) !== 0x68
    || dataView.getUint8(20) !== 0x60
    || dataView.getUint8(28) !== 0x84
    || dataView.getUint8(30) !== 0xAC
    || dataView.getUint8(31) !== 0x09
}

export function writePressureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x68
    || dataView.getUint8(3) !== 0x68
    || dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x60
    || dataView.getUint8(10) !== 0x0c
    || dataView.getUint8(11) !== 0xff
    || dataView.getUint8(12) !== 0x01
    || dataView.getUint8(19) !== 0x68
    || dataView.getUint8(20) !== 0x60
    || dataView.getUint8(28) !== 0x84
    || dataView.getUint8(30) !== 0xAC
    || dataView.getUint8(31) !== 0x90
}
