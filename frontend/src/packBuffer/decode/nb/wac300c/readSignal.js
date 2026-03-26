import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readSignal(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0x6d || //协议id
    dataView.getUint8(26) !== 0x05 || //fn
    dataView.getUint8(28) !== 0x07  //afn
  if (!notPass) {
    console.warn('解析信号:', dataView.getUint8(30))
    context.deviceSignal = dataView.getUint8(30)
    context.createLeftSpanMessage('读取信号值:' + dataView.getUint8(30), 'grey')
  } else {
    return notPass
  }
  return notPass
}
