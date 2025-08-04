import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {
  decodeGetReadOutTemperature
} from "@/packBuffer/decode/nb/ct1000/decodeValue";

export function decodeReadDataCT1000(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80 ||
    dataView.getUint8(26) !== 0x0C ||
    dataView.getUint8(28) !== 0X0A
  if (!notPass) {
    context.readOutTemperature = decodeGetReadOutTemperature(responseMessage)
    console.warn('CT1000 读取进温度：', context.readInTemperature, '℃');

  }
  return notPass
}

