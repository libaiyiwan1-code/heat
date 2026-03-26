import {getDataView, hex2arrayBuffer, hexToAscii, isStatusNotPass, report} from "@/packBuffer/common/comUtil";
import {protocolIDMap} from "@/views/device/enum/enum";

const SELF_TEST_CHECKS = [
  {offset: 54, msg: '未自检过'},
  {offset: 58, msg: 'EEP 不正常'},
  {offset: 59, msg: '联网 不正常'},
  {offset: 60, msg: '阀门最小开度标定 不正常'},
  {offset: 61, msg: '阀门最大开度标定 不正常'},
  {offset: 62, msg: '回温标定 不正常'},
  {offset: 63, msg: '进温标定 不正常'},
  {offset: 64, msg: '电压 不正常'},
  {offset: 65, msg: '气压传感器 不正常'},
  {offset: 66, msg: '进水压力 不正常'},
  {offset: 67, msg: '回水压力 不正常'},
  {offset: 68, msg: '磁性传感器 不正常'},
  {offset: 69, msg: '回温探头 不匹配 '},
  {offset: 70, msg: '进温探头 不匹配 '},
  {offset: 71, msg: '回水压力探头 不匹配 '},
  {offset: 72, msg: '进水压力探头 不匹配 '},
]

export function readSelfTestStatus2(context, responseMessage) {
  const dv = getDataView(responseMessage)
  const raw = context.receivedData.globalReceivedOneData
  let hasError = false

  const baseCheck =
    dv.getUint8(0) !== 0x68 ||
    dv.getUint8(3) !== 0x68 ||
    dv.getUint8(4) !== 0x80 ||
    dv.getUint8(5) !== 0x75 ||
    dv.getUint8(10) !== 0x0C ||
    dv.getUint8(12) !== 0x01 ||
    dv.getUint8(16) !== 0x68 ||
    dv.getUint8(17) !== 0x75 ||
    dv.getUint8(27) !== 0xF0 ||
    dv.getUint8(28) !== 0xDE

  SELF_TEST_CHECKS.forEach(({offset, msg}) => {
    if (isStatusNotPass(dv, offset)) {
      report(context, msg, false)
      hasError = true
    }
  })

  if (baseCheck || hasError) {
    report(context, '自检不通过')
    context.leftWorkPrompt = '自检失败(读自检状态不通过)'
    context.receivedData.globalReceivedOneData = ''
    return true
  }

  report(context, '自检通过')

  context.productName = decodeGetProductName(raw)
  if (!context.productName.toLowerCase().includes('wac710c')) {
    report(context, `产品名称错误：${context.productName}`)
    return true
  }

  context.protocolId = getDeviceProtocolId(raw)
  context.version = decodeGetVersion(raw)
  context.netprovider = decodeGetNetProvider(raw)
  // if (context.netprovider === 1) {//电信
  //   protocolIDMap[context.configForm.produceModel].model = 9
  //   protocolIDMap[context.configForm.produceModel].joinMode = 8 //NB_IOT_CTWING
  // } else if (context.netprovider === 2) {//移动
  //   protocolIDMap[context.configForm.produceModel].model = 10
  //   protocolIDMap[context.configForm.produceModel].joinMode = 2
  // }
  return false
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

export function getDeviceProtocolId(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(55).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(56).toString(16), 16)
}

export function decodeGetVersion(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(57).toString(16), 16)
}
