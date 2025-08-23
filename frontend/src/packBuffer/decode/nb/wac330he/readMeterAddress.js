import {calculateCSByte, hex2arrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function decodeCheckMeterReadAddressWAC330HE(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过包长度
  let skipLength = 3 + 17  //FE FE FE+红外包
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 热表读地址 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】热表读地址 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  let notPass = innerView.getUint8(0) !== 0x68 ||
    innerView.getUint8(11) !== 0x81 ||
    innerView.getUint8(12) !== 0x0A;
  if (!notPass) {
    context.readMeterAddress = innerView.getUint32(2, false).toString(16).padStart(8,'0')
    console.warn('读热表8位地址：', context.readMeterAddress)
  }
  return notPass
}
