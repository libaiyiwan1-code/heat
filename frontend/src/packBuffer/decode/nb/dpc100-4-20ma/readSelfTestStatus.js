import {getDataView, isStatusNotPass, report} from "@/packBuffer/common/comUtil";

const SELF_TEST_CHECKS = [
  {offset: 57, msg: '进压    不正常'},
  {offset: 58, msg: '回压    不正常'},
  {offset: 59, msg: '电流标定 不正常'},
]

export function readSelfTestStatus(context, responseMessage) {
  const dv = getDataView(responseMessage)
  const raw = context.receivedData.globalReceivedOneData
  let hasError = false

  const baseCheck =
    dv.getUint8(16) !== 0x68 ||
    dv.getUint8(19) !== 0x68 ||
    dv.getUint8(20) !== 0x80 ||
    dv.getUint8(26) !== 0xF0 ||
    dv.getUint8(28) !== 0x1E

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

  // context.productName = decodeGetProductName(raw)
  // if (!context.productName.toLowerCase().includes('wac300ns')) {
  //   report(context, `产品名称错误：${context.productName}`)
  //   return true
  // }

  context.protocolId = getDeviceProtocolId(raw)
  context.version = decodeGetVersion(raw)
  context.netprovider = decodeGetNetProvider(raw)

  return false
}

// export function decodeGetProductName(responseMessage) {
//   let model = '';
//   let messageBuffer = hex2arrayBuffer(responseMessage);
//   let dataView = new DataView(messageBuffer)
//   // 判断型号
//   for (let i = 63; i <= 86; i++) {
//     model += dataView.getUint8(i).toString(16);
//   }
//   const productName = hexToAscii(model);
//   console.log('产品名称:', productName);
//   return productName
//
// }
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
