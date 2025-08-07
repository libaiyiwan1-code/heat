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
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(33) !== 0X68 ||
    dataView.getUint8(36) !== 0X68 ||
    dataView.getUint8(37) !== 0X80||
    dataView.getUint8(38) !== 0X8E ||
    dataView.getUint8(50) !== 0X8E ||
    dataView.getUint8(60) !== 0XDD ||
    dataView.getUint8(61) !== 0XF0
}

export function decodeCheckInquireSelfTestCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80||
    dataView.getUint8(21) !== 0X91 ||
    dataView.getUint8(26) !== 0XF0 ||
    dataView.getUint8(28) !== 0X01
}



export function decodeCheckInquireSelfTestNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return   dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80||
    dataView.getUint8(26) !== 0Xf0||
    dataView.getUint8(28) !== 0X01
}
export function decodeCheckInquireSelfTestWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(33) !== 0X68 ||
    dataView.getUint8(36) !== 0X68 ||
    dataView.getUint8(37) !== 0X80||
    dataView.getUint8(38) !== 0X47 ||
    dataView.getUint8(60) !== 0XDD ||
    dataView.getUint8(61) !== 0XF0
}
export function decodeCheckInquireSelfTestWAC300NH(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(33) !== 0X68 ||
    dataView.getUint8(36) !== 0X68 ||
    dataView.getUint8(37) !== 0X80||
    dataView.getUint8(38) !== 0X47 ||
    dataView.getUint8(60) !== 0XDD ||
    dataView.getUint8(61) !== 0XF0
}
