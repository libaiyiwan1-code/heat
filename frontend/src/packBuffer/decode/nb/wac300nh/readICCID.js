import {checkICCID, checkIMEI, hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetICCID} from "@/packBuffer/decode/decode";
import {decodeCheckAwakenWAC300NH} from "@/packBuffer/decode/nb/wac300nh/awaken";



export function decodeCheckReadICCIDWAC300NH(context,responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x47 ||
    dataView.getUint8(26) !== 0x05 ||
    dataView.getUint8(28) !== 0x08
  if (!notPass) {
    let iccid = decodeGetICCID(responseMessage, true)
    console.warn('iccid', iccid)
    if (checkICCID(iccid)) {
      context.createLeftSpanMessage('ICCID不合法', 'red')
      notPass = true
    }
    context.iccid = iccid
  }

  return notPass
}


