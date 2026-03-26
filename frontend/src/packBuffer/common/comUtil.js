const Log = require('ee-core/log');


/**
 * 检查是否是自发送的数据
 * @param {string} responseMessage - 响应消息
 * @param {string} requestMessage - 请求消息
 * @returns {boolean} - 如果是自发送的数据返回 true，否则返回 false
 *
 * */
export function checkSpontaneous(responseMessage, requestMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  requestMessage = requestMessage.replace(/\s/g, '');
  return responseMessage.toLowerCase() === requestMessage.toLowerCase();

}

export function getDataView(responseMessage) {
  return new DataView(hex2arrayBuffer(responseMessage))
}
export function isStatusNotPass(dataView, offset) {
  const v = dataView.getUint8(offset)
  return v !== 0x01 && v !== 0x02
}
export function report(context, msg,isPass=true) {
  if (isPass){
    context.createLeftSpanMessage(msg, 'grey')
  }else{
    context.createLeftSpanMessage(msg, 'red')
  }
  console.error(msg)
  Log.error(msg)
}
/**
 * 合并 ArrayBuffer
 * @param  {...any} arrays - 要合并的 ArrayBuffer
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
 * ArrayBuffer 转换为十六进制字符串
 * @param {Array} buffer - 要转换的 ArrayBuffer
 * @returns {string} - 转换后的十六进制字符串
 */
export const arrayBuffer2Hex = (buffer) => {
  return Array.prototype.map.call(new Uint8Array(buffer), x => x.toString(16).padStart(2, '0')).join('');
}


/**
 * 十六进制字符串转换为 ASCII 字符
 * @param {string} hexString - 要转换的十六进制字符串
 * @returns {string} - 转换后的 ASCII 字符串
 * */
export function hexToAscii(hexString) {
  let asciiString = '';
  for (let i = 0; i < hexString.length; i += 2) {
    // 获取每两个字符组成的十六进制数
    const hex = hexString.substr(i, 2);
    // 将十六进制数转换为十进制数
    const decimal = parseInt(hex, 16);
    // 如果是可打印字符（ASCII码在32~126之间），则添加对应的 ASCII 字符
    if (decimal >= 32 && decimal <= 126) {
      asciiString += String.fromCharCode(decimal);
    } else {
      console.log(decimal)
      // 如果遇到不可打印字符，则不添加到结果中
      // 可根据需要添加其他处理逻辑，比如替换为空格或忽略等
      break;
    }
  }
  return asciiString;
}

/**
 * 16进制字符串转换为 ArrayBuffer
 * @param {hex} hex - 要转换的十六进制字符串
 * */
export const hex2arrayBuffer = function (hex) {
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16);
  }));
  return typedArray.buffer;
};


/**
 * 计算 CS 校验和
 * @param buffer - 要计算的 ArrayBuffer
 *
 * */
export const calculateCSByte = (buffer) => {
  let bodySum = 0
  let bodyDataView = new DataView(buffer)
  for (let i = 0; i < buffer.byteLength; i++) {
    bodySum += bodyDataView.getUint8(i)
  }
  return bodySum & 0XFF;
}

/**
 *  十六进制字符串转换为 IEEE 754 浮点数
 *   @param {string} hexString - 要转换的十六进制字符串 长度必须为4字节（8个十六进制字符）
 *   @param {boolean} isLittleEndian - 是否为小端序-逆序读
 *   @returns {number} - 转换后的浮点数
 * */
export function hexToFloat(hexString, isLittleEndian = false) {
  console.log(hexString)
  const buffer = Buffer.from(hexString, 'hex');
  if (buffer.length !== 4) {
    throw new Error('Hex string to float conversion failed: Input must be 4 bytes long');
  }
  if (isLittleEndian) {
    return buffer.readFloatLE(0);
  } else {
    return buffer.readFloatBE(0);
  }
}

/**
 * crc 校验算法
 * @param buffer - 要计算的 ArrayBuffer
 * @param isHigh - 是否返回高位
 * @returns {number} - 返回计算得到的 CRC 校验值
 * */
export const calculateCRCByte = (buffer, isHigh) => {
  const crc = calculateCRC(new Uint8Array(buffer));
  if (isHigh) {
    return (crc >> 8) & 0xFF; // 返回CRC高位
  } else {
    return crc & 0xFF; // 返回CRC低位
  }
}
// Modbus 协议 计算CRC
 const calculateCRC = (buffer) => {
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
/**
 * 将 IEEE 754 float 浮点数转换为 4 字节十六进制 Buffer
 * @param {number} floatValue - 要转换的浮点数
 * @param {boolean} isLittleEndian - 是否为小端序-逆序读
 * @returns {Buffer} - 表示该浮点数的 4 字节 Buffer（大端序）
 */
export function floatToHexBuffer(floatValue, isLittleEndian = false) {
 console.log('转换值:',floatValue)
  const buffer = Buffer.alloc(4);
  if (isLittleEndian) {
    buffer.writeFloatLE(floatValue, 0);
  } else {
    buffer.writeFloatBE(floatValue, 0);
  }
  return buffer;
}

/**
 * 地址转换
 * @param {string} address - 16进制字符串地址
 * @returns {Array} - 返回一个字节数组
 * */
export function addressCover(address) {
  let byteArray = [];
  for (let i = 0; i < address.length; i += 2) {
    byteArray.unshift(parseInt(address.substr(i, 2), 16));
  }
  return byteArray

}

/**
 * 验证 IMEI 号
 * @param {string} imei - 要验证的 IMEI 号
 * 验证规则：
 * 1. 长度必须为 15 位
 * 2. 必须以 8 开头
 *
 * */
export function checkIMEI(imei) {
  return !imei || imei.length !== 15 || !/^8/.test(imei);

}

/**
 * 验证 ICCID 号
 * @param {string} iccid - 要验证的 ICCID 号
 * 验证规则：
 * 1. 长度必须为 20 位
 * 2. 必须以 8 开头
 *
 * */
export function checkICCID(iccid) {
  return !iccid || iccid.length !== 20 || !/^8/.test(iccid)

}
