import {hex2arrayBuffer, hexToAscii} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');


export function notHasSelfTestCompleted(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(87).toString(16).padStart(2, '0') !== '01' || dataView.getUint8(87) === 0xFF;

}


export function decodeCheckEEP(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(91).toString(16).padStart(2, '0') === '00' || dataView.getUint8(91) === 0xFF;

}

export function decodeCheckNetwork(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(92).toString(16).padStart(2, '0') === '00' || dataView.getUint8(92) === 0xFF;

}

export function decodeCheckValveClose(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(93).toString(16).padStart(2, '0') === '00' || dataView.getUint8(93) === 0xFF;

}

export function decodeCheckValveOpen(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(94).toString(16).padStart(2, '0') === '00' || dataView.getUint8(94) === 0xFF;

}

export function decodeCheckFsk(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(95).toString(16).padStart(2, '0') === '00' || dataView.getUint8(95) === 0xFF;

}

export function decodeCheckMbus(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(96).toString(16).padStart(2, '0') === '00' || dataView.getUint8(96) === 0xFF;

}

export function decodeCheckHall(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(97).toString(16).padStart(2, '0') === '00' || dataView.getUint8(97) === 0xFF;

}

export function decodeCheckBatteryVoltage(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(98).toString(16).padStart(2, '0') === '00' || dataView.getUint8(98) === 0xFF;

}

export function decodeGetProtocolId(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(88).toString(16), 16);
}

export function decodeGetVersion(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(90).toString(16), 16)
}

export function decodeGetNetprovider(responseMessage) {
  let responseBuffer = hex2arrayBuffer(responseMessage)
  let responseDataView = new DataView(responseBuffer)
  return parseInt(responseDataView.getUint8(89).toString(16), 16)
}


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

export function decodeGetTorque(responseMessage) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(30) === 0x00 ? '25Nm' : '50Nm'
}

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


export function decodeReadAddress(responseMessage, isCover = false, selfCollecting) {
  responseMessage = responseMessage.replace(/\s/g, '');
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer)
  if (selfCollecting) {
    return dataView.getUint32(22, isCover).toString(16)
  } else {
    return dataView.getUint32(6, isCover).toString(16)
  }
}


export function decodeReadSelfTestAddress(context, messageStr) {
  let messageBuffer = hex2arrayBuffer(messageStr);
  let dataView = new DataView(messageBuffer);
  let result = '';
  for (let i = 39; i < 43; i++) {
    result += dataView.getUint8(i).toString(16).padStart(2, '0');
  }
  context.leftReadAddress = result
  return false;
}

