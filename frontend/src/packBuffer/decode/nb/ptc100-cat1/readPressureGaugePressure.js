import {hexToFloat} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log')

export function readPressureGaugePressure(messageStr, context, isInspection) {
  let hexString = '';
  for (let i = 12; i < 20; i++) {
    hexString += messageStr.charAt(i);
  }
  console.log(hexString)
  // 解析出压力
  context.pressureGauge = hexToFloat(hexString).toFixed(3);
  console.log('压力表读压力解析结果:', context.pressureGauge + 'MPa');
  context.createLeftSpanMessage('压力表读压力:' + context.pressureGauge + 'MPa', 'grey');
  if (!isInspection) {
    if (parseFloat(context.pressureGauge) <= 1.55 || parseFloat(context.pressureGauge) >= 1.65) {
      context.createLeftSpanMessage('写入压力不合格 当前压力:' + context.pressureGauge + ' 请写入1.55~1.65 MPa之间的压力', 'red');
      Log.info('写入压力不合格 请写入1.55~1.65 MPa之间的压力');
      console.warn('写入压力不合格 请写入1.55~1.65 MPa之间的压力');
      return true
    }
  }
  return false;
}
