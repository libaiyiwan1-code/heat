import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function separationAlarmState(responseMessage, close, context, type) {
  let separationState = decodeSeparationAlarmToBeContinued(responseMessage)
  let done = decodeSeparationAlarmDone(responseMessage)
  if (separationState && !close) {
    return {notPass: false, errorMessage: '分离警报检测-分离'}
  } else if (done && close) {
    return {notPass: false, errorMessage: '分离警报检测-闭合'}
  } else {
    let str = ''
    if (close) {
      str = '分离'
    } else {
      str = '闭合'
    }
    if (type === 'one') {
      context.createLeftSpanMessage('分离警报检测(' + str + ')-失败', 'grey')
    } else {
      context.createRightSpanMessage('分离警报检测(' + str + ')-失败', 'grey')
    }
    return {notPass: true, errorMessage: '分离警报检测-失败'}
  }

}

export function decodeSeparationAlarmToBeContinued(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(52) & 0x20) === 0x20;
}

export function decodeSeparationAlarmDone(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(52) & 0x20) === 0x00;
}
