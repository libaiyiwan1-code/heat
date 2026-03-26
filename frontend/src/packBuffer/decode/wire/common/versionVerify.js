import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function readVersionVerify(context, responseMessage, type, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let result
  if (!isInfraredDevice) {
    result = dataView.getUint8(3) !== 0x68
      || dataView.getUint8(12) !== 0x81
      || dataView.getUint8(14) !== 0xb0
      || dataView.getUint8(15) !== 0x05
  } else {
    result = dataView.getUint8(22) !== 0x68
      || dataView.getUint8(31) !== 0x81
      || dataView.getUint8(33) !== 0xb0
      || dataView.getUint8(34) !== 0x05
  }

  context.readVersion = decodeGetVersion(responseMessage, isInfraredDevice)
  if (type === 'one') {
    context.createLeftSpanMessage('读取设备版本号成功:' + context.readVersion, 'grey')
  } else {
    context.createRightSpanMessage('读取设备版本号成功:' + context.readVersion, 'grey')
  }
  console.log('版本：', context.readVersion)
  return result
}

export function decodeGetVersion(responseMessage, isInfraredDevice) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  let index;
  if (!isInfraredDevice) {
    index = 17
  } else {
    index = 36
  }
  let version = dataView.getUint8(index);
  return (version * 0.1).toFixed(1).toString();
}
