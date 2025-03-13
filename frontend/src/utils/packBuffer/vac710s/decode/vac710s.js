import {hex2arrayBuffer} from '@/utils/util'

export function checkSpontaneous(responseMessage, requestMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  requestMessage = requestMessage.replace(/\s/g, '');
  return responseMessage.toLowerCase() === requestMessage.toLowerCase();

}

/*
* 自检询问回包校验
* */
export function decodeCheckInquireSelfTest(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16).toString(16) !== '68'
    || dataView.getUint8(17).toString(16) !== '60'
    || dataView.getUint8(25).toString(16) !== '84'
    || dataView.getUint8(27).toString(16) !== 'dd'
    || dataView.getUint8(28).toString(16) !== 'f0'
}


/*
* 自检询问回包校验
* */
export function decodeCheckReadData(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17).toString(16) !== '60'
    || dataView.getUint8(27).toString(16) !== '90'
    || dataView.getUint8(28).toString(16) !== '20'

}


/*
* 写硬件配置参数回包校验
* */
export function decodeWriteConfigParam(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16).toString(16) !== '68'
    || dataView.getUint8(17).toString(16) !== '60'
    || dataView.getUint8(25).toString(16) !== '84'
    || dataView.getUint8(27).toString(16) !== 'ac'
    || dataView.getUint8(28).toString(16) !== '9'
}


/*
* 写压力探头回报校验
* */
export function decodeWritePressureProbe(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(16).toString(16) !== '68'
    || dataView.getUint8(17).toString(16) !== '60'
    || dataView.getUint8(25).toString(16) !== '84'
    || dataView.getUint8(27).toString(16) !== 'ac'
    || dataView.getUint8(28).toString(16) !== '90'
}


export function decodeReadAddress(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  return dataView.getUint32(18,true).toString(16);
}

export function decodeReadDataAddress(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  let result = '';
  for (let i = 39; i < 43; i++) {
    result += dataView.getUint8(i).toString(16).padStart(2, '0');
  }
  return result;
}

//自检询问 验证协议id FN AFN

export function checkSelfInquireTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
    || dataView.getUint8(26).toString(16) !== 'f0'
    || dataView.getUint8(28).toString(16) !== '1'
}

export function checkReturnSelfTest(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(20).toString(16) !== '80' || dataView.getUint8(21).toString(16) !== '8a'
}

export function checkWriteConfigurationMessage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(22).toString(16) !== '78' || dataView.getUint8(30).toString(16) !== '84'
}


export function checkReadSelfTestLength(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let packSumLength = messageBuffer.byteLength;
  let inPackLengthHex = dataView.getUint8(29).toString(16); // 获取十六进制值
  let inPackLengthDecimal = parseInt(inPackLengthHex, 16); //转换十进制
  console.log(inPackLengthDecimal, packSumLength)
  return inPackLengthDecimal > packSumLength;
}


export function checkEEPNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  let eepValue = dataView.getUint8(57).toString(16).padStart(2, '0');
  return eepValue === '00';
}

export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(54).toString(16).padStart(2, '0') !== '01';

}

export function decodeTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let inTemperature = (dataView.getUint16(50, true) * 0.01).toFixed(2);
  // let outTemperature=0
  let outTemperature = (dataView.getUint16(52, true) * 0.01).toFixed(2);
  let address = (dataView.getUint32(18, true).toString(16))
  console.warn('读数据解析地址：', address)
  return {inTemperature, outTemperature, address}

}

export function checkButtonOneStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(60).toString(16).padStart(2, '0') === '00';

}


export function checkButtonTwoStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(61).toString(16).padStart(2, '0') === '00';

}

export function checkButtonThreeStatusNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(62).toString(16).padStart(2, '0') === '00';

}

export function checkNetNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(58).toString(16).padStart(2, '0') === '00';


}

export function checkVoltageNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(59).toString(16).padStart(2, '0') === '00';

}

export function checkTemperatureSensorNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64).toString(16).padStart(2, '0') === '00';

}

export function checkInTemperatureCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(66).toString(16).padStart(2, '0') !== '01' && dataView.getUint8(66).toString(16).padStart(2, '0') !== '02';

}

export function checkOutTemperatureCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(65).toString(16).padStart(2, '0') !== '01' && dataView.getUint8(65).toString(16).padStart(2, '0') !== '02';
}

export function checkValveOpenMinimumCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(63).toString(16).padStart(2, '0') !== '01' && dataView.getUint8(63).toString(16).padStart(2, '0') !== '02';


}

export function checkValveOpenMaximumCalibrationNotPass(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(64).toString(16).padStart(2, '0') !== '01' && dataView.getUint8(64).toString(16).padStart(2, '0') !== '02';

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
  return dataView.getUint8(16).toString(16) !== '68';

}

/**
 *     校验控制码
 */

export function decodeCheckControlCode(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(19).toString(16) !== '80'
}

/**
 *     校验NB协议ID
 */

export function decodeCheckAgreementID(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(17).toString(16) !== '60'
}

/*
*校验 AFN FN
*  */

export function decodeCheckAFNAndFN(messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(27).toString(16) !== 'f0' || dataView.getUint8(28).toString(16) !== 'dd'

}

//EEP、联网网络、电压、进回温标定、阀门开关标定、进压回压标定、气压
export function decodeCheckSelfTest(messageStr) {
  let selfTestState = false;
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  let msg = ''; // 初始化消息字符串
  // 是否自检过
  if (dataView.getUint8(54) === 0x00 || dataView.getUint8(54) === 0xFF) {
    selfTestState = true;
    msg += '未自检过, ';
  } else {
    msg += '已自检过,';
  }

  // EEP
  if (dataView.getUint8(58) === 0x00 || dataView.getUint8(58) === 0xFF) {
    selfTestState = true;
    msg += 'EEP不正常, ';
  } else {
    msg += 'EEP正常, ';
  }

  // 联网
  if (dataView.getUint8(59) === 0x00 || dataView.getUint8(59) === 0xFF) {
    selfTestState = true;
    msg += '联网不正常, ';
  } else {
    msg += '联网正常, ';
  }

  // 电压
  if (dataView.getUint8(64) === 0x00 || dataView.getUint8(64) === 0xFF) {
    selfTestState = true;
    msg += '电压不正常, ';
  } else {
    msg += '电压正常, ';
  }


  // 气压
  if (dataView.getUint8(65) === 0x00 || dataView.getUint8(65) === 0xFF) {
    selfTestState = true;
    msg += '气压不正常, ';
  } else {
    msg += '气压正常, ';
  }

  // 进压
  if (dataView.getUint8(66) === 0x00 || dataView.getUint8(66) === 0xFF) {
    selfTestState = true;
    msg += '进压不正常, ';
  } else {
    msg += '进压正常, ';
  }


  // 回压
  if (dataView.getUint8(67) === 0x00 || dataView.getUint8(67) === 0xFF) {
    selfTestState = true;
    msg += '回压不正常, ';
  } else {
    msg += '回压正常, ';
  }


  // 进温
  if (dataView.getUint8(63) === 0x00 || dataView.getUint8(63) === 0xFF) {
    selfTestState = true;
    msg += '进温不正常, ';
  } else {
    msg += '进温正常, ';
  }

  // 回温
  if (dataView.getUint8(62) === 0x00 || dataView.getUint8(62) === 0xFF) {
    selfTestState = true;
    msg += '回温不正常, ';
  } else {
    msg += '回温正常, ';
  }

  // 阀门最小标定
  if (dataView.getUint8(60) === 0x00 || dataView.getUint8(60) === 0xFF) {
    selfTestState = true;
    msg += '阀门最小标定不正常, ';
  } else {
    msg += '阀门最小标定正常, ';
  }


  // 阀门最大标定
  if (dataView.getUint8(61) === 0x00 || dataView.getUint8(61) === 0xFF) {
    selfTestState = true;
    msg += '阀门最大标定不正常, ';
  } else {
    msg += '阀门最大标定正常, ';
  }
  // 去除 msg 字符串末尾的 ", "
  msg = msg.slice(0, -2);

  return {selfTestState, msg};
}


export function decodeGetProductModel(responseMessage) {
  let model = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  // 判断型号
  for (let i = 30; i <= 53; i++) {
    model += dataView.getUint8(i).toString(16);
  }
  console.log('产品名称：' + hexToAscii(model))
  return hexToAscii(model)
}


export function checkProtocolID(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(21).toString(16) !== '8a';

}

export function decodeGetProtocolId(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(55).toString(16), 16);
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(57).toString(16), 16)
}

export function decodeNetProvider(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(56).toString(16), 16)
}

export function decodeICCID(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let iccid = '';
  for (let i = 30; i <= 49; i++) {
    iccid += dataView.getUint8(i).toString(16).padStart(2, '0')
  }
  return hexToAscii(iccid)
}

export function decodeIMEI(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let imei = '';
  for (let i = 30; i <= 44; i++) {
    imei += dataView.getUint8(i).toString(16).padStart(2, '0')
  }
  return hexToAscii(imei)

}

export function checkWriteNotPass(valveAddress, responseMessage) {
  let splicingAddress = '';
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  for (let i = 6; i <= 9; i++) {
    const byteValue = dataView.getUint8(i);
    // 使用 toString(16) 将字节转换为十六进制字符串，并确保两个字符长度
    const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
    splicingAddress += hexString;
  }
  //地址对比
  console.log('要修改的地址:' + valveAddress, '报文返回的地址' + splicingAddress)
  return splicingAddress !== valveAddress;

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
      console.log(decimal)
      // 如果遇到不可打印字符，则不添加到结果中
      // 可根据需要添加其他处理逻辑，比如替换为空格或忽略等
      break;
    }
  }
  return asciiString;
}
