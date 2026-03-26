import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeTemperaturePressureProbe(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return  dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x51
    || dataView.getUint8(10) !== 0x00
    || dataView.getUint8(12) !== 0x01
}
