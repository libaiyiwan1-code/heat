import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";
import {
    decodeGetPressureProbesNTP100CConfig,
    decodeGetTemperatureProbesNTP100CConfig,
} from "@/packBuffer/decode/nb/ntp100c/decodeValue";

export function decodeCheckReadProbesNTP100C(context, responseMessage) {
    let messageBuffer = hex2arrayBuffer(responseMessage);
    let dataView = new DataView(messageBuffer)
    let notPass =
        dataView.getUint8(16) !== 0x68 ||
        dataView.getUint8(19) !== 0x68 ||
        dataView.getUint8(20) !== 0x80 ||
        dataView.getUint8(21) !== 0x70 ||
        dataView.getUint8(26) !== 0x05 ||
        dataView.getUint8(28) !== 0xFC
    if (!notPass) {
        let config = decodeGetTemperatureProbesNTP100CConfig(responseMessage)
        console.warn('温度探头：', context.configDetail.temperatureProbe, '读探头配置：', config)
        if (context.configDetail.temperatureProbe === '双探头' && config !== 0) {
            notPass = true
            console.error('双探头配置不匹配')
            context.createLeftSpanMessage('设备温度探头不匹配', 'red')
        } else if (context.configDetail.temperatureProbe === '回温探头' && config !== 1) {
            notPass = true
            console.error('回温探头配置不匹配')
            context.createLeftSpanMessage('设备温度探头不匹配', 'red')
        } else if (context.configDetail.temperatureProbe === '进温探头' && config !== 2) {
            notPass = true
            console.error('进温探头配置不匹配')
            context.createLeftSpanMessage('设备温度探头不匹配设备温度探头不匹配', 'red')
        } else if (context.configDetail.temperatureProbe === '无探头' && config !== 3) {
            notPass = true
            console.error('无探头配置不匹配')
            context.createLeftSpanMessage('设备温度探头不匹配', 'red')
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


        let configPressure = decodeGetPressureProbesNTP100CConfig(responseMessage)
        if (context.configDetail.pressureProbes === '无探头' && configPressure !== 0x03) {
            notPass = true
            context.createLeftSpanMessage('设备压力探头不匹配', 'red')
        } else if (context.configDetail.pressureProbes === '进压探头' && configPressure !== 0x02) {
            notPass = true
            context.createLeftSpanMessage('设备压力探头不匹配', 'red')
        } else if (context.configDetail.pressureProbes === '回压探头' && configPressure !== 0x01) {
            notPass = true
            context.createLeftSpanMessage('设备压力探头不匹配', 'red')
        } else if (context.configDetail.pressureProbes === '双探头' && configPressure !== 0x00) {
            notPass = true
            context.createLeftSpanMessage('设备压力探头不匹配', 'red')
        } else if (context.configDetail.pressureProbes === '压差' && configPressure !== 0x04) {
            notPass = true
            context.createLeftSpanMessage('设备压力探头不匹配', 'red')
        }
        console.log(configPressure)
        if (configPressure === 0x03) {
            context.readDevicePressureProbes = '无探头'
        } else if (configPressure === 0x02) {
            context.readDevicePressureProbes = '进压探头'
        } else if (configPressure === 0x01) {
            context.readDevicePressureProbes = '回压探头'
        } else if (configPressure === 0x00) {
            context.readDevicePressureProbes = '双探头'
        }

    }
    return notPass
}



