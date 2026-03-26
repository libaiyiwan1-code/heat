import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeAddress(valveAddress, responseMessage) {
  let splicingAddress = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass = dataView.getUint8(21) !== 0x68
    || dataView.getUint8(24) !== 0x68 ||
    dataView.getUint8(25) !== 0x80 ||
    dataView.getUint8(26) !== 0x56 ||
    dataView.getUint8(31) !== 0x00 ||
    dataView.getUint8(33) !== 0x01
  if (!notPass) {
    for (let i = 27; i <= 30; i++) {
      const byteValue = dataView.getUint8(i);
      // 使用 toString(16) 将字节转换为十六进制字符串，并确保两个字符长度
      const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
      splicingAddress += hexString;
    }
    //地址对比
    console.log('要修改的地址:' + valveAddress, '报文返回的地址' + splicingAddress)
  } else {
    return notPass
  }

  return splicingAddress !== valveAddress;

}
