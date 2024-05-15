const deAfn00 = require('./decode/afn00')
const deAfn0c = require('./decode/afn0c')
const deAfn05 = require('./decode/afn05')

/**
 * 解码：JsonObject
 * @param {*} buffer 
 */
export const toJsonObject_pdc100 = (buffer) => {
	let resultJsonObj = { s: -1 }

	let dataView = new DataView(buffer)

	let index = 0
	// 68(1) L(2) 68(1) C(1) ID(1)
	index += 6
	// A(4) 
	let macAddr = ''
	for (let i = 0; i < 4; i++) {
		macAddr += dataView.getUint8(index + i).toString(16).padStart(2, '0')
	}
	index += 4
	// afn
	let afn = dataView.getUint8(index++).toString(16).padStart(2, '0')
	// seq
	index++
	// fn
	let fn = dataView.getUint8(index++)
	switch (afn) {
		case '00':
			deAfn00(resultJsonObj, dataView, index, fn, macAddr)
			break
		case '0c':
			deAfn0c(resultJsonObj, dataView, index, fn, macAddr)
			break
		case '05':
			deAfn05(resultJsonObj, dataView, index, fn, macAddr)
			break
		default:
			Object.assign(resultJsonObj, {
				s: -1,
				msg: 'afn[' + afn + '] 匹配失败'
			})
	}

	return resultJsonObj
}
