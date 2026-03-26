/**
 * 地址转换
 * @param {string} address - 16进制字符串地址
 * @returns {Array} - 返回一个字节数组
 * */
 function addressCover(address) {
  let byteArray = [];
  for (let i = 0; i < address.length; i += 2) {
    byteArray.unshift(parseInt(address.substr(i, 2), 16));
  }
  return byteArray

}
const arrayBuffer2Hex = (buffer) => {
  return Array.prototype.map.call(new Uint8Array(buffer), x => x.toString(16).padStart(2, '0')).join('');
}


console.log(addressCover('45054188'))
console.log(arrayBuffer2Hex(addressCover('45054188')))
