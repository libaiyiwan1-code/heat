import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inTemperatureCalibration(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'bb'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ee'
}
