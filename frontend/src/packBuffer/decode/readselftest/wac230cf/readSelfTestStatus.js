import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";
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
const Log = require('ee-core/log');

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
export function decodeCheckReadSelfTestStatusWAC230CF(context, responseMessage) {
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
    context.receivedData.globalReceivedOneData = '';
    return true
  }
  //解析通过
  context.readAddress = decodeReadSelfTestAddress(context, context.receivedData.globalReceivedOneData); //读设备地址
  context.productName = decodeGetProductNameWAC230CF(context.receivedData.globalReceivedOneData); //产品名称
  if (!context.productName.toLowerCase().includes('WAC230CF')){
    context.createLeftSpanMessage('产品名称错误：'+context.productName, 'red');
    return true
  }
  context.protocolId = decodeGetProtocolId(context.receivedData.globalReceivedOneData);//协议id
  context.version = decodeGetVersion(context.receivedData.globalReceivedOneData)//版本号
  context.netprovider = decodeGetNetprovider(context.receivedData.globalReceivedOneData) //运营商
  return false
}
