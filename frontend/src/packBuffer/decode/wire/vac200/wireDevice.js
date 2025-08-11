import {addressCover, arrayBuffer2Hex, hex2arrayBuffer} from "@/packBuffer/common/comUtil";


export function decodeCheckReadAddress(context, responseMessage, type) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let address = '';
  for (let i = 5; i <= 11; i++) {
    const byteValue = dataView.getUint8(i);
    address += byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
  }
  console.log('解析地址：', address)
  if (type === 'one') {
    context.leftReadAddress = address
  } else {
    context.rightReadAddress = address
  }
  return false
}


export function decodeWriteUpperAndLowerTemperatureLimitsVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '11'

}


export function decodeWritePowerOutagesAndWirelessAnomaliesVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '26'

}


export function decodeWriteHeatingDateVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '19'

}

export function decodeWriteProbeConfigurationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'ac'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '09'

}

export function decodeWriteAllConfigConfigurationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'ac'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '02'

}

export function decodeReadVersionVerify(context, responseMessage,type) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'b0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '05'
  context.readVersion = decodeGetVersion(responseMessage)
  if (type==='one'){
    context.createLeftSpanMessage('读取设备版本号成功:'+context.readVersion, 'grey')
  }else{
    context.createRightSpanMessage('读取设备版本号成功:'+context.readVersion, 'grey')
  }
  console.log('版本：',context.readVersion)
  return result
}

export function decodeGetVersion(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  let version = dataView.getUint8(17);
  return (version * 0.1).toFixed(1).toString();
}

export function decodeGetInAndOutTemperature(responseMessage,type,context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  const inTemperature = (dataView.getInt16(23, true).toString(16) * 0.01).toFixed(2);
  const outTemperature = (dataView.getInt16(25, true).toString(16) * 0.01).toFixed(2);
  console.log('设备进温：', inTemperature)
  console.log('设备回温：', outTemperature)
  if (type==='one'){
    context.leftInTemperature= inTemperature;
    context.leftOutTemperature= outTemperature;
  }else{
    context.rightInTemperature= inTemperature;
    context.rightOutTemperature= outTemperature;
  }
}

export function decodeFactoryConditionFullyOpenVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '17'
}

export function decodeFactoryConditionFullyCloseVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '17'
}

export function decodeOutTemperatureCalibrationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'bb'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ff'
}

export function decodeInTemperatureCalibrationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'bb'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ee'
}

export function decodeMainAndAuxiliaryValvesVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '22'
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

export function decodeSeparationAlarmState(responseMessage, close,context,type) {
  let separationState = decodeSeparationAlarmToBeContinued(responseMessage)
  let done = decodeSeparationAlarmDone(responseMessage)
  if (separationState && !close) {
    return {notPass: false, errorMessage: '分离警报检测-分离'}
  } else if (done && close) {
    return {notPass: false, errorMessage: '分离警报检测-闭合'}
  } else {
    let str=''
    if (close){
      str='分离'
    }else{
      str='闭合'
    }
    if (type==='one'){
      context.createLeftSpanMessage('分离警报检测('+str+')-失败', 'grey')
    }else{
      context.createRightSpanMessage('分离警报检测('+str+')-失败', 'grey')
    }
    return {notPass: true, errorMessage: '分离警报检测-失败'}
  }

}
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
export function decodeMainAndAuxiliaryValvesState(responseMessage,context,type) {
  let continuedState = decodeMainAndAuxiliaryValvesToBeContinued(responseMessage)
  let done = decodeMainAndAuxiliaryValvesDone(responseMessage)
  if (continuedState) {
    if (type==='one'){
      context.createLeftSpanMessage('主阀检测失败', 'grey')
    }else{
      context.createRightSpanMessage('主阀检测失败', 'grey')
    }
    return {notPass: true, errorMessage: '副阀检测失败'}
  } else if (done ) {
    return {notPass: false, errorMessage: '副阀检测成功'}
  } else {
    if (type==='one'){
      context.createLeftSpanMessage('主阀检测失败', 'grey')
    }else{
      context.createRightSpanMessage('主阀检测失败', 'grey')
    }
    return {notPass: true, errorMessage: '副阀检测失败'}
  }
}


export function decodeSeparationAlarmVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '1f'
}

export function decodeReadInAndBackTemperatureVerify(responseMessage,type,context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let result =dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '1f'
  decodeGetInAndOutTemperature(responseMessage,type,context)
  return result
}

export function decodeReadValveState(responseMessage,type,context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if ((dataView.getUint8(51) & 0x03) === 0x03){
    if (type==='one'){
      context.leftValveState='故障'
    }else {
      context.rightValveState='故障'
    }
  }else  if ((dataView.getUint8(51) & 0x02) === 0x02){
    if (type==='one'){
      context.leftValveState='阀关'
    }else {
      context.rightValveState='阀关'
    }
  }else  if ((dataView.getUint8(51) & 0x01) === 0x01){
    if (type==='one'){
      context.leftValveState='阀开'
    }else {
      context.rightValveState='阀开'
    }
  }
}

export function decodeFaceplateCommunicationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '1f'
}

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

export function decodeDetectPanelState(context,responseMessage,type) {
  let lostContactState = decodePanelDetectionLostContact(responseMessage)
  let lostNormal = decodePanelDetectionLostNormal(responseMessage)
  if (lostContactState) {
    if (type==='one'){
      context.createLeftSpanMessage('面板通信检测失败-面板失联', 'red')
    }else{
      context.createRightSpanMessage('面板通信检测失败-面板失联', 'red')
    }
    return {notPass: true, errorMessage: '面板通信检测失败-面板失联'}
  } else if (lostNormal) {
    return {notPass: false, errorMessage: ''}
  } else {
    if (type==='one'){
      context.createLeftSpanMessage('面板通信检测失败-面板失联', 'red')
    }else{
      context.createRightSpanMessage('面板通信检测失败-面板失联', 'red')
    }
    return {notPass: true, errorMessage: '面板通信检测失败-面板失联'}
  }

}

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

export function decodeCreditCardState(context,responseMessage,type) {
  let done = decodeCreditCardDone(responseMessage)
  let continuedState = decodeCreditCardToBeContinued(responseMessage)
  if (done) {
    return {notPass: false, errorMessage: ''}
  } else if (continuedState) {
    if (type==='one'){
      context.createLeftSpanMessage('刷卡检测失败', 'red')
    }else{
      context.createRightSpanMessage('刷卡检测失败', 'red')
    }

    return {notPass: true, errorMessage: '刷卡检测失败'}
  }
}

export function decodeCreditCardVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '24'
}

export function decodeFullOpenCalibrationVerify(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'cc'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ee'

}

export function decodeFullOffCalibrationVerify(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'cc'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ff'
}

export function decodeFullOffCalibrationState(responseMessage,context,type) {
  let state = decodeUpdateFullOffCalibrationState(responseMessage)
  let errorMessage = ''
  console.log('state', state)
  if (state === '02') {
    if (type==='one'){
      context.createLeftSpanMessage('全关-标定失败(标定值不在限定范围)', 'red')
    }else{
      context.createRightSpanMessage('全关-标定失败(标定值不在限定范围)', 'red')
    }
    errorMessage = '全关-标定失败(标定值不在限定范围)'
    return {notPass: true, errorMessage: errorMessage}
  } else if (state === '03') {
    if (type==='one'){
      context.createLeftSpanMessage('全关-标定超时', 'red')
    }else{
      context.createRightSpanMessage('全关-标定超时', 'red')
    }
    errorMessage = '全关-标定超时'
    return {notPass: true, errorMessage: errorMessage}
  } else if (state === '04') {
    if (type==='one'){
      context.createLeftSpanMessage('全关-标定故障', 'red')
    }else{
      context.createRightSpanMessage('全关-标定故障', 'red')
    }
    errorMessage = '全关-标定故障'
    return {notPass: true, errorMessage: errorMessage}
  }
}

export function decodeFullOpenCalibrationState(responseMessage,context,type) {
  let state = decodeUpdateFullOpenCalibrationState(responseMessage)
  let errorMessage = ''
  console.log('state', state)
  if (state === '02') {
    if (type==='one'){
      context.createLeftSpanMessage('全开-标定失败(标定值不在限定范围)', 'red')
    }else{
      context.createRightSpanMessage('全开-标定失败(标定值不在限定范围)', 'red')
    }
    errorMessage = '全开-标定失败(标定值不在限定范围)'
    return {notPass: true, errorMessage: errorMessage}
  } else if (state === '03') {
    if (type==='one'){
      context.createLeftSpanMessage('全开-标定超时', 'red')
    }else{
      context.createRightSpanMessage('全开-标定超时', 'red')
    }
    errorMessage = '全开-标定超时'
    return {notPass: true, errorMessage: errorMessage}
  } else if (state === '04') {
    if (type==='one'){
      context.createLeftSpanMessage('全开-标定故障', 'red')
    }else{
      context.createRightSpanMessage('全开-标定故障', 'red')
    }
    errorMessage = '全开-标定故障'
    return {notPass: true, errorMessage: errorMessage}
  }
}

export function decodeUpdateFullOpenCalibrationState(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(19).toString(16).padStart(2, '0')
}

export function decodeUpdateFullOffCalibrationState(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(19).toString(16).padStart(2, '0')
}

export function decodeCheckForcedTemperatureSetting(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68 || dataView.getUint8(14) !== 0xa0 || dataView.getUint8(15) !== 0x22
}
export function decodeCheckWriteTargetAdjustmentValue(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(14) !== 0xac ||
    dataView.getUint8(15) !== 0x04
}

export function decodeCheckWriteCleaningValveCycle(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(14) !== 0xa0 ||
    dataView.getUint8(15) !== 0x2c
}


export function decodeWriteAddressVerify(type, responseMessage, context) {
  let valveAddress = type === 'one' ? context.leftGenerateAddress : context.rightGenerateAddress
  let coverAddress = arrayBuffer2Hex(addressCover(valveAddress))
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  let splicingAddress = ''
  let writeAddressNotPass = false;
  for (let i = 5; i <= 8; i++) {
    const byteValue = dataView.getUint8(i);
    const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    splicingAddress += hexString;
  }
  console.log(splicingAddress)
  console.log(coverAddress)
  if (splicingAddress !== coverAddress) {
    writeAddressNotPass = true;
    console.log('Address check failed.');
    return writeAddressNotPass
  }

  return writeAddressNotPass;
}
