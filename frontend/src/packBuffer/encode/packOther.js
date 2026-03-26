import {createBuffer, packCSTail, packMeterDataDomains,packCurrentSourceDomains} from "@/packBuffer/common/common";
import {calculateCRCByte, mergeArrayBuffer} from "@/packBuffer/common/comUtil";

export function packReadCurrent() {
  return Buffer.from(createBuffer(8, [0x01, 0x03 ,0x00, 0x00 ,0x00, 0x02 ,0xC4 ,0x0B ]));
}


export function packMeter(cmdType, cmdCode, context) {
  let bodyBuffer=packMeterDataDomains(cmdType, cmdCode, context)
  return Buffer.from(mergeArrayBuffer(bodyBuffer,packCSTail(bodyBuffer)));
}

export function packCurrentSource(cmdType, cmdCode, context) {
  let bodyBuffer=packCurrentSourceDomains(cmdType, cmdCode, context)
  let crcLow=calculateCRCByte(bodyBuffer, false)
  let crcHigh=calculateCRCByte(bodyBuffer, true)
  return Buffer.from(mergeArrayBuffer(bodyBuffer,[crcLow,crcHigh]));
}

