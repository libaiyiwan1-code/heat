import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writesActualInputCurrentValue20MA(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(42) !== 0x01
}
