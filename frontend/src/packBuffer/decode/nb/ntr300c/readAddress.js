import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

// 读IMEI解析地址
export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0x7D || //协议id
    dataView.getUint8(26) !== 0x05 || //fn
    dataView.getUint8(28) !== 0x06  //afn
  if (!notPass) {
    // 读取6字节地址（从第24字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(22 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  console.log('读取地址:', context.leftReadAddress)
  return notPass
}
