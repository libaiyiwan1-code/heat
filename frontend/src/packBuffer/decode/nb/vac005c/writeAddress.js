import {hex2arrayBuffer,arrayBuffer2Hex,addressCover} from "@/packBuffer/common/comUtil";
//68 65 01 00 43 16 00 00 00 15 0A A0 18 01 78 56 34 12 00 00 00   13 16 恢复地址命令
export function writeAddress(valveAddress, responseMessage) {
  let splicingAddress = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  for (let i = 5; i <= 8; i++) {
    const byteValue = dataView.getUint8(i);
    // 使用 toString(16) 将字节转换为十六进制字符串,并确保两个字符长度
    const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    splicingAddress += hexString;
  }
  //地址对比
  console.log('要修改的地址:' + valveAddress, '报文返回的地址' + splicingAddress)
  return arrayBuffer2Hex(addressCover(splicingAddress)) !== valveAddress;

}
