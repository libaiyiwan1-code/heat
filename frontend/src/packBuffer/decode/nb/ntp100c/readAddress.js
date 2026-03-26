import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeReadAddress} from "@/packBuffer/decode/nb/ntp100c/decodeValue";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80 ||
    dataView.getUint8(26) !== 0X05 ||
    dataView.getUint8(28) !== 0X06
  if (!notPass) {
    context.leftReadAddress = decodeReadAddress(responseMessage, false)
  }
  return notPass
}
