import {hex2arrayBuffer, hexToFloat} from "@/packBuffer/common/comUtil";

export function deviceReadsCurrent(responseMessage, context) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(19) !== 0xFE ||
    dataView.getUint8(20) !== 0xFE ||
    dataView.getUint8(21) !== 0xFE ||
    dataView.getUint8(22) !== 0x68 ||
    dataView.getUint8(23) !== 0x46 ||
    dataView.getUint8(31) !== 0x84 ||
    dataView.getUint8(33) !== 0xCC ||
    dataView.getUint8(34) !== 0x0D
  if (notPass) {
    return notPass
  }

  let deviceCurrentADValue = dataView.getUint32(36, false).toString(16).padEnd(8,'0')
  console.log('读设备电流ad值:', deviceCurrentADValue)
  let deviceCurrent = hexToFloat(deviceCurrentADValue, false)
  deviceCurrent = Number(deviceCurrent / 1000).toFixed(4)
  console.log('vac130设备电流值:', deviceCurrent)
  context.createLeftSpanMessage('设备电流值: ' + deviceCurrent + ' mA')
  context.vac130DeviceCurrentValue = deviceCurrent
}
