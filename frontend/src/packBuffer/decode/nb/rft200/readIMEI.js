import {checkIMEI, hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";


export function readIMEI(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(18) !== 0x68 ||
    dataView.getUint8(21) !== 0x68 ||
    dataView.getUint8(22) !== 0x80 ||
    dataView.getUint8(23) !== 0x88 ||
    dataView.getUint8(30) !== 0x05 ||
    dataView.getUint8(32) !== 0x0B
  if (!notPass) {
    let imei = this.decodeIMEI(responseMessage)
    if (checkIMEI(imei)) {
      context.createLeftSpanMessage('IMEI不合法', 'red')
      notPass = true
    }

    context.imei = imei
  }
  return notPass
}

export function decodeIMEI(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let imei = '';
  for (let i = 34; i <= 48; i++) {
    imei += dataView.getUint8(i).toString(16).padStart(2, '0')
  }
  return hexToAscii(imei)

}

