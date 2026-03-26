import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function decodeCheckEEP(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(91) !== 0x01 && dataView.getUint8(91) !== 0x02;

}

export function decodeCheckNetwork(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(92) !== 0x01 && dataView.getUint8(92) !== 0x02;

}

export function decodeCheckValveClose(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(93) !== 0x01 && dataView.getUint8(93) !== 0x02;

}

export function decodeCheckValveOpen(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(94) !== 0x01 && dataView.getUint8(94) !== 0x02;

}

export function decodeGetProtocolId(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(88).toString(16), 16);
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(90).toString(16), 16)
}

export function decodeGetNetprovider(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(89).toString(16), 16)
}

export function decodeCheckFsk(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95) !== 0x01 && dataView.getUint8(95) !== 0x02;

}

export function decodeCheckMbus(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96) !== 0x01 && dataView.getUint8(96) !== 0x02;

}

export function decodeCheckHall(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(97) !== 0x01 && dataView.getUint8(97) !== 0x02;

}

export function decodeCheckBatteryVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(98) !== 0x01 && dataView.getUint8(98) !== 0x02;

}

export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(87) !== 0x01;

}

export function decodeGetProductNameWAC230CF(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 63; i <= 86; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}

export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(37) !== 0x80
    || dataView.getUint8(38) !== 0x8B
    || dataView.getUint8(60) !== 0xF0
    || dataView.getUint8(61) !== 0xDD
  let selfTestCompletedNotPass = notHasSelfTestCompleted(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEP(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetwork(context.receivedData.globalReceivedOneData)     //             联网
  let valveCloseNotPass = decodeCheckValveClose(context.receivedData.globalReceivedOneData)     //             阀关
  let valveOpenNotPass = decodeCheckValveOpen(context.receivedData.globalReceivedOneData)     //             阀开
  let fskNotPass = decodeCheckFsk(context.receivedData.globalReceivedOneData)     //             fsk
  let mbusNotPass = decodeCheckMbus(context.receivedData.globalReceivedOneData)     //             mbus
  let hallNotPass = decodeCheckHall(context.receivedData.globalReceivedOneData)               //霍尔
  let batteryVoltageNotPass = decodeCheckBatteryVoltage(context.receivedData.globalReceivedOneData)               //电池电压
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
  if (valveCloseNotPass) {
    context.createLeftSpanMessage('阀关 不正常', 'grey');
    Log.error('阀关 不正常');
    console.log('阀关 不正常');
  }
  if (valveOpenNotPass) {
    context.createLeftSpanMessage('阀开 不正常', 'grey');
    Log.error('阀开 不正常');
    console.log('阀开 不正常');
  }
  if (fskNotPass) {
    context.createLeftSpanMessage('无线通信fsk 不正常', 'grey');
    Log.error('无线通信fsk 不正常');
    console.log('无线通信fsk 不正常');
  }
  if (mbusNotPass) {
    context.createLeftSpanMessage('MBUS 不正常', 'grey');
    Log.error('MBUS 不正常');
    console.log('MBUS 不正常');
  }
  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'grey');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  }
  if (batteryVoltageNotPass) {
    context.createLeftSpanMessage('电池电压 不正常', 'grey');
    Log.error('电池电压 不正常');
    console.log('电池电压 不正常');
  }

  if (selfTestCompletedNotPass || eepNotPass || networkNotPass || valveCloseNotPass || valveOpenNotPass ||
    fskNotPass || mbusNotPass || hallNotPass || batteryVoltageNotPass || baseCheck) {
    context.createLeftSpanMessage('自检不通过', 'grey');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = '';
    return true
  }
  //解析通过
  context.productName = decodeGetProductNameWAC230CF(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.toLowerCase().includes('wac230cf')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'grey');
    return true
  }
  context.protocolId = decodeGetProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetprovider(context.receivedData.globalReceivedOneData) //运营商
  return false
}
