import {createBuffer, packCSTail, packMeterDataDomains} from "@/packBuffer/common/common";
import {mergeArrayBuffer} from "@/packBuffer/common/comUtil";

export function packReadCurrent() {
  return Buffer.from(createBuffer(8, [0x01, 0x03 ,0x00, 0x00 ,0x00, 0x02 ,0xC4 ,0x0B ]));
}


export function packMeter(cmdType, cmdCode, context) {
  let bodyBuffer=packMeterDataDomains(cmdType, cmdCode, context)
  return Buffer.from(mergeArrayBuffer(bodyBuffer,packCSTail(bodyBuffer)));
}

