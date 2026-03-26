import {checkIMEI, hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetIMEI} from "@/packBuffer/decode/decode";


export function readIMEI(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x92 ||
    dataView.getUint8(26) !== 0x05 ||
    dataView.getUint8(28) !== 0x0B
  if (!notPass) {
    let imei = decodeGetIMEI(responseMessage, false)
    if (checkIMEI(imei)) {
      context.createLeftSpanMessage('IMEI不合法', 'red')
      notPass = true
    }

    context.imei = imei
  }
  return notPass
}
