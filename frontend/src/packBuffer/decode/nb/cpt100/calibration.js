import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function calibration(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17) !== 0X68 ||
    dataView.getUint8(20) !== 0X68 ||
    dataView.getUint8(21) !== 0X80 ||
    dataView.getUint8(22) !== 0X84 ||
    dataView.getUint8(27) !== 0X0c ||
    dataView.getUint8(28) !== 0X12
}
