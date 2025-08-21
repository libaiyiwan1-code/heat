import {calculateCSByte, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function decodeCheckWriteTemperatureProbesConfigWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  // 跳过红外回包长度
  let skipLength = 35
  let headerLength = 4
  let innerStartIndex = 19
  let innerBodyLength = 14 // 内层包长度 (不含CS和16)
  let slicedBuffer = messageBuffer.slice(skipLength)
  let responseDataView = new DataView(slicedBuffer);
  let responseOuterCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 4)
  let innerEnd = innerStartIndex + innerBodyLength
  let innerBuffer = slicedBuffer.slice(innerStartIndex, innerEnd) //截取内层包
  let outerBuffer = slicedBuffer.slice(headerLength, innerStartIndex) //截取外层包
  let innerCSFromMsg = responseDataView.getUint8(innerEnd) // F6
  let mergeBuffer = mergeArrayBuffer(outerBuffer, innerBuffer, [innerCSFromMsg, 0x16])
  console.log(mergeBuffer)
  let innerCSCalc = calculateCSByte(innerBuffer)
  let outerCSCalc = calculateCSByte(mergeBuffer)
  console.log("设备 【WAC330HE】 写温度探头配置 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  Log.info("设备 【WAC330HE】 写温度探头配置 内层CS 来自报文:", responseOuterCSValue, '计算的内层包：', outerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc) || (responseOuterCSValue !== outerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】写温度探头配置 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  return responseDataView.getUint8(0) !== 0x68 ||
    responseDataView.getUint8(3) !== 0x68 ||
    responseDataView.getUint8(4) !== 0x80 ||
    responseDataView.getUint8(5) !== 0x66 ||
    responseDataView.getUint8(19) !== 0x68 ||
    responseDataView.getUint8(20) !== 0x66 ||
    responseDataView.getUint8(28) !== 0x84 ||
    responseDataView.getUint8(29) !== 0x03 ||
    responseDataView.getUint8(30) !== 0xAC ||
    responseDataView.getUint8(31) !== 0x09;
}
