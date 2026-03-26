import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodePanelDetectionLostNormal(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(51) & 0x40) === 0x00;
}

export function decodePanelDetectionLostContact(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(51) & 0x40) === 0x40;
}

export function detectPanelState(context, responseMessage, type) {
  let lostContactState = decodePanelDetectionLostContact(responseMessage)
  let lostNormal = decodePanelDetectionLostNormal(responseMessage)
  if (lostContactState) {
    if (type === 'one') {
      context.createLeftSpanMessage('面板通信检测失败-面板失联', 'red')
    } else {
      context.createRightSpanMessage('面板通信检测失败-面板失联', 'red')
    }
    return {notPass: true, errorMessage: '面板通信检测失败-面板失联'}
  } else if (lostNormal) {
    return {notPass: false, errorMessage: ''}
  } else {
    if (type === 'one') {
      context.createLeftSpanMessage('面板通信检测失败-面板失联', 'red')
    } else {
      context.createRightSpanMessage('面板通信检测失败-面板失联', 'red')
    }
    return {notPass: true, errorMessage: '面板通信检测失败-面板失联'}
  }

}
