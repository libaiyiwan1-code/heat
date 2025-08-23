import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompletedCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) !== 0X01 ;
}


export function getDeviceProtocolIdCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(21).toString(16), 16)
}

export function decodeGetNetProviderCT1000(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(57).toString(16), 16)
}

export function decodeGetVersionCT1000(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeCheckEEPCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(57) !== 0x01 && dataView.getUint8(57)!== 0x02;

}

export function decodeCheckNetworkCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0x01 && dataView.getUint8(58) !== 0x02;

}

export function decodeCheckMinimumValveOpeningCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(93) !== 0x01 && dataView.getUint8(93) !== 0x02;

}

export function decodeCheckMaximumValveOpeningCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(94) !== 0x01 && dataView.getUint8(94) !== 0x02;

}

export function decodeCheckOutTemperatureCalibrationCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95) !== 0x01 && dataView.getUint8(95) !==0x02;

}

export function decodeCheckInTemperatureCalibrationCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96) !== 0x01 && dataView.getUint8(96) !== 0x02;

}

export function decodeCheckVoltageCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

}

export function decodeCheckHallCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !==0x01 && dataView.getUint8(60) !==0x02;

}

export function decodeCheckInTemperatureSensorCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckOutTemperatureSensorCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}

export function decodeCheckDifferentialPressureCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(101) !== 0x01 && dataView.getUint8(101) !== 0x02;

}

export function decodeCheckInletWaterPressureSensorCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !==0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckOutWaterPressureSensorCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function decodeCheckInTemperatureMatchCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(103) !== 0x01 && dataView.getUint8(103) !== 0x02;

}

export function decodeCheckOutPressureMatchCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(104) !== 0x01 && dataView.getUint8(104) !== 0x02;

}
export function decodeCheckTemperatureSensorCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) !== 0x01 && dataView.getUint8(65) !== 0x02;

}export function decodeCheckDifferentialPressureMatchCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(107) !== 0x01 && dataView.getUint8(107) !== 0x02;

}


export function decodeReadSelfTestAddressCT1000(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(22).toString(16) ;

}
export function decodeGetProductNameCT1000(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 30; i <= 54; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}
export function decodeCheckReadSelfTestStatusCT1000(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x91 ||
    dataView.getUint8(26) !== 0xF0 ||
    dataView.getUint8(28) !== 0x1E
  let selfTestCompletedNotPass = notHasSelfTestCompletedCT1000(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPCT1000(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkCT1000(context.receivedData.globalReceivedOneData)     //             联网
  let voltageNotPass = decodeCheckVoltageCT1000(context.receivedData.globalReceivedOneData)     //             电压
  let hallNotPass = decodeCheckHallCT1000(context.receivedData.globalReceivedOneData)     //             霍尔
  let inTemperatureSensorNotPass = decodeCheckInTemperatureSensorCT1000(context.receivedData.globalReceivedOneData)     //             进温传感器
  let outTemperatureSensorNotPass = decodeCheckOutTemperatureSensorCT1000(context.receivedData.globalReceivedOneData)     //             回温传感器
  let inletWaterPressureSensorNotPass = decodeCheckInletWaterPressureSensorCT1000(context.receivedData.globalReceivedOneData)     //             进压传感器
  let outWaterPressureSensorNotPass = decodeCheckOutWaterPressureSensorCT1000(context.receivedData.globalReceivedOneData)     //             回压传感器
  let temperatureSensorNotPass
  if (context.configForm.produceModel === 'CT1000'){
     temperatureSensorNotPass = decodeCheckTemperatureSensorCT1000(context.receivedData.globalReceivedOneData)     //             温度传感器是否正常
  }else if (context.configForm.produceModel === 'ET01'){
    temperatureSensorNotPass=false
  }
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  }
  // else {
  //   context.createLeftSpanMessage('已自检过', 'green');
  // }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'red');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('eep 正常', 'green');
  // }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'red');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('联网 正常', 'green');
  // }
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'red');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('电压 正常', 'green');
  // }
  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'red');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('霍尔 正常', 'green');
  // }
  if (inTemperatureSensorNotPass) {
    context.createLeftSpanMessage('进温传感器 不正常', 'red');
    Log.error('进温传感器 不正常');
    console.log('进温传感器 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('进温传感器 正常', 'green');
  // }
  if (outTemperatureSensorNotPass) {
    context.createLeftSpanMessage('回温传感器 不正常', 'red');
    Log.error('回温传感器 不正常');
    console.log('回温传感器 不正常');
  }

  // if (differentialPressure) {
  //   context.createLeftSpanMessage('压差 不正常', 'red');
  //   Log.error('压差 不正常');
  //   console.log('压差 不正常');
  // }
  // else {
  //   context.createLeftSpanMessage('回水压力 正常', 'green');
  // }
  if (inletWaterPressureSensorNotPass) {
    context.createLeftSpanMessage('进压传感器 不正常', 'red');
    Log.error('进压传感器 不正常');
    console.log('进压传感器 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('进压传感器 正常', 'green');
  // }
  if (outWaterPressureSensorNotPass) {
    context.createLeftSpanMessage('回压传感器 不正常', 'red');
    Log.error('回压传感器 不正常');
    console.log('回压传感器 不正常');
  }
  // else {
  //   context.createLeftSpanMessage('回温探头 与实物匹配', 'green');
  // }
  if (temperatureSensorNotPass) {
    context.createLeftSpanMessage('温度传感器 不正常', 'red');
    Log.error('温度传感器 不正常');
    console.log('温度传感器 不正常');
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
    voltageNotPass ||
    hallNotPass ||
    inTemperatureSensorNotPass||
    outTemperatureSensorNotPass||
    // differentialPressure||
    inletWaterPressureSensorNotPass||
    outWaterPressureSensorNotPass||
    temperatureSensorNotPass
    // ||
    // differentialPressureMatchNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'grey');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = '';
    return true
  }else{
    context.createLeftSpanMessage('自检通过', 'grey');
    // context.leftWorkPrompt = '自检通过'
    // context.buttonSuccess('leftWorkPromptColor')
  }
  //解析通过
  context.leftReadAddress = decodeReadSelfTestAddressCT1000(context.receivedData.globalReceivedOneData); //读设备地址
  context.productName = decodeGetProductNameCT1000( context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.includes('CT1000')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolIdCT1000(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionCT1000(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderCT1000(context.receivedData.globalReceivedOneData) //运营商
  return false
}
