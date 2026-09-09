import {calculateCRCByte, calculateCSByte, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {
  cj88PackDataDomains,
  modbusPackDataDomains,
  nbPackDataDomains,
  packCJ88StartHead,
  packCSTail,
  packDoubleStartHead,
  packInlineDataDomains,
  packOutLineTransparentTransmission,
  packSingleStartHead,
  packWireDeviceDataDomains,
  packWireDeviceStartHead
} from "@/packBuffer/common/common";

const Log = require('ee-core/log');


/**
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context vue 引用
 * */
export function outlineExecute(afn, fn, protocolID, context) {
  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const headBuffer = packSingleStartHead(protocolID);
  const bodyBuffer = packInlineDataDomains(afn, fn, protocolID, context);
  const tailBuffer = packCSTail(mergeArrayBuffer(headBuffer, bodyBuffer));
  let mergeBuffer1 = mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer)
  let mergeBuffer2 = mergeArrayBuffer(packOutLineTransparentTransmission(protocolID, mergeBuffer1.byteLength), mergeBuffer1)
  const endBuffer = packCSTail(mergeBuffer2);
  const outLineHeadBuffer = packDoubleStartHead(protocolID, mergeBuffer2.byteLength);
  return Buffer.from(mergeArrayBuffer(outLineHeadBuffer, mergeBuffer2, endBuffer));
}

/**
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context vue 引用
 * */
export function nbExecute(afn, fn, protocolID, context) {
  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const bodyBuffer = nbPackDataDomains(afn, fn, protocolID, context);
  const headBuffer = packDoubleStartHead(protocolID, bodyBuffer.byteLength);
  const tailBuffer = packCSTail(bodyBuffer);
  return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer));
}


/**
 * UTM 串口组包
 * @param {Object} uplinkCommunicationTarget - 上行通讯目标配置
 * @param {number} uplinkCommunicationTarget.baudRate - 波特率 (1200, 2400, 4800, 9600, 38400, 115200)
 * @param {string} uplinkCommunicationTarget.method - 通讯方式
 * @param {string} uplinkCommunicationTarget.checkDigit - 校验位 (无校验, 奇校验, 偶校验)
 * @param {boolean} uplinkCommunicationTarget.includeUTM100Device - 是否包含UTM100设备
 * @returns {ArrayBuffer}
 */
export function getUTM100HeadBuffer(uplinkCommunicationTarget) {
  const {baudRate = 2400, method = 'INFRARED', checkDigit = '偶校验'} = uplinkCommunicationTarget;
  // 通讯波特率映射（BCD码）
  const baudRateMap = {
    1200: 0x01, 2400: 0x02, 4800: 0x03,
    9600: 0x04, 38400: 0x05, 115200: 0x06
  };

  // 通讯校验映射（BCD码）
  const checkDigitMap = {
    '无校验': 0x01, '奇校验': 0x02, '偶校验': 0x03
  };

  // 通讯接口选择映射（HEX）
  const methodMap = {
    'TTL': 0x80, 'INFRARED': 0x40, 'RS485': 0x20,
    'MBUS': 0x10, 'RS232': 0x04, 'WIRELESS': 0x02
  };
  const buffer = new ArrayBuffer(3);
  const dataView = new DataView(buffer);
  dataView.setUint8(0, baudRateMap[baudRate]);
  dataView.setUint8(1, checkDigitMap[checkDigit]);
  dataView.setUint8(2, methodMap[method]);

  return buffer;
}


/**
 * cj88协议组包
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context vue 引用
 * */
export function cj88Execute(afn, fn, protocolID, context) {
  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const bodyBuffer = cj88PackDataDomains(afn, fn, protocolID, context);
  const headBuffer = packCJ88StartHead(protocolID);
  const tailBuffer = packCSTail(mergeArrayBuffer(headBuffer, bodyBuffer));
  return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer));
}


/**
 * MODBUS 协议组包（支持 UTM100 设备）
 * @description 组装 MODBUS 协议报文，根据是否包含 UTM100 设备决定是否添加外层包头和 CS 校验
 * @param {string} afn - 应用层功能码
 * @param {string} fn - 功能码
 * @param {Object} context - Vue 组件上下文
 * @param {Object} uplinkCommunicationTarget - 上行通讯目标配置
 * @param {number} uplinkCommunicationTarget.baudRate - 波特率 (1200, 2400, 4800, 9600, 38400, 115200)
 * @param {string} uplinkCommunicationTarget.method - 通讯方式
 * @param {string} uplinkCommunicationTarget.checkDigit - 校验位 (无校验, 奇校验, 偶校验)
 * @param {boolean} uplinkCommunicationTarget.includeUTM100Device - 是否包含UTM100设备
 * @returns {Buffer} 完整的协议报文 Buffer
 * @example
 * const buffer = executeUTM100MODBUSPackBuffer('06', 'calibratedZeroMegapascals', context, {
 *   baudRate: 2400,
 *   method: 'MODBUS',
 *   checkDigit: '偶校验',
 *   includeUTM100Device: false
 * });
 */
export function modbusExecute(afn, fn, context, uplinkCommunicationTarget) {
  Log.info(`execute: modbusExecute[${afn}] fn[${fn}]`);

  const includeUTM100Device = uplinkCommunicationTarget.includeUTM100Device;

  // 1. 组装数据域（body）
  const bodyBuffer = modbusPackDataDomains(afn, fn, context);

  // 2. 计算 CRC16 校验码（低字节在前）
  const crcLow = calculateCRCByte(bodyBuffer, false);
  const crcHigh = calculateCRCByte(bodyBuffer, true);

  // 3. 构建 CRC Buffer（2字节）
  const crcBuffer = new Uint8Array([crcLow, crcHigh]).buffer;

  // 4. 合并 body + CRC
  let resultBuffer = mergeArrayBuffer(bodyBuffer, crcBuffer);

  // 5. 如果是 UTM100 设备，添加外层包头和 CS 校验
  if (includeUTM100Device) {
    // 5.1 组装协议头
    const headBuffer = getUTM100HeadBuffer(uplinkCommunicationTarget);

    // 5.2 重新合并 head + body + CRC
    resultBuffer = mergeArrayBuffer(headBuffer, bodyBuffer, crcBuffer);

    // 5.3 计算 CS 校验和（1字节）
    const csByte = calculateCSByte(resultBuffer);

    // 5.4 追加 CS 校验字节到末尾
    resultBuffer = mergeArrayBuffer(resultBuffer, new Uint8Array([csByte]).buffer);
  }

  return Buffer.from(resultBuffer);
}


/**
 * MODBUS 协议组包（支持 UTM100 设备）
 * @description 组装 MODBUS 协议报文，根据是否包含 UTM100 设备决定是否添加外层包头和 CS 校验
 * @param {string} afn - 应用层功能码
 * @param {string} fn - 功能码
 * @param {Object} context - Vue 组件上下文
 * @param {Object} uplinkCommunicationTarget - 上行通讯目标配置
 * @param {number} uplinkCommunicationTarget.baudRate - 波特率 (1200, 2400, 4800, 9600, 38400, 115200)
 * @param {string} uplinkCommunicationTarget.method - 通讯方式
 * @param {string} uplinkCommunicationTarget.checkDigit - 校验位 (无校验, 奇校验, 偶校验)
 * @param {boolean} uplinkCommunicationTarget.includeUTM100Device - 是否包含UTM100设备
 * @returns {Buffer} 完整的协议报文 Buffer
 * @example
 * const buffer = executeUTM100MODBUSPackBuffer('06', 'calibratedZeroMegapascals', context, {
 *   baudRate: 2400,
 *   method: 'MODBUS',
 *   checkDigit: '偶校验',
 *   includeUTM100Device: false
 * });
 */
export function utt100NBExecute(afn, fn, context, uplinkCommunicationTarget, protocolID) {

  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  let resultBuffer;

  // 5.1 组装协议头
  const utm100HeadBuffer = getUTM100HeadBuffer(uplinkCommunicationTarget);

  // 1. 组装数据域（body）
  const bodyBuffer = nbPackDataDomains(afn, fn, protocolID, context);

  const headBuffer = packDoubleStartHead(protocolID, bodyBuffer.byteLength);
  const tailBuffer = packCSTail(bodyBuffer);

  // 5.2 重新合并 head + body + CRC
  resultBuffer = mergeArrayBuffer(utm100HeadBuffer,headBuffer, bodyBuffer, tailBuffer);

  // 5.3 计算 CS 校验和（1字节）
  const csByte = calculateCSByte(resultBuffer);

  // 5.4 追加 CS 校验字节到末尾
  resultBuffer = mergeArrayBuffer(resultBuffer, new Uint8Array([csByte]).buffer);

  return Buffer.from(resultBuffer);
}


/**
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context 上下文对象
 * @param {string} type 左或右侧工装
 * @param withStartFrame 是否包含起始帧
 * */
export function wireExecute(afn, fn, protocolID, context, type, withStartFrame = false) {
  Log.info("execute: wireExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const bodyBuffer = packWireDeviceDataDomains(afn, fn, protocolID, context, type);
  const headBuffer = packWireDeviceStartHead(protocolID);
  const tailBuffer = packCSTail(mergeArrayBuffer(headBuffer, bodyBuffer));
  if (withStartFrame) {
    return Buffer.from(mergeArrayBuffer([0xfe, 0xfe, 0xfe], headBuffer, bodyBuffer, tailBuffer));
  } else {
    return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer));
  }

}









