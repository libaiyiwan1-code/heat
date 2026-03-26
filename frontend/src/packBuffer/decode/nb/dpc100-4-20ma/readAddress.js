import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context,responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(26) !== 0xF0 || //fn
    dataView.getUint8(28) !== 0x1E  //afn
  if (!notPass) {
    // 读取4字节地址（从第22字节开始）
    context.leftReadAddress = Array.from({length: 4}, (_, i) =>
      dataView.getUint8(22 + i).toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  console.log('设备读取地址:', context.leftReadAddress)
  context.createLeftSpanMessage(`${context.leftReadAddress}`, 'grey');
  return notPass
}


