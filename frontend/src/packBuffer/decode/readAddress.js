import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetICCID, decodeReadAddress} from "@/packBuffer/decode/decode";
export function decodeCheckReadAddressWAC230CF(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass = dataView.getUint8(16) !== 0x68 || dataView.getUint8(19) !== 0x68 || dataView.getUint8(20) !== 0x80 || dataView.getUint8(21) !== 0x8B
    || dataView.getUint8(26) !== 0x05 || dataView.getUint8(28) !== 0x06
  if (!notPass) {
    context.leftReadAddress = decodeReadAddress(responseMessage,false,true)
  }
  return notPass
}



export function decodeCheckReadAddressWAC710CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(10) !== 0x05 ||
    dataView.getUint8(12) !== 0x06
  if (!notPass) {
    context.leftReadAddress = decodeReadAddress(responseMessage,false,false)
  }
  return notPass
}



