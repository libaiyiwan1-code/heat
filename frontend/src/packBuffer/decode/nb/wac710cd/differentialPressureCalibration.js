import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function calibratedLowerLimit4mA(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x8D ||
    dataView.getUint8(27) !== 0xBB ||
    dataView.getUint8(28) !== 0xCC
  if (!notPass) {
    context.lowerLimitOf4mACalibratedADValue = decodeGetLowerLimitOf4mACalibratedADValue(responseMessage)
  }
  return notPass
}


export function calibratedUpperLimit20mA(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x8D ||
    dataView.getUint8(27) !== 0xBB ||
    dataView.getUint8(28) !== 0xCC
  if (!notPass) {
    context.upperLimitOf20mACalibratedADValue = decodeGetUpperLimitOf20mACalibratedADValue(responseMessage)
  }
  return notPass
}
export function openPower(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x8D ||
    dataView.getUint8(27) !== 0xBB ||
    dataView.getUint8(28) !== 0xCC
  if (!notPass) {
    context.upperLimitOf20mACalibratedADValue = decodeGetUpperLimitOf20mACalibratedADValue(responseMessage)
  }
  return notPass
}


export function decodeGetLowerLimitOf4mACalibratedADValue(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint16(30, true)
}


export function decodeGetUpperLimitOf20mACalibratedADValue(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint16(30, true)
}
