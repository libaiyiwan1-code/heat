import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readBatteryVoltage(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0x6d || //协议id
    dataView.getUint8(26) !== 0x05 || //fn
    dataView.getUint8(28) !== 0x0a  //afn
  if (!notPass) {
    console.warn('解析电池电压:', dataView.getUint16(30, true) * 0.01)
    context.deviceBatteryVoltage = dataView.getUint16(30, true) * 0.01
    context.createLeftSpanMessage('读取电池电压值:' + context.deviceBatteryVoltage + 'V', 'grey')
  } else {
    return notPass
  }
  return notPass
}
