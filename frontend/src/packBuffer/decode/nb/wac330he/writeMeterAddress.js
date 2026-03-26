import {addressCover, arrayBuffer2Hex, calculateCSByte, hex2arrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function writeMeterAddress(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过包长度
  let skipLength = 3 + 23  //FE FE FE+红外包
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 热表写地址 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】热表写地址 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  let notPass = innerView.getUint8(0) !== 0x68 ||
    innerView.getUint8(11) !== 0xA0 ||
    innerView.getUint8(12) !== 0x18;
  if (!notPass) {
    let newAddress = context.leftGenerateAddress;
    let responseAddress = innerView.getUint32(2, false).toString(16).padStart(8,'0')
    console.warn('写热表地址：', newAddress, '报文返回热表地址(需要逆序读)：', responseAddress)
    if (newAddress !== arrayBuffer2Hex(addressCover(responseAddress))) {
      Log.info(`设备 【WAC330HE】热表写地址 写入地址与返回地址不符，写入地址:${newAddress},返回地址:${addressCover(responseAddress)}`)
      console.log(`设备 【WAC330HE】热表写地址 写入地址与返回地址不符，写入地址:${newAddress},返回地址:${addressCover(responseAddress)}`)
      context.createLeftSpanMessage(`写入地址与返回地址不符，写入地址:${newAddress},返回地址:${addressCover(responseAddress)}`, 'red')
      notPass = true
    }
  }
  return notPass
}
