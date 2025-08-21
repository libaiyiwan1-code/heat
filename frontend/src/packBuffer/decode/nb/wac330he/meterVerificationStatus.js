const Log = require('ee-core/log');
const {hex2arrayBuffer, calculateCSByte} = require("@/packBuffer/common/comUtil");

export function decodeCheckMeterEnterVerificationStatusWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过包长度
  let skipLength = 3  //FE FE FE
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 热表进入检定 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】热表进入检定 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  return innerView.getUint8(0) !== 0x68 ||
    innerView.getUint8(9) !== 0xA4 ||
    innerView.getUint8(10) !== 0x05;
}

export function decodeCheckMeterReturnVerificationStatusWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过包长度
  let skipLength = 3  //FE FE FE
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 热表退出检定 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】热表退出检定 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  return innerView.getUint8(0) !== 0x68 ||
    innerView.getUint8(9) !== 0xA4 ||
    innerView.getUint8(10) !== 0x05;
}
