import {calculateCSByte, hex2arrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function writeValveAddress(leftGenerateAddress, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过红外长度
  let skipLength = 21 + 4 //红外+包头
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 写阀门地址 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】 写阀门地址 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  let notPass = innerView.getUint8(0) !== 0x80 || innerView.getUint8(1) !== 0x9a
  if (!notPass) {
    const splicingAddress = innerView.getUint32(2, false).toString(16);

    //地址对比
    console.log('要修改的地址:' + leftGenerateAddress, '报文返回的地址' + splicingAddress)
    if (splicingAddress !== leftGenerateAddress) {
      notPass = splicingAddress !== leftGenerateAddress;
    }
  }

  return notPass
}
