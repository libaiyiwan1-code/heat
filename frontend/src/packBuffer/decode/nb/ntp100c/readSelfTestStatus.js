import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompletedNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54) !== 0X01;
}


export function getDeviceProtocolIdNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(21).toString(16), 16)
}

export function decodeGetNetProviderNTP100C(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16)
}

export function decodeGetVersionNTP100C(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeCheckEEPNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(57) !== 0x01 && dataView.getUint8(57) !== 0x02;

}

export function decodeCheckNetworkNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0x01 && dataView.getUint8(58) !== 0x02;

}

export function decodeCheckVoltageNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

}

export function decodeCheckHallNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}

export function decodeCheckInTemperatureSensorNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckOutTemperatureSensorNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}


export function decodeCheckInPressureSensorNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckOutPressureSensorNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}


export function decodeReadSelfTestAddressNTP100C(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16);

}

export function decodeGetProductNameNTP100C(responseMessage) {
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

export function decodeCheckReadSelfTestStatusNTP100C(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 ||
    dataView.getUint8(21) !== 0x70 ||
    dataView.getUint8(26) !== 0xF0 ||
    dataView.getUint8(28) !== 0x1E
  let selfTestCompletedNotPass = notHasSelfTestCompletedNTP100C(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPNTP100C(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkNTP100C(context.receivedData.globalReceivedOneData)     //             联网
  let voltageNotPass = decodeCheckVoltageNTP100C(context.receivedData.globalReceivedOneData)     //             电压
  let hallNotPass = decodeCheckHallNTP100C(context.receivedData.globalReceivedOneData)     //             霍尔
  let inTemperatureSensorNotPass = decodeCheckInTemperatureSensorNTP100C(context.receivedData.globalReceivedOneData)     //             进温传感器
  let outTemperatureSensorNotPass = decodeCheckOutTemperatureSensorNTP100C(context.receivedData.globalReceivedOneData)     //             回温传感器
  let inPressureSensorNotPass = decodeCheckInPressureSensorNTP100C(context.receivedData.globalReceivedOneData)     //             进压传感器
  let outPressureNotPass = decodeCheckOutPressureSensorNTP100C(context.receivedData.globalReceivedOneData)     //             回压传感器
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

  if (inPressureSensorNotPass) {
    context.createLeftSpanMessage('进压传感器 不正常', 'grey');
    Log.error('进压传感器 不正常');
    console.log('进压传感器 不正常');
  }
  if (outPressureNotPass) {
    context.createLeftSpanMessage('回压传感器 不正常', 'grey');
    Log.error('回压传感器 不正常');
    console.log('回压传感器 不正常');
  }


  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    voltageNotPass ||
    hallNotPass ||
    inTemperatureSensorNotPass ||
    outTemperatureSensorNotPass ||
    inPressureSensorNotPass ||
    outPressureNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'red');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = '';
    return true
  } else {
    context.createLeftSpanMessage('自检通过', 'grey');
    // context.leftWorkPrompt = '自检通过'
    // context.buttonSuccess('leftWorkPromptColor')
  }
  //解析通过
  context.productName = decodeGetProductNameNTP100C(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.includes('NTP100')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolIdNTP100C(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionNTP100C(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderNTP100C(context.receivedData.globalReceivedOneData) //运营商
  return false
}
