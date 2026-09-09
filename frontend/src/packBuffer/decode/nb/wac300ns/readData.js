import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');
export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(33) !== 0x68
    || dataView.getUint8(36) !== 0x68
    || dataView.getUint8(37) !== 0x80
    || dataView.getUint8(38) !== 0x89
    || dataView.getUint8(43) !== 0x0C
    || dataView.getUint8(45) !== 0x01
    || dataView.getUint8(49) !== 0x68
    || dataView.getUint8(50) !== 0x89
    || dataView.getUint8(60) !== 0x90
    || dataView.getUint8(61) !== 0x20;
  if (!notPass) {
    context.readInTemperature=Number((dataView.getUint16(69, true).toString(16) * 0.01).toFixed(2))
    console.log('WAC300NS 读取进温度：' + context.readInTemperature + '℃')
    Log.info('WAC300NS 读取进温度：' + context.readInTemperature + '℃');
    context.createLeftSpanMessage('WAC300NS 读取进温：' + context.readInTemperature + '℃', 'grey')
    context.readOutTemperature = Number((dataView.getUint16(71, true).toString(16) * 0.01).toFixed(2));
    console.log('WAC300NS 读取回温温度：' + context.readOutTemperature + '℃')
    Log.info('WAC300NS 读取回温温度：' + context.readOutTemperature + '℃');
    context.createLeftSpanMessage('WAC300NS 读取回温：' + context.readOutTemperature + '℃', 'grey')
    context.leftReadAddress= (dataView.getUint32(51,true).toString(16).padStart(0,'8'))
    console.warn('读数据解析地址：',context.leftReadAddress)
  }
  return notPass
}

