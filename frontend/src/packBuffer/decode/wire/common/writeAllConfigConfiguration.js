import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeAllConfigConfiguration(responseMessage, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if (!isInfraredDevice) {
    return dataView.getUint8(3) !== 0x68
      || dataView.getUint8(12) !== 0x84
      || dataView.getUint8(14) !== 0xac
      || dataView.getUint8(15) !== 0x02
  } else {
    return dataView.getUint8(50) !== 0x68
      || dataView.getUint8(59) !== 0x84
      || dataView.getUint8(62) !== 0xac
      || dataView.getUint8(63) !== 0x02
  }

}
