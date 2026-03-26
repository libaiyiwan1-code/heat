import {hex2arrayBuffer, hexToFloat} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log')

/**
 * 标定0MPa压力AD值
 *
 * */
export function zeroMpaDemarcate(context, responseMessage) {
  let pressureADStr = '';
  let notPass = false
  for (let i = 34; i < 42; i++) {
    pressureADStr += responseMessage.charAt(i);
  }
  if (pressureADStr === '00000000' || pressureADStr === undefined || pressureADStr === null || pressureADStr === '') {
    context.createLeftSpanMessage('标定0MPa压力AD值异常:' + pressureADStr, 'grey');
    console.warn('标定0MPa压力失败，AD值异常:', pressureADStr);
    Log.warn('标定0MPa压力失败，AD值异常:', pressureADStr);
    notPass = true
  } else {
    context.createLeftSpanMessage('标定0MPa压力AD值正常:' + pressureADStr, 'grey');
  }
  return notPass
}

/**
 *  标定1.6MPa压力AD值
 *
 * */
export function onePointSixMpaDemarcate(context, responseMessage) {
  let pressureADStr = '';
  let notPass = false
  for (let i = 34; i < 42; i++) {
    pressureADStr += responseMessage.charAt(i);
  }

  if (pressureADStr === '00000000' || pressureADStr === undefined || pressureADStr === null || pressureADStr === '') {
    context.createLeftSpanMessage('标定0MPa压力AD值异常:' + pressureADStr, 'grey');
    console.warn('标定1.6MPa压力失败，AD值异常:', pressureADStr);
    Log.warn('标定1.6MPa压力失败，AD值异常:', pressureADStr);
    notPass = true
  } else {
    context.createLeftSpanMessage('标定1.6MPa压力AD值正常:' + pressureADStr, 'grey');
  }
  return notPass
}


/**
 * 4mA温度通道标定
 * */
export function calibrateTemperatureChannel4mA(messageStr, context) {
  console.warn('decodeCheckCalibrated4mA:', messageStr)
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  const value = dataView.getUint32(13, false) // false = 大端
  if (value === 0) {
    context.createLeftSpanMessage('4mA温度通道标定失败', 'grey');
    return false
  }
  return dataView.getUint8(10) !== 0x01 ||
    dataView.getUint8(11) !== 0x06 ||
    dataView.getUint8(12) !== 0x04
}

/**
 * 20mA温度通道标定
 * */
export function calibrateTemperatureChannel20mA(messageStr, context) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  const value = dataView.getUint32(13, false) // false = 大端
  if (value === 0) {
    context.createLeftSpanMessage('20mA温度通道标定失败', 'grey');
    return false
  }
  return dataView.getUint8(10) !== 0x01 ||
    dataView.getUint8(11) !== 0x06 ||
    dataView.getUint8(12) !== 0x04
}

/**
 * 压力通道4mA标定
 * */
export function calibratePressureChannel4mA(messageStr, context) {
  console.warn('decodeCheckCalibrated4mA:', messageStr)
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  const value = dataView.getUint32(13, false) // false = 大端
  if (value === 0) {
    context.createLeftSpanMessage('4mA压力通道标定失败', 'grey');
    return false
  }
  return dataView.getUint8(10) !== 0x01 ||
    dataView.getUint8(11) !== 0x06 ||
    dataView.getUint8(12) !== 0x04
}

/**
 * 压力通道20mA标定
 * */
export function calibratePressureChannel20mA(messageStr, context) {
  console.warn('decodeCheckCalibrated20mA:', messageStr)
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  const value = dataView.getUint32(13, false) // false = 大端
  if (value === 0) {
    context.createLeftSpanMessage('20mA压力通道标定失败', 'grey');
    return false
  }
  return dataView.getUint8(10) !== 0x01 ||
    dataView.getUint8(11) !== 0x06 ||
    dataView.getUint8(12) !== 0x04
}

/**
 * 设备读压力
 * */
export function readDevicePressure(messageStr, context) {
  let hexString = '';
  for (let i = 22; i < 30; i++) {
    hexString += messageStr.charAt(i);
  }
  context.pressureDeviceValue = parseFloat((hexToFloat(hexString).toFixed(3) / Math.pow(10, 6)).toFixed(3));
  context.createLeftSpanMessage('ptc100-4-20MA读压力:' + context.pressureDeviceValue + 'MPa', 'grey');
  console.log('ptc100-4-20MA读压力解析结果:', context.pressureDeviceValue + 'MPa');
  Log.info('ptc100-4-20MA读压力解析结果:', context.pressureDeviceValue + 'MPa');
  if (Math.abs(context.pressureGauge - context.pressureDeviceValue) > 0.008) {
    context.createLeftSpanMessage('ptc100-4-20MA压力数据检测失败,差值:' + Math.abs(context.pressureGauge - context.pressureDeviceValue), 'red');
    console.warn('ptc100-4-20MA压力数据检测失败,差值:' + Math.abs(context.pressureGauge - context.pressureDeviceValue));
    Log.info('ptc100-4-20MA压力数据检测失败,差值:' + Math.abs(context.pressureGauge - context.pressureDeviceValue));
    return true
  } else {
    Log.info('ptc100-4-20MA压力检测 成功 ');
    console.log('ptc100-4-20MA压力检测 成功 ');
    context.createLeftSpanMessage('ptc100-4-20MA压力检测 成功 ', 'green');
  }
  return false;
}


/**
 * 验证PTC100-4-20mA设备的压力与压力表读压力对比
 * */
export function readVoltmeter(messageStr, context) {
  let hexString = '';
  for (let i = 6; i < 14; i++) {
    hexString += messageStr.charAt(i);
  }
  console.log(hexString)
  // 解析出压力
  context.pressureGauge = hexToFloat(hexString).toFixed(3);
  console.log('压力表读压力解析结果:', context.pressureGauge + 'MPa');
  context.createLeftSpanMessage('压力表读压力:' + context.pressureGauge + 'MPa', 'grey');
  if (parseFloat(context.pressureGauge) <= 1.55 || parseFloat(context.pressureGauge) >= 1.65) {
    context.createLeftSpanMessage('写入压力不合格 当前压力:' + context.pressureGauge + ' 请写入1.55~1.65 MPa之间的压力', 'red');
    Log.info('写入压力不合格 请写入1.55~1.65 MPa之间的压力');
    console.warn('写入压力不合格 请写入1.55~1.65 MPa之间的压力');
    return true
  }
  return false;
}


/**
 * 读压力电流表
 * */
export function readPressureGaugeCurrent(messageStr, context) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(0) !== 0x02 || dataView.getUint8(1) !== 0x03
  context.readCurrentPressureMeterValue = parseFloat(Number(dataView.getUint32(3, false) * 0.001).toFixed(3));
  console.log('压力电流表读数:', context.readCurrentPressureMeterValue)
  context.createLeftSpanMessage(`压力电流表读数:${context.readCurrentPressureMeterValue}mA`, 'grey');
  return result
}

/**
 * 读温度表电流
 * */
export function readTemperatureGaugeCurrent(messageStr, context) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(0) !== 0x03 || dataView.getUint8(1) !== 0x03
  context.readCurrentMeterValue = parseFloat(Number(dataView.getUint32(3, false) * 0.001).toFixed(3));
  console.log('温度电流表读数:', context.readCurrentMeterValue)
  context.createLeftSpanMessage(`温度电流表读数:${context.readCurrentMeterValue}mA`, 'grey');
  return result
}


/**
 * 设备输出4mA
 * */
export function deviceOutputs4mA(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(8) !== 0x01 ||
    dataView.getUint8(9) !== 0x06 ||
    dataView.getUint8(10) !== 0x04
}

/**
 * 设备输出12mA
 * */
export function deviceOutputs12mA(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(8) !== 0x01 ||
    dataView.getUint8(9) !== 0x06 ||
    dataView.getUint8(10) !== 0x04
}

/**
 * 设备输出20mA
 * */
export function deviceOutputs20mA(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(8) !== 0x01 ||
    dataView.getUint8(9) !== 0x06 ||
    dataView.getUint8(10) !== 0x04
}
