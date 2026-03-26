import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function decodeUpdateFullOpenCalibrationState(responseMessage,isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if (!isInfraredDevice) {
    return dataView.getUint8(19).toString(16).padStart(2, '0')
  }else{
    return dataView.getUint8(38).toString(16).padStart(2, '0')
  }

}

export function fullOpenCalibrationState(responseMessage, context, type, isInfraredDevice) {
  let state = decodeUpdateFullOpenCalibrationState(responseMessage,isInfraredDevice)
  let errorMessage = ''
  console.log('state', state)
  if (state === '02') {
    if (type === 'one') {
      context.createLeftSpanMessage('全开-标定失败(标定值不在限定范围)', 'red')
    } else {
      context.createRightSpanMessage('全开-标定失败(标定值不在限定范围)', 'red')
    }
    errorMessage = '全开-标定失败(标定值不在限定范围)'
    return {notPass: true, errorMessage: errorMessage}
  } else if (state === '03') {
    if (type === 'one') {
      context.createLeftSpanMessage('全开-标定超时', 'red')
    } else {
      context.createRightSpanMessage('全开-标定超时', 'red')
    }
    errorMessage = '全开-标定超时'
    return {notPass: true, errorMessage: errorMessage}
  } else if (state === '04') {
    if (type === 'one') {
      context.createLeftSpanMessage('全开-标定故障', 'red')
    } else {
      context.createRightSpanMessage('全开-标定故障', 'red')
    }
    errorMessage = '全开-标定故障'
    return {notPass: true, errorMessage: errorMessage}
  }
}
