import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x48 ||
    dataView.getUint8(26) !== 0x05 ||
    dataView.getUint8(28) !== 0x06
  if (!notPass) {
    responseMessage = responseMessage.replace(/\s/g, '');
    let messageBuffer = hex2arrayBuffer(responseMessage);
    let dataView = new DataView(messageBuffer)
    context.leftReadAddress = dataView.getUint32(31, false)
      .toString(16)
      .padStart(8, '0')
  }
  return notPass
}
