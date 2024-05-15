import {calculateCRCByte, calculateCSByte, mergeArrayBuffer} from '@/utils/util'

/*
* 读取485压力 组包 命令
* */
export function pack485PressureRead() {

  let agreementPropertiesBuffer = new ArrayBuffer(3)
  let agreementPropertiesBufferDataView = new DataView(agreementPropertiesBuffer)
  agreementPropertiesBufferDataView.setUint8(0, 0x03)
  agreementPropertiesBufferDataView.setUint8(1, 0x01)
  agreementPropertiesBufferDataView.setUint8(2, 0x20)

  let messageBodyBuffer = new ArrayBuffer(6)
  let messageBodyDataView = new DataView(messageBodyBuffer)
  messageBodyDataView.setUint8(0, 0x01)// 寄存器地址
  messageBodyDataView.setUint8(1, 0x03) //读 功能码
  messageBodyDataView.setUint8(2, 0x00)//数据起始H(高位)
  messageBodyDataView.setUint8(3, 0x16)//数据起始L(低位)
  messageBodyDataView.setUint8(4, 0x00)//数据个数H(高位)
  messageBodyDataView.setUint8(5, 0x02)//数据个数L(低位) 读取两个寄存器
  let heightCRC = calculateCRCByte(messageBodyBuffer, true)
  let lowCRC = calculateCRCByte(messageBodyBuffer, false)

  let CRCBuffer = new ArrayBuffer(2)
  let CRCDataView = new DataView(CRCBuffer)
  CRCDataView.setUint8(0, lowCRC)
  CRCDataView.setUint8(1, heightCRC)

  let mergeBuffer = mergeArrayBuffer(agreementPropertiesBuffer, messageBodyBuffer, CRCBuffer)
  let csByte = calculateCSByte(mergeBuffer)

  let CSBuffer = new ArrayBuffer(1)
  let CSDataView = new DataView(CSBuffer)
  CSDataView.setUint8(0, csByte)
  return Buffer.from(mergeArrayBuffer(mergeBuffer, CSBuffer))
}

