import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writePressureProbesConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(34) !== 0X68 ||
    dataView.getUint8(37) !== 0X68 ||
    dataView.getUint8(38) !== 0X80||
    dataView.getUint8(39) !== 0X96 ||
    dataView.getUint8(50) !== 0X68 ||
    dataView.getUint8(51) !== 0X96 ||
    dataView.getUint8(61) !== 0XAC ||
    dataView.getUint8(62) !== 0X90
}
