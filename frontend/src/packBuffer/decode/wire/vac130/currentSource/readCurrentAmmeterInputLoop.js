import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
const Log = require('ee-core/log');

export function readCurrentAmmeterInputLoop(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let current = parseFloat(Number(dataView.getUint32(3, false) / 1000).toFixed(3))
  console.log('电流表读取电流值:', current);
  Log.info('电流表读取电流值:', current);
  context.createLeftSpanMessage('电流表读取电流值: ' + current + ' mA')
  context.ammeterReadCurrentValue = current
  return false
}
