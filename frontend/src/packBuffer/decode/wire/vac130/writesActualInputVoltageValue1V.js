import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writesActualInputVoltageValue1V(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if (dataView.getUint8(42)!==0x01){
    context.createLeftSpanMessage('1V写入-标定失败','red')
    return true
  }
  return dataView.getUint8(26) !== 0x68
    ||dataView.getUint8(27)!==0x46
    ||dataView.getUint8(35)!==0x84
    ||dataView.getUint8(36)!==0x06
    ||dataView.getUint8(37)!==0xCC
    ||dataView.getUint8(38)!==0x0B

}
