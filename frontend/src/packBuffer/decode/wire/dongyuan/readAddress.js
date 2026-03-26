import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0XFE ||
    dataView.getUint8(1) !== 0XFE ||
    dataView.getUint8(2) !== 0XFE ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X55
  if (!notPass) {
    context.leftReadAddress = decodeReadAddress(responseMessage, true)
  }
  return notPass
}


export function decodeReadAddress(responseMessage, isCover ) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return   dataView.getUint32(5, isCover)
      .toString(16)
      .padStart(8, '0')
}
