import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {
  decodeGetReadInTemperature,
  decodeGetReadOutTemperature
} from "@/packBuffer/decode/nb/wac300lh/decodeValue";

export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x78 ||
    dataView.getUint8(27) !== 0x90 ||
    dataView.getUint8(28) !== 0x20

  if (!notPass) {
    context.readInTemperature = decodeGetReadInTemperature(responseMessage)
    context.readOutTemperature = decodeGetReadOutTemperature(responseMessage)
    console.warn('wac300lh 读取进温度：', context.readInTemperature, '℃');
    console.warn('wac300lh 读取回温度：', context.readOutTemperature, '℃');
  }
  return notPass
}

