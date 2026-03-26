import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80 ||
    dataView.getUint8(5) !== 0X94 ||
    dataView.getUint8(10) !== 0X05 ||
    dataView.getUint8(12) !== 0X06
  if (!notPass) {
    context.leftReadAddress = decodeReadAddress(responseMessage, false)
    console.log('730解析地址成功', context.leftReadAddress)
  }
  return notPass
}

export function decodeReadAddress(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(15,false).toString(16).padStart(8,'0')
}
