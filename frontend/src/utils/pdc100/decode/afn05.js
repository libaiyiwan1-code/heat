import { byte2HexStr } from '../../util.js'

/**
 * 查询参数（AFN=05H）
 * @param {*} resultJsonObj
 * @param {*} dataView
 * @param {*} index
 * @param {*} fn
 * @param {*} macAddr
 */
module.exports = (resultJsonObj, dataView, index, fn, macAddr) => {
	// sn
	index++

	switch (fn) {
		// 读地址
		case 6:
			index++
			let readMacAddr = ''
			for (let i = 0; i < 4; i++) {
				readMacAddr += dataView.getUint8(index + i).toString(16).padStart(2, '0')
			}

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr: readMacAddr,
				}
			})
			break
		// 读信号
		case 7:
			const signal = dataView.getUint8(index)

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					signal,
				}
			})
			break
		// 读ICCID
		case 8:
			let iccid = '', iccidCode
			for (let i = 0; i < 20; i++) {
				iccidCode = String.fromCharCode(dataView.getUint8(index + i))
				iccid += iccidCode
			}

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					iccid,
				}
			})
			break
		// 读版本
		case 9:
			const version = dataView.getUint8(index)

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					version,
				}
			})
			break
		// 读电压
		case 10:
			const voltage = (dataView.getUint16(index, true) * 0.01).toFixed(2)

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					voltage,
				}
			})
			break
		// 读IMEI
		case 11:
			let imei = '', imeiCode
			for (let i = 0; i < 15; i++) {
				imeiCode = String.fromCharCode(dataView.getUint8(index + i))
				imei += imeiCode
			}

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					imei,
				}
			})
			break
		// 读井盖检测参数
		// 68 2500 68 80 71 00000000 05ff0d 00 00000001 f0ff f0ff 0000 1801 1801 1801 00 00 04 10 11 0000 0000 0000 5116
		case 13:
			// 井盖地址
			let wellLidAddress = ''
			for (let i = 0; i < 4; i++) {
				wellLidAddress += dataView.getUint8(index + i).toString(16).padStart(2, '0')
			}
			index += 4
			// 井盖当前x值
			const wellLidXValue = dataView.getInt16(index, true)
			index += 2
			// 井盖当前y值
			const wellLidYValue = dataView.getInt16(index, true)
			index += 2
			// 井盖当前z值
			const wellLidZValue = dataView.getInt16(index, true)
			index += 2
			// x轴报警幅度值
			const xAlarmRange = dataView.getUint16(index, true)
			index += 2
			// y轴报警幅度值
			const yAlarmRange = dataView.getUint16(index, true)
			index += 2
			// z轴报警幅度值
			const zAlarmRange = dataView.getUint16(index, true)
			index += 2
			// 加速度唤醒阈值
			const speedRouseSlaveValue = dataView.getUint8(index++)
			// 加速度持续时间
			const speedDuration = dataView.getUint8(index++)
			// 井盖报警偏移值序号
			const wellLidAlarmOffset = dataView.getUint8(index++)
			// 软件版本号
			const softwareVersion = dataView.getUint8(index++)
			// 硬件版本号
			const hardwareVersion = dataView.getUint8(index++)
			// 电池电量
			const batteryCapacity = (dataView.getUint16(index, true) * 0.01).toFixed(2)
			index += 2
			// 井盖状态码
			index++
			const wellLidStatusCode = dataView.getUint8(index++)
			let wellLidStatus = {
				xOffsetAlarm: (wellLidStatusCode & 128) == 128 ? '1' : '0',
				yOffsetAlarm: (wellLidStatusCode & 64) == 64 ? '1' : '0',
				zOffsetAlarm: (wellLidStatusCode & 32) == 32 ? '1' : '0',
				'485State': (wellLidStatusCode & 8) == 8 ? '1' : '0',
				FSKState: (wellLidStatusCode & 4) == 4 ? '1' : '0',
				gyroState: (wellLidStatusCode & 2) == 2 ? '1' : '0',
				EEPState: (wellLidStatusCode & 1) == 1 ? '1' : '0',
			}
			// 井盖功能控制码
			const wellLidControlCode2 = dataView.getUint8(index++)
			const wellLidControlCode1 = dataView.getUint8(index++)
			let wellLidControl = {
				xAlarm: (wellLidControlCode1 & 128) == 128 ? '1' : '0',
				yAlarm: (wellLidControlCode1 & 64) == 64 ? '1' : '0',
				zAlarm: (wellLidControlCode1 & 32) == 32 ? '1' : '0',
				alarmMark: (wellLidControlCode1 & 16) == 16 ? '1' : '0',
				setMacAddr: (wellLidControlCode1 & 8) == 8 ? '1' : '0',
				setSoftwareOffset: (wellLidControlCode1 & 4) == 4 ? '1' : '0',
				setHardwareNum: (wellLidControlCode1 & 2) == 2 ? '1' : '0',
				slaveState: (wellLidControlCode1 & 1) == 1 ? '1' : '0',
				RS485UploadAlarmState: (wellLidControlCode2 & 2) == 2 ? '1' : '0',
				setStateCodee: (wellLidControlCode2 & 1) == 1 ? '1' : '0',
			}

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					wellLidAddress,
					wellLidXValue,
					wellLidYValue,
					wellLidZValue,
					xAlarmRange,
					yAlarmRange,
					zAlarmRange,
					speedRouseSlaveValue,
					speedDuration,
					wellLidAlarmOffset,
					softwareVersion,
					hardwareVersion,
					batteryCapacity,
					wellLidStatus,
					wellLidControl,
				}
			})
			break
		// 读取参数
		// 68 3f00 68 80 71 00000000 05fffb 00 71 00000000 02 0100 0300 d002 00 3c00 0600 1600
		// 3132342e37302e36382e35320000000000000000000000000000000000000000 5b07 5016
		case 251:
			// id(1) A(4)
			index += 5
			// 上传模式
			const uploadMode = dataView.getUint8(index++).toString()
			// 开始时间
			const startTime = byte2HexStr(dataView.getUint8(index)) + ':' + byte2HexStr(dataView.getUint8(index + 1))
			index += 2
			// 结束时间
			const endTime = byte2HexStr(dataView.getUint8(index)) + ':' + byte2HexStr(dataView.getUint8(index + 1))
			index += 2
			// 上传周期(分钟)
			const uploadCycle = dataView.getUint16(index, true)
			index += 2
			// 采集模式
			const collectMode = dataView.getUint8(index++).toString()
			// 采集周期(分钟)
			const collectCycle = dataView.getUint16(index, true)
			index += 2
			// 定时1
			const timing1 = byte2HexStr(dataView.getUint8(index)) + ':' + byte2HexStr(dataView.getUint8(index + 1))
			index += 2
			// 定时2
			const timing2 = byte2HexStr(dataView.getUint8(index)) + ':' + byte2HexStr(dataView.getUint8(index + 1))
			index += 2
			// ip
			let ip = '', code
			for (let i = 0; i < 32; i++) {
				code = String.fromCharCode(dataView.getUint8(index + i))
				if (code === '\u0000') {
					break
				}
				ip += code
			}
			index += 32
			// port
			const port = dataView.getUint16(index, true)
			index += 2

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					uploadMode,
					startTime,
					endTime,
					uploadCycle,
					collectMode,
					collectCycle,
					timing1,
					timing2,
					ip,
					port,
				}
			})
			break
		default:
			Object.assign(resultJsonObj, {
				s: -1,
				msg: 'fn[' + fn + ']匹配失败'
			})
	}
}
