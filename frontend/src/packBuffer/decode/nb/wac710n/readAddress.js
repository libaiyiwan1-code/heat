import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

// 读自检解析地址
export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x60 ||
    dataView.getUint8(10) !== 0x05 ||
    dataView.getUint8(12) !== 0x06
  if (!notPass) {
    // 读取4字节地址（从第18字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(15 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  console.log('读取地址:', context.leftReadAddress)
  return notPass
}
