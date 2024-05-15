
/**
 * 确认/否认（AFN=00H）
 * @param {*} resultJsonObj 
 * @param {*} dataView 
 * @param {*} index 
 * @param {*} fn 
 * @param {*} macAddr 
 */
module.exports = (resultJsonObj, dataView, index, fn, macAddr) => {
	switch (fn) {
		// 确认：对收到报文中的数据单元标识进行确认
		case 1:
			// sn
			const sn = dataView.getUint8(index++)

			Object.assign(resultJsonObj, {
				s: 0,
				msg: 'ok',
				data: {
					macAddr,
					sn
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