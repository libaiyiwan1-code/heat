import {protocolIDMap} from "@/views/device/enum/enum";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const doDeviceInspectionPTC100RS485 = async (context, type) => {
  let readPressureResult = await serialPortOperation(context, {
    actionType: 'readPressureGaugePressure',
    operationName: '压力表-读压力',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'readPressureGaugePressure',               // fn 的命令码
    protocolId: null,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readPressureGaugePressure'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readPressureGaugePressure'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readPressureGaugePressure(context, context.receivedData.globalReceivedVoltageSourceData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readPressureGaugePressure,
  }, type,'UTM100-485-MODBUS')
  if (readPressureResult) {
    return true
  }

  //设备读压力解包有检验逻辑
  return await serialPortOperation(context, {
    actionType: 'readDevicePressure',
    operationName: '设备-读压力',
    cmdType: '04',                         // afn 的命令类型
    cmdCode: 'readDevicePressure',               // fn 的命令码
    protocolId: null,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readDevicePressure'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readDevicePressure'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readDevicePressure(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readDevicePressure,
  }, type, 'UTM100-CPT100-MODBUS');

}
