import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X40 ||
    dataView.getUint8(5) !== 0X4B ||
    dataView.getUint8(10) !== 0X05
  if (!notPass) {
    context.leftReadAddress = geAddress(responseMessage, false)
  }
  return notPass
}

export function geAddress(responseMessage, isCover) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return    dataView.getUint32(21, false)
      .toString(16)
      .padStart(8, '0')
}
