import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";


export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68
    || dataView.getUint8(3) !== 0x68
    || dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x60
    || dataView.getUint8(10) !== 0x0c
    || dataView.getUint8(11) !== 0xff
    || dataView.getUint8(12) !== 0x01
    || dataView.getUint8(19) !== 0x68
    || dataView.getUint8(20) !== 0x60
    || dataView.getUint8(28) !== 0x81
    || dataView.getUint8(30) !== 0x90
    || dataView.getUint8(31) !== 0x20;
  if (!notPass) {
    context.readInTemperature = decodeGetReadInTemperature(responseMessage)
    context.readOutTemperature = decodeGetReadOutTemperature(responseMessage)
    console.warn('VAC710 读取进温度：', context.readInTemperature, '℃');
    console.warn('VAC710 读取回温度：', context.readOutTemperature, '℃');
  }
  return notPass
}


export function decodeGetReadInTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return Number(dataView.getUint16(53, true) ) * 0.01
}


export function decodeGetReadOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return Number(dataView.getUint16(55, true) ) * 0.01
}
