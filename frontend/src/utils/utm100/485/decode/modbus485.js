
/*
* 读取485压力 解析
* */

export function decodeReadPressureHex(messageStr) {
  let hexString = '';
  for (let i = 13; i < 21; i++) {
    hexString += messageStr.charAt(i);
  }
  return hexString;
}
