import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

export function decodeGetProductNameWAC300CD(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 30; i <= 53; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}
