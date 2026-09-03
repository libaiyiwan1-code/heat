import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(6) !== 0x68 ||
    dataView.getUint8(7) !== 0x80 ||
    dataView.getUint8(8) !== 0X7A ||
    dataView.getUint8(13) !== 0XF0||
    dataView.getUint8(15) !== 0X01
}
