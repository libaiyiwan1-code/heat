import {mergeArrayBuffer} from '../../util.js'


const arrayBufferToHexString = (arrayBuffer) => {
    // 创建一个 DataView 来读取 fullBuffer 中的数据
    let fullDataView = new DataView(arrayBuffer);

    // 初始化一个空字符串用于存储十六进制字符串
    let hexString = '';

    // 遍历 fullBuffer 中的每一个字节，并将其转换为十六进制字符串
    for (let i = 0; i < arrayBuffer.byteLength; i++) {
        // 使用 getUint8 方法获取当前字节的十进制值
        let decimalValue = fullDataView.getUint8(i);
        // 将十进制值转换为两位十六进制字符串，并添加到 hexString 中
        hexString += ('0' + decimalValue.toString(16)).slice(-2) + ' ';
        // 每 16 个字节打印一行
        if ((i + 1) % 16 === 0) {
            console.log(hexString);
            hexString = ''; // 清空 hexString，准备存储下一行的数据
        }
    }

    return hexString;
};

/**
 * 外层协议 组包 广播读
 */
export function packBroadcastRead() {
    let homeBuffer = new ArrayBuffer(3)
    let homeDataView = new DataView(homeBuffer)
    homeDataView.setUint8(0, 0xFE)
    homeDataView.setUint8(1, 0xFE)
    homeDataView.setUint8(2, 0xFE)
    let headBuffer = new ArrayBuffer(14)
    let headDataView = new DataView(headBuffer)
    headDataView.setUint8(0, 0x68)
    headDataView.setUint8(1, 0x46)
    headDataView.setUint8(2, 0xAA)
    headDataView.setUint8(3, 0xAA)
    headDataView.setUint8(4, 0xAA)
    headDataView.setUint8(5, 0xAA)
    headDataView.setUint8(6, 0xAA)
    headDataView.setUint8(7, 0xAA)
    headDataView.setUint8(8, 0xAA)
    headDataView.setUint8(9, 0x03)
    headDataView.setUint8(10, 0x03)
    headDataView.setUint8(11, 0x81)
    headDataView.setUint8(12, 0x0A)
    headDataView.setUint8(13, 0x01)
    let bodySum = 0
    let bodyDataView = new DataView(headBuffer)
    for (let i = 0; i < headBuffer.byteLength; i++) {
        bodySum += bodyDataView.getUint8(i)
    }
    let tailBuffer = new ArrayBuffer(2)
    let tailDataView = new DataView(tailBuffer)
    tailDataView.setUint8(0, bodySum % 256)
    tailDataView.setUint8(1, 0x16)

    let arrayBuffer = mergeArrayBuffer(homeBuffer, headBuffer, tailBuffer);
    // console.log('广播读发送的命令 十六进制字符串:', arrayBufferToHexString(arrayBuffer));
    // 将 ArrayBuffer 转换为 Buffer 类型
    return Buffer.from(arrayBuffer)
}


export function packEditMacAddr(receivedDataArrayBuffer, valveAddress) {

    // 去掉所有空格
    valveAddress = valveAddress.replace(/\s/g, '');
    let startBuffer = new ArrayBuffer(3)
    let startDataView = new DataView(startBuffer)
    startDataView.setUint8(0, 0xFE)
    startDataView.setUint8(1, 0xFE)
    startDataView.setUint8(2, 0xFE)

    let homeBuffer = new ArrayBuffer(2)
    let homeDataView = new DataView(homeBuffer)
    homeDataView.setUint8(0, 0x68)
    homeDataView.setUint8(1, 0x46)
    let homeMergeArray = mergeArrayBuffer(homeBuffer, receivedDataArrayBuffer)
    // 创建一个 DataView 来读取 fullBuffer 中的数据
    let fullDataView = new DataView(homeMergeArray);

    // 初始化一个空字符串用于存储十六进制字符串
    let hexString = '';

    // 遍历 fullBuffer 中的每一个字节，并将其转换为十六进制字符串
    for (let i = 0; i < homeMergeArray.byteLength; i++) {
        // 使用 getUint8 方法获取当前字节的十进制值
        let decimalValue = fullDataView.getUint8(i);
        // 将十进制值转换为两位十六进制字符串，并添加到 hexString 中
        hexString += ('0' + decimalValue.toString(16)).slice(-2) + ' ';
        // 每 16 个字节打印一行
        if ((i + 1) % 16 === 0) {
            console.log(hexString);
            hexString = ''; // 清空 hexString，准备存储下一行的数据
        }
    }

    // 打印最后一行的数据（不足 16 个字节）
    if (hexString !== '') {
        console.log(hexString);
    }
    // console.log('homeMergeArray:', arrayBufferToHexString(homeMergeArray));
    //继续拼 15 0A A0 18 01
    let bodyBuffer = new ArrayBuffer(5)
    let bodyDataView = new DataView(bodyBuffer)
    bodyDataView.setUint8(0, 0x15)
    bodyDataView.setUint8(1, 0x0A)
    bodyDataView.setUint8(2, 0xA0)
    bodyDataView.setUint8(3, 0x18)
    bodyDataView.setUint8(4, 0x01)

    // 转换新地址为字节数组
    let byteArray = [];
    for (let i = 0; i < valveAddress.length; i += 2) {
        byteArray.unshift(parseInt(valveAddress.substr(i, 2), 16));
    }

    let newAddressBuffer=new ArrayBuffer(7)
    let newAddressView = new DataView(newAddressBuffer)
    for (let i = 0; i < byteArray.length; i ++) {
        newAddressView.setUint8(i, byteArray[i])
    }
    // console.log('newAddressBuffer:', arrayBufferToHexString(newAddressBuffer));
    let allBodyArray = mergeArrayBuffer(homeMergeArray, bodyBuffer, newAddressBuffer);

    let allSum = 0
    let allDataView = new DataView(allBodyArray)
    for (let i = 0; i < allBodyArray.byteLength; i++) {
        allSum += allDataView.getUint8(i)
    }
    let tailBuffer = new ArrayBuffer(2)
    let tailDataView = new DataView(tailBuffer)
    tailDataView.setUint8(0, allSum % 256)
    tailDataView.setUint8(1, 0x16)

    let allArray = mergeArrayBuffer(startBuffer,allBodyArray, tailBuffer)
    console.log('receivedDataArrayBuffer:', arrayBufferToHexString(allArray));
    return Buffer.from(allArray);
}
