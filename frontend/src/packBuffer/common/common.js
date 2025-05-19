import {addressCover, calculateCSByte, hex2arrayBuffer, mergeArrayBuffer} from "@/packBuffer/common/comUtil";

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
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x03]);
            } else if (context.configDetail.pressureProbes === '进压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x02]);
            } else if (context.configDetail.pressureProbes === '回压探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x01]);
            } else if (context.configDetail.pressureProbes === '双探头') {
              arrayBuffer = createBuffer(7, [0x04, 0x05, 0xdd, 0xf3, 0x00, 0x00, 0x00]);
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
          arrayBuffer = createBuffer(5, [0x01, 0x03, 0xab, 0x82, 0x00]);
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


export function packWireDeviceDataDomains(afn, fn, protocolID, context, type) {
  let deviceAddress = type === 'one' ? context.leftReadAddress : context.rightReadAddress
  let arrayBuffer = null;
  let dataBuffer = null;
  let dataView = null;
  //温度上下限
  let writeTemperatureUpperLimitBuffer = context.wireConfig.temperatureUpperLimit
  let writeTemperatureDownLimitBuffer = context.wireConfig.temperatureDownLimit
  //无线异常配置
  //阀门动作异常
  //hmes : 0 ->不动作  , 1->开阀  , 2->关阀
  //设备 : 0->开阀     ,  1->关阀  , 10-> 不动作
  let writeStateBuffer
  let powerState = context.wireConfig.powerState;
  let wirelessAnomaly = context.wireConfig.wirelessAnomaly;
  if (powerState === '0' && wirelessAnomaly === ('0')) {
    writeStateBuffer = 0x22 //22  00100010
  }
  if (powerState === '0' && wirelessAnomaly === ('1')) {
    writeStateBuffer = 0x20  //20 00100000
  }
  if (powerState === '0' && wirelessAnomaly === ('2')) {
    writeStateBuffer = 0x21 //21 00100001
  }
  if (powerState === '1' && wirelessAnomaly === ('0')) {
    writeStateBuffer = 0x02  //02 00000010
  }
  if (powerState === '1' && wirelessAnomaly === ('1')) {
    writeStateBuffer = 0x00 //00 00000000
  }
  if (powerState === '1' && wirelessAnomaly === ('2')) {
    writeStateBuffer = 0x01 //01 00000001
  }
  if (powerState === '2' && wirelessAnomaly === ('0')) {
    writeStateBuffer = 0x12 //12  00010010
  }
  if (powerState === '2' && wirelessAnomaly === ('1')) {
    writeStateBuffer = 0x10 //10  00010000
  }
  if (powerState === '2' && wirelessAnomaly === ('2')) {
    writeStateBuffer = 0x11 //11 00010001
  }
  //供暖结束 、 开始
  let heatingStartDate = context.wireConfig.heatingStartDate
  let heatingEndDate = context.wireConfig.heatingEndDate
  let [startYear, startMonth, startDay] = heatingStartDate.split('-');
  let writeHeatingStartDate = startMonth + startDay
  let [EndYear, endMonth, endDay] = heatingEndDate.split('-');
  let writeHeatingEndDate = endMonth + endDay

  //阀门开度上下限
  let writeOpeningUpperLimitBuffer = context.wireConfig.openingUpperLimit
  let writeOpeningDownLimitBuffer = context.wireConfig.openingDownLimit
  //清洗周期
  let writeCleaningCycBuffer = context.wireConfig.cleaningCycle
  //调节模式
  let writeRegulationModeBuffer = context.wireConfig.regulationMode
  //是否启用温差、回温调节
  let writeEnableTemperatureDifferenceBuffer = 0x00 //默认 0x00
  if (writeRegulationModeBuffer === '2' || writeRegulationModeBuffer === '3') {
    writeEnableTemperatureDifferenceBuffer = 0x01
  }
  //调节值
  let writeRegulationModeValueBuffer = 0x01;
  //调节周期
  let writeAdjustmentCycleBuffer = context.wireConfig.adjustmentCycle;
  //调节死区
  let writeAdjustDeadZoneBuffer
  if (context.wireConfig.regulationMode === 0) {
    writeAdjustDeadZoneBuffer = context.wireConfig.adjustDeadZone * 100;
  } else {
    writeAdjustDeadZoneBuffer = context.wireConfig.adjustDeadZone;
  }
  //pid
  let pValueBuffer = 0x01
  let iValueBuffer = 0x01
  let dValueBuffer = 0x01

  //定比例调节
  let writeProportionalAdjustmentBuffer = context.wireConfig.proportionalAdjustment;
  //屏幕 温度探头
  let screenDisplay = context.wireConfig.screenDisplay
  let temperatureProbe = context.wireConfig.temperatureProbe
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
        default:
        // Log.error("packages: afn[{}] match fail", afn);
      }
      return mergeArrayBuffer(packInlineSevenMacAddr(), arrayBuffer);
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
          arrayBuffer = mergeArrayBuffer(createBuffer(6, [0x04, 0x04, 0xa0, 0x17, 0x01, 0x66]), dataBuffer);
          break;
        case '17-open':
          arrayBuffer = mergeArrayBuffer(createBuffer(6, [0x04, 0x04, 0xa0, 0x17, 0x01, 0x77]), dataBuffer);
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
        case '26':
          arrayBuffer = createBuffer(6, [0x04, 0x04, 0xa0, 0x26, 0x01, writeStateBuffer])
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case 'ac':
      switch (fn) {
        case '09':
          dataBuffer = new ArrayBuffer(2)
          dataView = new DataView(dataBuffer)
          dataView.setUint8(0, writeScreenDisplayBuffer)
          dataView.setUint8(1, writeTemperatureProbeBuffer)
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x05, 0xac, 0x09, 0x01]), dataBuffer);
          break;
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
          dataView.setUint16(14, writeRegulationModeValueBuffer)
          dataView.setUint16(16, parseInt(writeAdjustmentCycleBuffer, 16), true)
          dataView.setUint16(18, parseInt(writeAdjustDeadZoneBuffer, 16), true)
          dataView.setUint16(20, pValueBuffer, true)
          dataView.setUint16(22, iValueBuffer, true)
          dataView.setUint16(24, dValueBuffer, true)
          dataView.setUint16(26, parseInt(writeProportionalAdjustmentBuffer, 16), true)
          arrayBuffer = mergeArrayBuffer(createBuffer(5, [0x04, 0x1F, 0xac, 0x02, 0x01]), dataBuffer);
          break;
        default:
      }
      return mergeArrayBuffer(hex2arrayBuffer(deviceAddress), arrayBuffer);
    case 'b0':DTC
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
  }
}


export function createBuffer(size, values) {
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);
  values.forEach((value, index) => view.setUint8(index, value));
  return buffer;
}
