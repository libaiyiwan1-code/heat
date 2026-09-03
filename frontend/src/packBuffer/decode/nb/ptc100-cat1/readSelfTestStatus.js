import {getDataView, hex2arrayBuffer, hexToAscii, isStatusNotPass, report} from "@/packBuffer/common/comUtil";
import {protocolIDMap} from "@/views/device/enum/enum";

const SELF_TEST_CHECKS = [
  {offset: 41, msg: '未自检过'},
  {offset: 44, msg: '压力标定 不正常'},
  {offset: 45, msg: 'EEP 不正常'},
  {offset: 46, msg: '设备联网 不正常'},
  {offset: 47, msg: '电压 不正常'},
  {offset: 48, msg: '霍尔 不正常'},
  {offset: 49, msg: '内部温度传感器 不正常'},
  {offset: 50, msg: '温度传感器不正常 不正常'},
  {offset: 51, msg: '压力传感器不正常 不正常'},
]

export function readSelfTestStatus(context, responseMessage) {
  const dv = getDataView(responseMessage)
  const raw = context.receivedData.globalReceivedOneData
  let hasError = false

  const baseCheck =
    dv.getUint8(3) !== 0x68 ||
    dv.getUint8(6) !== 0x68 ||
    dv.getUint8(7) !== 0x80 ||
    dv.getUint8(8) !== 0x7A ||
    dv.getUint8(13) !== 0xf0 ||
    dv.getUint8(15) !== 0x1e

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
  if (!context.productName.toLowerCase().includes('ptc100-cat1')) {
    report(context, `产品名称错误：${context.productName}`)
    return true
  }

  context.protocolId = getDeviceProtocolId(raw)
  context.version = decodeGetVersion(raw)
  context.netprovider = decodeGetNetProvider(raw)
  //根
  return false
}

export function decodeGetProductName(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 17; i <= 41; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  const productName = hexToAscii(model);
  console.log('产品名称:', productName);
  return productName

}

export function getDeviceProtocolId(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8( 8).toString(16), 16)
}

export function decodeGetNetProvider(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(42).toString(16), 16)
}

export function decodeGetVersion(responseMessage) {
  const dv = getDataView(responseMessage)
  return parseInt(dv.getUint8(43).toString(16), 16)
}
