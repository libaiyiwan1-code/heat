const enAfn03 = require('./encode/afn03')
const enAfn05 = require('./encode/afn05')
const enAfn0c = require('./encode/afn0c')

/**
 * 编码：arrayBuffer
 * @param {*} afn 
 * @param {*} fn 
 * @param {*} paramObj 
 */
export const toArrayBuffer_pdc100 = (afn, fn, paramObj) => {
	if (!afn) {
		uni.showToast({ title: 'afn是空', icon: 'error', duration: 2000 })
		return null
	}
	if (!fn) {
		uni.showToast({ title: 'fn是空', icon: 'error', duration: 2000 })
		return null
	}
	if (!paramObj.macAddr) {
		uni.showToast({ title: '终端地址是空', icon: 'error', duration: 2000 })
		return null
	}
	
	let buffer
	switch (afn) {
		case '03':
			buffer = enAfn03(afn, fn, paramObj)
			break
		case '05':
			buffer = enAfn05(afn, fn, paramObj)
			break
		case '0c':
			buffer = enAfn0c(afn, fn, paramObj)
			break
		default:
			uni.showToast({ title: 'afn匹配失败', icon: 'error', duration: 1000 })
			return null
	}
	return buffer
}
