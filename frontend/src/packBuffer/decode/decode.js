import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";


/**
 * 读IMEI字符串解析
 *
 * **/
export function decodeGetIMEI(responseMessage, selfCollecting) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let imei = '';
  if (selfCollecting) {
    for (let i = 30; i <= 44; i++) {
      imei += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
  } else {
    for (let i = 14; i <= 28; i++) {
      imei += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
  }
  return hexToAscii(imei)
}

/**
 * 读扭矩档位字符串解析
 * */
export function decodeGetTorqueStr(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(30) === 0x00 ? '25Nm' : '50Nm'
}

/**
 *  读扭矩档位数值解析
 *
 * */
export function decodeGetTorque(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(30) === 0x00 ? 25 : 50
}

/**
 *
 * 读ICCID字符串解析
 *
 * */
export function decodeGetICCID(responseMessage, selfCollecting) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  let iccid = '';
  if (selfCollecting) {
    for (let i = 30; i <= 49; i++) {
      iccid += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
  } else {
    for (let i = 14; i <= 33; i++) {
      iccid += dataView.getUint8(i).toString(16).padStart(2, '0')
    }
  }
  return hexToAscii(iccid)
}



