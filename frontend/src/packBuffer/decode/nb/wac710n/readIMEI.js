import {checkIMEI, hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetIMEI} from "@/packBuffer/decode/decode";


export function readIMEI(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80 ||
    dataView.getUint8(5) !== 0X60 ||
    dataView.getUint8(10) !== 0X05 ||
    dataView.getUint8(12) !== 0X0B
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
