import {
  addressCover, arrayBuffer2Hex,
  calculateCSByte,
  floatToHexBuffer,
  hex2arrayBuffer,
  mergeArrayBuffer
} from "@/packBuffer/common/comUtil";

export function packSingleStartHead(protocolID) {
  return createBuffer(2, [0x68, protocolID]);
}

export function packDoubleStartHead(protocolID, length) {
  return createBuffer(4, [0x68, length, 0x00, 0x68]);
}

export function packWireDeviceStartHead(protocolID) {
  return createBuffer(2, [0x68, protocolID]);
}

export function packInlineSevenMacAddr() {
  return createBuffer(7, [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
}

export function packBroadcastSevenMacAddr() {
  return createBuffer(7, [0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA]);
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
          if (context.configDetail.temperatureProbe === '无探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xdd, 0xf2, 0x00, 0x00]);
          } else if (context.configDetail.temperatureProbe === '回温探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xdd, 0xf2, 0x00, 0x01]);
          } else if (context.configDetail.temperatureProbe === '进温探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xdd, 0xf2, 0x00, 0x02]);
          } else if (context.configDetail.temperatureProbe === '双探头') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xdd, 0xf2, 0x00, 0x03]);
          }

          break;
        case 'f3':
          if (context.configDetail.temperatureProbe === '无探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x00]);
            } else if (context.configDetail.pressureProbes === '压差') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x04]);
            }
          } else if (context.configDetail.temperatureProbe === '回温探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x01, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x01, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x01, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x01, 0x00]);
            } else if (context.configDetail.pressureProbes === '压差') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x01, 0x04]);
            }
          } else if (context.configDetail.temperatureProbe === '进温探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x02, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x02, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x02, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x02, 0x00]);
            } else if (context.configDetail.pressureProbes === '压差') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x02, 0x04]);
            }
          } else if (context.configDetail.temperatureProbe === '双探头') {
            if (context.configDetail.pressureProbes === '无探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x03, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x03, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x03, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x03, 0x00]);
            } else if (context.configDetail.pressureProbes === '压差') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x03, 0x04]);
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
    case 'bb':
      switch (fn) {
        case 'cc-calibrated-at-4mA':
          arrayBuffer = createBuffer(10, [0x04, 0x08, 0xbb, 0xcc, 0x00, 0x00, 0x00, 0x00, 0x80, 0x40]);
          break;
        case 'cc-calibrated-at-20mA':
          arrayBuffer = createBuffer(10, [0x04, 0x08, 0xbb, 0xcc, 0x00, 0x01, 0x00, 0x00, 0xA0, 0x41]);
          break;
        case 'cc-calibrated-at-customize-upper':
          let upperBuffer = floatToHexBuffer(context.readCurrent)
          let coverUpperBuffer = hex2arrayBuffer(arrayBuffer2Hex(addressCover(arrayBuffer2Hex(upperBuffer))));
          console.log('读取电流-上限标定buffer：', coverUpperBuffer)
          arrayBuffer = mergeArrayBuffer(createBuffer(6, [0x04, 0x08, 0xbb, 0xcc, 0x00, 0x01]), coverUpperBuffer);
          break;
        case 'cc-calibrated-at-customize-lower':
          console.log(context.readCurrent)
          let lowerBuffer = floatToHexBuffer(context.readCurrent)
          let coverLowerBuffer = hex2arrayBuffer(arrayBuffer2Hex(addressCover(arrayBuffer2Hex(lowerBuffer))));
          console.log('读取电流-下限标定buffer：', coverLowerBuffer)
          arrayBuffer = mergeArrayBuffer(createBuffer(6, [0x04, 0x08, 0xbb, 0xcc, 0x00, 0x00]), coverLowerBuffer);
          break;
        case 'cc-calibrated-turn-on-power':
          arrayBuffer = createBuffer(10, [0x04, 0x08, 0xbb, 0xcc, 0x00, 0x02, 0x00, 0x00, 0xA0, 0x41]);
          break;
        default:
      }
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
          } else if (context.configDetail.pressureProbes === '压差') {
            arrayBuffer = createBuffer(6, [0x04, 0x04, 0xac, 0x90, 0x00, 0x04]);
          }
          break;
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);

    case 'ab':
      switch (fn) {
        case '09':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xab, 0x09, 0x00]);
          break;
        case '82':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xab, 0x82, 0x00]);
          break;
        case '90':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xab, 0x90, 0x00]);
          break;
        default:
          return arrayBuffer;
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);
    case '90':
      switch (fn) {
        case '20':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0x90, 0x20, 0x00]);
          break
        default:
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);

    default:
      return arrayBuffer;
  }
}


export function packDataDomains(afn, fn, protocolID, context) {
  let arrayBuffer = null;
  let startBuffer = createBuffer(2, [0x40, parseInt(protocolID.toString(), 10)]);
  switch (afn) {
    case '0c':
      switch (fn) {
        case '0a':
          arrayBuffer = createBuffer(4, [0x0c, 0xff, 0x0a, 0x00]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    case 'f0':
      switch (fn) {
        case '01':
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x01, 0x00]);
          break;
        case '02':
          //0x00 默认普通自检
          arrayBuffer = createBuffer(5, [0xf0, 0xff, 0x02, 0x00, 0x00]);
          break;
        case '1e':
          //0x00 默认普通自检
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x1e, 0x00]);
          break;
        case '14':
          //0x00 默认普通自检
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x14, 0x00]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    case '03':
      switch (fn) {
        case 'fd':
          arrayBuffer = createBuffer(4, [0x03, 0xff, 0xfd, 0x00]);
          break;
        case '06':
          arrayBuffer = createBuffer(5, [0x03, 0xff, 0x06, 0x00, parseInt(protocolID.toString(), 16)]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, hex2arrayBuffer(context.leftGenerateAddress))
          break;
        case 'fc':
          if (context.configDetail.temperatureProbe === '无探头' && context.configDetail.pressureProbes === '双探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x00]);
          } else if (context.configDetail.temperatureProbe === '无探头' && context.configDetail.pressureProbes === '回压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x01]);
          } else if (context.configDetail.temperatureProbe === '无探头' && context.configDetail.pressureProbes === '进压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x02]);
          } else if (context.configDetail.temperatureProbe === '无探头' && context.configDetail.pressureProbes === '无探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x03]);
          } else if (context.configDetail.temperatureProbe === '回温探头' && context.configDetail.pressureProbes === '双探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x01, 0x00]);
          } else if (context.configDetail.temperatureProbe === '回温探头' && context.configDetail.pressureProbes === '回压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x01, 0x01]);
          } else if (context.configDetail.temperatureProbe === '回温探头' && context.configDetail.pressureProbes === '进压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x01, 0x02]);
          } else if (context.configDetail.temperatureProbe === '回温探头' && context.configDetail.pressureProbes === '无探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x01, 0x03]);
          } else if (context.configDetail.temperatureProbe === '进温探头' && context.configDetail.pressureProbes === '双探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x02, 0x00]);
          } else if (context.configDetail.temperatureProbe === '进温探头' && context.configDetail.pressureProbes === '回压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x02, 0x01]);
          } else if (context.configDetail.temperatureProbe === '进温探头' && context.configDetail.pressureProbes === '进压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x02, 0x02]);
          } else if (context.configDetail.temperatureProbe === '进温探头' && context.configDetail.pressureProbes === '无探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x02, 0x03]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '双探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x00]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '回压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x01]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '进压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x02]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '无探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x03, 0x03]);
          }
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
        case  '09':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x09, 0x00]);
          break;
        case  'fc':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0xfc, 0x00]);
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
    case '00':
      switch (fn) {
        case '41-4-mA-load':
          arrayBuffer = createBuffer(8, [0x00, 0xFF, 0x29, 0x00, 0x40, 0x80, 0x00, 0x00]);
          break;
        case '41-10-mA-load':
          arrayBuffer = createBuffer(8, [0x00, 0xFF, 0x29, 0x00, 0x41, 0x20, 0x00, 0x00]);
          break;
        case '41-20-mA-load':
          arrayBuffer = createBuffer(8, [0x00, 0xFF, 0x29, 0x00, 0x41, 0xA0, 0x00, 0x00]);
          break;
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    default:
  }

  return arrayBuffer;
}

export function packMeterDataDomains(afn, fn, context) {
  let arrayBuffer = null;
  let startBuffer = createBuffer(2, [0x68, 0x20]);
  switch (afn) {
    case 'a0':
      switch (fn) {
        case '15':
          // 获取当前时间并转换为BCD码
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1; // 月份从0开始，需要+1
          const day = now.getDate();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          // 转换为BCD码（如2022年取后两位22）
          const yearFirstTwo = parseInt(year.slice(0, 2), 10); // 前两位：20
          const yearLastTwo = parseInt(year.slice(-2), 10);    // 后两位
          const bcdMonth = parseInt(month.toString().padStart(2, '0'), 10);
          const bcdDay = parseInt(day.toString().padStart(2, '0'), 10);
          const bcdHours = parseInt(hours.toString().padStart(2, '0'), 10);
          const bcdMinutes = parseInt(minutes.toString().padStart(2, '0'), 10);
          const bcdSeconds = parseInt(seconds.toString().padStart(2, '0'), 10);

          // =格式: 秒 分 时 日 月 年(后两位)
          const dateArrayBuffer = createBuffer(7, [
            bcdSeconds,  // 秒
            bcdMinutes,  // 分
            bcdHours,    // 时
            bcdDay,      // 日
            bcdMonth,    // 月
            yearLastTwo,     // 年(后两位)
            yearFirstTwo,     // 年(前两位)
          ]);
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x0a, 0xa0, 0x15, 0x01]), dateArrayBuffer);
          arrayBuffer = mergeArrayBuffer(startBuffer, packBroadcastSevenMacAddr(), arrayBuffer)
          break;
        //写热表地址
        case '18':
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x15, 0x0a, 0xa0, 0x18, 0x01]));
          arrayBuffer = mergeArrayBuffer(
            startBuffer,
            Buffer.from(addressCover(context.readMeterAddress)), //旧地址
            createBuffer(3, [0x00, 0x00, 0x00]), //旧地址厂商代码
            arrayBuffer,
            Buffer.from(addressCover(context.leftGenerateAddress)),
            createBuffer(3, [0x00, 0x00, 0x00])); //新地址厂商代码
          // ), //新地址 逆序
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return arrayBuffer
    case '81':
      switch (fn) {
        //读地址
        case '0a':
          arrayBuffer = createBuffer(6, [0x23, 0x04, 0x81, 0x0a, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(startBuffer, packBroadcastSevenMacAddr(), arrayBuffer);
    case '01':
      switch (fn) {
        //进入检定状态
        case '10-enter-verification':
          arrayBuffer = createBuffer(7, [0x24, 0x05, 0x01, 0x10, 0x01, 0x01, 0x00]);
          break;
        //退出检定状态
        case '10-return-verification':
          arrayBuffer = createBuffer(7, [0x24, 0x05, 0x01, 0x10, 0x01, 0x02, 0x00]);
          break;
        case '12':
          // 表温度标定 固定50度。
          arrayBuffer = createBuffer(9, [0x24, 0x07, 0x01, 0x12, 0x01, 0x01, 0x00, 0x50, 0xe8]);
          break;
      }
      return mergeArrayBuffer(startBuffer, packBroadcastSevenMacAddr(), arrayBuffer);
    default:
  }

  return arrayBuffer;
}


export function packWireDeviceDataDomains(afn, fn, protocolID, context, type) {
  let deviceAddress = type === 'one' ? context.leftReadAddress : context.rightReadAddress
  // console.warn('设备地址：', context.leftReadAddress)
  // console.warn('设备地址：', context.leftReadAddress)
  // console.warn('设备地址：', deviceAddress)
  // console.warn('设备地址：', type)
  let arrayBuffer = null;
  let dataBuffer = null;
  let dataView = null;
  //温度上下限
  let writeTemperatureUpperLimitBuffer = context.wireValveCardForm.temperatureUpperLimit
  let writeTemperatureDownLimitBuffer = context.wireValveCardForm.temperatureDownLimit
  //无线异常配置
  //阀门动作异常
  //hmes : 0 ->不动作  , 1->开阀  , 2->关阀
  //设备 : 0->开阀     ,  1->关阀  , 10-> 不动作
  //上电是否恢复阀门状态 默认恢复
  let writeStateBuffer
  let powerState = context.wireValveCardForm.powerState;
  let wirelessAnomaly = context.wireValveCardForm.wirelessAnomaly;
  if (powerState === '0' && wirelessAnomaly === ('0')) {
    writeStateBuffer = 0xA2 //22  10100010
  }
  if (powerState === '0' && wirelessAnomaly === ('1')) {
    writeStateBuffer = 0xA0  //20 10100000
  }
  if (powerState === '0' && wirelessAnomaly === ('2')) {
    writeStateBuffer = 0xA1 //21 10100001
  }
  if (powerState === '1' && wirelessAnomaly === ('0')) {
    writeStateBuffer = 0x82  //02 10000010
  }
  if (powerState === '1' && wirelessAnomaly === ('1')) {
    writeStateBuffer = 0x80 //00 10000000
  }
  if (powerState === '1' && wirelessAnomaly === ('2')) {
    writeStateBuffer = 0x81 //01 10000001
  }
  if (powerState === '2' && wirelessAnomaly === ('0')) {
    writeStateBuffer = 0x92 //12  10010010
  }
  if (powerState === '2' && wirelessAnomaly === ('1')) {
    writeStateBuffer = 0x90 //10  10010000
  }
  if (powerState === '2' && wirelessAnomaly === ('2')) {
    writeStateBuffer = 0x91 //11 10010001
  }
  //供暖结束 、 开始
  let heatingStartDate = context.wireValveCardForm.heatingStartDate
  let heatingEndDate = context.wireValveCardForm.heatingEndDate
  let [startYear, startMonth, startDay] = heatingStartDate.split('-');
  let writeHeatingStartDate = startMonth + startDay
  let [EndYear, endMonth, endDay] = heatingEndDate.split('-');
  let writeHeatingEndDate = endMonth + endDay

  //阀门开度上下限
  let writeOpeningUpperLimitBuffer = context.wireValveCardForm.openingUpperLimit
  let writeOpeningDownLimitBuffer = context.wireValveCardForm.openingDownLimit
  //清洗周期
  let writeCleaningCycBuffer = context.wireValveCardForm.cleaningCycle
  //调节模式
  let writeRegulationModeBuffer = context.wireValveCardForm.regulationMode
  //是否启用温差、回温调节
  let writeEnableTemperatureDifferenceBuffer = context.wireValveCardForm.selfRegulating
  // if (writeRegulationModeBuffer === '2' || writeRegulationModeBuffer === '3') {
  //   writeEnableTemperatureDifferenceBuffer = 0x01  //回温调节模式或进温调节模式 不启用
  // }
  //调节值
  let writeRegulationModeValueBuffer //50%开度
  //调节模式 ：  00：通过面板在上下限之间控制,01：远程控制开度,02：回水温度控制开度；03：进回水温差控制开度
  //调节模式为   00：此处无用；01：表目标开度50%；02：表目标温度0.50摄氏度；03：表目标温差0.50摄氏度；

  if (writeRegulationModeBuffer === '0') {
    writeRegulationModeValueBuffer = 0x00
  } else if (writeRegulationModeBuffer === '1') {
    writeRegulationModeValueBuffer = Number(context.wireValveCardForm.regulationModeValue)
  } else if (writeRegulationModeBuffer === '2' || writeRegulationModeBuffer === '3') {
    writeRegulationModeValueBuffer = Number(context.wireValveCardForm.regulationModeValue) * 100
  }

  //调节周期
  let writeAdjustmentCycleBuffer = context.wireValveCardForm.adjustmentCycle;
  //调节死区
  let writeAdjustDeadZoneBuffer
  if (context.wireValveCardForm.regulationMode === 0) {
    writeAdjustDeadZoneBuffer = context.wireValveCardForm.adjustDeadZone * 100;
  } else {
    writeAdjustDeadZoneBuffer = context.wireValveCardForm.adjustDeadZone;
  }
  //pid
  let pValueBuffer = 0x01
  let iValueBuffer = 0x01
  let dValueBuffer = 0x01

  //定比例调节
  let writeProportionalAdjustmentBuffer = context.wireValveCardForm.proportionalAdjustment;
  //屏幕 温度探头
  let screenDisplay = context.wireValveCardForm.screenDisplay
  let temperatureProbe = context.wireValveCardForm.temperatureProbe
  let writeScreenDisplayBuffer = null
  let writeTemperatureProbeBuffer = null
  switch (screenDisplay) {
    case '0':
      writeScreenDisplayBuffer = 0x01
      break;
    case '1':
      writeScreenDisplayBuffer = 0x00
      break;
  }
  switch (temperatureProbe) {
    case '0':
      writeTemperatureProbeBuffer = 0x03
      break;
    case '1':
      writeTemperatureProbeBuffer = 0x01
      break;
    case'2' :
      writeTemperatureProbeBuffer = 0x02
      break;
    case'3':
      writeTemperatureProbeBuffer = 0x00
      break;
  }
  switch (afn) {
    case '81':
      switch (fn) {
        case '0a':
          arrayBuffer = createBuffer(5, [0x03, 0x03, 0x81, 0x0A, 0x01]);
          break;
        case '0a-东元':
          arrayBuffer = createBuffer(6, [0x23, 0x04, 0x81, 0x0A, 0x00, 0x02]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
    case 'a0':
      switch (fn) {
        case '11':
          dataBuffer = new ArrayBuffer(6)
          dataView = new DataView(dataBuffer)
          dataView.setUint16(0, parseInt(writeTemperatureUpperLimitBuffer, 16), true)
          dataView.setUint16(2, parseInt(writeTemperatureDownLimitBuffer, 16), true)
          dataView.setUint8(4, 0x00)
          dataView.setUint8(5, 0x00)
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x09, 0xa0, 0x11, 0x01]), dataBuffer);
          break;
        case '17-close':
          arrayBuffer = mergeArrayBuffer(createBuffer(6, [0x04, 0x04, 0xa0, 0x17, 0x01, 0x77]), dataBuffer);
          break;
        case '17-open':
          arrayBuffer = mergeArrayBuffer(createBuffer(6, [0x04, 0x04, 0xa0, 0x17, 0x01, 0x66]), dataBuffer);
          break;
        case '18':
          console.log('厂商代码:', context.workDetail.vendorCode)
          let newAddress = type === 'one' ? context.leftGenerateAddress : context.rightGenerateAddress
          let newAddressBuffer = mergeArrayBuffer(addressCover(newAddress), hex2arrayBuffer(context.workNumberForm.vendorCode))
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x15, 0x0a, 0xa0, 0x18, 0x01]), newAddressBuffer);
          break;
        case '19':
          dataBuffer = new ArrayBuffer(4)
          dataView = new DataView(dataBuffer)
          dataView.setUint16(0, parseInt(writeHeatingStartDate, 16))
          dataView.setUint16(2, parseInt(writeHeatingEndDate, 16))
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x7, 0xa0, 0x19, 0x01]), dataBuffer);
          break;
        //写强制温度
        case '22':
          dataBuffer = new ArrayBuffer(6)
          dataView = new DataView(dataBuffer)
          dataView.setUint16(0, parseInt(writeTemperatureUpperLimitBuffer, 16))
          dataView.setUint16(2, parseInt(writeTemperatureDownLimitBuffer, 16))
          dataView.setUint16(4, parseInt(context.wireValveCardForm.forcedTemperature, 16))
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x09, 0xa0, 0x22, 0x01]), dataBuffer);
          break;
        case '26':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xa0, 0x26, 0x01, writeStateBuffer])
          break;
        case '2C':
          arrayBuffer = createBuffer(6, [0x04, 0x05, 0xa0, 0x2c, 0x01, writeStateBuffer])
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case 'ac':
      switch (fn) {
        case '02':
          dataBuffer = new ArrayBuffer(28)
          dataView = new DataView(dataBuffer)
          dataView.setUint8(0, writeScreenDisplayBuffer)
          dataView.setUint8(1, writeTemperatureProbeBuffer)
          dataView.setUint16(2, parseInt(writeHeatingStartDate, 16), true)
          dataView.setUint16(4, parseInt(writeHeatingEndDate, 16), true)
          dataView.setUint16(6, parseInt(writeOpeningUpperLimitBuffer, 16), true)
          dataView.setUint16(8, parseInt(writeOpeningDownLimitBuffer, 16), true)
          dataView.setUint16(10, parseInt(writeCleaningCycBuffer, 16), true)
          dataView.setUint8(12, writeRegulationModeBuffer)
          dataView.setUint8(13, writeEnableTemperatureDifferenceBuffer)
          dataView.setUint16(14, parseInt(writeRegulationModeValueBuffer, 16), true)
          dataView.setUint16(16, parseInt(writeAdjustmentCycleBuffer, 16), true)
          dataView.setUint16(18, parseInt(writeAdjustDeadZoneBuffer, 16), true)
          dataView.setUint16(20, pValueBuffer, true)
          dataView.setUint16(22, iValueBuffer, true)
          dataView.setUint16(24, dValueBuffer, true)
          dataView.setUint16(26, parseInt(writeProportionalAdjustmentBuffer, 16), true)
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x1F, 0xac, 0x02, 0x01]), dataBuffer);
          break;
        case '04':
          dataBuffer = new ArrayBuffer(3)
          dataView = new DataView(dataBuffer)
          dataView.setUint8(0, writeRegulationModeBuffer)
          dataView.setUint8(1, writeRegulationModeValueBuffer)
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x06, 0xac, 0x04, 0x01]), dataBuffer);
          break;
        case '09':
          dataBuffer = new ArrayBuffer(2)
          dataView = new DataView(dataBuffer)
          dataView.setUint8(0, writeScreenDisplayBuffer)
          dataView.setUint8(1, writeTemperatureProbeBuffer)
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x05, 0xac, 0x09, 0x01]), dataBuffer);
          break;

        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case 'b0':
      switch (fn) {
        case '05':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xb0, 0x05, 0x01]);
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case 'bb':
      switch (fn) {
        case 'ff':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xbb, 0xff, 0x01]);
          break;
        case 'ee':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xbb, 0xee, 0x01]);
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case '90':
      switch (fn) {
        case '20':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0x90, 0x20, 0x00]);
          break
        case '22':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0x90, 0x22, 0x01]);
          break;
        case '1f':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0x90, 0x1f, 0x01]);
          break;
        case '24':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0x90, 0x24, 0x01]);
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case 'cc':
      switch (fn) {
        case 'ee':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0xee, 0x01]);
          break;
        case 'ff':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0xff, 0x01]);
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    default:
      return arrayBuffer;
    case '0c':
      switch (fn) {
        case '0c':
          arrayBuffer = createBuffer(5, [0x85, 0x03, 0x0c, 0x0c, 0x00]);
          break;
        default:
      }
      return arrayBuffer;
  }
}


export function createBuffer(size, values) {
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  values.forEach((value, index) => view.setUint8(index, value));
  return buffer;
}
