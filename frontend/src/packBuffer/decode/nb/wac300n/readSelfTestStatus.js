import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
import {protocolIDMap} from "@/views/device/enum/enum";

const Log = require('ee-core/log');

export function notHasSelfTestCompletedWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(87) !== 0X01;
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

export function decodeCheckEEPWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(91) !== 0x01 && dataView.getUint8(91) !== 0x02;

}

export function decodeCheckNetworkWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(92) !== 0x01 && dataView.getUint8(92) !== 0x02;

}

export function decodeCheckMinimumValveOpeningWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(93) !== 0x01 && dataView.getUint8(93) !== 0x02;

}

export function decodeCheckMaxValveOpeningWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(94) !== 0x01 && dataView.getUint8(94) !== 0x02;

}

export function decodeCheckOutTemperatureCalibrationWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95) !== 0x01 && dataView.getUint8(95) !== 0x02;

}

export function decodeCheckInTemperatureCalibrationWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96) !== 0x01 && dataView.getUint8(96) !== 0x02;

}


export function decodeCheckVoltageWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(97) !== 0x01 && dataView.getUint8(97) !== 0x02;

}


export function decodeReadSelfTestAddressWAC300N(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16);

}

export function decodeGetProductNameWAC300N(responseMessage) {
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

export function decodeCheckReadSelfTestStatusWAC300N(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(33) !== 0x68 ||
    dataView.getUint8(36) !== 0x68 ||
    dataView.getUint8(37) !== 0x80 ||
    dataView.getUint8(38) !== 0x47 ||
    dataView.getUint8(60) !== 0xF0 ||
    dataView.getUint8(61) !== 0xDD
  let selfTestCompletedNotPass = notHasSelfTestCompletedWAC300N(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPWAC300N(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkWAC300N(context.receivedData.globalReceivedOneData)     //             联网
  let minimumValveOpeningNotPass = decodeCheckMinimumValveOpeningWAC300N(context.receivedData.globalReceivedOneData)     //             最小开度
  let maxValveOpeningNotPass = decodeCheckMaxValveOpeningWAC300N(context.receivedData.globalReceivedOneData)     //             最大开度
  let outTemperatureCalibrationNotPass = decodeCheckOutTemperatureCalibrationWAC300N(context.receivedData.globalReceivedOneData)     //             回温标定
  let inTemperatureCalibrationNotPass = decodeCheckInTemperatureCalibrationWAC300N(context.receivedData.globalReceivedOneData)     //             进温标定
  let voltageNotPass = decodeCheckVoltageWAC300N(context.receivedData.globalReceivedOneData)     //             电压
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
    context.createLeftSpanMessage('阀门最小开度 不正常', 'red');
    Log.error('阀门最小开度 不正常');
    console.log('阀门最小开度 不正常');
  }
  if (maxValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最大开度 不正常', 'red');
    Log.error('阀门最大开度 不正常');
    console.log('阀门最大开度 不正常');
  }
  if (outTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('回温标定 不正常', 'red');
    Log.error('回温标定 不正常');
    console.log('回温标定 不正常');
  }
  if (inTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('进温标定 不正常', 'red');
    Log.error('进温标定 不正常');
    console.log('进温标定 不正常');
  }
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'red');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  }


  if (baseCheck || selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    minimumValveOpeningNotPass ||
    maxValveOpeningNotPass ||
    outTemperatureCalibrationNotPass ||
    inTemperatureCalibrationNotPass || voltageNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'red');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.buttonError('leftWorkPromptColor')
    context.receivedData.globalReceivedOneData = '';
    return true
  } else {
    context.createLeftSpanMessage('自检通过', 'grey');
    // context.leftWorkPrompt = '自检通过'
    // context.buttonSuccess('leftWorkPromptColor')
  }
  //解析通过
  context.productName = decodeGetProductNameWAC300N(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.includes('WAC300N')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'red');
    return true;
  }
  context.protocolId = getDeviceProtocolIdWAC300N(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionWAC300N(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderWAC300N(context.receivedData.globalReceivedOneData) //运营商
  //根据运营商改编enum中的mode
  console.log('解析运营商：', context.netprovider)
  console.log('解析运营商：', typeof context.netprovider)
  if (context.netprovider === 1) {
    protocolIDMap[context.configForm.produceModel].model = 6
    protocolIDMap[context.configForm.produceModel].joinMode = 8
  } else if (context.netprovider === 2) {
    protocolIDMap[context.configForm.produceModel].model = 1
    protocolIDMap[context.configForm.produceModel].joinMode = 2
  }
  console.warn('数据变更：',protocolIDMap[context.configForm.produceModel] )
  return false
}
