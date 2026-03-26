import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function deviceOutputs4m(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x00 ||
    dataView.getUint8(1) !== 0x06 ||
    dataView.getUint8(2) !== 0x02 ||
    dataView.getUint8(3) !== 0x10
}


export function readTemperatureCurrent(context,responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(0) !== 0x02 || dataView.getUint8(1) !== 0x03
  context.readCurrentMeterValue = parseFloat(Number(dataView.getUint32(3, false) * 0.001).toFixed(3));
  console.log('电流表读数:', context.readCurrentMeterValue)
  context.createLeftSpanMessage(`电流表读数:${context.readCurrentMeterValue}mA`, 'grey');
  return result
}


export function deviceOutputs20mA(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x00 ||
    dataView.getUint8(1) !== 0x06 ||
    dataView.getUint8(2) !== 0x02||
    dataView.getUint8(3) !== 0x10
}

export function deviceOutputs12mA(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x00 ||
    dataView.getUint8(1) !== 0x06 ||
    dataView.getUint8(2) !== 0x02||
    dataView.getUint8(3) !== 0x20
}


export function device4mACalibrated(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x00 ||
    dataView.getUint8(1) !== 0x06 ||
    dataView.getUint8(2) !== 0x02||
    dataView.getUint8(3) !== 0x16
}
export function device20mACalibrated(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0x00 ||
    dataView.getUint8(1) !== 0x06 ||
    dataView.getUint8(2) !== 0x02||
    dataView.getUint8(3) !== 0x18
}


