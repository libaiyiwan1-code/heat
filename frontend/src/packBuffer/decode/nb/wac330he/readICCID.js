import {calculateCSByte, checkIMEI, hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetICCID} from "@/packBuffer/decode/decode";

const Log = require('ee-core/log');


export function decodeCheckReadICCIDWAC330HE(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(messageBuffer)
  // 跳过红外长度
  let skipLength = 16 + 4 //红外+包头
  let innerBuffer = messageBuffer.slice(skipLength, messageBuffer.byteLength - 2)
  let innerView = new DataView(innerBuffer)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let innerCSCalc = calculateCSByte(innerBuffer)
  console.log("设备 【WAC330HE】 读ICCID 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】读ICCID 报文校验失败(CS验证错误)')
    return true
  }
  // 验证基础报文
  let notPass = innerView.getUint8(10) !== 0x05 ||
    innerView.getUint8(12) !== 0x08;
  if (!notPass) {
    let imei = decodeGetICCID(responseMessage, false)
    if (checkIMEI(imei)) {
      context.createLeftSpanMessage('IMEI不合法', 'red')
      notPass = true
    }

    context.imei = imei
  }
  return notPass
}
