import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

// 读自检解析地址
export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x78 ||
    dataView.getUint8(27) !== 0xDD ||
    dataView.getUint8(28) !== 0xF0
  if (!notPass) {
    // 读取4字节地址（从第18字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(18 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  console.log('读取地址:', context.leftReadAddress)
  return notPass
}
