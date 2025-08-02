import {arrayBuffer2Hex, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {
  packCSTail,
  packDataDomains,
  packDoubleStartHead,
  packInlineDataDomains,
  packOutLineTransparentTransmission,
  packSingleStartHead, packWireDeviceDataDomains, packWireDeviceStartHead
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
 * */
export function nbExecute(afn, fn, protocolID, context) {
  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const bodyBuffer = packDataDomains(afn, fn, protocolID, context);
  const headBuffer = packDoubleStartHead(protocolID, bodyBuffer.byteLength);
  const tailBuffer = packCSTail(bodyBuffer);
  return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer));
}


/**
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context 上下文对象
 * @param {string} type 左或右侧工装
 * @param withStartFrame 是否包含起始帧
 * */
export function wireExecute(afn, fn, protocolID, context, type, withStartFrame=false) {
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




