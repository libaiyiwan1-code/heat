import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(18) !== 0x68
  ||dataView.getUint8(19) !== 0x78
  ||dataView.getUint8(27) !== 0x84
    || dataView.getUint8(29) !== 0xAC
    || dataView.getUint8(30) !== 0x09
}
