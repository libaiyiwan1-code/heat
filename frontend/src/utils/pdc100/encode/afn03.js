const afnCom = require('./afnCom')
const util = require('../../util.js')

/**
 * 设置命令（AFN=03H）
 * @param {*} fn
 * @param {*} paramObj
 */
module.exports = (afn, fn, paramObj) => {
	let buffer, dataView, index = 0

	switch (fn) {
		// 写地址
		case 6:
			buffer = new ArrayBuffer(6)
			dataView = new DataView(buffer)

			// 数据包标识 sn
			dataView.setUint8(index++, 0x00)
			// T
			dataView.setUint8(index++, 0x71)
			// macAddr
			for (let i = 0; i < 4; i++) {
				dataView.setUint8(index + i, '0x' + paramObj.macAddr.substr(i * 2, 2))
			}

			break
		// 写井盖检测参数
		// 68 1a00 68 4071 00000000 03ff0d 01 00000001 1801 1801 0000 20 02 1234 01cf 2c16
		// 68 1a00 68 4071 12345678 03ff0d 00 00000004 1801 1801 0000 20 02 0000 01ce fb16
		case 13:
			buffer = new ArrayBuffer(17)
			dataView = new DataView(buffer)
			// 数据包标识 sn
			dataView.setUint8(index++, 0x01)
			// 设置的井盖地址
			for (let i = 0; i < 4; i++) {
				dataView.setUint8(index + i, '0x' + paramObj.wellLidAddress.substr(i * 2, 2))
			}
			index += 4
			// 报警幅度值
			dataView.setInt16(index, paramObj.xAlarmRange, true)
			index += 2
			dataView.setInt16(index, paramObj.yAlarmRange, true)
			index += 2
			dataView.setInt16(index, paramObj.zAlarmRange, true)
			index += 2
			// 加速度唤醒阈值
			dataView.setUint8(index++, paramObj.speedRouseSlaveValue)
			// 加速度持续时间
			dataView.setUint8(index++, paramObj.speedDuration)

			let config = 0
			let config1 = 0
			let config2 = 0
			if (paramObj.xOffsetAlarm === '1') config += 128
			if (paramObj.yOffsetAlarm === '1') config += 64
			if (paramObj.zOffsetAlarm === '1') config += 32
			if (paramObj['485State'] === '1') config += 8
			if (paramObj.FSKState === '1') config += 4
			if (paramObj.gyroState === '1') config += 2
			if (paramObj.EEPState === '1') config += 1

			if (paramObj.xAlarm === '1') config1 += 128
			if (paramObj.yAlarm === '1') config1 += 64
			if (paramObj.zAlarm === '1') config1 += 32
			if (paramObj.alarmMark === '1') config1 += 16
			if (paramObj.setMacAddr === '1') config1 += 8
			if (paramObj.setSoftwareOffset === '1') config1 += 4
			if (paramObj.setHardwareNum === '1') config1 += 2
			if (paramObj.slaveState === '1') config1 += 1

			if (paramObj.RS485UploadAlarmState === '1') config2 += 2
			if (paramObj.setStateCodee === '1') config2 += 1

			dataView.setUint8(index++, 0x00)
			dataView.setUint8(index++, config)
			dataView.setUint8(index++, config2)
			dataView.setUint8(index++, config1)
			break
		// 修改参数
		case 250:
			buffer = new ArrayBuffer(49)
			dataView = new DataView(buffer)

			// sn
			dataView.setUint8(index++, 0x00)
			// 上传模式
			dataView.setUint8(index++, paramObj.uploadMode)
			// 开始时间
			let startTimeStr = util.clearColon(paramObj.startTime)
			dataView.setUint8(index++, '0x' + startTimeStr.substr(0, 2))
			dataView.setUint8(index++, '0x' + startTimeStr.substr(2, 2))
			// 结束时间
			let endTimeStr = util.clearColon(paramObj.endTime)
			dataView.setUint8(index++, '0x' + endTimeStr.substr(0, 2))
			dataView.setUint8(index++, '0x' + endTimeStr.substr(2, 2))
			// 上传周期
			dataView.setUint16(index, paramObj.uploadCycle, true)
			index += 2
			// 采集模式 0-周期 1-定时
			dataView.setUint8(index++, paramObj.collectMode)
			// 采集周期
			dataView.setUint16(index, paramObj.collectCycle, true)
			index += 2
			// 定时时间1
			let timing1Str = util.clearColon(paramObj["timing1"])
			dataView.setUint8(index++, '0x' + timing1Str.substr(0, 2))
			dataView.setUint8(index++, '0x' + timing1Str.substr(2, 2))
			// 定时时间2
			let timing2Str = util.clearColon(paramObj["timing2"])
			dataView.setUint8(index++, '0x' + timing2Str.substr(0, 2))
			dataView.setUint8(index++, '0x' + timing2Str.substr(2, 2))
			// ip
			for (let i = 0; i < 32; i++) {
				if (!paramObj.ip[i]) {
					dataView.setUint8(index++, 0x00)
				} else {
					dataView.setUint8(index++, paramObj.ip[i].charCodeAt())
				}
			}
			// port
			dataView.setUint16(index, paramObj.port, true)

			break
		// 唤醒
		case 253:
			buffer = new ArrayBuffer(1)
			dataView = new DataView(buffer)

			// 数据包标识 sn
			dataView.setUint8(index, 0x00)

			break
		default:
			return null
	}

	return afnCom.packBroadcastRead(afn, fn, paramObj.macAddr, buffer)
}
