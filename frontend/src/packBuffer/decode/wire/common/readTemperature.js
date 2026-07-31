import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readInAndBackTemperatureVerify(responseMessage, type, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '1f'
  getInAndOutTemperature(responseMessage, type, context)
  return result
}
export function getInAndOutTemperature(responseMessage, type, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  const inTemperature = (parseInt(dataView.getUint16(23, true).toString(16), 10) * 0.01).toFixed(2);
  const outTemperature = (parseInt(dataView.getUint16(25, true).toString(16), 10) * 0.01).toFixed(2);
  console.log('设备进温：', inTemperature)
  console.log('设备回温：', outTemperature)
  if (type === 'one') {
    context.leftInTemperature = inTemperature;
    context.leftOutTemperature = outTemperature;
  } else {
    context.rightInTemperature = inTemperature;
    context.rightOutTemperature = outTemperature;
  }
}
