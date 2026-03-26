import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writePowerOutagesAndWirelessAnomalies(responseMessage, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if (!isInfraredDevice) {
    return dataView.getUint8(3) !== 0x68
      || dataView.getUint8(12) !== 0x84
      || dataView.getUint8(14) !== 0xa0
      || dataView.getUint8(15) !== 0x26
  } else {
    return dataView.getUint8(23) !== 0x68
      || dataView.getUint8(32) !== 0x84
      || dataView.getUint8(34) !== 0xa0
      || dataView.getUint8(35) !== 0x26
  }


}
