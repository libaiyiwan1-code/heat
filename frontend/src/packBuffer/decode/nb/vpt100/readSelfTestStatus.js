import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(38) !== 0X01;
}


export function getDeviceProtocolId(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(5).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(55).toString(16)
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(40).toString(16), 16)
}

export function decodeCheckEEP(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(41) !== 0x01 && dataView.getUint8(41) !== 0x02;

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

export function decodeCheckElectricityMeteringChip(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60) !== 0x01 && dataView.getUint8(60) !== 0x02;

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
  for (let i = 14; i <= 37; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}

export function checkButtonOneStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62) !== 0x01 && dataView.getUint8(62) !== 0x02;

}


export function checkButtonTwoStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63) !== 0x01 && dataView.getUint8(63) !== 0x02;

}

export function checkButtonThreeStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64) !== 0x01 && dataView.getUint8(64) !== 0x02;

}

export function checkButtonFourStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65) !== 0x01 && dataView.getUint8(65) !== 0x02;

}

export function checkTemperatureSensorNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61) !== 0x01 && dataView.getUint8(61) !== 0x02;

}

export function decodeCheckTemperatureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(42) !== 0x01

}

export function decodeCheckPressureProbe(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(43) !== 0x01

}

export function decodeCheckHall(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(44) !== 0x01 && dataView.getUint8(44) !== 0x02;

}

export function decodeCheckInTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(45) !== 0x01 && dataView.getUint8(45) !== 0x02;

}

export function decodeCheckOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(46) !== 0x01 && dataView.getUint8(46) !== 0x02;

}

export function decodeCheckInPressure(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(47) !== 0x01 && dataView.getUint8(47) !== 0x02;

}

export function decodeCheckOutPressure(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(48) !== 0x01 && dataView.getUint8(48) !== 0x02;

}

export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(4) !== 0x80
    || dataView.getUint8(5) !== 0x51
    || dataView.getUint8(10) !== 0xF0
    || dataView.getUint8(12) !== 0x1E
  let selfTestCompletedNotPass = notHasSelfTestCompleted(responseMessage)               //是否自检过
  let eepNotPass = decodeCheckEEP(responseMessage)     //             EEP
  let checkTemperatureProbeNotPass = decodeCheckTemperatureProbe(responseMessage) //写入配置的温度探头与实物是否匹配
  let checkPressureProbeNotPass = decodeCheckPressureProbe(responseMessage) //写入配置的压力探头与实物是否匹配
  let hallNotPass = decodeCheckHall(responseMessage)               //霍尔
  let inTemperatureNotPass = decodeCheckInTemperature(responseMessage)               //进温
  let outTemperatureNotPass = decodeCheckOutTemperature(responseMessage)                                   //回温
  let inPressureNotPass = decodeCheckInPressure(responseMessage)                                   //进压
  let outPressureNotPass = decodeCheckOutPressure(responseMessage)                               //回压
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

  if (checkTemperatureProbeNotPass) {
    context.createLeftSpanMessage('温度探头 不匹配', 'grey');
    Log.error('温度探头 不匹配');
    console.log('温度探头 不匹配');
  }

  if (checkPressureProbeNotPass) {
    context.createLeftSpanMessage('压力探头 不匹配', 'grey');
    Log.error('压力探头 不匹配');
    console.log('压力探头 不匹配');
  }

  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'grey');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  }

  if (inTemperatureNotPass) {
    context.createLeftSpanMessage('进温 不正常', 'grey');
    Log.error('进温 不正常');
    console.log('进温 不正常');
  }
  if (outTemperatureNotPass) {
    context.createLeftSpanMessage('回温 不正常', 'grey');
    Log.error('回温 不正常');
    console.log('回温 不正常');
  }
  if (inPressureNotPass) {
    context.createLeftSpanMessage('进压 不正常', 'grey');
    Log.error('进压 不正常');
    console.log('进压 不正常');
  }
  if (outPressureNotPass) {
    context.createLeftSpanMessage('回压 不正常', 'grey');
    Log.error('回压 不正常');
    console.log('回压 不正常');
  }


  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    checkTemperatureProbeNotPass ||
    checkPressureProbeNotPass ||
    hallNotPass ||
    inTemperatureNotPass ||
    outTemperatureNotPass ||
    inPressureNotPass ||
    outPressureNotPass

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
  if (!context.productName.toLowerCase().includes('vpt100')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = null
  return false
}
