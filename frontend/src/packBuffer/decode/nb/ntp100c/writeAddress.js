import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeAddress(valveAddress, responseMessage) {
  let splicingAddress = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  for (let i = 27; i <= 30; i++) {
    const byteValue = dataView.getUint8(i);
    // 使用 toString(16) 将字节转换为十六进制字符串，并确保两个字符长度
    const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    splicingAddress += hexString;
  }
  //地址对比
  console.log('要修改的地址:' + valveAddress, '报文返回的地址' + splicingAddress)
  return splicingAddress !== valveAddress;

}
