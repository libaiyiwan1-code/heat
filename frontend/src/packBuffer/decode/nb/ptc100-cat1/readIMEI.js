import {checkIMEI, hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";


export function readIMEI(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(6) !== 0x68 ||
    dataView.getUint8(7) !== 0x80 ||
    dataView.getUint8(8) !== 0x7A ||
    dataView.getUint8(13) !== 0x05 ||
    dataView.getUint8(15) !== 0x0B
  if (!notPass) {
    responseMessage = responseMessage.replace(/\s/g, '');
    let messageBuffer = hex2arrayBuffer(responseMessage);
    let dataView = new DataView(messageBuffer)
    let imei = '';
    for (let i = 17; i <= 31; i++) {
      imei += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
    imei = hexToAscii(imei)
    console.log(imei)
    if (checkIMEI(imei)) {
      context.createLeftSpanMessage('IMEI不合法', 'red')
      notPass = true
    }
    context.imei = imei
  }
  return notPass
}
