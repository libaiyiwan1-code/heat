import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
const Log = require('ee-core/log');

export function readVoltageAmmeterInputLoop(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let voltage = parseFloat(Number(dataView.getUint32(3, false) / 10000).toFixed(3))
  console.log('电压表读取电压值:', voltage);
  Log.info('电压表读取电压值:', voltage);
  context.createLeftSpanMessage('电压表读取电压值: ' + voltage + ' V')
  context.voltmeterReadVoltageValue = voltage
  return false
}

