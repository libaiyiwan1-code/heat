import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeCheckAwakenWAC300NH(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80||
    dataView.getUint8(21) !== 0X47
}
