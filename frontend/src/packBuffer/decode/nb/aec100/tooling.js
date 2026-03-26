import {hex2arrayBuffer, hexToFloat} from "@/packBuffer/common/comUtil";
const Log = require('ee-core/log');

export function signal20MASourceOutput(responseMessage) {
  return responseMessage !== '0106000007D08A66';

}



export function signal12MASourceOutput(responseMessage) {
  return responseMessage !== '0106000004B08ABE';

}



export function signal4MASourceOutput(responseMessage) {
  console.log(responseMessage)
  console.log('responseMessage !== 0106000001908836',responseMessage !== '0106000001908836')
  return responseMessage !== '0106000001908836';

}
export function readCurrentSource(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let current = parseFloat(Number(dataView.getUint16(3, false) / 100).toFixed(3))
  console.log('电流源值读取:', current);
  Log.info('电流源值读取:', current);
  context.createLeftSpanMessage('电流源值读取: ' + current + ' mA')
  context.currentSourceValue = current
  return false
}


export function readCurrentAmmeter(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let current = parseFloat(Number(dataView.getUint32(3, false) / 1000).toFixed(3))
  console.log('电流表读取电流值:', current);
  Log.info('电流表读取电流值:', current);
  context.createLeftSpanMessage('电流表读取电流值: ' + current + ' mA')
  context.ammeterReadCurrentValue = current
  return false
}

export function readDeviceCurrent(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(25) !== 0x84 ||
    dataView.getUint8(27) !== 0xCC ||
    dataView.getUint8(28) !== 0x0D
  if (notPass) {
    return notPass
  }

  let deviceCurrentADValue = dataView.getUint32(30, true).toString(16).padEnd(8, '0')
  console.log('读设备电流ad值:', deviceCurrentADValue)
  let deviceCurrent = hexToFloat(deviceCurrentADValue, false)
  deviceCurrent = Number(deviceCurrent / 1000).toFixed(4)
  console.log('aec100设备电流值:', deviceCurrent)
  context.createLeftSpanMessage('设备电流值: ' + deviceCurrent + ' mA')
  context.aec100DeviceCurrentValue = deviceCurrent
}


export function calibrationCurrent4To20mASuccessful(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17) !== 0x68 ||
    dataView.getUint8(26) !== 0x84 ||
    dataView.getUint8(28) !== 0xCC ||
    dataView.getUint8(29) !== 0x0E

}


export function calibrationCurrent4To20mAError(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17) !== 0x68 ||
    dataView.getUint8(26) !== 0x84 ||
    dataView.getUint8(28) !== 0xCC ||
    dataView.getUint8(29) !== 0x0E

}


export function writesActualOutputCurrentValue4mA(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0x68 ||
    dataView.getUint8(29) !== 0x84 ||
    dataView.getUint8(30) !== 0x03 ||
    dataView.getUint8(31) !== 0xCC ||
    dataView.getUint8(32) !== 0x03

}


export function writesActualOutputCurrentValue20mA(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0x68 ||
    dataView.getUint8(29) !== 0x84 ||
    dataView.getUint8(30) !== 0x03 ||
    dataView.getUint8(31) !== 0xCC ||
    dataView.getUint8(32) !== 0x04

}

export function writesActualInputCurrentValue4mA(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0x68 ||
    dataView.getUint8(29) !== 0x84 ||
    dataView.getUint8(31) !== 0xCC ||
    dataView.getUint8(32) !== 0x09

}


export function writesActualInputCurrentValue20mA(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0x68 ||
    dataView.getUint8(29) !== 0x84 ||
    dataView.getUint8(31) !== 0xCC ||
    dataView.getUint8(32) !== 0x0A

}

export function writeFixedOutput4mA(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17) !== 0x68 ||
    dataView.getUint8(26) !== 0x84 ||
    dataView.getUint8(28) !== 0xCC ||
    dataView.getUint8(29) !== 0x02

}

export function writeFixedOutput20mA(responseMessage ) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17) !== 0x68 ||
    dataView.getUint8(26) !== 0x84 ||
    dataView.getUint8(28) !== 0xCC ||
    dataView.getUint8(29) !== 0x02

}
