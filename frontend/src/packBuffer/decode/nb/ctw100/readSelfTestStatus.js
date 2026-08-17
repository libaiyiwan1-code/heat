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
  return parseInt(responseDataView.getUint8(21).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16)
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeCheckEEP(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(57) !== 0x01 && dataView.getUint8(57) !== 0x02;

}

export function decodeCheckNetwork(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0x01 && dataView.getUint8(58) !== 0x02;

}

export function decodeCheckBatteryVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

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
  return dataView.getUint8(65)!== 0x01

}

export function decodeCheckLevelProbes(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66)!== 0x01

}

export function decodeCheckInternalTemperatureNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(67)!== 0x01&&dataView.getUint8(67)!==0x02

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
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x8C ||
    dataView.getUint8(26) !== 0xF0 ||
    dataView.getUint8(28) !== 0x1E
  let selfTestCompletedNotPass = notHasSelfTestCompleted(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEP(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetwork(context.receivedData.globalReceivedOneData)     //             联网
  let batteryVoltageNotPass = decodeCheckBatteryVoltage(context.receivedData.globalReceivedOneData)     //             电池电压
  let hallNotPass = decodeCheckHall(context.receivedData.globalReceivedOneData)     //             霍尔不正常
  let inTemperatureSensorNotPass = decodeCheckInTemperatureSensor(context.receivedData.globalReceivedOneData)     //             进温传感器
  let outTemperatureSensorNotPass = decodeCheckOutTemperatureSensor(context.receivedData.globalReceivedOneData)     //             回温传感器
  let liquidLevelNotPass = decodeCheckLiquidLevel(context.receivedData.globalReceivedOneData)     //             液位
  let ambientTemperatureProbeNotPass = decodeCheckAmbientTemperatureProbe(context.receivedData.globalReceivedOneData)     //进温探头是否匹配
  let pipeTemperatureProbesNotPass = decodeCheckPipeTemperatureProbes(context.receivedData.globalReceivedOneData)     //             回温探头是否匹配
  let levelProbesNotPass = decodeCheckLevelProbes(context.receivedData.globalReceivedOneData)     //             液位温度探头是否匹配
  let internalTemperatureNotPass = decodeCheckInternalTemperatureNotPass(context.receivedData.globalReceivedOneData)     //             内部温度是否正常

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

  if (batteryVoltageNotPass) {
    context.createLeftSpanMessage('电池电压 不正常', 'grey');
    Log.error('电池电压 不正常');
    console.log('电池电压 不正常');
  }

  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'grey');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  }

  if (inTemperatureSensorNotPass) {
    context.createLeftSpanMessage('进温传感器 不正常', 'grey');
    Log.error('进温传感器 不正常');
    console.log('进温传感器 不正常');
  }

  if (outTemperatureSensorNotPass) {
    context.createLeftSpanMessage('回温传感器 不正常', 'grey');
    Log.error('回温传感器 不正常');
    console.log('回温传感器 不正常');
  }

  if (liquidLevelNotPass) {
    context.createLeftSpanMessage('液位 不正常', 'grey');
    Log.error('液位 不正常');
    console.log('液位 不正常');
  }

  if (ambientTemperatureProbeNotPass) {
    context.createLeftSpanMessage('进温探头与实物不匹配', 'grey');
    Log.error('进温探头与实物不匹配 不正常');
    console.log('进温探头与实物不匹配 不正常');
  }

  if (pipeTemperatureProbesNotPass) {
    context.createLeftSpanMessage('回温探头与实物不匹配 ', 'grey');
    Log.error('回温探头与实物不匹配 不正常');
    console.log('回温探头与实物不匹配 不正常');
  }

  if (levelProbesNotPass) {
    context.createLeftSpanMessage('液位探头与实物不匹配 ', 'grey');
    Log.error('液位探头与实物不匹配 不正常');
    console.log('液位探头与实物不匹配 不正常');
  }
  if (internalTemperatureNotPass) {
    context.createLeftSpanMessage('内部温度 不正常', 'grey');
    Log.error('内部温度 不正常');
    console.log('内部温度 不正常');
  }

  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    batteryVoltageNotPass ||
    hallNotPass ||
    inTemperatureSensorNotPass ||
    outTemperatureSensorNotPass ||
    liquidLevelNotPass ||
    ambientTemperatureProbeNotPass ||
    pipeTemperatureProbesNotPass ||
    levelProbesNotPass||
    internalTemperatureNotPass
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
  if (!context.productName.toLowerCase().includes('ctw100')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'grey');
    return true;
  }
  context.protocolId = getDeviceProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProvider(context.receivedData.globalReceivedOneData) //运营商
  return false
}
