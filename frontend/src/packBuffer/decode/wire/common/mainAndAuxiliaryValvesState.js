import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeMainAndAuxiliaryValvesToBeContinued(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(55) & 0x80) === 0x80;
}

export function decodeMainAndAuxiliaryValvesDone(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(55) & 0x80) === 0x00;
}

export function mainAndAuxiliaryValvesState(responseMessage, context, type) {
  let continuedState = decodeMainAndAuxiliaryValvesToBeContinued(responseMessage)
  let done = decodeMainAndAuxiliaryValvesDone(responseMessage)
  if (continuedState) {
    if (type === 'one') {
      context.createLeftSpanMessage('主阀检测失败', 'grey')
    } else {
      context.createRightSpanMessage('主阀检测失败', 'grey')
    }
    return {notPass: true, errorMessage: '副阀检测失败'}
  } else if (done) {
    return {notPass: false, errorMessage: '副阀检测成功'}
  } else {
    if (type === 'one') {
      context.createLeftSpanMessage('主阀检测失败', 'grey')
    } else {
      context.createRightSpanMessage('主阀检测失败', 'grey')
    }
    return {notPass: true, errorMessage: '副阀检测失败'}
  }
}
