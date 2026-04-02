import {
  addressCover,
  arrayBuffer2Hex,
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

export function packCJ88StartHead(protocolID) {
  console.log(protocolID)
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

export function packInlineSixMacAddr() {
  return createBuffer(6, [0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0XAA]);
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
        case '1f':
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0x90, 0x1f, 0x00]);
          break;
        default:
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);

    default:
      return arrayBuffer;
  }
}

/**
 * UTM100-485-MODBUS 组包
 *
 * */
export function modbusUTM100485PackDataDomains(afn, fn, context) {
  let arrayBuffer = null;
  switch (afn) {
    case '02':
      switch (fn) {
        //0Mpa标定
        case '00':
          arrayBuffer = createBuffer(12, [0x00, 0x06, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0x4d, 0x30, 0x31]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '03'://读指令
      switch (fn) {
        case 'readPressureGaugePressure':
          arrayBuffer = createBuffer(6, [0x01, 0x03, 0x00, 0x16, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '06'://写指令
      switch (fn) {
        case 'onePointSixMpaDemarcate':
          //压力转换写入PTC100 读取 压力*10^6.toString(16)
          let hexPressure = (parseFloat(context.pressureGauge) * Math.pow(10, 6)).toString(16);
          let bufferOne = createBuffer(5, [0x00, 0x06, 0x02, 0x02, 0x00])
          let newPressureBuffer = hex2arrayBuffer(hexPressure)
          let bufferTwo = createBuffer(4, [0x50, 0x4D, 0x30, 0x31])
          arrayBuffer = mergeArrayBuffer(bufferOne, newPressureBuffer, bufferTwo)
          break;
        //设备输出4mA
        case 'output-4mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x10, 0X0F, 0xA0]);
          break;
        case 'output-20mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x10, 0X4E, 0x20]);
          break;
        case 'output-12mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x20, 0X2E, 0xE0]);
          break;
        //温度通道标定4mA
        case 'temperatureChannelCalibrated4mA':
          let readCurrentMeterValue = context.readCurrentMeterValue
          let current = parseFloat(readCurrentMeterValue) * 1000
          let currentBuffer = floatToHexBuffer(current, false)
          let packBuffer = createBuffer(4, [0x01, 0x06, 0x02, 0x16]);
          arrayBuffer = mergeArrayBuffer(packBuffer, currentBuffer)
          break;
        //温度通道标定20mA
        case 'temperatureChannelCalibrated20mA':
          let readCurrentMeterValue20mA = context.readCurrentMeterValue
          let current20mA = parseFloat(readCurrentMeterValue20mA) * 1000
          let currentBuffer20mA = floatToHexBuffer(current20mA, false)
          let packBuffer20mA = createBuffer(4, [0x01, 0x06, 0x02, 0x18]);
          arrayBuffer = mergeArrayBuffer(packBuffer20mA, currentBuffer20mA)
          break;

        //压力通道4mA标定
        case 'pressureChannelCalibrated4mA':
          let readPressureMeterValue4mA = context.readCurrentPressureMeterValue
          let pressure4mA = parseFloat(readPressureMeterValue4mA) * 1000
          let currentPressureBuffer4mA = floatToHexBuffer(pressure4mA, false)
          let packBufferPressureMeter4mA = createBuffer(4, [0x01, 0x06, 0x02, 0x18]);
          arrayBuffer = mergeArrayBuffer(packBufferPressureMeter4mA, currentPressureBuffer4mA)
          break;
        //压力通道20mA标定
        case 'pressureChannelCalibrated20mA':
          let readPressureMeterValue20mA = context.readCurrentPressureMeterValue
          let pressure20mA = parseFloat(readPressureMeterValue20mA) * 1000
          let currentPressureBuffer20mA = floatToHexBuffer(pressure20mA, false)
          let packBufferPressureMeter20mA = createBuffer(4, [0x01, 0x06, 0x02, 0x14]);
          arrayBuffer = mergeArrayBuffer(packBufferPressureMeter20mA, currentPressureBuffer20mA)
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    default:
  }

  return arrayBuffer;
}


/**
 * UTM100-NB组包
 *
 * */
export function nbUTM100PackDataDomains(afn, fn, context) {
  let arrayBuffer = null;
  switch (afn) {
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
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x1e, 0x00]);
          break;
        case '14':
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x14, 0x00]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
    case '02':
      switch (fn) {
        //0Mpa标定
        case '00':
          arrayBuffer = createBuffer(12, [0x00, 0x06, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0x4d, 0x30, 0x31]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '03'://读指令
      switch (fn) {
        case 'readPressureGaugePressure':
          arrayBuffer = createBuffer(6, [0x01, 0x03, 0x00, 0x16, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '06'://写指令
      switch (fn) {
        case 'onePointSixMpaDemarcate':
          //压力转换写入PTC100 读取 压力*10^6.toString(16)
          let hexPressure = (parseFloat(context.pressureGauge) * Math.pow(10, 6)).toString(16);
          let bufferOne = createBuffer(5, [0x00, 0x06, 0x02, 0x02, 0x00])
          let newPressureBuffer = hex2arrayBuffer(hexPressure)
          let bufferTwo = createBuffer(4, [0x50, 0x4D, 0x30, 0x31])
          arrayBuffer = mergeArrayBuffer(bufferOne, newPressureBuffer, bufferTwo)
          break;
        //设备输出4mA
        case 'output-4mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x10, 0X0F, 0xA0]);
          break;
        case 'output-20mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x10, 0X4E, 0x20]);
          break;
        case 'output-12mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x20, 0X2E, 0xE0]);
          break;
        //温度通道标定4mA
        case 'temperatureChannelCalibrated4mA':
          let readCurrentMeterValue = context.readCurrentMeterValue
          let current = parseFloat(readCurrentMeterValue) * 1000
          let currentBuffer = floatToHexBuffer(current, false)
          let packBuffer = createBuffer(4, [0x01, 0x06, 0x02, 0x16]);
          arrayBuffer = mergeArrayBuffer(packBuffer, currentBuffer)
          break;
        //温度通道标定20mA
        case 'temperatureChannelCalibrated20mA':
          let readCurrentMeterValue20mA = context.readCurrentMeterValue
          let current20mA = parseFloat(readCurrentMeterValue20mA) * 1000
          let currentBuffer20mA = floatToHexBuffer(current20mA, false)
          let packBuffer20mA = createBuffer(4, [0x01, 0x06, 0x02, 0x18]);
          arrayBuffer = mergeArrayBuffer(packBuffer20mA, currentBuffer20mA)
          break;

        //压力通道4mA标定
        case 'pressureChannelCalibrated4mA':
          let readPressureMeterValue4mA = context.readCurrentPressureMeterValue
          let pressure4mA = parseFloat(readPressureMeterValue4mA) * 1000
          let currentPressureBuffer4mA = floatToHexBuffer(pressure4mA, false)
          let packBufferPressureMeter4mA = createBuffer(4, [0x01, 0x06, 0x02, 0x18]);
          arrayBuffer = mergeArrayBuffer(packBufferPressureMeter4mA, currentPressureBuffer4mA)
          break;
        //压力通道20mA标定
        case 'pressureChannelCalibrated20mA':
          let readPressureMeterValue20mA = context.readCurrentPressureMeterValue
          let pressure20mA = parseFloat(readPressureMeterValue20mA) * 1000
          let currentPressureBuffer20mA = floatToHexBuffer(pressure20mA, false)
          let packBufferPressureMeter20mA = createBuffer(4, [0x01, 0x06, 0x02, 0x14]);
          arrayBuffer = mergeArrayBuffer(packBufferPressureMeter20mA, currentPressureBuffer20mA)
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    default:
  }

  return arrayBuffer;
}


/**
 * UTM100-CPT100-MODBUS 组包
 *
 * */
export function modbusUTM100CPT100PackDataDomains(afn, fn, context) {
  let arrayBuffer = null;
  switch (afn) {
    case '02':
      switch (fn) {
        //0Mpa标定
        case '00':
          arrayBuffer = createBuffer(12, [0x00, 0x06, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0x4d, 0x30, 0x31]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '04' ://读温度指令
      switch (fn) {
        case 'readTemperature':
          arrayBuffer = createBuffer(9, [0x01, 0x04, 0x00, 0x01, 0x00, 0x04, 0xA0, 0x09, 0x01]);
          break;
        case 'readDevicePressure':
          arrayBuffer = createBuffer(6, [0x01, 0x04, 0x00, 0x01, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '06'://写指令
      switch (fn) {
        case 'onePointSixMpaDemarcate':
          //压力转换写入PTC100 读取 压力*10^6.toString(16)
          let hexPressure = (parseFloat(context.pressureGauge) * Math.pow(10, 6)).toString(16);
          let bufferOne = createBuffer(5, [0x00, 0x06, 0x02, 0x02, 0x00])
          let newPressureBuffer = hex2arrayBuffer(hexPressure)
          let bufferTwo = createBuffer(4, [0x50, 0x4D, 0x30, 0x31])
          arrayBuffer = mergeArrayBuffer(bufferOne, newPressureBuffer, bufferTwo)
          break;
        case 'calibratedZeroMegapascals':
          arrayBuffer = createBuffer(12, [0x00, 0x06, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0x4D, 0x30, 0x31]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    default:
  }

  return arrayBuffer;
}


/**
 * MODBUS组包
 *
 * */
export function modbusPackDataDomains(afn, fn, context) {
  let arrayBuffer = null;
  switch (afn) {
    case '01':
      switch (fn) {
        //电压表读功率
        case 'readAmmeterPower':
          arrayBuffer = createBuffer(6, [0x01, 0x03, 0x20, 0x04, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '02':
      switch (fn) {
        //0Mpa标定
        case '00':
          arrayBuffer = createBuffer(12, [0x00, 0x06, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0x4d, 0x30, 0x31]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '03'://读指令
      switch (fn) {
        case 'readPressureGaugePressure':
          arrayBuffer = createBuffer(6, [0x01, 0x03, 0x00, 0x16, 0x00, 0x02]);
          break;
        case 'readDevicePressure':
          arrayBuffer = createBuffer(6, [0x00, 0x03, 0x00, 0x10, 0x00, 0x02]);
          break;
        case 'readDeviceTemperatureCurrent':
          arrayBuffer = createBuffer(6, [0x03, 0x03, 0x00, 0x00, 0x00, 0x02]);
          break;
        case 'readPressureCurrent':
          arrayBuffer = createBuffer(6, [0x02, 0x03, 0x00, 0x00, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '04' ://读温度指令
      switch (fn) {
        case 'readTemperature':
          arrayBuffer = createBuffer(9, [0x01, 0x04, 0x00, 0x01, 0x00, 0x04, 0xA0, 0x09, 0x01]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '06'://写指令
      switch (fn) {
        case 'onePointSixMpaDemarcate':
          //压力转换写入PTC100 读取 压力*10^6.toString(16)
          let hexPressure = (parseFloat(context.pressureGauge) * Math.pow(10, 6)).toString(16);
          let bufferOne = createBuffer(5, [0x00, 0x06, 0x02, 0x02, 0x00])
          let newPressureBuffer = hex2arrayBuffer(hexPressure)
          let bufferTwo = createBuffer(4, [0x50, 0x4D, 0x30, 0x31])
          arrayBuffer = mergeArrayBuffer(bufferOne, newPressureBuffer, bufferTwo)
          break;
        //设备输出4mA
        case 'output-4mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x10, 0X0F, 0xA0]);
          break;
        case 'output-20mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x10, 0X4E, 0x20]);
          break;
        case 'output-12mA':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x02, 0x20, 0X2E, 0xE0]);
          break;
        //温度通道标定4mA
        case 'temperatureChannelCalibrated4mA':
          let readCurrentMeterValue = context.readCurrentMeterValue
          let current = parseFloat(readCurrentMeterValue) * 1000
          let currentBuffer = floatToHexBuffer(current, false)
          let packBuffer = createBuffer(4, [0x01, 0x06, 0x02, 0x16]);
          arrayBuffer = mergeArrayBuffer(packBuffer, currentBuffer)
          break;
        //温度通道标定20mA
        case 'temperatureChannelCalibrated20mA':
          let readCurrentMeterValue20mA = context.readCurrentMeterValue
          let current20mA = parseFloat(readCurrentMeterValue20mA) * 1000
          let currentBuffer20mA = floatToHexBuffer(current20mA, false)
          let packBuffer20mA = createBuffer(4, [0x01, 0x06, 0x02, 0x18]);
          arrayBuffer = mergeArrayBuffer(packBuffer20mA, currentBuffer20mA)
          break;

        //压力通道4mA标定
        case 'pressureChannelCalibrated4mA':
          let readPressureMeterValue4mA = context.readCurrentPressureMeterValue
          let pressure4mA = parseFloat(readPressureMeterValue4mA) * 1000
          let currentPressureBuffer4mA = floatToHexBuffer(pressure4mA, false)
          let packBufferPressureMeter4mA = createBuffer(4, [0x01, 0x06, 0x02, 0x18]);
          arrayBuffer = mergeArrayBuffer(packBufferPressureMeter4mA, currentPressureBuffer4mA)
          break;
        //压力通道20mA标定
        case 'pressureChannelCalibrated20mA':
          let readPressureMeterValue20mA = context.readCurrentPressureMeterValue
          let pressure20mA = parseFloat(readPressureMeterValue20mA) * 1000
          let currentPressureBuffer20mA = floatToHexBuffer(pressure20mA, false)
          let packBufferPressureMeter20mA = createBuffer(4, [0x01, 0x06, 0x02, 0x14]);
          arrayBuffer = mergeArrayBuffer(packBufferPressureMeter20mA, currentPressureBuffer20mA)
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    default:
  }

  return arrayBuffer;
}


export function cj88PackDataDomains(afn, fn, protocolID, context) {
  let arrayBuffer = null;
  switch (afn) {
    case 'a0':
      switch (fn) {
        case '18':
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x15, 0x0a, 0xa0, 0x18, 0x01]));
          arrayBuffer = mergeArrayBuffer(
            packBroadcastSevenMacAddr(),
            arrayBuffer,
            Buffer.from(addressCover(context.leftGenerateAddress)),
            createBuffer(3, [0x00, 0x00, 0x00])); //新地址厂商代码
          // ), //新地址 逆序
          break;

      }
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
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
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
    case 'ac':
      switch (fn) {
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

      }
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
    case 'dd':
      switch (fn) {
        case 'f0':
          arrayBuffer = createBuffer(4, [0x04, 0x03, 0xdd, 0xf0, 0x00]);
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
      }
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
    case '81': {
      switch (fn) {
        case '0a':
          arrayBuffer = createBuffer(5, [0x03, 0x03, 0x81, 0x0a, 0x00]);
          break;
      }
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
    }
    case 'cc':
      switch (fn) {
        //写固定输出4ma
        case '02-4ma':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x04]);
          break;
        //写固定输出20ma
        case '02-20ma':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x14]);
          break
        // 输出4ma实际电流值标定
        case '03':
          let output4CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x03, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output4CurrentBuffer)
          break;
        // 输出20ma实际电流值标定
        case '04':
          let output20CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x04, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output20CurrentBuffer)
          break;
        //写入4MA实际输入电流值
        case '09':
          let input4CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x09, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, input4CurrentBuffer)
          break;
        //写入20MA实际输入电流值
        case '0a':
          let input20CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x0a, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, input20CurrentBuffer)
          break;
        case '0d':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0x0d, 0x01]);
          break;
        case '0e-success':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x0e, 0x01, 0x01]);
          break;
        case '0e-error':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x0e, 0x01, 0x02]);
          break;
      }
      return mergeArrayBuffer(packBroadcastSevenMacAddr(), arrayBuffer);
    default:
  }

  return arrayBuffer;
}


export function nbPackDataDomains(afn, fn, protocolID, context) {
  let arrayBuffer = null;
  let startBuffer = createBuffer(2, [0x40, parseInt(protocolID.toString(), 10)]);
  switch (afn) {
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
    case '03':
      switch (fn) {
        case 'fd': //唤醒
          arrayBuffer = createBuffer(4, [0x03, 0xff, 0xfd, 0x00]);
          break;
        case '06':
          console.log('协议id:', parseInt(protocolID.toString(), 10))
          arrayBuffer = createBuffer(5, [0x03, 0xff, 0x06, 0x00, protocolID]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, hex2arrayBuffer(context.leftGenerateAddress))
          break;
        case '23':
          let selectTemperatureProbes = context.configDetail.selectTemperatureProbes
          let selectTemperatureProbesBuffer
          if (selectTemperatureProbes === '无探头') {
            selectTemperatureProbesBuffer = createBuffer(1, [0x03])
          } else if (selectTemperatureProbes === '有环境温度探头') {
            selectTemperatureProbesBuffer = createBuffer(1, [0x02])
          } else if (selectTemperatureProbes === '有管道温度探头') {
            selectTemperatureProbesBuffer = createBuffer(1, [0x01])
          } else if (selectTemperatureProbes === '双探头') {
            selectTemperatureProbesBuffer = createBuffer(1, [0x00])
          } else {
            selectTemperatureProbesBuffer = createBuffer(1, [0x03])
          }
          let selectLevelProbes = context.configDetail.selectLevelProbes
          let selectLevelProbesBuffer
          if (selectLevelProbes === '有液位探头') {
            selectLevelProbesBuffer = createBuffer(1, [0x00])
          } else if (selectLevelProbes === '无液位探头') {
            selectLevelProbesBuffer = createBuffer(1, [0x01])
          } else {
            selectLevelProbesBuffer = createBuffer(1, [0x01])
          }
          arrayBuffer = createBuffer(4, [0x03, 0xff, 0x23, 0x00]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, selectTemperatureProbesBuffer, selectLevelProbesBuffer)
          break;
        case 'fc':
          // 0x00：带进回温探头
          // 0x01：只带回温探头
          // 0x02：只带进温探头
          // 0x03：不带进回温探头

          //0x00：带进回压探头
          // 0x01：只带回压探头
          // 0x02：只带进压探头
          // 0x03：不带进回压探头
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
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x00, 0x00]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '回压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x00, 0x01]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '进压探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x00, 0x02]);
          } else if (context.configDetail.temperatureProbe === '双探头' && context.configDetail.pressureProbes === '无探头') {
            arrayBuffer = createBuffer(6, [0x03, 0xff, 0xfc, 0x00, 0x00, 0x03]);
          }
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      //采集器地址6位,NB协议
      if (context.configDetail.printLabel === 'LPC230' || context.configDetail.printLabel === 'LPC230E' || context.configDetail.printLabel === 'AEC100') {
        return mergeArrayBuffer(startBuffer, packInlineSixMacAddr(), arrayBuffer);
      } else {
        return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
      }
    case '05':
      switch (fn) {
        case '06':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x06, 0x00]);
          break;
        case '07':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x07, 0x00]);
          break;
        case '0a':
          arrayBuffer = createBuffer(4, [0x05, 0xff, 0x0a, 0x00]);
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
      //采集器地址6位,NB协议
      if (context.configDetail.printLabel === 'LPC230' || context.configDetail.printLabel === 'LPC230E' || context.configDetail.printLabel === 'AEC100') {
        return mergeArrayBuffer(startBuffer, packInlineSixMacAddr(), arrayBuffer);
      } else {
        return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
      }
    case '0c':
      switch (fn) {
        case '0a':
          arrayBuffer = createBuffer(4, [0x0c, 0xff, 0x0a, 0x00]);
          break;
        case '11':
          arrayBuffer = createBuffer(4, [0x0c, 0xff, 0x11, 0x00]);
          break;
        case '12-fail':
          arrayBuffer = createBuffer(4, [0x0c, 0xff, 0x12, 0x00]);
          break;
        case '12-success':
          arrayBuffer = createBuffer(4, [0x0c, 0xff, 0x12, 0x01]);
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
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x1e, 0x00]);
          break;
        case '14':
          arrayBuffer = createBuffer(4, [0xf0, 0xff, 0x14, 0x00]);
          break;
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      //采集器地址6位,NB协议
      if (context.configDetail.printLabel === 'LPC230' || context.configDetail.printLabel === 'LPC230E' || context.configDetail.printLabel === 'AEC100') {
        return mergeArrayBuffer(startBuffer, packInlineSixMacAddr(), arrayBuffer);
      } else {
        return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);
      }

    case 'dd':
      switch (fn) {
        case 'aa':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xdd, 0xaa, 0x00]);
          break;
      }
      return mergeArrayBuffer(startBuffer, packInlineFourMacAddr(), arrayBuffer);

    case 'cc':
      switch (fn) {
        //写固定输出4ma
        case '02-4ma':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x04]);
          break;
        //写固定输出20ma
        case '02-20ma':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x14]);
          break
        // 输出4ma实际电流值标定
        case '03':
          let output4CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x03, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output4CurrentBuffer)
          break;
        // 输出20ma实际电流值标定
        case '04':
          let output20CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x04, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output20CurrentBuffer)
          break;
        //写入4MA实际输入电流值
        case '09':
          let input4CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x09, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, input4CurrentBuffer)
          break;
        //写入20MA实际输入电流值
        case '0a':
          let input20CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x0a, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, input20CurrentBuffer)
          break;
        case '0d':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0x0d, 0x01]);
          break;
        case '0e-success':
          arrayBuffer = createBuffer(5, [0x04, 0x04, 0xcc, 0x0e, 0x01]);
          break;
        case '0e-error':
          arrayBuffer = createBuffer(5, [0x04, 0x04, 0xcc, 0x0e, 0x02]);
          break;
      }
      return mergeArrayBuffer(startBuffer, packBroadcastSevenMacAddr(), arrayBuffer);
    default:
  }

  return arrayBuffer;
}

export function packMeterDataDomains(afn, fn, context) {
  let arrayBuffer = null;
  let startBuffer = createBuffer(2, [0x68, 0x55]);
  let start2Buffer = createBuffer(2, [0x68, 0x20]);
  switch (afn) {
    case 'a0':
      switch (fn) {
        case '15':
          // 获取当前时间并转换为BCD码
          const now = new Date();
          const year = now.getFullYear().toString();
          const month = now.getMonth() + 1; // 月份从0开始，需要+1
          const day = now.getDate();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          // 转换为BCD码（如2022年取后两位22）
          const yearFirstTwo = parseInt(year.slice(0, 2), 16); // 前两位：20
          const yearLastTwo = parseInt(year.slice(-2), 16);    // 后两位
          const bcdMonth = parseInt(month.toString().padStart(2, '0'), 16);
          const bcdDay = parseInt(day.toString().padStart(2, '0'), 16);
          const bcdHours = parseInt(hours.toString().padStart(2, '0'), 16);
          const bcdMinutes = parseInt(minutes.toString().padStart(2, '0'), 16);
          const bcdSeconds = parseInt(seconds.toString().padStart(2, '0'), 16);

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
          arrayBuffer = mergeArrayBuffer(start2Buffer, packBroadcastSevenMacAddr(), arrayBuffer)
          break;
        //写热表地址
        case '18':
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x15, 0x0a, 0xa0, 0x18, 0x01]));
          arrayBuffer = mergeArrayBuffer(
            start2Buffer,
            packBroadcastSevenMacAddr(),
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

export function packCurrentSourceDomains(afn, fn) {
  let arrayBuffer = null;
  switch (afn) {
    case '01':
      switch (fn) {
        //电流源输出4mA
        case '06-4ma':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x00, 0x00, 0x01, 0x90]);
          break;
        //电流源输出1V
        case '06-1v':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x00, 0x00, 0x00, 0x64]);
          break;
        //电流源输出5V
        case '06-5v':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x00, 0x00, 0x01, 0xF4]);
          break;
        //电流源输出10V
        case '06-10v':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x00, 0x00, 0x03, 0xE8]);
          break;
        //电流源输出12mA
        case '06-12ma':
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x00, 0x00, 0x04, 0xB0]);
          break;
        //电流源输出20mA
        case '06-20ma':
          // 表温度标定 固定50度。
          arrayBuffer = createBuffer(6, [0x01, 0x06, 0x00, 0x00, 0x07, 0xD0]);
          break;
        //读取控制器屏幕的电流
        case '03':
          arrayBuffer = createBuffer(6, [0x01, 0x03, 0x00, 0x00, 0x00, 0x02]);
          break;
        //读取控制器屏幕的电流 aec100
        case '03-aec100':
          arrayBuffer = createBuffer(6, [0x01, 0x03, 0x00, 0x00, 0x00, 0x01]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '02':
      switch (fn) {
        //读取输出回路电流或电压(输出)
        case '03':
          arrayBuffer = createBuffer(6, [0x02, 0x03, 0x00, 0x00, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
    case '03':
      switch (fn) {
        //读取输入回路电流或电压(输入)
        case '03':
          arrayBuffer = createBuffer(6, [0x03, 0x03, 0x00, 0x00, 0x00, 0x02]);
          break;
      }
      return mergeArrayBuffer(arrayBuffer);
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
  //mes : 0 ->不动作  , 1->开阀  , 2->关阀
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
      return mergeArrayBuffer(hex2arrayBuffer('aaaaaaaaaaaaaa'), arrayBuffer);
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
        //写工作模式 0~10V
        case '01-0~10V':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x01, 0x01, 0x01]);
          break;
        //写工作模式 1~10V
        case '01-1~10V':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x01, 0x01, 0x02]);
          break;
        //写工作模式 4~20MA
        case '01-4~20MA':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x01, 0x01, 0x00]);
          break;
        //写固定输出4ma
        case '02-4ma':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x04]);
          break;
        //写固定输出20ma
        case '02-20ma':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x14]);
          break
        //写固定输出1V
        case '02-1V':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x01]);
          break;
        //写固定输出5V
        case '02-5V':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x05]);
          break;
        //写固定输出10V
        case '02-10V':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xcc, 0x02, 0x01, 0x0a]);
          break;
        // 输出4ma实际电流值标定
        case '03':
          let output4CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x03, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output4CurrentBuffer)
          break;
        // 输出20ma实际电流值标定
        case '04':
          let output20CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x04, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output20CurrentBuffer)
          break;
        // 输出1V实际电流值标定
        case '05':
          let output1VoltageBuffer = floatToHexBuffer(parseFloat(context.voltmeterReadVoltageValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x05, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output1VoltageBuffer)
          break;
        // 输出10V实际电流值标定
        case '06':
          let output10VoltageBuffer = floatToHexBuffer(parseFloat(context.voltmeterReadVoltageValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x06, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, output10VoltageBuffer)
          break;
        //写入4MA实际输入电流值
        case '09':
          let input4CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x09, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, input4CurrentBuffer)
          break;
        //写入20MA实际输入电流值
        case '0a':
          let input20CurrentBuffer = floatToHexBuffer(parseFloat(context.ammeterReadCurrentValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x0a, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, input20CurrentBuffer)
          break;
        // 写入1v实际值
        case '0b':
          let voltmeter1VoltageBuffer = floatToHexBuffer(parseFloat(context.voltmeterReadVoltageValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x0b, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, voltmeter1VoltageBuffer)
          break;
        // 写入10v实际值
        case '0c':
          let voltmeter10VoltageBuffer = floatToHexBuffer(parseFloat(context.voltmeterReadVoltageValue.toString()) * 1000, false)
          arrayBuffer = createBuffer(5, [0x04, 0x07, 0xcc, 0x0c, 0x01]);
          arrayBuffer = mergeArrayBuffer(arrayBuffer, voltmeter10VoltageBuffer)
          break;
        //全开标定
        case 'ee':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0xee, 0x01]);
          break;
        //全关标定
        case 'ff':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0xff, 0x01]);
          break;
        case '0d':
          arrayBuffer = createBuffer(5, [0x04, 0x03, 0xcc, 0x0d, 0x01]);
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
