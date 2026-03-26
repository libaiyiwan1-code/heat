import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

// 读IMEI解析地址
export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x65 ||
    dataView.getUint8(14) !== 0x81 ||
    dataView.getUint8(15) !== 0x0A
  if (!notPass) {
    // 读取4字节地址（从第18字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(5 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
    context.leftReadAddress=arrayBuffer2Hex(addressCover(context.leftReadAddress))
  }
  console.log('读取地址:', context.leftReadAddress)
  return notPass
}
