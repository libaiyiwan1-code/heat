import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";

/**
 * 双通道标定
 * */
export const dosDoubleChannelCalibrationPTC100420MA = async (context, type) => {
  //设备输出12mA
  let deviceOutputs12mAResult = await serialPortOperation(context, {
    actionType: 'deviceOutputs12mA',
    operationName: '设备输出12mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: 'output-12mA',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['deviceOutputs12mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['deviceOutputs12mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceOutputs12mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.deviceOutputs12mA,
  }, type, 'MODBUS')
  if (deviceOutputs12mAResult) {
    return true
  }
  context.createLeftSpanMessage('等待20s，确保设备输出稳定', 'grey');
  console.log('等待20s，确保设备输出稳定');
  await new Promise(x => setTimeout(x, 20000));
  //读温度电流表
  let readTemperatureCurrentResult = await serialPortOperation(context, {
    actionType: 'readTemperatureCurrent',
    operationName: '读温度电流表',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'readDeviceTemperatureCurrent',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readTemperatureCurrent'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readTemperatureCurrent'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readTemperatureCurrent(context, context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readTemperatureCurrent,
  }, type, 'MODBUS')
  if (readTemperatureCurrentResult) {
    return true
  }
  //电流表对比12mA误差小于0.03ma
  let readCurrent12MeterValue = context.readCurrentMeterValue
  if (!(Math.abs(readCurrent12MeterValue - 12) <= 0.03)) {
    context.createLeftSpanMessage(`温度通道电流验证失败，电流表读数:${readCurrent12MeterValue}mA，误差超出0.03mA`, 'red');
    return true
  }
  //设备输出4mA
  let deviceOutputs4mAResult = await serialPortOperation(context, {
    actionType: 'deviceOutputs4mA',
    operationName: '设备输出4mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: 'output-4mA',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['deviceOutputs4mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['deviceOutputs4mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceOutputs4mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.deviceOutputs4mA,
  }, type, 'MODBUS')
  if (deviceOutputs4mAResult) {
    return true
  }
  context.createLeftSpanMessage('等待30s，确保设备输出稳定', 'grey');
  console.log('等待30s，确保设备输出稳定');
  await new Promise(x => setTimeout(x, 30000));

  //读压力电流表
  let readPressureCurrentResult = await serialPortOperation(context, {
    actionType: 'readPressureCurrent',
    operationName: '读压力电流表',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'readPressureCurrent',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readPressureCurrent'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readPressureCurrent'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readPressureCurrent(context, context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readPressureCurrent,
  }, type, 'MODBUS')
  if (readPressureCurrentResult) {
    return true
  }


  //压力通道4mA标定
  let pressureChannelCalibrated4mAResult = await serialPortOperation(context, {
    actionType: 'pressureChannelCalibrated4mA',
    operationName: '压力通道4mA标定',
    cmdType: '06',                         // afn 的命令类型
    cmdCode: 'pressureChannelCalibrated4mA',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['pressureChannelCalibrated4mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['pressureChannelCalibrated4mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.pressureChannelCalibrated4mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.pressureChannelCalibrated4mA,
  }, type, 'MODBUS')
  if (pressureChannelCalibrated4mAResult) {
    return true
  }

  //设备输出20mA
  let deviceOutputs20mAResult = await serialPortOperation(context, {
    actionType: 'deviceOutputs20mA',
    operationName: '设备输出20mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: 'output-20mA',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['deviceOutputs20mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['deviceOutputs20mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceOutputs20mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.deviceOutputs20mA,
  }, type, 'MODBUS')
  if (deviceOutputs20mAResult) {
    return true
  }
  context.createLeftSpanMessage('等待30s，确保设备输出稳定', 'grey');
  console.log('等待30s，确保设备输出稳定');
  await new Promise(x => setTimeout(x, 30000));



  //读压力电流表
  let readPressureCurrent2Result = await serialPortOperation(context, {
    actionType: 'readPressureCurrent',
    operationName: '读压力电流表',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'readPressureCurrent',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readPressureCurrent'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readPressureCurrent'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readPressureCurrent(context, context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readPressureCurrent,
  }, type, 'MODBUS')
  if (readPressureCurrent2Result) {
    return true
  }


  //压力通道20mA标定
  let pressureChannelCalibrated20mAResult = await serialPortOperation(context, {
    actionType: 'pressureChannelCalibrated20mA',
    operationName: '压力通道20mA标定',
    cmdType: '06',                         // afn 的命令类型
    cmdCode: 'pressureChannelCalibrated20mA',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['pressureChannelCalibrated20mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['pressureChannelCalibrated20mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.pressureChannelCalibrated20mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.pressureChannelCalibrated20mA,
  }, type, 'MODBUS')
  if (pressureChannelCalibrated20mAResult) {
    return true
  }

  //设备输出12mA
  let deviceOutputs12mAResult2 = await serialPortOperation(context, {
    actionType: 'deviceOutputs12mA',
    operationName: '设备输出12mA',
    cmdType: '01',                         // afn 的命令类型
    cmdCode: 'output-12mA',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['deviceOutputs12mA'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['deviceOutputs12mA'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.deviceOutputs12mA(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.deviceOutputs12mA,
  }, type, 'MODBUS')
  if (deviceOutputs12mAResult2) {
    return true
  }
  context.createLeftSpanMessage('等待30s，确保设备输出稳定', 'grey');
  console.log('等待30s，确保设备输出稳定');
  await new Promise(x => setTimeout(x, 30000));
  //读压力电流表
  let readPressureCurrent3Result = await serialPortOperation(context, {
    actionType: 'readPressureCurrent',
    operationName: '读压力电流表',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'readPressureCurrent',               // fn 的命令码
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readPressureCurrent'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readPressureCurrent'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readPressureCurrent(context, context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readPressureCurrent,
  }, type, 'MODBUS')
  if (readPressureCurrent3Result) {
    return true
  }

  //压力电流表对比12mA误差小于0.03ma
  let readCurrent12MeterValue2 = context.readCurrentPressureMeterValue
  if (Math.abs(readCurrent12MeterValue2 - 12) <= 0.03) {
    context.createLeftSpanMessage(`双通道标定成功,电流表读数:${readCurrent12MeterValue2}mA`, 'green');
    return false
  } else {
    context.createLeftSpanMessage(`双通道标定失败，电流表读数:${readCurrent12MeterValue2}mA，误差超出0.03mA`, 'red');
    return true
  }

}
