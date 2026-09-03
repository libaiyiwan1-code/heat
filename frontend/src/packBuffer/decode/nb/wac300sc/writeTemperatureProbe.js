import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeTemperatureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(35) !== 0X68 ||
    dataView.getUint8(38) !== 0X68 ||
    dataView.getUint8(39) !== 0X80 ||
    dataView.getUint8(40) !== 0X9B ||
    dataView.getUint8(62) !== 0XAC ||
    dataView.getUint8(63) !== 0X09
}
