import {hex2arrayBuffer} from '@/utils/util'

/*
* 自检询问回包校验
* */
export function decodeCheckInquireSelfTest(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(4).toString(16) !== '80'
    || dataView.getUint8(5).toString(16) !== '75'
    || dataView.getUint8(10).toString(16) !== 'c'
    || dataView.getUint8(11).toString(16) !== 'ff'
    || dataView.getUint8(16).toString(16) !== '68'
    || dataView.getUint8(17).toString(16) !== '75'
    || dataView.getUint8(25).toString(16) !== '84'
    || dataView.getUint8(27).toString(16) !== 'dd'
    || dataView.getUint8(28).toString(16) !== 'f0';
}

/*
* 写温度探头
* */
export function decodeCheckWriteTemperatureProbe(messageStr) {
  //68 0C 00 68 80 75 11 00 00 00 0C FF 01 01 00 00 13 16
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(4).toString(16) !== '80'
    || dataView.getUint8(5).toString(16) !== '75'
    || dataView.getUint8(10).toString(16) !== 'c'
    || dataView.getUint8(11).toString(16) !== 'ff';
}


/**
 *     1.包内长度与报文总长度
 *     2.包内长度与透传长度
 */

export function decodeCheckSumLength(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  let packSumLength = messageBuffer.byteLength;
  let inPackLength = dataView.getUint8(1);
  let inPackTransparentLength = dataView.getUint8(14);
  return inPackLength > packSumLength || inPackTransparentLength > inPackLength;
}


/**
 *     校验包内起始帧
 */

export function decodeCheckFrame(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(0).toString(16) !== '68' || dataView.getUint8(3).toString(16) !== '68'

}


/**
 *     校验控制码
 */

export function decodeCheckControlCode(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(4).toString(16) !== '80' || dataView.getUint8(25).toString(16) !== '81'
}


/**
 *     校验NB协议ID
 */

export function decodeCheckAgreementID(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(5).toString(16) !== '75' || dataView.getUint8(17).toString(16) !== '75'
}


/*
*校验 AFN FN
*  */

export function decodeCheckAFNAndFN(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(10).toString(16) !== 'c' || dataView.getUint8(12).toString(16) !== '1' ||
    dataView.getUint8(27).toString(16) !== 'f0' || dataView.getUint8(28).toString(16) !== 'dd'
}

/*
*校验 自检状态
*EEP、联网、电压、进回温标定、进回压、阀门开关标定、型号
* */

export function decodeCheckSelfTest(messageStr) {
  let selfTestState = false;
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  let model = '';
  let msg = ''; // 初始化消息字符串

  //判断型号
  for (let i = 30; i < 54; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  if (hexToAscii(model) !== 'WAC710C-NT26E') {
    selfTestState = true;
    msg += '产品型号不匹配, ';
  }

  // 是否自检过
  if (dataView.getUint8(54) === 0x00) {
    selfTestState = true;
    msg += '未自检过, ';
  }

  // EEP
  if (dataView.getUint8(58) === 0x00) {
    selfTestState = true;
    msg += 'EEP不正常, ';
  }

  // 联网
  if (dataView.getUint8(59) === 0x00) {
    selfTestState = true;
    msg += '联网不正常, ';
  }

  // 电压
  if (dataView.getUint8(64) === 0x00) {
    selfTestState = true;
    msg += '电压不正常, ';
  }

  // 进温
  if (dataView.getUint8(63) === 0x00) {
    selfTestState = true;
    msg += '进温不正常, ';
  }

  // 回温
  if (dataView.getUint8(62) === 0x00) {
    selfTestState = true;
    msg += '回温不正常, ';
  }

  // 进压
  if (dataView.getUint8(66) === 0x00) {
    selfTestState = true;
    msg += '进压不正常, ';
  }
  // 回压
  if (dataView.getUint8(67) === 0x00) {
    selfTestState = true;
    msg += '内部温度传感器不正常, ';
  }

  // 气压传感器
  if (dataView.getUint8(65) === 0x00) {
    selfTestState = true;
    msg += '气压传感器不正常, ';
  }

  // 阀门最小标定
  if (dataView.getUint8(60) === 0x00) {
    selfTestState = true;
    msg += '阀门最小标定不正常, ';
  }


  // 阀门最大标定
  if (dataView.getUint8(61) === 0x00) {
    selfTestState = true;
    msg += '阀门最大标定不正常, ';
  }

  // 去除 msg 字符串末尾的 ", "
  msg = msg.slice(0, -2);

  return {selfTestState, msg};
}

/*
*解析IMEI
*  */

export function decodeIMEI(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  let imei = '';
  for (let i = 14; i < 29; i++) {
    imei += dataView.getUint8(i).toString(16)
  }
  return hexToAscii(imei)
}

/*
*解析ICCID
*  */
export function decodeICCID(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  let iccid = '';
  for (let i = 14; i < 34; i++) {
    iccid += dataView.getUint8(i).toString(16)
  }
  return hexToAscii(iccid)
}

/*
*协议id
*  */
export function decodeProtocolId(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(5);
}

/*软件版本*/
export function decodeValveVersion(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(57);
}


/*
*TPC100 解析写地址
*  */
export function decodeAddressMessage(messageStr, valueAddress) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  let writeAddressNotPass = false;
  let splicingAddress = '';

  // 校验AFN
  if (dataView.getUint8(10) !== 0x00) {
    writeAddressNotPass = true;
    console.error('AFN check failed.');
  }
  // 校验 FN
  if (dataView.getUint8(12) !== 0x01) {
    writeAddressNotPass = true;
    console.error('FN check failed.');
  }

  //  68 0A 00 68 80 75 34 45 90 01 00 FF 01 02 01 16
  // 校验地址
  for (let i = 6; i <= 9; i++) {
    const byteValue = dataView.getUint8(i);
    // 使用 toString(16) 将字节转换为十六进制字符串，并确保两个字符长度
    const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    splicingAddress += hexString;
  }
  console.log(splicingAddress, valueAddress)
  if (splicingAddress !== valueAddress) {
    writeAddressNotPass = true;
    console.error('Address check failed.');
  }

  return writeAddressNotPass;
}

/*
*TPC100 线路检测
*  */
export function decodeLineDetectionCheck(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(7).toString(16) !== '80' ||
    dataView.getUint8(8).toString(16) !== '7A' ||
    dataView.getUint8(16).toString(16) !== '00' ||
    dataView.getUint8(13).toString(16) !== 'F0' ||
    dataView.getUint8(15).toString(16) !== '01' ||
    dataView.getUint8(3).toString(16) !== '68' ||
    dataView.getUint8(6).toString(16) !== '68'
}


function hexToAscii(hexString) {
  let asciiString = '';
  for (let i = 0; i < hexString.length; i += 2) {
    // 获取每两个字符组成的十六进制数
    const hex = hexString.substr(i, 2);
    // 将十六进制数转换为十进制数
    const decimal = parseInt(hex, 16);
    // 如果是可打印字符（ASCII码在32~126之间），则添加对应的 ASCII 字符
    if (decimal >= 32 && decimal <= 126) {
      asciiString += String.fromCharCode(decimal);
    } else {
      // 如果遇到不可打印字符，则不添加到结果中
      // 可根据需要添加其他处理逻辑，比如替换为空格或忽略等
      break;
    }
  }
  return asciiString;
}
