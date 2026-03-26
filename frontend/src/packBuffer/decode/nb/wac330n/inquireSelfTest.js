import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(33) !== 0X68 ||
    dataView.getUint8(36) !== 0X68 ||
    dataView.getUint8(37) !== 0X80||
    dataView.getUint8(38) !== 0X56 ||
    dataView.getUint8(43) !== 0X0C ||
    dataView.getUint8(45) !== 0X01||
    dataView.getUint8(49) !== 0X68||
    dataView.getUint8(50) !== 0X56||
    dataView.getUint8(58) !== 0X84||
    dataView.getUint8(60) !== 0XDD||
    dataView.getUint8(61) !== 0XF0
}
