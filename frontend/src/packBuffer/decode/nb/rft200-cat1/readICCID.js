import {checkICCID, checkIMEI, hex2arrayBuffer} from "@/packBuffer/common/comUtil";



export function readICCID(context,responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x91 ||
    dataView.getUint8(26) !== 0x05 ||
    dataView.getUint8(28) !== 0x08
  if (!notPass) {
    let iccid = decodeICCID(responseMessage)
    console.warn('iccid', iccid)
    if (checkICCID(iccid)) {
      context.createLeftSpanMessage('ICCID不合法', 'red')
      notPass = true
    }
    context.iccid = iccid
  }

  return notPass
}


export function decodeICCID(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let iccid = '';
  for (let i = 34; i <= 53; i++) {
    iccid += dataView.getUint8(i).toString(16).padStart(2, '0')
  }
  return hexToAscii(iccid)
}
