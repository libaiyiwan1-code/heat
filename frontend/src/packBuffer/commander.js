import {arrayBuffer2Hex, calculateCRCByte, calculateCSByte, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {
  packCSTail,
  nbPackDataDomains,
  packDoubleStartHead,
  packInlineDataDomains,
  packOutLineTransparentTransmission,
  packSingleStartHead,
  packWireDeviceDataDomains,
  packWireDeviceStartHead,
  cj88PackDataDomains,
  packCJ88StartHead,
  modbusPackDataDomains, modbusUTM100485PackDataDomains, modbusUTM100CPT100PackDataDomains, nbUTM100PackDataDomains
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
 *  @param {string} afn 内层包 afn
 *  @param {string} fn 内层包 fn
 *  @param context vue 引用
 *
 * */

export function nbProtocolTypeIsModbusExecute(afn, fn, context) {
  Log.info("execute: modbusExecute[", afn, "] fn[", fn, "]");
  const bodyBuffer = modbusPackDataDomains(afn, fn, context);

  //MODBUS CRC校验 低字节在前
  let CRCBuffer = new ArrayBuffer(2)
  let CRCDataView = new DataView(CRCBuffer)

  const crcHigh = calculateCRCByte(bodyBuffer, true);
  const crcLow = calculateCRCByte(bodyBuffer, false);
  CRCDataView.setUint8(0, crcLow)
  CRCDataView.setUint8(1, crcHigh)

  return Buffer.from(mergeArrayBuffer(bodyBuffer, CRCBuffer));
}


/**
 *  @param {string} afn 内层包 afn
 *  @param {string} fn 内层包 fn
 *  @param context vue 引用
 *
 * */

export function nbProtocolTypeIsUTM100CPT100ModBUSExecute(afn, fn, context) {
  Log.info("execute: modbusExecute[", afn, "] fn[", fn, "]");
  let ptc100AgreementPropertiesBuffer = getUTM100CPT100AgreementPropertiesBuffer();
  const bodyBuffer = modbusUTM100CPT100PackDataDomains(afn, fn, context);
  let csByte = calculateCSByte(bodyBuffer)
  let tailBuffer = new ArrayBuffer(2)
  let tailDataView = new DataView(tailBuffer)
  tailDataView.setUint8(0, csByte)
  tailDataView.setUint8(1, 0x16)
  let resultBuffer = mergeArrayBuffer(ptc100AgreementPropertiesBuffer, bodyBuffer, tailBuffer)
  let csAllByte = calculateCSByte(resultBuffer)
  let endBuffer = new ArrayBuffer(1)
  let endDataView = new DataView(endBuffer)
  endDataView.setUint8(0, csAllByte);
  return Buffer.from(mergeArrayBuffer(resultBuffer,endBuffer));
}


/**
 *  @param {string} afn 内层包 afn
 *  @param {string} fn 内层包 fn
 *  @param context vue 引用
 *
 * */

export function nbProtocolTypeIsUTM100485ModBUSExecute(afn, fn, context) {
  Log.info("execute: modbusExecute[", afn, "] fn[", fn, "]");
  let ptc100AgreementPropertiesBuffer = getUTM100VoltmeterAgreementPropertiesBuffer();
  const bodyBuffer = modbusUTM100485PackDataDomains(afn, fn, context);
  let csByte = calculateCSByte(bodyBuffer)
  let tailBuffer = new ArrayBuffer(2)
  let tailDataView = new DataView(tailBuffer)
  tailDataView.setUint8(0, csByte)
  tailDataView.setUint8(1, 0x16)
  let resultBuffer = mergeArrayBuffer(ptc100AgreementPropertiesBuffer, bodyBuffer, tailBuffer)
  let csAllByte = calculateCSByte(resultBuffer)
  let endBuffer = new ArrayBuffer(1)
  let endDataView = new DataView(endBuffer)
  endDataView.setUint8(0, csAllByte);
  return Buffer.from(mergeArrayBuffer(resultBuffer,endBuffer));
}
/**
 *  @param {string} afn 内层包 afn
 *  @param {string} fn 内层包 fn
 *  @param context vue 引用
 *
 * */

export function nbProtocolTypeIsUTM100CPT100Execute(afn, fn, context) {
  Log.info("execute: modbusExecute[", afn, "] fn[", fn, "]");
  let ptc100AgreementPropertiesBuffer = getUTM100CPT100AgreementPropertiesBuffer();
  const bodyBuffer = nbUTM100PackDataDomains(afn, fn, context);
  let csByte = calculateCSByte(bodyBuffer)
  let tailBuffer = new ArrayBuffer(2)
  let tailDataView = new DataView(tailBuffer)
  tailDataView.setUint8(0, csByte)
  tailDataView.setUint8(1, 0x16)
  let resultBuffer = mergeArrayBuffer(ptc100AgreementPropertiesBuffer, bodyBuffer, tailBuffer)
  let csAllByte = calculateCSByte(resultBuffer)
  let endBuffer = new ArrayBuffer(1)
  let endDataView = new DataView(endBuffer)
  endDataView.setUint8(0, csAllByte);
  return Buffer.from(mergeArrayBuffer(resultBuffer,endBuffer));
}




/**
 * CPT100串口协议组包
 * @returns {ArrayBuffer}
 */
function getUTM100CPT100AgreementPropertiesBuffer() {
  let ptc100AgreementPropertiesBuffer = new ArrayBuffer(3)
  let ptc100AgreementPropertiesBufferDataView = new DataView(ptc100AgreementPropertiesBuffer)
  ptc100AgreementPropertiesBufferDataView.setUint8(0, 0x04) //波特率9600
  ptc100AgreementPropertiesBufferDataView.setUint8(1, 0x01)// 无校验
  ptc100AgreementPropertiesBufferDataView.setUint8(2, 0x20)// RS-485 通讯
  return ptc100AgreementPropertiesBuffer;
}


/**
 * UTM100电压表串口协议组包
 * @returns {ArrayBuffer}
 */
function getUTM100VoltmeterAgreementPropertiesBuffer() {
  let ptc100AgreementPropertiesBuffer = new ArrayBuffer(3)
  let ptc100AgreementPropertiesBufferDataView = new DataView(ptc100AgreementPropertiesBuffer)
  ptc100AgreementPropertiesBufferDataView.setUint8(0, 0x03) //波特率 查文档
  ptc100AgreementPropertiesBufferDataView.setUint8(1, 0x01)// 无校验
  ptc100AgreementPropertiesBufferDataView.setUint8(2, 0x20)// RS-485 通讯
  return ptc100AgreementPropertiesBuffer;
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
 * modbus 协议组包
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context vue 引用
 * */
export function modbusExecute(afn, fn, context) {
  Log.info("execute: modbusExecute[", afn, "] fn[", fn, "]");
  const bodyBuffer = modbusPackDataDomains(afn, fn, context);

  //MODBUS CRC校验 低字节在前
  let CRCBuffer = new ArrayBuffer(2)
  let CRCDataView = new DataView(CRCBuffer)

  const crcHigh = calculateCRCByte(bodyBuffer, true);
  const crcLow = calculateCRCByte(bodyBuffer, false);
  CRCDataView.setUint8(0, crcLow)
  CRCDataView.setUint8(1, crcHigh)

  return Buffer.from(mergeArrayBuffer(bodyBuffer, CRCBuffer));
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









