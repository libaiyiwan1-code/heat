import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) !== 0X01;
}


export function getDeviceProtocolId(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(57).toString(16), 16)
}

export function decodeCheckEEP(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0x01 && dataView.getUint8(58) !== 0x02;

}

export function decodeCheckNetwork(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

}

export function checkValveOpenMinimumCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}

export function checkValveOpenMaximumCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function checkOutTemperatureCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8((62)) !== 0x02;

}

export function checkInTemperatureCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function decodeCheckInletWaterPressure(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66) !== 0x01 && dataView.getUint8(66) !== 0x02;

}

export function decodeCheckOutputWaterPressure(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(67) !== 0x01 && dataView.getUint8(67) !== 0x02;

}

export function decodeCheckHall(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}

export function decodeCheckInTemperatureSensor(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckOutTemperatureSensor(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}

export function decodeCheckLiquidLevel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckAmbientTemperatureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01

}

export function decodeCheckPipeTemperatureProbes(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) !== 0x01

}

export function decodeCheckLevelProbes(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66) !== 0x01

}


export function decodeGetProductName(responseMessage) {
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

export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x78 ||
    dataView.getUint8(27) !== 0xF0 ||
    dataView.getUint8(28) !== 0xDD
  let selfTestCompletedNotPass = notHasSelfTestCompleted(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEP(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetwork(context.receivedData.globalReceivedOneData)     //             联网
  let valveOpenMinimumCalibrationNotPass = checkValveOpenMinimumCalibrationNotPass(context.receivedData.globalReceivedOneData)            //阀门开度最小标定
  let valveOpenMaximumCalibrationNotPass = checkValveOpenMaximumCalibrationNotPass(context.receivedData.globalReceivedOneData)         //阀门开关最大标定
  let outTemperatureCalibrationNotPass = checkOutTemperatureCalibrationNotPass(context.receivedData.globalReceivedOneData)                //回温标定
  let inTemperatureCalibrationNotPass = checkInTemperatureCalibrationNotPass(context.receivedData.globalReceivedOneData)                //进温标定
  let voltageNotPass = decodeCheckVoltage(context.receivedData.globalReceivedOneData)     //            电压
  let inletWaterPressureNotPass = decodeCheckInletWaterPressure(context.receivedData.globalReceivedOneData)     //            进水压力是否正常
  let outputWaterPressureNotPass = decodeCheckOutputWaterPressure(context.receivedData.globalReceivedOneData)     //            回水压力是否正常

  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'grey');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'grey');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  }

  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'grey');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  }

  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'grey');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  }
  if (valveOpenMinimumCalibrationNotPass) {
    context.createLeftSpanMessage('阀门最小开度标定 不正常', 'grey');
    Log.error('阀门最小开度标定 不正常');
    console.log('阀门最小开度标定 不正常');
  }
  if (valveOpenMaximumCalibrationNotPass) {
    context.createLeftSpanMessage('阀门最大开度标定 不正常', 'grey');
    Log.error('阀门最大开度标定 不正常');
    console.log('阀门最大开度标定 不正常');
  }
  if (outTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('回温标定 不正常', 'grey');
    Log.error('回温标定 不正常');
    console.log('回温标定 不正常');
  }
  if (inTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('进温标定 不正常', 'grey');
    Log.error('进温标定 不正常');
    console.log('进温标定 不正常');
  }
  if (inletWaterPressureNotPass) {
    context.createLeftSpanMessage('进水压力 不正常', 'grey');
    Log.error('进水压力 不正常');
    console.log('进水压力 不正常');
  }
  if (outputWaterPressureNotPass) {
    context.createLeftSpanMessage('回水压力 不正常', 'grey');
    Log.error('回水压力 不正常');
    console.log('回水压力 不正常');
  }


  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    voltageNotPass ||
    valveOpenMinimumCalibrationNotPass||
    valveOpenMaximumCalibrationNotPass||
    outTemperatureCalibrationNotPass||
    inTemperatureCalibrationNotPass||
    inletWaterPressureNotPass||
    outputWaterPressureNotPass
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
  context.productName = decodeGetProductName(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.toLowerCase().includes('wac300lh')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'grey');
    return true;
  }
  context.protocolId = getDeviceProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProvider(context.receivedData.globalReceivedOneData) //运营商
  return false
}
