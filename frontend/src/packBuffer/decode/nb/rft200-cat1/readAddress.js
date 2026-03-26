import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(18) !== 0x68 ||
    dataView.getUint8(21) !== 0x68 ||
    dataView.getUint8(22) !== 0x80 ||
    dataView.getUint8(23) !== 0x7F ||
    dataView.getUint8(30) !== 0x05 ||
    dataView.getUint8(32) !== 0x06
  if (!notPass) {
    context.leftReadAddress = this.decodeReadAddressStr(responseMessage)
  }
  return notPass
}


export function decodeReadAddressStr(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  let result = '';
  for (let i = 24; i < 30; i++) {
    result += dataView.getUint8(i).toString(16).padStart(2, '0');
  }
  return result;
}
