import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
export function decodeCheckAwakenWAC230CF(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(19) !== 0X68 ||
    dataView.getUint8(20) !== 0X80 ||
    dataView.getUint8(21) !== 0X8B
}
export function decodeCheckAwakenWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80||
    dataView.getUint8(5) !== 0X8D
}

export function decodeCheckAwakenWAC300CD(responseMessage) {

}
