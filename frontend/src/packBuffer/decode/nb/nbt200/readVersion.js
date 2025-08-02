import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetVersion} from "@/packBuffer/decode/nb/nbt200/decodeValue.js";

export function decodeReadVersionVerifyNBT200(context, responseMessage, type) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(16)!==0x68
    || dataView.getUint8(19)!==0x68
    || dataView.getUint8(20)!==0x80
    || dataView.getUint8(26)!==0x05
    || dataView.getUint8(28)!==0x09
  context.readVersion = decodeGetVersion(responseMessage)
  if (type === 'one') {
    context.createLeftSpanMessage('读取设备版本号成功:' + context.readVersion, 'grey')
  } else {
    context.createRightSpanMessage('读取设备版本号成功:' + context.readVersion, 'grey')
  }
  console.log('版本：', context.readVersion)
  return result
}
