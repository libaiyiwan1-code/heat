import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeReadAddress(responseMessage, isCover ) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(21, isCover).toString(16)
}

export function decodeGetVersion(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  return dataView.getUint8(30);
}
