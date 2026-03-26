import {calculateCSByte, hex2arrayBuffer, hexToAscii, mergeArrayBuffer} from "@/packBuffer/common/comUtil";
import {protocolIDMap} from "@/views/device/enum/enum";

const Log = require('ee-core/log');

export function notHasSelfTestCompletedWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(90) !== 0X01;
}


export function getDeviceProtocolIdWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let responseDataView = new DataView(messageBuffer)
  return parseInt(responseDataView.getUint8(91).toString(16), 16)
}

export function decodeGetNetProviderWAC330HE(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(92).toString(16), 16)
}

export function decodeGetVersionWAC330HE(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(93).toString(16), 16)
}

export function decodeCheckEEPWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(94) !== 0x01 && dataView.getUint8(94) !== 0x02;

}

export function decodeCheckNetworkWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95) !== 0x01 && dataView.getUint8(95) !== 0x02;

}

export function decodeCheckMinimumValveOpeningWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96) !== 0x01 && dataView.getUint8(96) !== 0x02;

}

export function decodeCheckMaxValveOpeningWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(97) !== 0x01 && dataView.getUint8(97) !== 0x02;

}

export function decodeCheckOutTemperatureCalibrationWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(98) !== 0x01 && dataView.getUint8(98) !== 0x02;

}

export function decodeCheckInTemperatureCalibrationWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(99) !== 0x01 && dataView.getUint8(99) !== 0x02;

}


export function decodeCheckVoltageWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(100) !== 0x01 && dataView.getUint8(100) !== 0x02;

}

export function decodeInPressureWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(101) !== 0x01 && dataView.getUint8(101) !== 0x02;

}

export function decodeOutPressureWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(102) !== 0x01 && dataView.getUint8(102) !== 0x02;

}


export function decodeReadSelfTestAddressWAC330HE(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint32(18).toString(16);

}

export function decodeGetProductNameWAC330HE(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 66; i <=89; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}

export function readSelfTestStatus(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  // 跳过红外回包长度
  let skipLength = 33
  let headerLength = 4
  let innerStartIndex = 19 //内层包68起始
  let innerBodyLength = 53 // 内层包长度 (不包含FE FE FE,不含CS和16)
  let outerBodyLength = 12 // 外层CS校验和长度 (不含CS和16)
  let slicedBuffer = messageBuffer.slice(skipLength)
  let responseDataView = new DataView(slicedBuffer);
  let responseOuterCSValue = responseDataView.getUint8(responseDataView.byteLength - 2)
  let responseInnerCSValue = responseDataView.getUint8(responseDataView.byteLength - 4)
  let innerEnd = innerStartIndex + innerBodyLength
  let innerBuffer = slicedBuffer.slice(innerStartIndex, innerEnd) //截取内层包
  let outerBuffer = slicedBuffer.slice(headerLength, headerLength + outerBodyLength) //截取外层包
  let innerCSCalc = calculateCSByte(innerBuffer)
  let mergeBuffer = mergeArrayBuffer(outerBuffer, [0xFE, 0XFE, 0XFE], innerBuffer, [innerCSCalc, 0x16])
  let outerCSCalc = calculateCSByte(mergeBuffer)
  console.log("设备 【WAC330HE】 读自检状态 内层CS 来自报文:", responseInnerCSValue, '计算的内层包：', innerCSCalc)
  Log.info("设备 【WAC330HE】 读自检状态 内层CS 来自报文:", responseOuterCSValue, '计算的内层包：', outerCSCalc)
  if ((responseInnerCSValue !== innerCSCalc) || (responseOuterCSValue !== outerCSCalc)) {
    console.log("内外层CS校验失败")
    Log.info('设备 【WAC330HE】读自检状态 报文校验失败(CS验证错误)')
    context.createLeftSpanMessage('自检不通过-CS校验失败', 'grey');
    return true
  }
  // 验证基础报文
  let baseCheck =
    responseDataView.getUint8(0) !== 0x68 ||
    responseDataView.getUint8(3) !== 0x68 ||
    responseDataView.getUint8(4) !== 0x80 ||
    responseDataView.getUint8(5) !== 0x66 ||
    responseDataView.getUint8(19) !== 0x68 ||
    responseDataView.getUint8(20) !== 0x66 ||
    responseDataView.getUint8(28) !== 0x81 ||
    responseDataView.getUint8(30) !== 0xF0 ||
    responseDataView.getUint8(31) !== 0xDD;

  let selfTestCompletedNotPass = notHasSelfTestCompletedWAC330HE(context.receivedData.globalReceivedOneData)               //是否自检过
  let eepNotPass = decodeCheckEEPWAC330HE(context.receivedData.globalReceivedOneData)     //             EEP
  let networkNotPass = decodeCheckNetworkWAC330HE(context.receivedData.globalReceivedOneData)     //             联网
  let minimumValveOpeningNotPass = decodeCheckMinimumValveOpeningWAC330HE(context.receivedData.globalReceivedOneData)     //             最小开度
  let maxValveOpeningNotPass = decodeCheckMaxValveOpeningWAC330HE(context.receivedData.globalReceivedOneData)     //             最大开度
  let outTemperatureCalibrationNotPass = decodeCheckOutTemperatureCalibrationWAC330HE(context.receivedData.globalReceivedOneData)     //             回温标定
  let inTemperatureCalibrationNotPass = decodeCheckInTemperatureCalibrationWAC330HE(context.receivedData.globalReceivedOneData)     //             进温标定
  let voltageNotPass = decodeCheckVoltageWAC330HE(context.receivedData.globalReceivedOneData)     //             电压
  let inPressureNotPass = decodeInPressureWAC330HE(context.receivedData.globalReceivedOneData)     //             进压
  let outPressureNotPass = decodeOutPressureWAC330HE(context.receivedData.globalReceivedOneData)     //             回压
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
  if (minimumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最小开度 不正常', 'grey');
    Log.error('阀门最小开度 不正常');
    console.log('阀门最小开度 不正常');
  }
  if (maxValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最大开度 不正常', 'grey');
    Log.error('阀门最大开度 不正常');
    console.log('阀门最大开度 不正常');
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
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'grey');
    Log.error('电压 不正常');
    console.log('电压 不正常');
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
    networkNotPass ||
    minimumValveOpeningNotPass ||
    maxValveOpeningNotPass ||
    outTemperatureCalibrationNotPass ||
    inTemperatureCalibrationNotPass || voltageNotPass || inPressureNotPass || outPressureNotPass
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
  context.productName = decodeGetProductNameWAC330HE(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.includes('WAC330NE')) {
    context.createLeftSpanMessage('产品名称错误：' + context.productName, 'grey');
    return true;
  }
  context.protocolId = getDeviceProtocolIdWAC330HE(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersionWAC330HE(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetProviderWAC330HE(context.receivedData.globalReceivedOneData) //运营商
  //根据运营商改编enum中的mode 01：电信，02：移动
  if (context.netprovider === 1) {
    protocolIDMap[context.configForm.produceModel].model = 38
    protocolIDMap[context.configForm.produceModel].joinMode = 8
  } else if (context.netprovider === 2) {
    protocolIDMap[context.configForm.produceModel].model = 84
    protocolIDMap[context.configForm.produceModel].joinMode = 2
  }
  return false
}
