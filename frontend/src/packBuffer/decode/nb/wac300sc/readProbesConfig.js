import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {decodeGetTemperatureProbesWAC300NConfig} from "@/packBuffer/decode/nb/wac300n/decodeValue";
import {decodeGetTemperatureProbesWAC300SCConfig} from "@/packBuffer/decode/nb/wac300sc/decodeValue";

export function readProbesConfig(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let notPass =
    dataView.getUint8(33) !== 0x68 ||
    dataView.getUint8(36) !== 0x68 ||
    dataView.getUint8(37) !== 0x80 ||
    dataView.getUint8(38) !== 0x9B||
    dataView.getUint8(60) !== 0xAB ||
    dataView.getUint8(61) !== 0x09
  if (!notPass) {
    let config = decodeGetTemperatureProbesWAC300SCConfig(responseMessage)
    console.warn('温度探头：', context.configDetail.temperatureProbe, '读探头配置：', config)

    if (context.configDetail.temperatureProbe === '双探头' && config !== 0) {
      notPass = true
      console.error('双探头 探头配置-不匹配')
      context.createLeftSpanMessage('双探头 探头配置-不匹配', 'red')
    } else if (context.configDetail.temperatureProbe === '回温探头' && config !== 1) {
      notPass = true
      console.error('回温 探头配置-不匹配')
      context.createLeftSpanMessage('回温 探头配置-不匹配', 'red')
    } else if (context.configDetail.temperatureProbe === '进温探头' && config !== 2) {
      notPass = true
      console.error('进温 探头配置-不匹配')
      context.createLeftSpanMessage('进温 探头配置-不匹配', 'red')
    } else if (context.configDetail.temperatureProbe === '无探头' && config !== 3) {
      notPass = true
      console.error('无探头 配置-不匹配')
      context.createLeftSpanMessage('无探头 配置-不匹配', 'red')
    }
    if (config === 0x01) {
      context.readDeviceTemperatureProbes = '回温探头'
    } else if (config === 0x02) {
      context.readDeviceTemperatureProbes = '进温探头'
    } else if (config === 0x00) {
      context.readDeviceTemperatureProbes = '双探头'
    } else if (config === 0x03) {
      context.readDeviceTemperatureProbes = '无探头'
    }
    console.log(context.readDeviceTemperatureProbes)
  }
  return notPass
}


