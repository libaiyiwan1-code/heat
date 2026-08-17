import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0x8C || //协议id
    dataView.getUint8(26) !== 0x0c || //fn
    dataView.getUint8(28) !== 0x0a
  if (!notPass) {
    context.readInTemperature = parseFloat((dataView.getUint16(34, true).toString(10) * 0.01).toFixed(2))
    context.readOutTemperature = parseFloat((dataView.getUint16(32, true).toString(10) * 0.01).toFixed(2));
    console.log('进温:', context.readInTemperature, '回温：', context.readOutTemperature)
    context.createLeftSpanMessage(`CTW100读数据成功,进温:${context.readInTemperature}℃,回温:${context.readOutTemperature}℃`, 'grey')
  } else {
    return notPass
  }
  return notPass
}
