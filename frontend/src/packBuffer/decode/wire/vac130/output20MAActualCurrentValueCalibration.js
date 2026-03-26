import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function output20MAActualCurrentValueCalibration(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(23) !== 0xFE ||
    dataView.getUint8(24) !== 0xFE ||
    dataView.getUint8(25) !== 0xFE ||
    dataView.getUint8(26) !== 0x68 ||
    dataView.getUint8(27) !== 0x46 ||
    dataView.getUint8(35) !== 0x84 ||
    dataView.getUint8(36) !== 0x03 ||
    dataView.getUint8(37) !== 0xCC ||
    dataView.getUint8(38) !== 0x04
}

