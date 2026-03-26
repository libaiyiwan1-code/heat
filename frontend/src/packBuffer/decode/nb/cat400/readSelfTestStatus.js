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
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(55).toString(16)
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

export function decodeCheckVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59) !== 0x01 && dataView.getUint8(59) !== 0x02;

}

export function decodeCheckMBusChannel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(messageBuffer);
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}

export function decodeCheckRS485Channel(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(messageBuffer);
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

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
  for (let i = 30; i <= 53; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}

export function checkButtonOneStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

}


export function checkButtonTwoStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function checkButtonThreeStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}
export function checkTemperatureSensorNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(19) !== 0x68 ||
    dataView.getUint8(20) !== 0x80 || //报文返回控制码
    dataView.getUint8(21) !== 0x7B || //协议id
    dataView.getUint8(26) !== 0xF0 || //FN
    dataView.getUint8(28) !== 0x1E  //AFN
  let selfTestCompletedNotPass = notHasSelfTestCompleted(responseMessage)               //是否自检过
  let buttonOneNotPass = checkButtonOneStatusNotPass(responseMessage)               //按键1
  let buttonTwoNotPass = checkButtonTwoStatusNotPass(responseMessage)               //按键2
  let buttonThreeNotPass = checkButtonThreeStatusNotPass(responseMessage)               //按键3
  let networkNotPass = decodeCheckNetwork(responseMessage)     //             联网
  let eepNotPass = decodeCheckEEP(responseMessage)     //             EEP
  let voltageNotPass = decodeCheckVoltage(responseMessage)     //             电压
  let temperatureSensorNotPass = checkTemperatureSensorNotPass(responseMessage)                               //温度传感器
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'grey');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  }
  if (buttonOneNotPass) {
    context.createLeftSpanMessage('按键1 不正常', 'grey');
    Log.error('按键1 不正常');
    console.log('按键1 不正常');
  }
  if (buttonTwoNotPass) {
    context.createLeftSpanMessage('按键2 不正常', 'grey');
    Log.error('按键2 不正常');
    console.log('按键2 不正常');
  }
  if (buttonThreeNotPass) {
    context.createLeftSpanMessage('按键3 不正常', 'grey');
    Log.error('按键3 不正常');
    console.log('按键3 不正常');
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
  if (temperatureSensorNotPass) {
    context.createLeftSpanMessage('温度传感器 不正常', 'grey');
    Log.error('温度传感器 不正常');
    console.log('温度传感器 不正常');
  }



  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    voltageNotPass ||
    buttonOneNotPass ||
    buttonTwoNotPass ||
    buttonThreeNotPass ||
    temperatureSensorNotPass

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
  if (!context.productName.toLowerCase().includes('cat400')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProvider(context.receivedData.globalReceivedOneData) //运营商
  return false
}
