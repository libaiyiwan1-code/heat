import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(22) !== 0x80
    || dataView.getUint8(23) !== 0x8C
}
