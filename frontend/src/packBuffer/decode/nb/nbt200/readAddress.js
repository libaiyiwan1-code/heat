import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeReadAddress} from "@/packBuffer/decode/nb/nbt200/decodeValue";

export function decodeCheckReadAddressNBT200(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X40 ||
    dataView.getUint8(5) !== 0X4B ||
    dataView.getUint8(10) !== 0X05
  if (!notPass) {
    context.leftReadAddress = decodeReadAddress(responseMessage, false)
  }
  return notPass
}
