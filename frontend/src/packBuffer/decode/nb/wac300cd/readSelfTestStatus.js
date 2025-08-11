import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompletedWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(87) !== 0X01 ;
}


export function getDeviceProtocolIdWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(88).toString(16), 16)
}

export function decodeGetNetProviderWAC300CD(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(89).toString(16), 16)
}

export function decodeGetVersionWAC300CD(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(90).toString(16), 16)
}

export function decodeCheckEEPWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(91) !== 0x01 && dataView.getUint8(91)!== 0x02;

}

export function decodeCheckNetworkWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(92) !== 0x01 && dataView.getUint8(92) !== 0x02;

}

export function decodeCheckMinimumValveOpeningWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(93) !== 0x01 && dataView.getUint8(93) !== 0x02;

}

export function decodeCheckMaximumValveOpeningWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(94) !== 0x01 && dataView.getUint8(94) !== 0x02;

}

export function decodeCheckOutTemperatureCalibrationWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95) !== 0x01 && dataView.getUint8(95) !==0x02;

}

export function decodeCheckInTemperatureCalibrationWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96) !== 0x01 && dataView.getUint8(96) !== 0x02;

}

export function decodeCheckVoltageWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(97) !== 0x01 && dataView.getUint8(97) !== 0x02;

}

export function decodeCheckBarometricPressureSensorWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(98) !==0x01 && dataView.getUint8(98) !==0x02;

}

export function decodeCheckInPressureWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(99) !== 0x01 && dataView.getUint8(99) !== 0x02;

}

export function decodeCheckOutPressureWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(100) !== 0x01 && dataView.getUint8(100) !== 0x02;

}

export function decodeCheckDifferentialPressureWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(101) !== 0x01 && dataView.getUint8(101) !== 0x02;

}

export function decodeCheckMagneticSensorsWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(101) !==0x01 && dataView.getUint8(101) !== 0x02;

}

export function decodeCheckOutTemperatureMatchWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(102) !== 0x01 && dataView.getUint8(102) !== 0x02;

}

export function decodeCheckInTemperatureMatchWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(103) !== 0x01 && dataView.getUint8(103) !== 0x02;

}

export function decodeCheckOutPressureMatchWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(104) !== 0x01 && dataView.getUint8(104) !== 0x02;

}
export function decodeCheckInPressureMatchWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(105) !== 0x01 && dataView.getUint8(105) !== 0x02;

}export function decodeCheckDifferentialPressureMatchWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(107) !== 0x01 && dataView.getUint8(107) !== 0x02;

}


export function decodeReadSelfTestAddressWAC300CD(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16) ;

}
export function decodeGetProductNameWAC300CD(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 63; i <= 87; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}
export function decodeCheckReadSelfTestStatusWAC300CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(33) !== 0x68 ||
    dataView.getUint8(36) !== 0x68 ||
    dataView.getUint8(37) !== 0x80 ||
    dataView.getUint8(38) !== 0x8E ||
    dataView.getUint8(49) !== 0x68 ||
    dataView.getUint8(50) !== 0x8E ||
    dataView.getUint8(60) !== 0xF0 ||
    dataView.getUint8(61) !== 0xDE
  let selfTestCompletedNotPass = notHasSelfTestCompletedWAC300CD(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPWAC300CD(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkWAC300CD(context.receivedData.globalReceivedOneData)     //             联网
  let minimumValveOpeningNotPass = decodeCheckMinimumValveOpeningWAC300CD(context.receivedData.globalReceivedOneData)     //             最小开度标定
  let maximumValveOpeningNotPass = decodeCheckMaximumValveOpeningWAC300CD(context.receivedData.globalReceivedOneData)     //             最大开度标定
  let outTemperatureCalibrationNotPass = decodeCheckOutTemperatureCalibrationWAC300CD(context.receivedData.globalReceivedOneData)     //             回温标定
  let inTemperatureCalibrationNotPass = decodeCheckInTemperatureCalibrationWAC300CD(context.receivedData.globalReceivedOneData)     //             进温标定
  let voltageNotPass = decodeCheckVoltageWAC300CD(context.receivedData.globalReceivedOneData)     //             电压
  let barometricPressureSensorNotPass = decodeCheckBarometricPressureSensorWAC300CD(context.receivedData.globalReceivedOneData)     //             气压
  let inPressureNotPass = decodeCheckInPressureWAC300CD(context.receivedData.globalReceivedOneData)     //             进水压力
  let outPressureNotPass = decodeCheckOutPressureWAC300CD(context.receivedData.globalReceivedOneData)     //             回水压力
  let magneticSensorsNotPass = decodeCheckMagneticSensorsWAC300CD(context.receivedData.globalReceivedOneData)     //             磁性传感器
  let outTemperatureMatchNotPass = decodeCheckOutTemperatureMatchWAC300CD(context.receivedData.globalReceivedOneData)     //             回温探头是否匹配
  let inTemperatureMatchNotPass = decodeCheckInTemperatureMatchWAC300CD(context.receivedData.globalReceivedOneData)     //             进温探头是否匹配
   let outPressureMatchNotPass = decodeCheckOutPressureMatchWAC300CD(context.receivedData.globalReceivedOneData)     //             回压探头是否匹配
  let inPressureMatchNotPass = decodeCheckInPressureMatchWAC300CD(context.receivedData.globalReceivedOneData)     //             进压探头是否匹配
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'grey');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  }
  // else {
  //   context.createLeftSpanMessage('已自检过', 'green');
  // }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'grey');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('eep 正常', 'green');
  // }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'grey');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('联网 正常', 'green');
  // }
  if (minimumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最小开度标定 不正常', 'grey');
    Log.error('阀门最小开度标定 不正常');
    console.log('阀门最小开度标定 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('阀门最小开度标定 正常', 'green');
  // }
  if (maximumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最大开度标定 不正常', 'grey');
    Log.error('阀门最大开度标定 不正常');
    console.log('阀门最大开度标定 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('阀门最大开度标定 正常', 'green');
  // }
  if (outTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('回温标定 不正常', 'grey');
    Log.error('回温标定 不正常');
    console.log('回温标定 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('回温标定 正常', 'green');
  // }
  if (inTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('进温标定 不正常', 'grey');
    Log.error('进温标定 不正常');
    console.log('进温标定 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('进温标定 正常', 'green');
  // }
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'grey');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('电压 正常', 'green');
  // }
  if (barometricPressureSensorNotPass) {
    context.createLeftSpanMessage('气压传感器 不正常', 'grey');
    Log.error('气压传感器 不正常');
    console.log('气压传感器 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('气压传感器 正常', 'green');
  // }
  if (inPressureNotPass) {
    context.createLeftSpanMessage('进水压力 不正常', 'grey');
    Log.error('进水压力 不正常');
    console.log('进水压力 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('进水压力 正常', 'green');
  // }
  if (outPressureNotPass) {
    context.createLeftSpanMessage('回水压力 不正常', 'grey');
    Log.error('回水压力 不正常');
    console.log('回水压力 不正常');
  }

  // if (differentialPressure) {
  //   context.createLeftSpanMessage('压差 不正常', 'red');
  //   Log.error('压差 不正常');
  //   console.log('压差 不正常');
  // }
  // else {
  //   context.createLeftSpanMessage('回水压力 正常', 'green');
  // }
  if (magneticSensorsNotPass) {
    context.createLeftSpanMessage('磁传感器 不正常', 'grey');
    Log.error('磁传感器 不正常');
    console.log('磁传感器 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('磁传感器 正常', 'green');
  // }
  if (outTemperatureMatchNotPass) {
    context.createLeftSpanMessage('回温探头 与实物不匹配', 'grey');
    Log.error('回温探头 与实物不匹配');
    console.log('回温探头 与实物不匹配');
  }
  // else {
  //   context.createLeftSpanMessage('回温探头 与实物匹配', 'green');
  // }
  if (inTemperatureMatchNotPass) {
    context.createLeftSpanMessage('进温探头 与实物不匹配', 'grey');
    Log.error('进温探头 与实物不匹配');
    console.log('进温探头 与实物不匹配');
  }

  if (outPressureMatchNotPass) {
    context.createLeftSpanMessage('回压探头 与实物不匹配', 'grey');
    Log.error('回压探头 与实物不匹配');
    console.log('回压探头 与实物不匹配');
  }
  if (inPressureMatchNotPass) {
    context.createLeftSpanMessage('进压探头 与实物不匹配', 'grey');
    Log.error('进压探头 与实物不匹配');
    console.log('进压探头 与实物不匹配');
  }
  // if (differentialPressureMatchNotPass) {
  //   context.createLeftSpanMessage('压差探头 与实物不匹配', 'red');
  //   Log.error('压差探头 与实物不匹配');
  //   console.log('压差探头 与实物不匹配');
  // }
  // else {
  //   context.createLeftSpanMessage('进温探头 与实物匹配', 'green');
  // }
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
    // differentialPressure||
    magneticSensorsNotPass||
    outTemperatureMatchNotPass||
    inTemperatureMatchNotPass||
    outPressureMatchNotPass||
    inPressureMatchNotPass
    // ||
    // differentialPressureMatchNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'grey');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = '';
    context.buttonError('leftWorkPromptColor')
    return true
  }else{
    context.createLeftSpanMessage('自检通过', 'green');
    // context.leftWorkPrompt = '自检通过'
    // context.buttonSuccess('leftWorkPromptColor')
  }
  //解析通过
  context.leftReadAddress = decodeReadSelfTestAddressWAC300CD(context.receivedData.globalReceivedOneData); //读设备地址
  context.productName = decodeGetProductNameWAC300CD( context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.includes('WAC300CD')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'grey');
    return true;
  }
  context.protocolId = getDeviceProtocolIdWAC300CD(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionWAC300CD(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderWAC300CD(context.receivedData.globalReceivedOneData) //运营商
  return false
}
