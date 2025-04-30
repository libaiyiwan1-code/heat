import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetTorque} from "@/packBuffer/decode/decode";

export function decodeCheckReadTorqueConfigWAC710CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(27) !== 0xAB ||
    dataView.getUint8(28) !== 0x82
  if (!notPass) {
    context.torque = decodeGetTorque(responseMessage)
  }
  return notPass
}
