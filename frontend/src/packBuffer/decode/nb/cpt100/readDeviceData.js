import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

// 读设备数据
export function readDeviceData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let power
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //控制域
    dataView.getUint8(21) !== 0x84 || //协议id
    dataView.getUint8(26) !== 0x0C || //fn
    dataView.getUint8(28) !== 0x11  //afn
  if (!notPass) {
    power = dataView.getUint32(38, true).toString(16).padStart(8, '0')
  }
  console.log('CPT100读功率:', power)
  context.deviceReadPower = power
  return notPass
}
