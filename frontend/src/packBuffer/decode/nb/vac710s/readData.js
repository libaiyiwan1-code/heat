import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');
export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68
    || dataView.getUint8(3) !== 0x68
    || dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x60
    || dataView.getUint8(10) !== 0x0C
    || dataView.getUint8(12) !== 0x01
    || dataView.getUint8(16) !== 0x68
    || dataView.getUint8(17) !== 0x60
    || dataView.getUint8(25) !== 0x84
    || dataView.getUint8(27) !== 0x90
    || dataView.getUint8(28) !== 0x20;
  if (!notPass) {
    context.readInTemperature=(dataView.getUint16(50, true).toString(16) * 0.01).toFixed(2)
    console.log('WAC400NS 读取进温度：' + context.readInTemperature + '℃')
    Log.info('WAC400NS 读取进温度：' + context.readInTemperature + '℃');
    context.readOutTemperature = (dataView.getUint16(52, true).toString(16) * 0.01).toFixed(2);
    console.log('WAC400NS 读取回温温度：' + context.readOutTemperature + '℃')
    Log.info('WAC400NS 读取回温温度：' + context.readOutTemperature + '℃');
    context.leftReadAddress= (dataView.getUint32(18,true).toString(16).padStart(0,'8'))
    console.warn('读数据解析地址：',context.leftReadAddress)
  }
  return notPass
}

