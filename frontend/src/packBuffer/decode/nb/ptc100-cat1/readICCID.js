import {checkICCID, checkIMEI, hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {decodeGetICCID} from "@/packBuffer/decode/decode";


export function readICCID(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let notPass= dataView.getUint8(3) !== 0x68
    || dataView.getUint8(6) !== 0x68 ||
    dataView.getUint8(7) !== 0x80||
    dataView.getUint8(8) !== 0x7A||
    dataView.getUint8(13) !== 0x05||
    dataView.getUint8(15) !== 0x08
  if (!notPass) {
    let iccid = ''
    for (let i = 17; i <= 36; i++) {
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


