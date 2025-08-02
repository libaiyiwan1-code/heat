import {createBuffer} from "@/packBuffer/common/common";

export function packReadCurrent() {
  return Buffer.from(createBuffer(8, [0x01, 0x03 ,0x00, 0x00 ,0x00, 0x02 ,0xC4 ,0x0B ]));
}


