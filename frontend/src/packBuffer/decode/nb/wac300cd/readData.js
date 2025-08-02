import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {
  decodeGetReadInTemperature,
  decodeGetReadOutTemperature
} from "@/packBuffer/decode/nb/wac300cd/decodeValue";

export function decodeReadDataWAC300CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(33) !== 0x68 ||
    dataView.getUint8(36) !== 0x68 ||
    dataView.getUint8(37) !== 0x80 ||
    dataView.getUint8(38) !== 0x8E ||
    dataView.getUint8(60) !== 0x90 ||
    dataView.getUint8(61) !== 0x20
  if (!notPass) {
    context.readInTemperature = decodeGetReadInTemperature(responseMessage)
    context.readOutTemperature = decodeGetReadOutTemperature(responseMessage)
    console.warn('WAC300CD 读取进温度：', context.readInTemperature, '℃');
    console.warn('WAC300CD 读取回温度：', context.readOutTemperature, '℃');
  }
  return notPass
}

