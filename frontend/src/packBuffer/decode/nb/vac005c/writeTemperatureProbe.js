import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeTemperatureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68
    || dataView.getUint8(4) !== 0x65
    || dataView.getUint8(12) !== 0x84
    || dataView.getUint8(14) !== 0xAC
    || dataView.getUint8(15) !== 0x09
}

