import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

export function decodeGetProductNameWAC230CF(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 63; i <= 86; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}
