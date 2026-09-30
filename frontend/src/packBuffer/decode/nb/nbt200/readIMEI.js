import {checkIMEI, hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

export function readIMEI(context,responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let notPass= dataView.getUint8(16) !== 0x68
    || dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80||
    dataView.getUint8(21) !== 0x49||
    dataView.getUint8(26) !== 0x05||
    dataView.getUint8(28) !== 0x0B

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
