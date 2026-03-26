import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function fullOffCalibrationVerify(responseMessage, context, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  if (!isInfraredDevice){
    return dataView.getUint8(3) !== 0x68
      || dataView.getUint8(12)  !== 0x84
      || dataView.getUint8(14)  !== 0xcc
      || dataView.getUint8(15)  !== 0xff
  }else{
    return dataView.getUint8(22) !== 0x68
      || dataView.getUint8(31)  !== 0x84
      || dataView.getUint8(33)  !== 0xcc
      || dataView.getUint8(34)  !== 0xff
  }
}
