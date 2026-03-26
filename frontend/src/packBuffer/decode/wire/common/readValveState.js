import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readValveState(responseMessage, type, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if ((dataView.getUint8(51) & 0x03) === 0x03) {
    if (type === 'one') {
      context.leftValveState = '故障'
    } else {
      context.rightValveState = '故障'
    }
  } else if ((dataView.getUint8(51) & 0x02) === 0x02) {
    if (type === 'one') {
      context.leftValveState = '阀关'
    } else {
      context.rightValveState = '阀关'
    }
  } else if ((dataView.getUint8(51) & 0x01) === 0x01) {
    if (type === 'one') {
      context.leftValveState = '阀开'
    } else {
      context.rightValveState = '阀开'
    }
  }
}
