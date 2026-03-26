import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
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
    // 读取6字节地址（从第24字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(6 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  console.log('读取地址:', context.leftReadAddress)
  return notPass
}
