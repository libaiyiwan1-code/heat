// 读版本
import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readVersion(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x69 ||
    dataView.getUint8(10) !== 0x05 ||
    dataView.getUint8(12) !== 0x09
  if (!notPass) {
    context.version = Number(dataView.getUint8(14))

  }
  console.log('读软件版本:', context.version)
  context.createLeftSpanMessage('读软件版本:' + context.version, 'grey')
  return notPass
}
