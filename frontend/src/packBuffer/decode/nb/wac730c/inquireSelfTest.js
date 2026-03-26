import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function inquireSelfTest (responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return  dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80 ||
    dataView.getUint8(5) !== 0X94 ||
    dataView.getUint8(10) !== 0X0C ||
    dataView.getUint8(12) !== 0X01 ||
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(17) !== 0X94 ||
    dataView.getUint8(27) !== 0XDD ||
    dataView.getUint8(28) !== 0XF0

}
