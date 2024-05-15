const afnCom = require('./afnCom')

/**
 * 查询参数（AFN=05H）
 * @param {*} fn
 * @param {*} paramObj
 */
module.exports = (afn, fn, paramObj) => {
	let buffer, dataView, index = 0
	// 读地址 读信号 读ICCID 读版本号 读电压 读IMEI 读取参数
	// 68 0a00 68 40 71 12345678 05fffb 00 c416
	if (fn == 6 || fn == 7 || fn == 8 || fn == 9 || fn == 10 || fn == 11 || fn == 251 || fn == 13 ) {
		buffer = new ArrayBuffer(1)
		dataView = new DataView(buffer)
		// 数据包标识 sn
		dataView.setUint8(index, 0x00)
	} else {
		return null
	}

	return afnCom.packBroadcastRead(afn, fn, paramObj.macAddr, buffer)
}
