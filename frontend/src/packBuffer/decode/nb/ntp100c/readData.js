import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {
  decodeGetReadInTemperature,
  decodeGetReadOutTemperature
} from "@/packBuffer/decode/nb/ntp100c/decodeValue";

export function readData(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80 ||
    dataView.getUint8(26) !== 0x0C ||
    dataView.getUint8(28) !== 0X0A
  if (!notPass) {
    context.readInTemperature = decodeGetReadInTemperature(responseMessage)
    context.readOutTemperature = decodeGetReadOutTemperature(responseMessage)
    console.warn('NTP100C 读取进温度：', context.readInTemperature, '℃');
    console.warn('NTP100C 读取回温度：', context.readOutTemperature, '℃');

  }
  return notPass
}

