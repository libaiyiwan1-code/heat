import {hexToFloat} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log')

/**
 * 设备读压力
 * */
export function readDevicePressure(messageStr, context) {
  let hexString = '';
  for (let i = 12; i < 20; i++) {
    hexString += messageStr.charAt(i);
  }
  context.pressureDeviceValue = parseFloat((hexToFloat(hexString).toFixed(3) / Math.pow(10, 6)).toFixed(3));
  context.createLeftSpanMessage('设备读压力:' + context.pressureDeviceValue + 'MPa', 'grey');
  console.log('设备读压力解析结果:', context.pressureDeviceValue + 'MPa');
  Log.info('设备读压力解析结果:', context.pressureDeviceValue + 'MPa');
  let diffValue = Math.abs(context.pressureGauge - context.pressureDeviceValue)
  if (diffValue > 0.008) {
    context.createLeftSpanMessage('设备压力数据检测失败,差值:' + diffValue.toFixed(3), 'red');
    console.warn('设备压力数据检测失败,差值' + diffValue.toFixed(3));
    Log.info('设备压力数据检测失败,差值' + diffValue.toFixed(3));
    return true
  } else {
    Log.info('设备压力数据检测成功,差值:' + diffValue.toFixed(3));
    console.log('设备压力数据检测成功,差值:' + diffValue.toFixed(3));
    context.createLeftSpanMessage('设备压力数据检测成功,差值:' + diffValue.toFixed(3));
  }
  return false;
}
