import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeCheckInquireSelfTestWAC230CF(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(33) !== 0X68 ||
    dataView.getUint8(36) !== 0X68 ||
    dataView.getUint8(37) !== 0X80
}


export function decodeCheckInquireSelfTestWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80||
    dataView.getUint8(5) !== 0X8D ||
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(17) !== 0X8D ||
    dataView.getUint8(27) !== 0XDD ||
    dataView.getUint8(28) !== 0XF0
}

export function decodeCheckInquireSelfTestWAC300CD(responseMessage) {

}
