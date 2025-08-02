import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {
  decodeGetDifferentialPressure,
  decodeGetReadInTemperature,
  decodeGetReadOutTemperature
} from "@/packBuffer/decode/nb/wac710cd/decodeValue";

export function decodeReadDataWAC710CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x8D ||
    dataView.getUint8(27) !== 0x90 ||
    dataView.getUint8(28) !== 0x20
  if (!notPass) {
    context.readDifferentialPressure = decodeGetDifferentialPressure(responseMessage)
    console.log('压差未保留小数:', context.readDifferentialPressure)
    console.log('压差:', context.readDifferentialPressure.toFixed(4))
    context.readInTemperature = decodeGetReadInTemperature(responseMessage)
    context.readOutTemperature = decodeGetReadOutTemperature(responseMessage)
  }
  return notPass
}

