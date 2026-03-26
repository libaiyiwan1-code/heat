import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {protocolIDMap} from "@/views/device/enum/enum";

const Log = require('ee-core/log');

export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) !== 0X01;
}

export function decodeCheckPressureCalibrationStatus(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(57) !== 0x01 && dataView.getUint8(57) !== 0x02;
}
export function decodeCheckEEPStatus(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0x01 && dataView.getUint8(58) !== 0x02;
}


export function getDeviceProtocolIdWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(88).toString(16), 16)
}

export function decodeGetNetProviderWAC300N(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(89).toString(16), 16)
}

export function decodeGetVersionWAC300N(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(90).toString(16), 16)
}



export function decodeCheckNetwork(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

}



export function decodeCheckHall(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckExternalTemperatureSensor(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}

export function decodeCheckTemperatureSensor(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckPressureSensor(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function decodeCheckCurrentOutput(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) !== 0x01 && dataView.getUint8(65) !== 0x02;

}


export function decodeCheckOutTemperatureCalibration(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95) !== 0x01 && dataView.getUint8(95) !== 0x02;

}

export function decodeCheckInTemperatureCalibration(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96) !== 0x01 && dataView.getUint8(96) !== 0x02;

}


export function decodeCheckVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}


export function decodeReadSelfTestAddressWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16);

}

export function decodeGetProductName(responseMessage) {
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

export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(26) !== 0XF0 ||
    dataView.getUint8(28) !== 0X1E
  let selfTestCompletedNotPass = notHasSelfTestCompleted(context.receivedData.globalReceivedOneData)               //是否自检过
  let pressureCalibrationNotPass = decodeCheckPressureCalibrationStatus(context.receivedData.globalReceivedOneData)     //             压力标定是否正常
  let eepNotPass = decodeCheckEEPStatus(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetwork(context.receivedData.globalReceivedOneData)     //             联网
  let voltageNotPass = decodeCheckVoltage(context.receivedData.globalReceivedOneData)     //            电压
  let hallNotPass = decodeCheckHall(context.receivedData.globalReceivedOneData)     //             霍尔
  let externalTemperatureSensorNotPass = decodeCheckExternalTemperatureSensor(context.receivedData.globalReceivedOneData)     //             外部温度传感器
  let temperatureSensorNotPass = decodeCheckTemperatureSensor(context.receivedData.globalReceivedOneData)     //             温度传感器
  let pressureSensorNotPass = decodeCheckPressureSensor(context.receivedData.globalReceivedOneData)     //             压力传感器
  let currentOutputNotPass = decodeCheckCurrentOutput(context.receivedData.globalReceivedOneData)     //             电流输出

  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  }

  if (pressureCalibrationNotPass) {
    context.createLeftSpanMessage('压力标定 不正常', 'red');
    Log.error('压力标定 不正常');
    console.log('压力标定 不正常');
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
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'red');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  }
  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'red');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  }
  if (externalTemperatureSensorNotPass) {
    context.createLeftSpanMessage('外部温度传感器 不正常', 'red');
    Log.error('外部温度传感器 不正常');
    console.log('外部温度传感器 不正常');
  }
  if (temperatureSensorNotPass) {
    context.createLeftSpanMessage('温度传感器 不正常', 'red');
    Log.error('温度传感器 不正常');
    console.log('温度传感器 不正常');
  }
  if (pressureSensorNotPass) {
    context.createLeftSpanMessage('压力传感器 不正常', 'red');
    Log.error('压力传感器 不正常');
    console.log('压力传感器 不正常');
  }  if (currentOutputNotPass) {
    context.createLeftSpanMessage('电流输出 不正常', 'red');
    Log.error('电流输出 不正常');
    console.log('电流输出 不正常');
  }


  if (baseCheck || selfTestCompletedNotPass ||
    pressureCalibrationNotPass ||
    eepNotPass ||
    networkNotPass ||
    voltageNotPass ||
    hallNotPass ||
    externalTemperatureSensorNotPass || temperatureSensorNotPass||
    pressureSensorNotPass || currentOutputNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'grey');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = '';
    return true
  } else {
    context.createLeftSpanMessage('自检通过', 'grey');
  }
  return false
}
