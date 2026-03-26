import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58) !== 0X01;
}


export function getDeviceProtocolId(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(23).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(59).toString(16), 16)
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(60).toString(16), 16)
}

export function decodeCheckEEP(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckNetwork(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}

export function decodeCheckVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function decodeCheckMBusChannel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(messageBuffer);
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function decodeCheckRS485Channel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(messageBuffer);
  return dataView.getUint8(65) !== 0x01 && dataView.getUint8(65) !== 0x02;

}

export function decodeCheckFSKChannel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(messageBuffer);
  return dataView.getUint8(66) !== 0x01 && dataView.getUint8(66) !== 0x02;

}


export function decodeGetProductName(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 34; i <= 57; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}

export function readSelfTestStatus (context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(18) !== 0x68 ||
    dataView.getUint8(21) !== 0x68 ||
    dataView.getUint8(22) !== 0x80 || //报文返回控制码
    dataView.getUint8(23) !== 0x80 || //协议id
    dataView.getUint8(30) !== 0xF0 || //FN
    dataView.getUint8(32) !== 0x1E  //AFN
  let selfTestCompletedNotPass = notHasSelfTestCompleted(responseMessage)               //是否自检过
  let eepNotPass = decodeCheckEEP(responseMessage)     //             EEP
  let networkNotPass = decodeCheckNetwork(responseMessage)     //             联网
  let voltageNotPass = decodeCheckVoltage(responseMessage)     //             电压
  let mbusNotPass = decodeCheckMBusChannel(responseMessage)     //             MBUS通道
  let rs485NotPass = decodeCheckRS485Channel(responseMessage)     //             RS485通道
  let fskNotPass = decodeCheckFSKChannel(responseMessage)     //             FSK通道
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
  if (mbusNotPass) {
    context.createLeftSpanMessage('mbus通道 不正常', 'grey');
    Log.error('mbus通道 不正常');
    console.log('mbus通道 不正常');
  }
  if (rs485NotPass) {
    context.createLeftSpanMessage('rs485通道 不正常', 'grey');
    Log.error('rs485通道 不正常');
    console.log('rs485通道 不正常');
  }

  if (fskNotPass) {
    context.createLeftSpanMessage('fsk通道 不正常', 'grey');
    Log.error('fsk通道 不正常');
    console.log('fsk通道 不正常');
  }


  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    voltageNotPass ||
    mbusNotPass ||
    rs485NotPass ||
    fskNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'grey');
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
  context.productName = decodeGetProductName(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.toLowerCase().includes('lpc230')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProvider(context.receivedData.globalReceivedOneData) //运营商
  return false
}
