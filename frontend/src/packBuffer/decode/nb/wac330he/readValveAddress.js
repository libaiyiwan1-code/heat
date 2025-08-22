import {calculateCSByte, hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import Log from "ee-core/log";

export function decodeCheckReadAddressWAC330HE(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过红外长度
  let skipLength = 16 + 4 //红外+包头
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 读地址 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】读地址 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  let notPass = innerView.getUint8(0) !== 0x80 ||
    innerView.getUint8(10) !== 0x05 ||
    innerView.getUint8(11) !== 0x06;
  if (!notPass) {
    context.leftReadAddress = innerBuffer.getUint32(2, false).toString(16)
  }
  return notPass
}
