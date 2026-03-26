import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeCleaningValveCycle(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(14) !== 0xa0 ||
    dataView.getUint8(15) !== 0x2c
}
