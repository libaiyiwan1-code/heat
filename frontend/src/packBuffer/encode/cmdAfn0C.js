import {createBuffer} from "@/packBuffer/common/common";

export function f1(afn, fn, length) {
  return createBuffer(5, [afn, 0xFF, fn, 0x00, length]);
}


