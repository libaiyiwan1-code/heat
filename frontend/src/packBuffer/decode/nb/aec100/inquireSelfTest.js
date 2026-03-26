import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(18) !== 0X68 ||
    dataView.getUint8(21) !== 0X68 ||
    dataView.getUint8(22) !== 0X80 || //报文返回控制码
    dataView.getUint8(23) !== 0X95 || //协议id
    dataView.getUint8(30) !== 0XF0 || //FN
    dataView.getUint8(32) !== 0X01 // AFN
}
