import {mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {
  packCSTail,
  packDataDomains,
  packDoubleStartHead,
  packInlineDataDomains,
  packOutLineTransparentTransmission,
  packSingleStartHead
} from "@/packBuffer/common/common";

const Log = require('ee-core/log');


/**
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * @param context vue 引用
 * */
export function outlineExecute(afn, fn, protocolID,context) {
  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const headBuffer = packSingleStartHead(protocolID);
  const bodyBuffer = packInlineDataDomains(afn, fn, protocolID,context);
  const tailBuffer = packCSTail(mergeArrayBuffer(headBuffer, bodyBuffer));
  let mergeBuffer1 = mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer)
  let mergeBuffer2 = mergeArrayBuffer(packOutLineTransparentTransmission(protocolID, mergeBuffer1.byteLength), mergeBuffer1)
  const endBuffer = packCSTail(mergeBuffer2);
  const outLineHeadBuffer = packDoubleStartHead(protocolID, mergeBuffer2.byteLength);
  console.warn('外包:',Buffer.from(mergeArrayBuffer(outLineHeadBuffer, mergeBuffer2, endBuffer)))
  return Buffer.from(mergeArrayBuffer(outLineHeadBuffer, mergeBuffer2, endBuffer));
}

/**
 * @param {string} afn 内层包 afn
 * @param {string} fn 内层包 fn
 * @param {number} protocolID 协议ID
 * */
export function nbExecute(afn, fn, protocolID,context) {
  Log.info("execute: inlineExecute[", afn, "] fn[", fn, "], protocolID[", protocolID, "]");
  const bodyBuffer = packDataDomains(afn, fn, protocolID,context);
  const headBuffer = packDoubleStartHead(protocolID, bodyBuffer.byteLength);
  const tailBuffer = packCSTail(bodyBuffer);
  return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailBuffer));
}





