import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function settingEnergyError(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20) !== 0X68 ||
    dataView.getUint8(23) !== 0X68 ||
    dataView.getUint8(24) !== 0X80 ||
    dataView.getUint8(25) !== 0X84 ||
    dataView.getUint8(30) !== 0X0c ||
    dataView.getUint8(32) !== 0X18
}
