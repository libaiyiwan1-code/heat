import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readAddress(context, responseMessage, type, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let address = '';
  if (!isInfraredDevice) {
    for (let i = 5; i <= 11; i++) {
      const byteValue = dataView.getUint8(i);
      address += byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    }
  } else {
    for (let i = 24; i <= 30; i++) {
      const byteValue = dataView.getUint8(i);
      address += byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    }
  }

  console.log('解析地址：', address)
  if (type === 'one') {
    context.leftReadAddress = address
  } else {
    context.rightReadAddress = address
  }
  return false
}
