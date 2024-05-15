const afnCom = require('./afnCom')

/**
 * 查询参数（AFN=0cH）
 * @param {*} fn
 * @param {*} paramObj
 */
module.exports = (afn, fn, paramObj) => {
	let buffer, dataView, index = 0

	switch (fn) {
		// 读数据
		case 11:
			buffer = new ArrayBuffer(1)
			dataView = new DataView(buffer)

			// sn
			dataView.setUint8(index++, 0x00)

			break
		default:
			return null
	}

	return afnCom.packBroadcastRead(afn, fn, paramObj.macAddr, buffer)
}
