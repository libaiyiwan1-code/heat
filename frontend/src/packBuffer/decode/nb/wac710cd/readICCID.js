import {checkICCID, checkIMEI, hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetICCID} from "@/packBuffer/decode/decode";


export function readICCID(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(10) !== 0x05 ||
    dataView.getUint8(12) !== 0x08
  if (!notPass) {
    let iccid = decodeGetICCID(responseMessage, false)
    console.warn('iccid', iccid)
    if (checkICCID(iccid)) {
      context.createLeftSpanMessage('ICCID不合法', 'red')
      notPass = true
    }
    context.iccid = iccid
  }

  return notPass
}


