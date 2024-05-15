export const ab2hex = (buffer) => {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
    }
  );
  return hexArr.join('');
}

/**
 * 合并 ArrayBuffer
 * @param  {...any} arrays
 */
export const mergeArrayBuffer = (...arrays) => {
  let totalLen = 0;
  for (let i = 0; i < arrays.length; i++) {
    // 全部转成Uint8Array
    arrays[i] = new Uint8Array(arrays[i]);

    totalLen += arrays[i].length;
  }

  let res = new Uint8Array(totalLen);

  let offset = 0;
  for (let arr of arrays) {
    res.set(arr, offset);

    offset += arr.length;
  }

  return res.buffer;
}

/**
 * Array 2 Hex
 * @param {*} buffer
 */
export const arrayBuffer2Hex = (buffer) => {
  return Array.prototype.map.call(new Uint8Array(buffer), x => x.toString(16).padStart(2, '0')).join('');
}

export const hex2arrayBuffer = function (hex) {
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16);
  }));
  return typedArray.buffer;
};

export const fillZeroLeft = (str, length) => {
  if (str || str === 0) {
    if (typeof (str) !== 'string') {
      str += '';
    }

    const strLength = str.length;
    if (strLength < length) {
      for (let i = 0, len = length - strLength; i < len; i++) {
        str = '0' + str;
      }
    }
  }
  return str;
}

/**
 * 字节 转 hex字符串
 * @param b
 * @returns {string}
 */
export const byte2HexStr = (b) => {
  return ('00' + b.toString(16)).slice(-2);
}

/**
 * 左填充0
 * @param obj
 * @param len
 * @returns {string}
 */
export const fillLeftZero = (obj, len) => {
  return (new Array(len + 1).join('0') + obj).slice(-len);
}

/**
 * 小数
 * @param str
 * @returns {string}
 */
export const clearDots = (str) => {
  const num = Number(str).toFixed(2).toString()
  return num.split('.')
}

/**
 * 日期 月-日
 * @param str
 * @returns {string}
 */
export const clearLine = (str) => {
  return str.replace(/-/g, "")
}

/**
 * 时间 时-分
 * @param str
 * @returns {string}
 */
export const clearColon = (str) => {
  return str.replace(/:/g, "")
}

// 深拷贝
export const deepClone = (obj) => {
  const objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        objClone[key] = deepClone(obj[key])
      } else {
        objClone[key] = obj[key]
      }
    }
  }
  return objClone
}

// 判断数字是否有小数
export const judgeDecimals = (num) => {
  if (String(num).indexOf('.') == -1) {
    return 0
  } else {
    let x = String(num).indexOf('.') + 1; // 小数点的位置
    let y = String(num).length - x; // 小数的位数
    // 返回小数点后的个数
    return y
  }
}

// 判断是否为BRF模块直连
export const judgeBEF = (modelTxt) => {
  return modelTxt == 'LRT400' || modelTxt == 'WAC300' || modelTxt == 'WAC300C' ||
    modelTxt == 'WAC300NH' || modelTxt == 'WAC330NE' || modelTxt == 'WAC400' ||
    modelTxt == 'NTC100' || modelTxt == 'NBT200' || modelTxt == 'WAC330N'
}


// Modbus 协议 计算CRC
export const calculateCRC = (buffer) => {
  let crc = 0xFFFF;
  const length = buffer.byteLength;

  for (let i = 0; i < length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x0001) !== 0) {
        crc >>= 1;
        crc ^= 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }

  return crc;
}

export const calculateCRCByte = (buffer, isHigh) => {
  const crc = calculateCRC(new Uint8Array(buffer));
  if (isHigh) {
    return (crc >> 8) & 0xFF; // 返回CRC高位
  } else {
    return crc & 0xFF; // 返回CRC低位
  }
}

export const calculateCSByte = (buffer) => {
  let bodySum = 0
  let bodyDataView = new DataView(buffer)
  for (let i = 0; i < buffer.byteLength; i++) {
    bodySum += bodyDataView.getUint8(i)
  }
  return bodySum;
}

export const calculateCSByteCover = (buffer) => {
  let bodySum = 0
  let bodyDataView = new DataView(buffer)
  for (let i = 0; i < buffer.byteLength; i++) {
    bodySum += bodyDataView.getUint8(i)
  }
  // 取校验和的低位字节
  return bodySum & 0xFF;
}

/*
*  十六进制字符串转换为 IEEE 754 浮点数
* */
export function hexToFloat(hexString) {
  // 转换 Buffer
  const buffer = Buffer.from(hexString, 'hex');

  // 如果 Buffer 的长度不是 4，说明无法转换为 IEEE 754 浮点数
  if (buffer.length !== 4) {
    throw new Error('Hex string must be 4 bytes long');
  }
  // 3EC2BA82
  // C2BA82A5
  // 使用 readFloatBE 从 Buffer 中读取 IEEE 754 浮点数
  return buffer.readFloatBE(0);
}

export function addressCover(address) {
  let byteArray = [];
  for (let i = 0; i < address.length; i += 2) {
    byteArray.unshift(parseInt(address.substr(i, 2), 16));
  }
  return byteArray

}
