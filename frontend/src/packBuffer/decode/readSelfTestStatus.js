import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');
import {
  decodeCheckBatteryVoltage,
  decodeCheckEEP,
  decodeCheckFsk,
  decodeCheckHall,
  decodeCheckMbus,
  decodeCheckNetwork,
  decodeCheckValveClose,
  decodeCheckValveOpen,
  decodeGetNetprovider,
  decodeGetProtocolId,
  decodeGetVersion,
  decodeReadSelfTestAddress,
  notHasSelfTestCompleted
} from "@/packBuffer/decode/decode";
import {
  decodeCheckBarometricPressureSensorWAC710CD,
  decodeCheckEEPWAC710CD,
  decodeCheckInPressureMatchWAC710CD,
  decodeCheckInPressureWAC710CD,
  decodeCheckInTemperatureCalibrationWAC710CD,
  decodeCheckInTemperatureMatchWAC710CD,
  decodeCheckMagneticSensorsWAC710CD,
  decodeCheckMaximumValveOpeningWAC710CD,
  decodeCheckMinimumValveOpeningWAC710CD,
  decodeCheckNetworkWAC710CD,
  decodeCheckOutPressureMatchWAC710CD,
  decodeCheckOutPressureWAC710CD,
  decodeCheckOutTemperatureCalibrationWAC710CD,
  decodeCheckOutTemperatureMatchWAC710CD,
  decodeCheckVoltageWAC710CD, decodeGetNetProviderWAC710CD,
  decodeGetProductNameWAC710CD, decodeGetVersionWAC710CD,
  decodeReadSelfTestAddressWAC710CD,
  getDeviceProtocolIdWAC710CD,
  notHasSelfTestCompletedWAC710CD
} from "@/packBuffer/decode/readselftest/wac710cd/readSelfTestStatus";
import {decodeGetProductNameWAC230CF} from "@/packBuffer/decode/readselftest/wac230cf/readSelfTestStatus";
import {decodeGetProductNameWAC300CD} from "@/packBuffer/decode/readselftest/wac300cd/readSelfTestStatus";

export function decodeCheckReadSelfTestStatusWAC230CF(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(37) !== 0x80
    || dataView.getUint8(38) !== 0x8B
    || dataView.getUint8(60) !== 0xF0
    || dataView.getUint8(61) !== 0xDD
  let selfTestCompletedNotPass = notHasSelfTestCompleted(context.globalReceivedData)               //是否自检过
  let eepNotPass = decodeCheckEEP(context.globalReceivedData)     //             EEP
  let networkNotPass = decodeCheckNetwork(context.globalReceivedData)     //             联网
  let valveCloseNotPass = decodeCheckValveClose(context.globalReceivedData)     //             阀关
  let valveOpenNotPass = decodeCheckValveOpen(context.globalReceivedData)     //             阀开
  let fskNotPass = decodeCheckFsk(context.globalReceivedData)     //             fsk
  let mbusNotPass = decodeCheckMbus(context.globalReceivedData)     //             mbus
  let hallNotPass = decodeCheckHall(context.globalReceivedData)               //霍尔
  let batteryVoltageNotPass = decodeCheckBatteryVoltage(context.globalReceivedData)               //电池电压
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  } else {
    context.createLeftSpanMessage('已自检过', 'green');
  }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'red');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  } else {
    context.createLeftSpanMessage('eep 正常', 'green');
  }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'red');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  } else {
    context.createLeftSpanMessage('联网 正常', 'green');
  }
  if (valveCloseNotPass) {
    context.createLeftSpanMessage('阀关 不正常', 'red');
    Log.error('阀关 不正常');
    console.log('阀关 不正常');
  } else {
    context.createLeftSpanMessage('阀关 正常', 'green');
  }
  if (valveOpenNotPass) {
    context.createLeftSpanMessage('阀开 不正常', 'red');
    Log.error('阀开 不正常');
    console.log('阀开 不正常');
  } else {
    context.createLeftSpanMessage('阀开 正常', 'green');
  }
  if (fskNotPass) {
    context.createLeftSpanMessage('无线通信fsk 不正常', 'red');
    Log.error('无线通信fsk 不正常');
    console.log('无线通信fsk 不正常');
  } else {
    context.createLeftSpanMessage('无线通信fsk 正常', 'green');
  }
  if (mbusNotPass) {
    context.createLeftSpanMessage('MBUS 不正常', 'red');
    Log.error('MBUS 不正常');
    console.log('MBUS 不正常');
  } else {
    context.createLeftSpanMessage('MBUS 正常', 'green');
  }
  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'red');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  } else {
    context.createLeftSpanMessage('霍尔 正常', 'green');
  }
  if (batteryVoltageNotPass) {
    context.createLeftSpanMessage('电池电压 不正常', 'red');
    Log.error('电池电压 不正常');
    console.log('电池电压 不正常');
  } else {
    context.createLeftSpanMessage('电池电压 正常', 'green');
  }

  if (selfTestCompletedNotPass || eepNotPass || networkNotPass || valveCloseNotPass || valveOpenNotPass ||
    fskNotPass || mbusNotPass || hallNotPass || batteryVoltageNotPass || baseCheck) {
    context.createLeftSpanMessage('自检不通过', 'red');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.globalReceivedData = '';
    return true
  }
  //解析通过
  context.readAddress = decodeReadSelfTestAddress(context, context.globalReceivedData); //读设备地址
  context.productName = decodeGetProductNameWAC230CF(context.globalReceivedData); //产品名称
  if (!context.productName.toLowerCase().includes('WAC230CF')){
    context.createLeftSpanMessage('产品名称错误：'+context.productName, 'red');
    return true
  }
  context.protocolId = decodeGetProtocolId(context.globalReceivedData);//协议id
  context.version = decodeGetVersion(context.globalReceivedData)//版本号
  context.netprovider = decodeGetNetprovider(context.globalReceivedData) //运营商
  return false
}

export function decodeCheckReadSelfTestStatusWAC710CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck =
    dataView.getUint8(0) !== 0x68 ||
    dataView.getUint8(3) !== 0x68 ||
    dataView.getUint8(4) !== 0x80 ||
    dataView.getUint8(5) !== 0x8D ||
    dataView.getUint8(16) !== 0x68 ||
    dataView.getUint8(17) !== 0x8D ||
    dataView.getUint8(27) !== 0xF0 ||
    dataView.getUint8(28) !== 0xDE
  let selfTestCompletedNotPass = notHasSelfTestCompletedWAC710CD(context.globalReceivedData)               //是否自检过
  let eepNotPass = decodeCheckEEPWAC710CD(context.globalReceivedData)     //             EEP
  let networkNotPass = decodeCheckNetworkWAC710CD(context.globalReceivedData)     //             联网
  let minimumValveOpeningNotPass = decodeCheckMinimumValveOpeningWAC710CD(context.globalReceivedData)     //             最小开度标定
  let maximumValveOpeningNotPass = decodeCheckMaximumValveOpeningWAC710CD(context.globalReceivedData)     //             最大开度标定
  let outTemperatureCalibrationNotPass = decodeCheckOutTemperatureCalibrationWAC710CD(context.globalReceivedData)     //             回温标定
  let inTemperatureCalibrationNotPass = decodeCheckInTemperatureCalibrationWAC710CD(context.globalReceivedData)     //             进温标定
  let voltageNotPass = decodeCheckVoltageWAC710CD(context.globalReceivedData)     //             电压
  let barometricPressureSensorNotPass = decodeCheckBarometricPressureSensorWAC710CD(context.globalReceivedData)     //             气压
  let inPressureNotPass = decodeCheckInPressureWAC710CD(context.globalReceivedData)     //             进水压力
  let outPressureNotPass = decodeCheckOutPressureWAC710CD(context.globalReceivedData)     //             回水压力
  let magneticSensorsNotPass = decodeCheckMagneticSensorsWAC710CD(context.globalReceivedData)     //             磁性传感器
  let outTemperatureMatchNotPass = decodeCheckOutTemperatureMatchWAC710CD(context.globalReceivedData)     //             回温探头是否匹配
  let inTemperatureMatchNotPass = decodeCheckInTemperatureMatchWAC710CD(context.globalReceivedData)     //             进温探头是否匹配
  let outPressureMatchNotPass = decodeCheckOutPressureMatchWAC710CD(context.globalReceivedData)     //             回水压力探头是否匹配
  let inPressureMatchNotPass = decodeCheckInPressureMatchWAC710CD(context.globalReceivedData)     //             进水压力探头是否匹配
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  } else {
    context.createLeftSpanMessage('已自检过', 'green');
  }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'red');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  } else {
    context.createLeftSpanMessage('eep 正常', 'green');
  }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'red');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  } else {
    context.createLeftSpanMessage('联网 正常', 'green');
  }
  if (minimumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最小开度标定 不正常', 'red');
    Log.error('阀门最小开度标定 不正常');
    console.log('阀门最小开度标定 不正常');
  } else {
    context.createLeftSpanMessage('阀门最小开度标定 正常', 'green');
  }
  if (maximumValveOpeningNotPass) {
    context.createLeftSpanMessage('阀门最大开度标定 不正常', 'red');
    Log.error('阀门最大开度标定 不正常');
    console.log('阀门最大开度标定 不正常');
  } else {
    context.createLeftSpanMessage('阀门最大开度标定 正常', 'green');
  }
  if (outTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('回温标定 不正常', 'red');
    Log.error('回温标定 不正常');
    console.log('回温标定 不正常');
  } else {
    context.createLeftSpanMessage('回温标定 正常', 'green');
  }
  if (inTemperatureCalibrationNotPass) {
    context.createLeftSpanMessage('进温标定 不正常', 'red');
    Log.error('进温标定 不正常');
    console.log('进温标定 不正常');
  } else {
    context.createLeftSpanMessage('进温标定 正常', 'green');
  }
  if (voltageNotPass) {
    context.createLeftSpanMessage('电压 不正常', 'red');
    Log.error('电压 不正常');
    console.log('电压 不正常');
  } else {
    context.createLeftSpanMessage('电压 正常', 'green');
  }
  if (barometricPressureSensorNotPass) {
    context.createLeftSpanMessage('气压传感器 不正常', 'red');
    Log.error('气压传感器 不正常');
    console.log('气压传感器 不正常');
  } else {
    context.createLeftSpanMessage('气压传感器 正常', 'green');
  }
  if (inPressureNotPass) {
    context.createLeftSpanMessage('进水压力 不正常', 'red');
    Log.error('进水压力 不正常');
    console.log('进水压力 不正常');
  } else {
    context.createLeftSpanMessage('进水压力 正常', 'green');
  }
  if (outPressureNotPass) {
    context.createLeftSpanMessage('回水压力 不正常', 'red');
    Log.error('回水压力 不正常');
    console.log('回水压力 不正常');
  } else {
    context.createLeftSpanMessage('回水压力 正常', 'green');
  }
  if (magneticSensorsNotPass) {
    context.createLeftSpanMessage('磁传感器 不正常', 'red');
    Log.error('磁传感器 不正常');
    console.log('磁传感器 不正常');
  } else {
    context.createLeftSpanMessage('磁传感器 正常', 'green');
  }
  if (outTemperatureMatchNotPass) {
    context.createLeftSpanMessage('回温探头 与实物不匹配', 'red');
    Log.error('回温探头 与实物不匹配');
    console.log('回温探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('回温探头 与实物匹配', 'green');
  }
  if (inTemperatureMatchNotPass) {
    context.createLeftSpanMessage('进温探头 与实物不匹配', 'red');
    Log.error('进温探头 与实物不匹配');
    console.log('进温探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('进温探头 与实物匹配', 'green');
  }
  if (outPressureMatchNotPass) {
    context.createLeftSpanMessage('回压探头 与实物不匹配', 'red');
    Log.error('回压探头 与实物不匹配');
    console.log('回压探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('回压探头 与实物匹配', 'green');
  }
  if (inPressureMatchNotPass) {
    context.createLeftSpanMessage('进压探头 与实物不匹配', 'red');
    Log.error('进压探头 与实物不匹配');
    console.log('进压探头 与实物不匹配');
  } else {
    context.createLeftSpanMessage('进压探头 与实物匹配', 'green');
  }
  if (baseCheck||selfTestCompletedNotPass ||
    eepNotPass ||
    networkNotPass ||
    minimumValveOpeningNotPass ||
    maximumValveOpeningNotPass ||
    outTemperatureCalibrationNotPass ||
    inTemperatureCalibrationNotPass ||
    voltageNotPass ||
    barometricPressureSensorNotPass ||
    inPressureNotPass||
    outPressureNotPass||
    magneticSensorsNotPass||
    outTemperatureMatchNotPass||
    inTemperatureMatchNotPass||
    outPressureMatchNotPass||
    inPressureMatchNotPass
  ) {
    context.createLeftSpanMessage('自检不通过', 'red');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.globalReceivedData = '';
    return true
  }
  //解析通过
  context.readAddress = decodeReadSelfTestAddressWAC710CD(context.globalReceivedData); //读设备地址
  context.productName = decodeGetProductNameWAC710CD(false,context.globalReceivedData); //产品名称
  if (!context.productName.toLowerCase().includes('WAC710CD')){
    context.createLeftSpanMessage('产品名称错误：'+context.productName, 'red');
    return true
  }
  context.protocolId = getDeviceProtocolIdWAC710CD(context.globalReceivedData);//协议id
  context.version = decodeGetVersionWAC710CD(context.globalReceivedData)//版本号
  context.netprovider = decodeGetNetProviderWAC710CD(context.globalReceivedData) //运营商
  return false
}


export function decodeCheckReadSelfTestStatusWAC300CD(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let baseCheck = dataView.getUint8(37) !== 0x80
    || dataView.getUint8(38) !== 0x8B
    || dataView.getUint8(60) !== 0xF0
    || dataView.getUint8(61) !== 0xDD
  let selfTestCompletedNotPass = notHasSelfTestCompleted(context.globalReceivedData)               //是否自检过
  let eepNotPass = decodeCheckEEP(context.globalReceivedData)     //             EEP
  let networkNotPass = decodeCheckNetwork(context.globalReceivedData)     //             联网
  let valveCloseNotPass = decodeCheckValveClose(context.globalReceivedData)     //             阀关
  let valveOpenNotPass = decodeCheckValveOpen(context.globalReceivedData)     //             阀开
  let fskNotPass = decodeCheckFsk(context.globalReceivedData)     //             fsk
  let mbusNotPass = decodeCheckMbus(context.globalReceivedData)     //             mbus
  let hallNotPass = decodeCheckHall(context.globalReceivedData)               //霍尔
  let batteryVoltageNotPass = decodeCheckBatteryVoltage(context.globalReceivedData)               //电池电压
  if (selfTestCompletedNotPass) {
    context.createLeftSpanMessage('未进行过自检', 'red');
    Log.error('未进行过自检');
    console.log('未进行过自检');
  } else {
    context.createLeftSpanMessage('已自检过', 'green');
  }

  if (eepNotPass) {
    context.createLeftSpanMessage('eep 不正常', 'red');
    Log.error('eep 不正常');
    console.log('eep 不正常');
  } else {
    context.createLeftSpanMessage('eep 正常', 'green');
  }
  if (networkNotPass) {
    context.createLeftSpanMessage('联网 不正常', 'red');
    Log.error('联网 不正常');
    console.log('联网 不正常');
  } else {
    context.createLeftSpanMessage('联网 正常', 'green');
  }
  if (valveCloseNotPass) {
    context.createLeftSpanMessage('阀关 不正常', 'red');
    Log.error('阀关 不正常');
    console.log('阀关 不正常');
  } else {
    context.createLeftSpanMessage('阀关 正常', 'green');
  }
  if (valveOpenNotPass) {
    context.createLeftSpanMessage('阀开 不正常', 'red');
    Log.error('阀开 不正常');
    console.log('阀开 不正常');
  } else {
    context.createLeftSpanMessage('阀开 正常', 'green');
  }
  if (fskNotPass) {
    context.createLeftSpanMessage('无线通信fsk 不正常', 'red');
    Log.error('无线通信fsk 不正常');
    console.log('无线通信fsk 不正常');
  } else {
    context.createLeftSpanMessage('无线通信fsk 正常', 'green');
  }
  if (mbusNotPass) {
    context.createLeftSpanMessage('MBUS 不正常', 'red');
    Log.error('MBUS 不正常');
    console.log('MBUS 不正常');
  } else {
    context.createLeftSpanMessage('MBUS 正常', 'green');
  }
  if (hallNotPass) {
    context.createLeftSpanMessage('霍尔 不正常', 'red');
    Log.error('霍尔 不正常');
    console.log('霍尔 不正常');
  } else {
    context.createLeftSpanMessage('霍尔 正常', 'green');
  }
  if (batteryVoltageNotPass) {
    context.createLeftSpanMessage('电池电压 不正常', 'red');
    Log.error('电池电压 不正常');
    console.log('电池电压 不正常');
  } else {
    context.createLeftSpanMessage('电池电压 正常', 'green');
  }

  if (selfTestCompletedNotPass || eepNotPass || networkNotPass || valveCloseNotPass || valveOpenNotPass ||
    fskNotPass || mbusNotPass || hallNotPass || batteryVoltageNotPass || baseCheck) {
    context.createLeftSpanMessage('自检不通过', 'red');
    console.error('自检不通过');
    Log.error('自检不通过');
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.globalReceivedData = '';
    return true
  }
  //解析通过
  context.readAddress = decodeReadSelfTestAddress(context, context.globalReceivedData); //读设备地址
  context.productName = decodeGetProductNameWAC300CD(context.globalReceivedData); //产品名称
  context.protocolId = decodeGetProtocolId(context.globalReceivedData);//协议id
  context.version = decodeGetVersion(context.globalReceivedData)//版本号
  context.netprovider = decodeGetNetprovider(context.globalReceivedData) //运营商
  return false
}
