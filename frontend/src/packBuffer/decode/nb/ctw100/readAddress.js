import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(26) !== 0X05 ||
    dataView.getUint8(28) !== 0X06
  if (!notPass) {
    responseMessage = responseMessage.replace(/\s/g, '');
    let messageBuffer = hex2arrayBuffer(responseMessage);
    let dataView = new DataView(messageBuffer)
    context.leftReadAddress =
      dataView.getUint32(22, false)
        .toString(16)
        .padStart(8, '0')
  }
  return notPass
}
