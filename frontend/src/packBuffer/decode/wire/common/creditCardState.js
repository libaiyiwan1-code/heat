import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeCreditCardToBeContinued(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(80) & 0x80) === 0x00;
}

export function decodeCreditCardDone(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  console.log((dataView.getUint8(80).toString(16) & 0x80) === 0x80)
  return (dataView.getUint8(80) & 0x80) === 0x80;
}

export function creditCardState(context, responseMessage, type) {
  let done = decodeCreditCardDone(responseMessage)
  let continuedState = decodeCreditCardToBeContinued(responseMessage)
  if (done) {
    return {notPass: false, errorMessage: ''}
  } else if (continuedState) {
    if (type === 'one') {
      context.createLeftSpanMessage('刷卡检测失败', 'red')
    } else {
      context.createRightSpanMessage('刷卡检测失败', 'red')
    }

    return {notPass: true, errorMessage: '刷卡检测失败'}
  }
}
