import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function exitSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return   dataView.getUint8(18) !== 0X68||
    dataView.getUint8(21) !== 0X68||
    dataView.getUint8(22) !== 0X80||
    dataView.getUint8(23) !== 0XF0||
    dataView.getUint8(32) !== 0X14
}
