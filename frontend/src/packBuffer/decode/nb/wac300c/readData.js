import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(33) !== 0x68 ||
    dataView.getUint8(36) !== 0x68 ||
    dataView.getUint8(37) !== 0x80 || //控制域
    dataView.getUint8(38) !== 0x6d || //协议id
    dataView.getUint8(43) !== 0x0c || //fn
    dataView.getUint8(45) !== 0x01 ||
    dataView.getUint8(49) !== 0x68 ||
    dataView.getUint8(50) !== 0x6D ||
    dataView.getUint8(58) !== 0x81 ||
    dataView.getUint8(60) !== 0x90 ||
    dataView.getUint8(61) !== 0x20
  if (!notPass) {
    context.readInTemperature = (dataView.getUint16(67, true).toString(16) * 0.01).toFixed(2)
    context.readOutTemperature = (dataView.getUint16(69, true).toString(16) * 0.01).toFixed(2);
    console.log('进温:', context.readInTemperature, '回温：', context.readOutTemperature)
    context.createLeftSpanMessage(`WAC300C读数据成功,进温:${context.readInTemperature}℃,回温:${context.readOutTemperature}℃`, 'grey')
  } else {
    return notPass
  }
  return notPass
}
