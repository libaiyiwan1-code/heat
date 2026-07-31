import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(33) !== 0X68 ||
    dataView.getUint8(36) !== 0X68 ||
    dataView.getUint8(37) !== 0X80||
    dataView.getUint8(38) !== 0X8B||
    dataView.getUint8(49) !== 0X68||
    dataView.getUint8(50) !== 0X8B||
    dataView.getUint8(58) !== 0X84||
    dataView.getUint8(60) !== 0Xdd||
    dataView.getUint8(61) !== 0Xf0
}
