import {getDataView, hex2arrayBuffer, hexToAscii, isStatusNotPass, report} from "@/packBuffer/common/comUtil";
import {protocolIDMap} from "@/views/device/enum/enum";
const SELF_TEST_CHECKS = [
  { offset: 54, msg: '未自检过' },
  { offset: 57, msg: 'EEP 不正常' },
  { offset: 58, msg: '联网 不正常' },
  { offset: 59, msg: '电压 不正常' },
  { offset: 60, msg: '按键1 不正常' },
  { offset: 61, msg: '按键2 不正常' },
  { offset: 62, msg: '按键3 不正常' },
  { offset: 63, msg: '温湿度传感器 不正常' },
  { offset: 64, msg: '温度传感器 不正常' },
  { offset: 65, msg: '外供电 不正常' },
]
export function readSelfTestStatus(context, responseMessage) {
  const dv = getDataView(responseMessage)
  const raw = context.receivedData.globalReceivedOneData
  let hasError = false

  const baseCheck =
    dv.getUint8(16) !== 0x68 ||
    dv.getUint8(19) !== 0x68 ||
    dv.getUint8(20) !== 0x80||
    dv.getUint8(26) !== 0xF0||
    dv.getUint8(28) !== 0x1E

  SELF_TEST_CHECKS.forEach(({ offset, msg }) => {
    if (isStatusNotPass(dv, offset)) {
      report(context, msg,false)
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
  if (!context.productName.toLowerCase().includes('nbt400')) {
    report(context, `产品名称错误：${context.productName}`)
    return true
  }

  context.protocolId = getDeviceProtocolId(raw)
  context.version = decodeGetVersion(raw)
  context.netprovider = decodeGetNetProvider(raw)
  if (context.netprovider === 1) { //电信
    protocolIDMap[context.configForm.produceModel].model = 41
    protocolIDMap[context.configForm.produceModel].joinMode = 8
  } else if (context.netprovider === 2) { //移动
    protocolIDMap[context.configForm.produceModel].model = 49
    protocolIDMap[context.configForm.produceModel].joinMode = 2
  }
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
  return parseInt(dv.getUint8(21).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(55).toString(16), 16)
}

export function decodeGetVersion(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(56).toString(16), 16)
}
