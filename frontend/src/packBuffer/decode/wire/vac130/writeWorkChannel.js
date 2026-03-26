import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeWorkChannel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0xFE ||
    dataView.getUint8(21) !== 0xFE ||
    dataView.getUint8(22) !== 0xFE ||
    dataView.getUint8(23) !== 0x68 ||
    dataView.getUint8(24) !== 0x46 ||
    dataView.getUint8(32) !== 0x84 ||
    dataView.getUint8(33) !== 0x03 ||
    dataView.getUint8(34) !== 0xCC ||
    dataView.getUint8(35) !== 0x01
}
