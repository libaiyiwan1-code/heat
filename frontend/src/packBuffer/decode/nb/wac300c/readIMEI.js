import {checkIMEI, hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {decodeGetIMEI} from "@/packBuffer/decode/decode";


export function readIMEI(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0x6d || //协议id
    dataView.getUint8(26) !== 0x05 || //fn
    dataView.getUint8(28) !== 0x0B  //afn
  if (!notPass) {
    let imei = '';
    for (let i = 30; i <= 44; i++) {
      imei += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
    imei= hexToAscii(imei)
    if (checkIMEI(imei)) {
      context.createLeftSpanMessage('IMEI不合法', 'red')
      notPass = true
      return notPass
    }
    console.warn('解析imei:', imei)
    context.imei = imei
  }
  return notPass
}
