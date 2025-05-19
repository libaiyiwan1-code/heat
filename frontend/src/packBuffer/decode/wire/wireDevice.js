import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";


export function decodeCheckReadAddress(context, responseMessage, type) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let address = '';
  for (let i = 5; i <= 11; i++) {
    const byteValue = dataView.getUint8(i);
    address += byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
  }
  if (type === 'one') {
    context.leftReadAddress = address
  } else {
    context.rightReadAddress = address
  }
}


export function decodeWriteUpperAndLowerTemperatureLimitsVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '11'

}


export function decodeWritePowerOutagesAndWirelessAnomaliesVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '26'

}


export function decodeWriteHeatingDateVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '19'

}

export function decodeWriteProbeConfigurationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'ac'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '09'

}

export function decodeWriteAllConfigConfigurationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'ac'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '02'

}

export function decodeReadVersionVerify(context, responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  let result = dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'b0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '05'
  conext.readVersion = decodeGetVersion(responseMessage)
  return result
}

export function decodeGetVersion(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  let version = dataView.getUint8(17);
  return (version * 0.1).toFixed(1).toString();
}

export function decodeGetInAndOutTemperature(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  console.log(dataView.getInt16(23, true))
  console.log(dataView.getInt16(23, true).toString(16))
  const inTemperature = (dataView.getInt16(23, true).toString(16) * 0.01).toFixed(2);
  const outTemperature = (dataView.getInt16(25, true).toString(16) * 0.01).toFixed(2);
  return {inTemperature, outTemperature}
}

export function decodeFactoryConditionFullyOpenVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '17'
}

export function decodeFactoryConditionFullyCloseVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'a0'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '17'
}

export function decodeOutTemperatureCalibrationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'bb'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ff'
}

export function decodeInTemperatureCalibrationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'bb'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ee'
}

export function decodeMainAndAuxiliaryValvesVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '22'
}
export function decodeMainAndAuxiliaryValvesDone(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return (dataView.getUint8(55) & 0x80) === 0x00;
}

export function decodeFaceplateCommunicationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '1f'
}

export function decodeCreditCardVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '81'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== '90'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== '24'
}

export function decodeFullOpenCalibrationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'cc'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ee'

}

export function decodeFullOffCalibrationVerify(responseMessage) {
  let messageBuffer = hex2arrayBuffer(responseMessage)
  let dataView = new DataView(messageBuffer)
  return dataView.getUint8(3).toString(16).padStart(2, '0') !== '68'
    || dataView.getUint8(12).toString(16).padStart(2, '0') !== '84'
    || dataView.getUint8(14).toString(16).padStart(2, '0') !== 'cc'
    || dataView.getUint8(15).toString(16).padStart(2, '0') !== 'ff'

}
