// 电压表读功率
import {hex2arrayBuffer, hexToFloat} from "@/packBuffer/common/comUtil";

export function readAmmeterPower(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let power = dataView.getUint32(3, false).toString(16).padStart(8, '0')
  console.log(power)
  power = Number(hexToFloat(power))*1000
  console.log('电压表读功率:', power)
  context.voltmeterReadPower = power
  return false
}
