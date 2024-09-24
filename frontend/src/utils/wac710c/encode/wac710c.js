import {
  calculateCRCByte,
  calculateCSByte,
  hex2arrayBuffer,
  mergeArrayBuffer,
  addressCover,
  arrayBuffer2Hex
} from '@/utils/util'


/**
 * WAC710C 开启自检
 * */
export function packWAC710CSelfTest(selectTemperatureProbes, selectPressureProbes) {
  //head buffer
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x21)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)
  //透传 Transparent buffer
  let wac710cTransparentBodyBuffer = new ArrayBuffer(11)
  let wac710cTransparentBodyDataView = new DataView(wac710cTransparentBodyBuffer)
  wac710cTransparentBodyDataView.setUint8(0, 0x40)
  wac710cTransparentBodyDataView.setUint8(1, 0x75)
  wac710cTransparentBodyDataView.setUint8(2, 0xAA)
  wac710cTransparentBodyDataView.setUint8(3, 0xAA)
  wac710cTransparentBodyDataView.setUint8(4, 0xAA)
  wac710cTransparentBodyDataView.setUint8(5, 0xAA)
  wac710cTransparentBodyDataView.setUint8(6, 0x0C)
  wac710cTransparentBodyDataView.setUint8(7, 0xFF)
  wac710cTransparentBodyDataView.setUint8(8, 0x01)
  wac710cTransparentBodyDataView.setUint8(9, 0x01)
  wac710cTransparentBodyDataView.setUint8(10, 0x16)
  // body buffer
  let wac710cBodyBuffer = new ArrayBuffer(20)
  let wac710cBodyDataView = new DataView(wac710cBodyBuffer)
  wac710cBodyDataView.setUint8(0, 0x68)
  wac710cBodyDataView.setUint8(1, 0x75)
  wac710cBodyDataView.setUint8(2, 0xAA)
  wac710cBodyDataView.setUint8(3, 0xAA)
  wac710cBodyDataView.setUint8(4, 0xAA)
  wac710cBodyDataView.setUint8(5, 0xAA)
  wac710cBodyDataView.setUint8(6, 0xAA)
  wac710cBodyDataView.setUint8(7, 0xAA)
  wac710cBodyDataView.setUint8(8, 0xAA)
  wac710cBodyDataView.setUint8(9, 0x04)
  wac710cBodyDataView.setUint8(10, 0x09)
  wac710cBodyDataView.setUint8(11, 0xDD)
  wac710cBodyDataView.setUint8(12, 0xF3)
  wac710cBodyDataView.setUint8(13, 0x01)
  // -00：不带进回温标定，01：带回温标定，02：带进温标定，03：带进回温标定
  if (selectTemperatureProbes === '无探头') {
    wac710cBodyDataView.setUint8(14, 0x00)
  } else if (selectTemperatureProbes === '蓝色-回温探头') {
    wac710cBodyDataView.setUint8(14, 0x01)
  } else if (selectTemperatureProbes === '红色-进温探头') {
    wac710cBodyDataView.setUint8(14, 0x02)
  } else if (selectTemperatureProbes === '红蓝-双探头') {
    wac710cBodyDataView.setUint8(14, 0x03)
  } else {
    wac710cBodyDataView.setUint8(14, 0x00)
  }
  //-00：带进回压自检，	01：带回压自检，02：带进压自检，03：不带进回压自检
  if (selectPressureProbes === '无探头') {
    wac710cBodyDataView.setUint8(15, 0x03)
  } else if (selectPressureProbes === '回压探头') {
    wac710cBodyDataView.setUint8(15, 0x01)
  } else if (selectPressureProbes === '进压探头') {
    wac710cBodyDataView.setUint8(15, 0x02)
  } else if (selectPressureProbes === '进回压双探头') {
    wac710cBodyDataView.setUint8(15, 0x00)
  } else {
    wac710cBodyDataView.setUint8(15, 0x03)
  }
  wac710cBodyDataView.setUint8(16, 0x00)
  wac710cBodyDataView.setUint8(17, 0x00)
  wac710cBodyDataView.setUint8(18, 0x00)
  wac710cBodyDataView.setUint8(19, 0x00)

  let csByte = calculateCSByte(wac710cBodyBuffer)
  let bodyTailBuffer = new ArrayBuffer(2)
  let bodyTailDataView = new DataView(bodyTailBuffer)
  bodyTailDataView.setUint8(0, csByte)
  bodyTailDataView.setUint8(1, 0x16)
  let resultArrayBuffer = mergeArrayBuffer(wac710cTransparentBodyBuffer, wac710cBodyBuffer, bodyTailBuffer)
  let csAllByte = calculateCSByte(resultArrayBuffer)
  let tailBuffer = new ArrayBuffer(2)
  let tailDataView = new DataView(tailBuffer)
  tailDataView.setUint8(0, csAllByte);
  tailDataView.setUint8(1, 0x16);
  return Buffer.from(mergeArrayBuffer(headBuffer, resultArrayBuffer, tailBuffer))
}


//WAC710C 写压力探头
export function packWAC710CWritePressureProbe(selectPressureProbes) {
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  //head buffer
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x1C)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)
  //透传 Transparent buffer
  let wac710cTransparentBodyBuffer = new ArrayBuffer(11)
  let wac710cTransparentBodyDataView = new DataView(wac710cTransparentBodyBuffer)
  wac710cTransparentBodyDataView.setUint8(0, 0x40)
  wac710cTransparentBodyDataView.setUint8(1, 0x75)
  wac710cTransparentBodyDataView.setUint8(2, 0xAA)
  wac710cTransparentBodyDataView.setUint8(3, 0xAA)
  wac710cTransparentBodyDataView.setUint8(4, 0xAA)
  wac710cTransparentBodyDataView.setUint8(5, 0xAA)
  wac710cTransparentBodyDataView.setUint8(6, 0x0C)
  wac710cTransparentBodyDataView.setUint8(7, 0xFF)
  wac710cTransparentBodyDataView.setUint8(8, 0x01)
  wac710cTransparentBodyDataView.setUint8(9, 0x01)
  wac710cTransparentBodyDataView.setUint8(10, 0x12)

  let wac710cBodyBuffer = new ArrayBuffer(15)
  let wac710cBodyDataView = new DataView(wac710cBodyBuffer)
  wac710cBodyDataView.setUint8(0, 0x68)
  wac710cBodyDataView.setUint8(1, 0x75)
  wac710cBodyDataView.setUint8(2, 0xAA)
  wac710cBodyDataView.setUint8(3, 0xAA)
  wac710cBodyDataView.setUint8(4, 0xAA)
  wac710cBodyDataView.setUint8(5, 0xAA)
  wac710cBodyDataView.setUint8(6, 0xAA)
  wac710cBodyDataView.setUint8(7, 0xAA)
  wac710cBodyDataView.setUint8(8, 0xAA)
  wac710cBodyDataView.setUint8(9, 0x04)
  wac710cBodyDataView.setUint8(10, 0x04)
  wac710cBodyDataView.setUint8(11, 0xAC)
  wac710cBodyDataView.setUint8(12, 0x90)
  wac710cBodyDataView.setUint8(13, 0x01)
  //压力探头配置，00：带进回压，01：只带回压，02：只带进压，03：不带进回压。
  if (selectPressureProbes === '无探头') {
    wac710cBodyDataView.setUint8(14, 0x03)
  } else if (selectPressureProbes === '回压探头') {
    wac710cBodyDataView.setUint8(14, 0x01)
  } else if (selectPressureProbes === '进压探头') {
    wac710cBodyDataView.setUint8(14, 0x02)
  } else if (selectPressureProbes === '进回压双探头') {
    wac710cBodyDataView.setUint8(14, 0x00)
  } else {
    wac710cBodyDataView.setUint8(14, 0x03)
  }
  let csByte = calculateCSByte(wac710cBodyBuffer)
  let bodyTailBuffer = new ArrayBuffer(2)
  let bodyTailDataView = new DataView(bodyTailBuffer)
  bodyTailDataView.setUint8(0, csByte)
  bodyTailDataView.setUint8(1, 0x16)
  let resultArrayBuffer = mergeArrayBuffer( wac710cTransparentBodyBuffer, wac710cBodyBuffer, bodyTailBuffer)
  let csAllByte = calculateCSByte(resultArrayBuffer)
  let tailBuffer = new ArrayBuffer(2)
  let tailDataView = new DataView(tailBuffer)
  tailDataView.setUint8(0, csAllByte);
  tailDataView.setUint8(1, 0x16);
  return Buffer.from(mergeArrayBuffer(headBuffer,resultArrayBuffer, tailBuffer))
}


//WAC710C 写温度探头
export function packWAC710CWriteTemperatureProbe(selectTemperatureProbes) {
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  //head buffer
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x1D)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)

  //透传 Transparent buffer
  let wac710cTransparentBodyBuffer = new ArrayBuffer(11)
  let wac710cTransparentBodyDataView = new DataView(wac710cTransparentBodyBuffer)
  wac710cTransparentBodyDataView.setUint8(0, 0x40)
  wac710cTransparentBodyDataView.setUint8(1, 0x75)
  wac710cTransparentBodyDataView.setUint8(2, 0xAA)
  wac710cTransparentBodyDataView.setUint8(3, 0xAA)
  wac710cTransparentBodyDataView.setUint8(4, 0xAA)
  wac710cTransparentBodyDataView.setUint8(5, 0xAA)
  wac710cTransparentBodyDataView.setUint8(6, 0x0C)
  wac710cTransparentBodyDataView.setUint8(7, 0xFF)
  wac710cTransparentBodyDataView.setUint8(8, 0x01)
  wac710cTransparentBodyDataView.setUint8(9, 0x01)
  wac710cTransparentBodyDataView.setUint8(10, 0x12)

  let wac710cBodyBuffer = new ArrayBuffer(16)
  let wac710cBodyDataView = new DataView(wac710cBodyBuffer)
  wac710cBodyDataView.setUint8(0, 0x68)
  wac710cBodyDataView.setUint8(1, 0x75)
  wac710cBodyDataView.setUint8(2, 0xAA)
  wac710cBodyDataView.setUint8(3, 0xAA)
  wac710cBodyDataView.setUint8(4, 0xAA)
  wac710cBodyDataView.setUint8(5, 0xAA)
  wac710cBodyDataView.setUint8(6, 0xAA)
  wac710cBodyDataView.setUint8(7, 0xAA)
  wac710cBodyDataView.setUint8(8, 0xAA)
  wac710cBodyDataView.setUint8(9, 0x04)
  wac710cBodyDataView.setUint8(10, 0x05)
  wac710cBodyDataView.setUint8(11, 0xAC)
  wac710cBodyDataView.setUint8(12, 0x09)
  wac710cBodyDataView.setUint8(13, 0x01)
  //00：轮显，01：不轮显，需要按键。
  wac710cBodyDataView.setUint8(14, 0x00)
  //00：带进回水温度探头；01：只带回水温度探头；02：只带进水温度探头；03：不带进回水温度探头
  if (selectTemperatureProbes === '无探头') {
    wac710cBodyDataView.setUint8(15, 0x03)
  } else if (selectTemperatureProbes === '蓝色-回温探头') {
    wac710cBodyDataView.setUint8(15, 0x01)
  } else if (selectTemperatureProbes === '红色-进温探头') {
    wac710cBodyDataView.setUint8(15, 0x02)
  } else if (selectTemperatureProbes === '红蓝-双探头') {
    wac710cBodyDataView.setUint8(15, 0x00)
  } else {
    wac710cBodyDataView.setUint8(15, 0x03)
  }
  let csByte = calculateCSByte(wac710cBodyBuffer)
  let bodyTailBuffer = new ArrayBuffer(2)
  let bodyTailDataView = new DataView(bodyTailBuffer)
  bodyTailDataView.setUint8(0, csByte)
  bodyTailDataView.setUint8(1, 0x16)
  let resultArrayBuffer = mergeArrayBuffer( wac710cTransparentBodyBuffer, wac710cBodyBuffer, bodyTailBuffer)
  let csAllByte = calculateCSByte(resultArrayBuffer)
  let tailBuffer = new ArrayBuffer(2)
  let tailDataView = new DataView(tailBuffer)
  tailDataView.setUint8(0, csAllByte);
  tailDataView.setUint8(1, 0x16);
  return Buffer.from(mergeArrayBuffer(headBuffer,resultArrayBuffer, tailBuffer))
}


/**
 * WAC710C 自检询问
 * */
export function packWAC710CSelfInquireTest() {
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  //外层协议 head
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x1B)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)

  //透传 body
  let wac710cTransparentBodyBuffer = new ArrayBuffer(11)
  let wac710cTransparentBodyDataView = new DataView(wac710cTransparentBodyBuffer)
  wac710cTransparentBodyDataView.setUint8(0, 0x40)
  wac710cTransparentBodyDataView.setUint8(1, 0x75)
  wac710cTransparentBodyDataView.setUint8(2, 0xAA)
  wac710cTransparentBodyDataView.setUint8(3, 0xAA)
  wac710cTransparentBodyDataView.setUint8(4, 0xAA)
  wac710cTransparentBodyDataView.setUint8(5, 0xAA)
  wac710cTransparentBodyDataView.setUint8(6, 0x0C)
  wac710cTransparentBodyDataView.setUint8(7, 0xFF)
  wac710cTransparentBodyDataView.setUint8(8, 0x01)
  wac710cTransparentBodyDataView.setUint8(9, 0x01)
  wac710cTransparentBodyDataView.setUint8(10, 0x10)

  //body buffer
  let wac710cBodyBuffer = new ArrayBuffer(14)
  let wac710cBodyDataView = new DataView(wac710cBodyBuffer)
  wac710cBodyDataView.setUint8(0, 0x68)
  wac710cBodyDataView.setUint8(1, 0x75)
  wac710cBodyDataView.setUint8(2, 0xAA)
  wac710cBodyDataView.setUint8(3, 0xAA)
  wac710cBodyDataView.setUint8(4, 0xAA)
  wac710cBodyDataView.setUint8(5, 0xAA)
  wac710cBodyDataView.setUint8(6, 0xAA)
  wac710cBodyDataView.setUint8(7, 0xAA)
  wac710cBodyDataView.setUint8(8, 0xAA)
  wac710cBodyDataView.setUint8(9, 0x04)
  wac710cBodyDataView.setUint8(10, 0x03)
  wac710cBodyDataView.setUint8(11, 0xDD)
  wac710cBodyDataView.setUint8(12, 0xF0)
  wac710cBodyDataView.setUint8(13, 0x01)
  let csByte = calculateCSByte(wac710cBodyBuffer)
  //body tail buffer
  let bodyTailBuffer = new ArrayBuffer(2)
  let bodyTailDataView = new DataView(bodyTailBuffer)
  bodyTailDataView.setUint8(0, csByte)
  bodyTailDataView.setUint8(1, 0x16)
  let resultArrayBuffer = mergeArrayBuffer(wac710cTransparentBodyBuffer, wac710cBodyBuffer, bodyTailBuffer)
  let csAllByte = calculateCSByte(resultArrayBuffer)
  //tail buffer
  let tailOutBuffer = new ArrayBuffer(2)
  let tailOutDataView = new DataView(tailOutBuffer)
  tailOutDataView.setUint8(0, csAllByte);
  tailOutDataView.setUint8(1, 0x16);
  return Buffer.from(mergeArrayBuffer(headBuffer, resultArrayBuffer, tailOutBuffer))
}

/**
 * WAC710C 读自检状态
 * */
export function packWAC710CReadSelfTestStatus() {
  //head buffer
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x1B)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)
  //透传 Transparent buffer
  let wac710cTransparentBodyBuffer = new ArrayBuffer(11)
  let wac710cTransparentBodyDataView = new DataView(wac710cTransparentBodyBuffer)
  wac710cTransparentBodyDataView.setUint8(0, 0x40)
  wac710cTransparentBodyDataView.setUint8(1, 0x75)
  wac710cTransparentBodyDataView.setUint8(2, 0xAA)
  wac710cTransparentBodyDataView.setUint8(3, 0xAA)
  wac710cTransparentBodyDataView.setUint8(4, 0xAA)
  wac710cTransparentBodyDataView.setUint8(5, 0xAA)
  wac710cTransparentBodyDataView.setUint8(6, 0x0C)
  wac710cTransparentBodyDataView.setUint8(7, 0xFF)
  wac710cTransparentBodyDataView.setUint8(8, 0x01)
  wac710cTransparentBodyDataView.setUint8(9, 0x01)
  wac710cTransparentBodyDataView.setUint8(10, 0x10)

  let wac710cBodyBuffer = new ArrayBuffer(14)
  let wac710cBodyDataView = new DataView(wac710cBodyBuffer)
  wac710cBodyDataView.setUint8(0, 0x68)
  wac710cBodyDataView.setUint8(1, 0x75)
  wac710cBodyDataView.setUint8(2, 0xAA)
  wac710cBodyDataView.setUint8(3, 0xAA)
  wac710cBodyDataView.setUint8(4, 0xAA)
  wac710cBodyDataView.setUint8(5, 0xAA)
  wac710cBodyDataView.setUint8(6, 0xAA)
  wac710cBodyDataView.setUint8(7, 0xAA)
  wac710cBodyDataView.setUint8(8, 0xAA)
  wac710cBodyDataView.setUint8(9, 0x01)
  wac710cBodyDataView.setUint8(10, 0x03)
  wac710cBodyDataView.setUint8(11, 0xF0)
  wac710cBodyDataView.setUint8(12, 0xDD)
  wac710cBodyDataView.setUint8(13, 0x01)


  let csByte = calculateCSByte(wac710cBodyBuffer)
  //body tail buffer
  let bodyTailBuffer = new ArrayBuffer(2)
  let bodyTailDataView = new DataView(bodyTailBuffer)
  bodyTailDataView.setUint8(0, csByte)
  bodyTailDataView.setUint8(1, 0x16)
  let resultArrayBuffer = mergeArrayBuffer(wac710cTransparentBodyBuffer, wac710cBodyBuffer, bodyTailBuffer)
  let csAllByte = calculateCSByte(resultArrayBuffer)
  //tail buffer
  let tailOutBuffer = new ArrayBuffer(2)
  let tailOutDataView = new DataView(tailOutBuffer)
  tailOutDataView.setUint8(0, csAllByte);
  tailOutDataView.setUint8(1, 0x16);
  return Buffer.from(mergeArrayBuffer(headBuffer, resultArrayBuffer, tailOutBuffer))
}


/**
 * WAC710C 读iccid
 * */
export function packWAC710CReadICCID() {
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x0A)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)
  let bodyBuffer = new ArrayBuffer(10)
  let bodyDataView = new DataView(bodyBuffer)
  bodyDataView.setUint8(0, 0x40)
  bodyDataView.setUint8(1, 0x75)
  bodyDataView.setUint8(2, 0xAA)
  bodyDataView.setUint8(3, 0xAA)
  bodyDataView.setUint8(4, 0xAA)
  bodyDataView.setUint8(5, 0xAA)
  bodyDataView.setUint8(6, 0x05)
  bodyDataView.setUint8(7, 0xFF)
  bodyDataView.setUint8(8, 0X08)
  bodyDataView.setUint8(9, 0x00)

  let csByte = calculateCSByte(bodyBuffer)
  let tailInHouseBuffer = new ArrayBuffer(2)
  let tailInHouseDataView = new DataView(tailInHouseBuffer)
  tailInHouseDataView.setUint8(0, csByte)
  tailInHouseDataView.setUint8(1, 0x16)
  return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailInHouseBuffer))
}

/**
 * WAC710C 读imei
 * */
export function packWAC710CReadIMEI() {
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x0A)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)
  let bodyBuffer = new ArrayBuffer(10)
  let bodyDataView = new DataView(bodyBuffer)
  bodyDataView.setUint8(0, 0x40)
  bodyDataView.setUint8(1, 0x75)
  bodyDataView.setUint8(2, 0xAA)
  bodyDataView.setUint8(3, 0xAA)
  bodyDataView.setUint8(4, 0xAA)
  bodyDataView.setUint8(5, 0xAA)
  bodyDataView.setUint8(6, 0x05)
  bodyDataView.setUint8(7, 0xFF)
  bodyDataView.setUint8(8, 0x0B)
  bodyDataView.setUint8(9, 0x00)
  let csByte = calculateCSByte(bodyBuffer)
  let tailInHouseBuffer = new ArrayBuffer(2)
  let tailInHouseDataView = new DataView(tailInHouseBuffer)
  tailInHouseDataView.setUint8(0, csByte)
  tailInHouseDataView.setUint8(1, 0x16)
  return Buffer.from(mergeArrayBuffer(headBuffer, bodyBuffer, tailInHouseBuffer))
}

export function packWAC710CWriteAddress(address) {
  address = address.replace(/\s/g, '');
  let headBuffer = new ArrayBuffer(4)
  let headDataView = new DataView(headBuffer)
  headDataView.setUint8(0, 0x68)
  headDataView.setUint8(1, 0x0F)
  headDataView.setUint8(2, 0x00)
  headDataView.setUint8(3, 0x68)
  let bodyBuffer = new ArrayBuffer(11)
  let bodyDataView = new DataView(bodyBuffer)
  bodyDataView.setUint8(0, 0x40)
  bodyDataView.setUint8(1, 0x75)
  bodyDataView.setUint8(2, 0xAA)
  bodyDataView.setUint8(3, 0xAA)
  bodyDataView.setUint8(4, 0xAA)
  bodyDataView.setUint8(5, 0xAA)
  bodyDataView.setUint8(6, 0x03)
  bodyDataView.setUint8(7, 0xFF)
  bodyDataView.setUint8(8, 0x06)
  bodyDataView.setUint8(9, 0x02)
  bodyDataView.setUint8(10, 0x75)
  let addressBuffer = hex2arrayBuffer(address)
  let mergeBuffer = mergeArrayBuffer(bodyBuffer, addressBuffer)
  let csByte = calculateCSByte(mergeBuffer)
  let tailInHouseBuffer = new ArrayBuffer(2)
  let tailInHouseDataView = new DataView(tailInHouseBuffer)
  tailInHouseDataView.setUint8(0, csByte)
  tailInHouseDataView.setUint8(1, 0x16)
  return Buffer.from(mergeArrayBuffer(headBuffer, mergeBuffer, tailInHouseBuffer))
}


