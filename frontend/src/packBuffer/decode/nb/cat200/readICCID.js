import {checkICCID, checkIMEI, hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {decodeGetICCID} from "@/packBuffer/decode/decode";


export function readICCID(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0X74 || //协议id
    dataView.getUint8(26) !== 0x05 || //fn
    dataView.getUint8(28) !== 0x08  //afn
  if (!notPass) {
    let iccid = ''
    for (let i = 30; i <= 49; i++) {
      iccid += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
    iccid = hexToAscii(iccid)
    if (checkICCID(iccid)) {
      context.createLeftSpanMessage('ICCID不合法', 'red')
      notPass = true
      return notPass
    }
    console.warn('解析iccid:', iccid)
    context.iccid = iccid
  }

  return notPass
}


