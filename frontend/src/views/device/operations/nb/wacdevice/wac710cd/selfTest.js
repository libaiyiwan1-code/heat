import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";

export const selfTest = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let inquireFail = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['inquireSelfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['inquireSelfTest'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.inquireSelfTest(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
  }, type)
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  let writeTorqueConfigResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '写扭矩配置',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '82',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeTorqueConfig'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeTorqueConfig'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeTorqueConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeTorqueConfig,
  }, type)
  if (writeTorqueConfigResult) {
    await playErrorAudio(context)
    return true
  }
  let writeTemperatureProbesConfigResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '写温度探头配置',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeTemperatureProbesConfig'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeTemperatureProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeTemperatureProbesConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeTemperatureProbesConfig,
  }, type)
  if (writeTemperatureProbesConfigResult) {
    await playErrorAudio(context)
    return true
  }

  let writePressureProbesConfigResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '写压力探头配置',
    cmdType: 'ac',                         // afn 的命令类型
    cmdCode: '90',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writePressureProbesConfig'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writePressureProbesConfig'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writePressureProbesConfig(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writePressureProbesConfig,
  }, type)
  if (writePressureProbesConfigResult) {
    await playErrorAudio(context)
    return true
  }
  if (context.configForm.pressureProbes === '压差') {
    //打开设备电源
    let openPowerFail = await serialPortOperation(context, {
      actionType: 'openPower',
      operationName: '开电源',
      cmdType: 'bb',                         // afn 的命令类型
      cmdCode: 'cc-calibrated-turn-on-power',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocol.deviceActionResponseMessageLength['openPower'],
      expectedLength2: protocol.deviceActionResponseMessageLength2['openPower'],
      timeout: 6000,
      validateResponse: () => protocol.validateResponse.openPower(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocol.isInfraredDevice,
      isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.openPower,
    }, type)
    if (openPowerFail) {
      await playErrorAudio(context)
      return true
    }

    if (context.configDetail.currentSource === '无') {
      // 通过信号源串口发送  产生4mA电流
      let signalSource4mAResult = await serialPortOperation(context, {
        actionType: '',
        operationName: '4mA负载通信',
        cmdType: '00',                         // afn 的命令类型
        cmdCode: '41-4-mA-load',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['generate4mACurrent'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['generate4mACurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.generate4mACurrent(context.receivedData.globalReceivedSignalSourceData),
        preprocess: () => {
        },
        isInfraredDevice: false,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.generate4mACurrent,
      }, 'three')
      if (signalSource4mAResult) {
        await playErrorAudio(context)
        return true
      }
      //等待2s
      await new Promise(resolve => setTimeout(resolve, 2000));


      //标定4mA下限
      let lowerLimitOf4mACalibratedResult = await serialPortOperation(context, {
        actionType: 'lowerLimitOf4mACalibrated',
        operationName: '压差4mA下限标定',
        cmdType: 'bb',                         // afn 的命令类型
        cmdCode: 'cc-calibrated-at-4mA',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['lowerLimitOf4mACalibrated'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['lowerLimitOf4mACalibrated'],
        timeout: 7000,
        validateResponse: () => protocol.validateResponse.lowerLimitOf4mACalibrated(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.lowerLimitOf4mACalibrated,
      }, type)
      if (lowerLimitOf4mACalibratedResult) {
        await playErrorAudio(context)
        return true
      }
      context.createLeftSpanMessage('压差下限标定成功', 'grey');

      //等待2s
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 通过信号源串口发送  产生20mA电流
      let signalSource20mAResult = await serialPortOperation(context, {
        actionType: 'generate20mACurrent',
        operationName: '20mA负载通信',
        cmdType: '00',                         // afn 的命令类型
        cmdCode: '41-20-mA-load',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['generate20mACurrent'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['generate20mACurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.generate20mACurrent(context.receivedData.globalReceivedSignalSourceData),
        preprocess: () => {
        },
        isInfraredDevice: false,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.generate20mACurrent,
      }, 'three')
      if (signalSource20mAResult) {
        await playErrorAudio(context)
        return true
      }
      //等待2s
      await new Promise(resolve => setTimeout(resolve, 2000));

      //标定20mA标定上限
      let upperLimitOf20mACalibratedResult = await serialPortOperation(context, {
        actionType: 'lowerLimitOf4mACalibrated',
        operationName: '压差20mA上限标定',
        cmdType: 'bb',                         // afn 的命令类型
        cmdCode: 'cc-calibrated-at-20mA',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['upperLimitOf20mACalibrated'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['upperLimitOf20mACalibrated'],
        timeout: 7000,
        validateResponse: () => protocol.validateResponse.upperLimitOf20mACalibrated(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.upperLimitOf20mACalibrated,
      }, type)
      if (upperLimitOf20mACalibratedResult) {
        await playErrorAudio(context)
        return true
      }
      context.createLeftSpanMessage('压差下限标定成功', 'grey');
    } else if (context.configDetail.currentSource === '有') {
      // 通过信号源串口发送  产生4mA电流
      let signalSource4mAResult = await serialPortOperation(context, {
        actionType: '',
        operationName: '4mA负载通信',
        cmdType: '00',                         // afn 的命令类型
        cmdCode: '41-4-mA-load',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['generate4mACurrent'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['generate4mACurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.generate4mACurrent(context.receivedData.globalReceivedSignalSourceData),
        preprocess: () => {
        },
        isInfraredDevice: false,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.generate4mACurrent,
      }, 'three')
      if (signalSource4mAResult) {
        await playErrorAudio(context)
        return true
      }
      //等待5s
      await new Promise(resolve => setTimeout(resolve, 5000));

      //读电流
      let readCurrentResult = await serialPortOperation(context, {
        actionType: 'readCurrent',
        operationName: '读电流源电流',
        cmdType: '-',                         // afn 的命令类型
        cmdCode: '-',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['readCurrent'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['readCurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.readCurrent(context.receivedData.globalReceivedCurrentSourceData, context),
        preprocess: () => {
        },
        isInfraredDevice: false,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readCurrent,
      }, 'four')
      if (readCurrentResult) {
        await playErrorAudio(context)
        return true
      }
      //判断是否和4mA在死区差值内
      // 计算死区上下限
      const lowerBound = 4 - context.configDetail.sig_cs_err;
      const upperBound = 4 + context.configDetail.sig_cs_err;
      // 判断是否在死区内
      if (context.readCurrent < lowerBound || context.readCurrent > upperBound) {
        context.createLeftSpanMessage('电流源和信号源误差过大,电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:4mA' + ',误差:' + Number(context.readCurrent - 4).toFixed(4), 'red');
        await playErrorAudio(context)
        return true;
      }
      context.createLeftSpanMessage('电流源和信号源误差正常,电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:4mA' + '误差:' + Number(context.readCurrent - 4).toFixed(4), 'grey');

      //标定自定义下限
      let lowerLimitOf4mACalibratedResult = await serialPortOperation(context, {
        actionType: 'lowerLimitOf4mACalibrated',
        operationName: '读电流源压差下限标定',
        cmdType: 'bb',                         // afn 的命令类型
        cmdCode: 'cc-calibrated-at-customize-lower',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['lowerLimitOf4mACalibrated'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['lowerLimitOf4mACalibrated'],
        timeout: 7000,
        validateResponse: () => protocol.validateResponse.lowerLimitOf4mACalibrated(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.lowerLimitOf4mACalibrated,
      }, type)
      if (lowerLimitOf4mACalibratedResult) {
        await playErrorAudio(context)
        return true
      }
      context.createLeftSpanMessage('压差下限标定成功', 'grey');

      // 通过信号源串口发送  产生20mA电流
      let signalSource20mAResult = await serialPortOperation(context, {
        actionType: 'generate20mACurrent',
        operationName: '20mA负载通信',
        cmdType: '00',                         // afn 的命令类型
        cmdCode: '41-20-mA-load',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['generate20mACurrent'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['generate20mACurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.generate20mACurrent(context.receivedData.globalReceivedSignalSourceData),
        preprocess: () => {
        },
        isInfraredDevice: false,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.generate20mACurrent,
      }, 'three')
      if (signalSource20mAResult) {
        await playErrorAudio(context)
        return true
      }
      //等待5s
      await new Promise(resolve => setTimeout(resolve, 5000));

      //读电流
      let readCurrent20Result = await serialPortOperation(context, {
        actionType: 'readCurrent',
        operationName: '读电流源电流',
        cmdType: '-',                         // afn 的命令类型
        cmdCode: '-',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['readCurrent'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['readCurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.readCurrent(context.receivedData.globalReceivedCurrentSourceData, context),
        preprocess: () => {
        },
        isInfraredDevice: false,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readCurrent,
      }, 'four')
      if (readCurrent20Result) {
        await playErrorAudio(context)
        return true
      }
      //判断是否和4mA在死区差值内
      // 计算死区上下限
      const lower20Bound = 20 - context.configDetail.sig_cs_err;
      const upper20Bound = 20 + context.configDetail.sig_cs_err;
      // 判断是否在死区内
      if (context.readCurrent < lower20Bound || context.readCurrent > upper20Bound) {
        context.createLeftSpanMessage('电流源和信号源误差过大,电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:20mA' + ',误差:' + Number(context.readCurrent - 20).toFixed(4), 'red');
        await playErrorAudio(context)
        return true;
      }
      context.createLeftSpanMessage('电流源和信号源误差正常,电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:20mA' + ',误差:' + Number(context.readCurrent - 20).toFixed(4), 'grey');
      //标定20mA标定上限
      let upperLimitOf20mACalibratedResult = await serialPortOperation(context, {
        actionType: 'lowerLimitOf4mACalibrated',
        operationName: '读电流源压差上限标定',
        cmdType: 'bb',                         // afn 的命令类型
        cmdCode: 'cc-calibrated-at-customize-upper',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['upperLimitOf20mACalibrated'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['upperLimitOf20mACalibrated'],
        timeout: 7000,
        validateResponse: () => protocol.validateResponse.upperLimitOf20mACalibrated(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.upperLimitOf20mACalibrated,
      }, type)
      if (upperLimitOf20mACalibratedResult) {
        await playErrorAudio(context)
        return true
      }
      context.createLeftSpanMessage('压差下限标定成功', 'grey');


    }

  }
  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f3',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['selfTest'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.selfTest,
  }, type)
  return false
}
