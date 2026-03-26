import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeTargetAdjustmentValue(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(14) !== 0xac ||
    dataView.getUint8(15) !== 0x04
}
