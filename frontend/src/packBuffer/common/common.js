import {calculateCSByte, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";

export function packSingleStartHead(protocolID) {
  return createBuffer(2, [0x68, protocolID]);
}

export function packDoubleStartHead(protocolID, length) {
  return createBuffer(4, [0x68, length, 0x00, 0x68]);
}

export function packInlineSevenMacAddr() {
  return createBuffer(7, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
}

export function packInlineFourMacAddr() {
  return createBuffer(4, [0xAA, 0xAA, 0xAA, 0xAA]);
}

export function packCSTail(bodyBuffer) {
  const csSum = calculateCSByte(bodyBuffer);
  return createBuffer(2, [csSum, 0x16]);
}

export function packOutLineTransparentTransmission(protocolID, transparentTransmissionLength) {
  return createBuffer(11, [0x40, protocolID, 0x00, 0x00, 0x00, 0x00, 0x0c, 0xff, 0x01, 0x00, transparentTransmissionLength]);
}

export function packInlineDataDomains(afn, fn, protocolID, context) {
  let arrayBuffer = null;
  // let startBuffer = createBuffer(2, [0x40, protocolID]);
  switch (afn) {
    case 'dd':
      switch (fn) {
        case 'aa':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xdd, 0xaa, 0x00]);
          break;
        case 'f0':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xdd, 0xf0, 0x00]);
          break;
        case 'f2':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xdd, 0xf2, 0x00, 0x00]);
          break;
        case 'f3':
          if (context.configDetail.temperatureProbe === '无探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x00, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x00, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x00, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x00, 0x00]);
            }
          } else if (context.configDetail.temperatureProbe === '回温探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x01, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x01, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x01, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x01, 0x00]);
            }
          } else if (context.configDetail.temperatureProbe === '进温探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x02, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x02, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x02, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x02, 0x00]);
            }
          } else if (context.configDetail.temperatureProbe === '双探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x03, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x03, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x03, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3,0x00, 0x03, 0x00]);
            }
          }

          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);
    case 'f0':
      switch (fn) {
        case 'dd':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xf0, 0xdd, 0x00]);
          break;
        case 'de':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xf0, 0xde, 0x00]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      // return mergeArrayBuffer(startBuffer, packInlineSevenMacAddr(), arrayBuffer);
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);
    case 'ac':
      switch (fn) {
        case '82':
          if (context.configForm.torques === '25Nm') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x82, 0x00, 0x00]);
          } else if (context.configForm.torques === '50Nm') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x82, 0x00, 0x01]);
          }
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
        case '09':
          if (context.configDetail.screenDisplay === '轮显') {
            if (context.configDetail.temperatureProbe === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x00, 0x03]);
            } else if (context.configDetail.temperatureProbe === '回温探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x00, 0x01]);
            } else if (context.configDetail.temperatureProbe === '进温探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x00, 0x02]);
            } else if (context.configDetail.temperatureProbe === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x00, 0x00]);
            }
          } else if (context.configDetail.screenDisplay === '不轮显') {
            if (context.configDetail.temperatureProbe === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x01, 0x03]);
            } else if (context.configDetail.temperatureProbe === '回温探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x01, 0x01]);
            } else if (context.configDetail.temperatureProbe === '进温探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x01, 0x02]);
            } else if (context.configDetail.temperatureProbe === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xac, 0x09, 0x00, 0x01, 0x00]);
            }
          }
          break;
        case '90':
          if (context.configDetail.pressureProbes === '无探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x90, 0x00, 0x03]);
          } else if (context.configDetail.pressureProbes === '进压探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x90, 0x00, 0x02]);
          } else if (context.configDetail.pressureProbes === '回压探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x90, 0x00, 0x01]);
          } else if (context.configDetail.pressureProbes === '双探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x90, 0x00, 0x00]);
          }
          break;
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);

    case 'ab':
      switch (fn) {
        case '82':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xab, 0x82,0x00]);
          break;
        default:
          return arrayBuffer;
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);
    default:
      return arrayBuffer;
  }
}


export function packDataDomains(afn, fn, protocolID, context) {
  let arrayBuffer = null;
  let startBuffer = createBuffer(2, [0x40, protocolID]);
  switch (afn) {
    case 'f0':
    case '03':
      switch (fn) {
        case 'fd':
          arrayBuffer = createBuffer(4, [0x03, 0xff, 0xfd, 0x00]);
          break;
        case '06':
          arrayBuffer = createBuffer(5, [0x03, 0xff, 0x06, 0x00, 0x8B]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, hex2arrayBuffer(context.leftGenerateAddress))
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    case '05':
      switch (fn) {
        case '06':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x06, 0x00]);
          break;
        case '0b':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x0b, 0x00]);
          break;
        case  '08':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x08, 0x00]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    case 'dd':
      switch (fn) {
        case 'aa':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xdd, 0xaa, 0x00]);
          break;
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    default:
      return arrayBuffer;
  }
}

export function createBuffer(size, values) {
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  values.forEach((value, index) => view.setUint8(index, value));
  return buffer;
}
