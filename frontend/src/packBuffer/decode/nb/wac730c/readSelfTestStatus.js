import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompletedWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) !== 0X01 ;
}


export function getDeviceProtocolIdWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16)
}

export function decodeGetNetProviderWAC730C(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeGetVersionWAC730C(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(57).toString(16), 16)
}

export function decodeCheckEEPWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0x01 && dataView.getUint8(58)!== 0x02;

}

export function decodeCheckNetworkWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

}

export function decodeCheckMinimumValveOpeningWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}

export function decodeCheckMaximumValveOpeningWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckOutTemperatureCalibrationWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !==0x02;

}

export function decodeCheckInTemperatureCalibrationWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckVoltageWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function decodeCheckBarometricPressureSensorWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) !==0x01 && dataView.getUint8(65) !==0x02;

}


export function decodeCheckInletWaterPressureSensorWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66) !==0x01 && dataView.getUint8(66) !== 0x02;

}

export function decodeCheckOutWaterPressureSensorWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(67) !== 0x01 && dataView.getUint8(67) !== 0x02;

}


export function decodeReadSelfTestAddressWAC730C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(6).toString(16) ;

}
export function decodeGetProductNameWAC730C(responseMessage) {
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
export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(0) !== 0X68 ||
    dataView.getUint8(3) !== 0X68 ||
    dataView.getUint8(4) !== 0X80 ||
    dataView.getUint8(5) !== 0X94 ||
    dataView.getUint8(10) !== 0X0C ||
    dataView.getUint8(12) !== 0X01 ||
    dataView.getUint8(16) !== 0X68 ||
    dataView.getUint8(17) !== 0X94 ||
    dataView.getUint8(27) !== 0XF0 ||
    dataView.getUint8(28) !== 0XDD
  let selfTestCompletedNotPass = notHasSelfTestCompletedWAC730C(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPWAC730C(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkWAC730C(context.receivedData.globalReceivedOneData)     //             联网
  let minimumValveOpeningNotPass = decodeCheckMinimumValveOpeningWAC730C(context.receivedData.globalReceivedOneData)     //             电压
  let maximumValveOpeningNotPass = decodeCheckMaximumValveOpeningWAC730C(context.receivedData.globalReceivedOneData)     //             电压
  let outTemperatureCalibrationNotPass = decodeCheckOutTemperatureCalibrationWAC730C(context.receivedData.globalReceivedOneData)     //             电压
  let inTemperatureCalibrationNotPass = decodeCheckInTemperatureCalibrationWAC730C(context.receivedData.globalReceivedOneData)     //             电压
  let voltageNotPass = decodeCheckVoltageWAC730C(context.receivedData.globalReceivedOneData)     //             霍尔
  let barometricPressureSensorNotPass = decodeCheckBarometricPressureSensorWAC730C(context.receivedData.globalReceivedOneData)     //             进温传感器
  let inletWaterPressureSensorNotPass = decodeCheckInletWaterPressureSensorWAC730C(context.receivedData.globalReceivedOneData)     //             回温传感器
  let outWaterPressureSensorNotPass = decodeCheckOutWaterPressureSensorWAC730C(context.receivedData.globalReceivedOneData)     //             回压传感器
  let temperatureSensorNotPass

  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'red');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'red');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  }
  if (minimumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最小开度标定 不正常', 'red');
    Log.error('阀门最小开度标定 不正常');
    console.log('阀门最小开度标定 不正常');
  }
  if (maximumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最大开度标定 不正常', 'red');
    Log.error('阀门最大开度标定 不正常 不正常');
    console.log('阀门最大开度标定 不正常 不正常');
  }
  if (outTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('回温传感器 不正常', 'red');
    Log.error('回温传感器 不正常 不正常');
    console.log('回温传感器 不正常 不正常');
  }

  if (inTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('进温传感器 不正常', 'red');
    Log.error('进温传感器 不正常');
    console.log('进温传感器 不正常');
  }
if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'red');
    Log.error('电压 不正常 不正常');
    console.log('电压 不正常 不正常');
  }
if (barometricPressureSensorNotPass) {
    context.createLeftSpanMessage('气压传感器 不正常', 'red');
    Log.error('气压传感器 不正常');
    console.log('气压传感器 不正常');
}
if (inletWaterPressureSensorNotPass) {
    context.createLeftSpanMessage('进压传感器 不正常', 'red');
    Log.error('进压传感器 不正常');
    console.log('进压传感器 不正常');
}if (outWaterPressureSensorNotPass) {
    context.createLeftSpanMessage('回压传感器 不正常', 'red');
    Log.error('回压传感器 不正常 不正常');
    console.log('回压传感器 不正常 不正常');
}

  if (baseCheck||selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    minimumValveOpeningNotPass ||
    maximumValveOpeningNotPass ||
    outTemperatureCalibrationNotPass||
    inTemperatureCalibrationNotPass||
    voltageNotPass||
    barometricPressureSensorNotPass||
    inletWaterPressureSensorNotPass||
    outWaterPressureSensorNotPass
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
  context.leftReadAddress = decodeReadSelfTestAddressWAC730C(context.receivedData.globalReceivedOneData); //读设备地址
  context.productName = decodeGetProductNameWAC730C( context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.toLowerCase().includes('wac730c')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolIdWAC730C(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionWAC730C(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderWAC730C(context.receivedData.globalReceivedOneData) //运营商
  return false
}
