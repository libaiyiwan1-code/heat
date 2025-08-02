import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeCheckWriteTemperatureProbesConfigWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80||
    dataView.getUint8(5) !== 0X8D ||
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(17) !== 0X8D ||
    dataView.getUint8(27) !== 0XAC ||
    dataView.getUint8(28) !== 0X09
}
export function decodeCheckWriteTemperatureProbesConfigWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(35) !== 0X68 ||
    dataView.getUint8(38) !== 0X68 ||
    dataView.getUint8(39) !== 0X80||
    dataView.getUint8(40) !== 0X8E ||
    dataView.getUint8(52) !== 0X8E ||
    dataView.getUint8(62) !== 0XAC ||
    dataView.getUint8(63) !== 0X09
}
export function decodeCheckWriteProbesConfigNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return   dataView.getUint8(18) !== 0X68 ||
    dataView.getUint8(21) !== 0X68 ||
    dataView.getUint8(22) !== 0X80 ||
    dataView.getUint8(28) !== 0x00 ||
    dataView.getUint8(30) !== 0X01
}
