
/**
 * 查询参数（AFN=0cH）
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
		// 读数据
		case 11:
				// 进水温度（℃）
				const enterWaterTemperature = (dataView.getUint16(index, true) * 0.01).toFixed(2)
				index += 2
				// 回水温度（℃）
				const backWaterTemperature = (dataView.getUint16(index, true) * 0.01).toFixed(2)
				index += 2
				// 环境温度（℃）
				const surroundingTemperature = (dataView.getUint16(index, true) * 0.01).toFixed(2)
				index += 2
				// 进水压力（MPa）
				const enterWaterPressure = dataView.getFloat32(index, true).toFixed(2)
				index += 4
				// 回水压力（MPa）
				const backWaterPressure = dataView.getFloat32(index, true).toFixed(2)
				index += 4
				// 定位数据有效无效
				const locateData = dataView.getUint8(index++)
				// 定位的UTC时间戳
				const locateTimestamp = dataView.getUint32(index)
				index += 4
				// 纬度方向
				const latitudeDirection = dataView.getUint8(index++)
				// 纬度小数前
				const latitudeDecimalsBefore = dataView.getUint32(index)
				index += 4
				// 纬度小数后
				const latitudeDecimalsAfter = dataView.getUint32(index)
				index += 4
				// 经度方向
				const longitudeDirection = dataView.getUint8(index++)
				// 经度小数前
				const longitudeDecimalsBefore = dataView.getUint32(index)
				index += 4
				// 经度小数后
				const longitudeDecimalsAfter = dataView.getUint32(index)
				index += 4
				// 井盖位移监测模块工作状态、井盖位移报警、电池电压状态、回压传感器状态、进压传感器状态、环境温度传感器状态、
				// 进温传感器状态、回温传感器状态、液位检测、管道有害气体检测、蓝牙状态、供电方式
				const ST = dataView.getUint8(index++)
				let STState = {
					wellLidOffsetDetectionModule: (ST & 128) == 128 ? '故障' : '正常',
					wellLidOffsetWarn: (ST & 64) == 64 ? '位移报警' : '无位移报警',
					powerPressureState: (ST & 32) == 32 ? '故障' : '正常',
					returnPressure: (ST & 16) == 16 ? '故障' : '正常',
					enterPressure: (ST & 8) == 8 ? '故障' : '正常',
					surroundingTemperature: (ST & 4) == 4 ? '故障' : '正常',
					enterTemperature: (ST & 2) == 2 ? '故障' : '正常',
					returnTemperature: (ST & 1) == 1 ? '故障' : '正常',
				}
				const ST1 = dataView.getUint8(index)
				STState.liquidLevelDetection = (ST1 & 192) == 128 ? '液位高限报警' : (ST1 & 192) == 64 ? '液位低限报警' : '正常'
				STState.pipelineHarmfulGasDetection = (ST1 & 8) == 8 ? '管道有有害气体' : '管道无有害气体'
				STState.bluetoothState = (ST1 & 6) == 4 ? '蓝牙故障' : (ST1 & 6) == 2 ? '蓝牙连接' : '无连接'
				STState.powerMode = (ST1 & 1) == 1 ? '当前外供电' : '当前电池供电'

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					enterWaterTemperature,
					backWaterTemperature,
					surroundingTemperature,
					enterWaterPressure,
					backWaterPressure,
					locateData,
					locateTimestamp,
					latitudeDirection,
					latitudeDecimalsBefore,
					latitudeDecimalsAfter,
					longitudeDirection,
					longitudeDecimalsBefore,
					longitudeDecimalsAfter,
					STState,
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