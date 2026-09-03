import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(6) !== 0x68 ||
    dataView.getUint8(7) !== 0x80 || //控制域
    dataView.getUint8(8) !== 0X7A || //协议id
    dataView.getUint8(13) !== 0x05 || //fn
    dataView.getUint8(15) !== 0x06  //afn
  if (!notPass) {
    // 读取4字节地址（从第24字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(18 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  console.log('读取地址:', context.leftReadAddress)
  return notPass
}
