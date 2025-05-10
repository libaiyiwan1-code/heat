import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {decodeGetProtocolId} from "@/packBuffer/decode/decode";
const Log = require('ee-core/log');

export function notHasSelfTestCompletedWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) === 0XFF || dataView.getUint8(54) === 0X00;
}


export function getDeviceProtocolIdWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16)
}

export function decodeGetNetProviderWAC710CD(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeGetVersionWAC710CD(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(57).toString(16), 16)
}

export function decodeCheckEEPWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) === 0x00 || dataView.getUint8(58) === 0xFF;

}

export function decodeCheckNetworkWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) === 0x00 || dataView.getUint8(59) === 0xFF;

}

export function decodeCheckMinimumValveOpeningWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) === 0x00 || dataView.getUint8(60) === 0xFF;

}

export function decodeCheckMaximumValveOpeningWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) === 0x00 || dataView.getUint8(61) === 0xFF;

}

export function decodeCheckOutTemperatureCalibrationWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) === 0x00 || dataView.getUint8(62) === 0xFF;

}

export function decodeCheckInTemperatureCalibrationWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) === 0x00 || dataView.getUint8(63) === 0xFF;

}

export function decodeCheckVoltageWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) === 0x00 || dataView.getUint8(64) === 0xFF;

}

export function decodeCheckBarometricPressureSensorWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) === 0x00 || dataView.getUint8(65) === 0xFF;

}

export function decodeCheckInPressureWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66) === 0x00 || dataView.getUint8(66) === 0xFF;

}

export function decodeCheckOutPressureWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(67) === 0x00 || dataView.getUint8(67) === 0xFF;

}

export function decodeCheckMagneticSensorsWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(68) === 0x00 || dataView.getUint8(68) === 0xFF;

}

export function decodeCheckOutTemperatureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(69) === 0x00 || dataView.getUint8(69) === 0xFF;

}

export function decodeCheckInTemperatureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(70) === 0x00 || dataView.getUint8(70) === 0xFF;

}

export function decodeCheckOutPressureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(71) === 0x00 || dataView.getUint8(71) === 0xFF;

}

export function decodeCheckInPressureMatchWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(72) === 0x00 || dataView.getUint8(72) === 0xFF;

}
export function decodeReadSelfTestAddressWAC710CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16) ;

}
export function decodeGetProductNameWAC710CD(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 30; i <= 53; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}
export function decodeCheckReadSelfTestStatusWAC710CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x8D ||
    dataView.getUint8(27) !== 0xF0 ||
    dataView.getUint8(28) !== 0xDE
  let selfTestCompletedNotPass = notHasSelfTestCompletedWAC710CD(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPWAC710CD(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkWAC710CD(context.receivedData.globalReceivedOneData)     //             联网
  let minimumValveOpeningNotPass = decodeCheckMinimumValveOpeningWAC710CD(context.receivedData.globalReceivedOneData)     //             最小开度标定
  let maximumValveOpeningNotPass = decodeCheckMaximumValveOpeningWAC710CD(context.receivedData.globalReceivedOneData)     //             最大开度标定
  let outTemperatureCalibrationNotPass = decodeCheckOutTemperatureCalibrationWAC710CD(context.receivedData.globalReceivedOneData)     //             回温标定
  let inTemperatureCalibrationNotPass = decodeCheckInTemperatureCalibrationWAC710CD(context.receivedData.globalReceivedOneData)     //             进温标定
  let voltageNotPass = decodeCheckVoltageWAC710CD(context.receivedData.globalReceivedOneData)     //             电压
  let barometricPressureSensorNotPass = decodeCheckBarometricPressureSensorWAC710CD(context.receivedData.globalReceivedOneData)     //             气压
  let inPressureNotPass = decodeCheckInPressureWAC710CD(context.receivedData.globalReceivedOneData)     //             进水压力
  let outPressureNotPass = decodeCheckOutPressureWAC710CD(context.receivedData.globalReceivedOneData)     //             回水压力
  let magneticSensorsNotPass = decodeCheckMagneticSensorsWAC710CD(context.receivedData.globalReceivedOneData)     //             磁性传感器
  let outTemperatureMatchNotPass = decodeCheckOutTemperatureMatchWAC710CD(context.receivedData.globalReceivedOneData)     //             回温探头是否匹配
  let inTemperatureMatchNotPass = decodeCheckInTemperatureMatchWAC710CD(context.receivedData.globalReceivedOneData)     //             进温探头是否匹配
  let outPressureMatchNotPass = decodeCheckOutPressureMatchWAC710CD(context.receivedData.globalReceivedOneData)     //             回水压力探头是否匹配
  let inPressureMatchNotPass = decodeCheckInPressureMatchWAC710CD(context.receivedData.globalReceivedOneData)     //             进水压力探头是否匹配
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  } else {
    context.createLeftSpanMessage('已自检过', 'green');
  }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'red');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  } else {
    context.createLeftSpanMessage('eep 正常', 'green');
  }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'red');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  } else {
    context.createLeftSpanMessage('联网 正常', 'green');
  }
  if (minimumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最小开度标定 不正常', 'red');
    Log.error('阀门最小开度标定 不正常');
    console.log('阀门最小开度标定 不正常');
  } else {
    context.createLeftSpanMessage('阀门最小开度标定 正常', 'green');
  }
  if (maximumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最大开度标定 不正常', 'red');
    Log.error('阀门最大开度标定 不正常');
    console.log('阀门最大开度标定 不正常');
  } else {
    context.createLeftSpanMessage('阀门最大开度标定 正常', 'green');
  }
  if (outTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('回温标定 不正常', 'red');
    Log.error('回温标定 不正常');
    console.log('回温标定 不正常');
  } else {
    context.createLeftSpanMessage('回温标定 正常', 'green');
  }
  if (inTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('进温标定 不正常', 'red');
    Log.error('进温标定 不正常');
    console.log('进温标定 不正常');
  } else {
    context.createLeftSpanMessage('进温标定 正常', 'green');
  }
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'red');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  } else {
    context.createLeftSpanMessage('电压 正常', 'green');
  }
  if (barometricPressureSensorNotPass) {
    context.createLeftSpanMessage('气压传感器 不正常', 'red');
    Log.error('气压传感器 不正常');
    console.log('气压传感器 不正常');
  } else {
    context.createLeftSpanMessage('气压传感器 正常', 'green');
  }
  if (inPressureNotPass) {
    context.createLeftSpanMessage('进水压力 不正常', 'red');
    Log.error('进水压力 不正常');
    console.log('进水压力 不正常');
  } else {
    context.createLeftSpanMessage('进水压力 正常', 'green');
  }
  if (outPressureNotPass) {
    context.createLeftSpanMessage('回水压力 不正常', 'red');
    Log.error('回水压力 不正常');
    console.log('回水压力 不正常');
  } else {
    context.createLeftSpanMessage('回水压力 正常', 'green');
  }
  if (magneticSensorsNotPass) {
    context.createLeftSpanMessage('磁传感器 不正常', 'red');
    Log.error('磁传感器 不正常');
    console.log('磁传感器 不正常');
  } else {
    context.createLeftSpanMessage('磁传感器 正常', 'green');
  }
  if (outTemperatureMatchNotPass) {
    context.createLeftSpanMessage('回温探头 与实物不匹配', 'red');
    Log.error('回温探头 与实物不匹配');
    console.log('回温探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('回温探头 与实物匹配', 'green');
  }
  if (inTemperatureMatchNotPass) {
    context.createLeftSpanMessage('进温探头 与实物不匹配', 'red');
    Log.error('进温探头 与实物不匹配');
    console.log('进温探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('进温探头 与实物匹配', 'green');
  }
  if (outPressureMatchNotPass) {
    context.createLeftSpanMessage('回压探头 与实物不匹配', 'red');
    Log.error('回压探头 与实物不匹配');
    console.log('回压探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('回压探头 与实物匹配', 'green');
  }
  if (inPressureMatchNotPass) {
    context.createLeftSpanMessage('进压探头 与实物不匹配', 'red');
    Log.error('进压探头 与实物不匹配');
    console.log('进压探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('进压探头 与实物匹配', 'green');
  }
  if (baseCheck||selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    minimumValveOpeningNotPass ||
    maximumValveOpeningNotPass ||
    outTemperatureCalibrationNotPass ||
    inTemperatureCalibrationNotPass ||
    voltageNotPass ||
    barometricPressureSensorNotPass ||
    inPressureNotPass||
    outPressureNotPass||
    magneticSensorsNotPass||
    outTemperatureMatchNotPass||
    inTemperatureMatchNotPass||
    outPressureMatchNotPass||
    inPressureMatchNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'red');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = '';
    return true
  }
  //解析通过
  context.readAddress = decodeReadSelfTestAddressWAC710CD(context.receivedData.globalReceivedOneData); //读设备地址
  context.productName = decodeGetProductNameWAC710CD( context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.includes('WAC710CD')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolIdWAC710CD(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionWAC710CD(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderWAC710CD(context.receivedData.globalReceivedOneData) //运营商
  return false
}
