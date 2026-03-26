import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function forcedTemperatureSetting(responseMessage, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if (!isInfraredDevice) {
    return dataView.getUint8(3) !== 0x68 || dataView.getUint8(14) !== 0xa0 || dataView.getUint8(15) !== 0x22
  } else {
    return dataView.getUint8(28) !== 0x68 || dataView.getUint8(39) !== 0xa0 || dataView.getUint8(40) !== 0x22
  }

}
