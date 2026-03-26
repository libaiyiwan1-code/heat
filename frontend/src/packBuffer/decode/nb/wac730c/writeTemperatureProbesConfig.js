import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";



export function writeTemperatureProbesConfig(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80||
    dataView.getUint8(5) !== 0X94 ||
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(17) !== 0X94 ||
    dataView.getUint8(27) !== 0XAC ||
    dataView.getUint8(28) !== 0X09
}



