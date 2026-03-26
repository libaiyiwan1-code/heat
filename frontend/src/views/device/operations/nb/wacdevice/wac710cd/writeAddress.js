import {badRecordUpload, serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {checkIMEIByTerminal, generateAddressByNB} from "@/utils/serviceUtils";

export async function writeAddress(protocolId, type, context) {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
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
      expectedLength2: protocol.deviceActionResponseMessageLength2['v'],
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
    //等待6s
    await new Promise(x => setTimeout(x, 6000));
    if (context.configDetail.currentSource === '无') {
      // 通过信号源串口发送  产生10mA电流
      let signalSource10mAResult = await serialPortOperation(context, {
        actionType: 'generate10mACurrent',
        operationName: '10mA负载通信',
        cmdType: '00',                         // afn 的命令类型
        cmdCode: '41-10-mA-load',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['generate10mACurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.generate10mACurrent(context.receivedData.globalReceivedSignalSourceData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.generate10mACurrent,
      }, 'three')
      if (signalSource10mAResult) {
        await playErrorAudio(context)
        return true
      }
      //等待2s
      await new Promise(resolve => setTimeout(resolve, 2000));
      let readDataResult = await serialPortOperation(context, {
        actionType: 'readData',
        operationName: '读数据',
        cmdType: '90',                         // afn 的命令类型
        cmdCode: '20',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['readData'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['readData'],
        timeout: 6500,
        validateResponse: () => protocol.validateResponse.readData(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readData,
      }, type)
      if (readDataResult) {
        await playErrorAudio(context)
        return true
      }
      if (!(context.readDifferentialPressure >= 10 - context.configDetail.sig_device_err &&
        context.readDifferentialPressure <= 10 + context.configDetail.sig_device_err)) {
        await badRecordUpload(context,'压差误差过大','设备电流:' + Number(context.readDifferentialPressure).toFixed(4) + '误差:' + (context.readDifferentialPressure - 10).toFixed(4), 'grey','writeAddress')
        await context.uploadMes(context,0,'压差误差过大,设备电流:' + Number(context.readDifferentialPressure).toFixed(4) + '误差:' + (context.readDifferentialPressure - 10).toFixed(4))
        await playErrorAudio(context)
        context.leftBadProductQuantity += 1
        return true
      }
      context.createLeftSpanMessage('压差精度检测正常,设备电流:' + Number(context.readDifferentialPressure).toFixed(4) + '误差:' + (context.readDifferentialPressure - 10).toFixed(4), 'grey')

    } else if (context.configDetail.currentSource === '有') {
      // 通过信号源串口发送  产生10mA电流
      let signalSource10mAResult = await serialPortOperation(context, {
        actionType: 'generate10mACurrent',
        operationName: '10mA负载通信',
        cmdType: '00',                         // afn 的命令类型
        cmdCode: '41-10-mA-load',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['generate10mACurrent'],
        timeout: context.timeout,
        validateResponse: () => protocol.validateResponse.generate10mACurrent(context.receivedData.globalReceivedSignalSourceData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.generate10mACurrent,
      }, 'three')
      if (signalSource10mAResult) {
        await playErrorAudio(context)
        return true
      }
      // 等待2s
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      const lowerBound = 10 - context.sig_cs_err;
      const upperBound = 10 + context.sig_cs_err;
      // 判断是否在死区内
      if (context.readCurrent < lowerBound || context.readCurrent > upperBound) {
        await badRecordUpload(context,'电流源和信号源误差过大','电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:10mA' + '实际误差:' + Number(context.readCurrent - 10).toFixed(4) + 'mA','writeAddress');
        await context.uploadMes(context.leftGenerateAddress, 0, '电流源和信号源误差过大,电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:10mA' + '实际误差:' + Number(context.readCurrent - 10).toFixed(4))
        await playErrorAudio(context)
        context.leftBadProductQuantity += 1
        return true;
      }
      context.createLeftSpanMessage('电流源和信号源误差正常,电流源电流:' + Number(context.readCurrent).toFixed(4) + ',信号源电流:10mA' + '实际误差:' + Number(context.readCurrent - 10).toFixed(4) + 'mA', 'grey');
      context.createLeftSpanMessage('电流源电流:' + Number(context.readCurrent).toFixed(4), 'grey');


      let readDataResult = await serialPortOperation(context, {
        actionType: 'readData',
        operationName: '读数据',
        cmdType: '90',                         // afn 的命令类型
        cmdCode: '20',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['readData'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['readData'],
        timeout: 6500,
        validateResponse: () => protocol.validateResponse.readData(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readData,
      }, type)
      if (readDataResult) {
        await playErrorAudio(context)
        return true
      }

      //读电流
      let readCurrentResult2 = await serialPortOperation(context, {
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
      if (readCurrentResult2) {
        await playErrorAudio(context)
        return true
      }

      // 计算设备和电流源的误差（绝对值）
      const error = Math.abs(context.readCurrent - context.readDifferentialPressure);
      const deadZone = context.cs_device_err;

      // 判断误差是否大于死区值
      if (error > deadZone) {
        await badRecordUpload(context,
          `设备和电流源误差过大`,
          `电流源电流: ${Number(context.readCurrent).toFixed(4)}mA, 设备电流: ${Number(context.readDifferentialPressure).toFixed(4)}mA, 误差: ${error.toFixed(4)}mA (超过死区 ${deadZone}mA)`,'writeAddress'

        );
        await context.uploadMes(context.leftGenerateAddress, 0, `设备和电流源误差过大，电流源电流: ${Number(context.readCurrent).toFixed(4)}mA, 设备电流: ${Number(context.readDifferentialPressure).toFixed(4)}mA, 误差: ${error.toFixed(4)}mA (超过死区 ${deadZone}mA)`)
        await playErrorAudio(context)
        context.leftBadProductQuantity += 1
        return true;
      }

      context.createLeftSpanMessage(`设备和电流源误差正常，电流源电流: ${Number(context.readCurrent).toFixed(4)}mA, 设备电流: ${Number(context.readDifferentialPressure).toFixed(4)}mA, 误差: ${error.toFixed(4)}mA`,
        'grey'
      )


    }


  }

  //进回温验证
  //回温探头
  //等待2s 读取压差
  // await new Promise(resolve => setTimeout(resolve, 2000));
  let readDataResult = await serialPortOperation(context, {
    actionType: 'readData',
    operationName: '读数据',
    cmdType: '90',                         // afn 的命令类型
    cmdCode: '20',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readData'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readData'],
    timeout: 6500,
    validateResponse: () => protocol.validateResponse.readData(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readData,
  }, type)
  if (readDataResult) {
    await playErrorAudio(context)
    return true
  }


  console.warn('温度探头：', context.configDetail.temperatureProbe)
  console.warn('温度误差：', context.configDetail.temperatureDiff)
  console.warn('回温：', context.readOutTemperature)
  console.warn('进温：', context.readInTemperature)
  if (context.configDetail.temperatureProbe === '回温探头') {
    if (!(context.readOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'回温温度误差过大' , + context.readOutTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readOutTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('回温验证成功:' + context.readOutTemperature, 'grey')

  } else if (context.configDetail.temperatureProbe === '进温探头') {
    //进温探头
    if (!(context.readInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'进温温度误差过大' , + context.readInTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readInTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('进温验证成功:' + context.readInTemperature, 'grey')

  } else if (context.configDetail.temperatureProbe === '双探头') {
    //双探头
    if (!(context.readOutTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readOutTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'回温温度误差过大' , + context.readOutTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '回温温度误差过大:' + context.readOutTemperature)
      await playErrorAudio(context)
      context.leftBadProductQuantity += 1
      return true
    }
    context.createLeftSpanMessage('回温验证成功:' + context.readOutTemperature, 'grey')
    if (!(context.readInTemperature >= context.configDetail.temperature - context.configDetail.temperatureDiff &&
      context.readInTemperature <= context.configDetail.temperature + context.configDetail.temperatureDiff)) {
      await badRecordUpload(context,'进温温度误差过大' , + context.readInTemperature, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '进温温度误差过大:' + context.readInTemperature)
      context.leftBadProductQuantity += 1
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('进温验证成功:' + context.readInTemperature, 'grey')
  }
  let notPass = await generateAddressByNB(context)
  if (notPass) {
    await playErrorAudio(context)
    return true
  }
  let readSelfTestStatusResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读自检状态）',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: 'de',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readSelfTestStatus'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
  }, type)
  if (readSelfTestStatusResult) {
    await playErrorAudio(context)
    return true
  }
  if (context.version.toString() !== context.configDetail.version.toString()) {
    await badRecordUpload(context,'版本号不一致' ,  '设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'writeAddress')
    await context.uploadMes(context.leftGenerateAddress, 0, '版本号不一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version)
    context.leftBadProductQuantity += 1
    await playErrorAudio(context)
    return true
  } else {
    context.createLeftSpanMessage('版本号一致,设备版本号:' + context.version + '配置版本号：' + context.configDetail.version, 'grey')
  }
  let readIMEIResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读IEMI）',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '0b',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readIMEI'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readIMEI'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readIMEI(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readIMEI,
  }, type)
  if (readIMEIResult) {
    await playErrorAudio(context)
    return true
  }
  //校验imei
  if (await checkIMEIByTerminal(context)) {
    await playErrorAudio(context)
    return true
  }

  let readICCIDResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读ICCID）',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '08',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readICCID'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readICCID'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readICCID(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readICCID,
  }, type)
  if (readICCIDResult) {
    await playErrorAudio(context)
    return true
  }
  let readTorqueConfigResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读扭矩配置）',
    cmdType: 'ab',                         // afn 的命令类型
    cmdCode: '82',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readTorqueConfig'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readTorqueConfig'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readTorqueConfig(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readTorqueConfig,
  }, type)
  if (readTorqueConfigResult) {
    await playErrorAudio(context)
    return true
  }
  if (context.torqueStr !== context.configDetail.torques) {
    await badRecordUpload(context, '写扭矩配置不一致', '设备扭矩：' + context.torqueStr + '配置扭矩：' + context.configDetail.torques, 'writeAddress')
    await context.uploadMes(context.context.leftGenerateAddress,0,'设备扭矩：' + context.torqueStr + '配置扭矩：' + context.configDetail.torques)
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return true
  } else {
    context.createLeftSpanMessage('扭矩配置一致,设备扭矩：' + context.torqueStr + '配置扭矩：' + context.configDetail.torques, 'grey');
  }
  let readTemperatureProbesResult = await serialPortOperation(context, {
    actionType: 'readTemperatureProbes',
    operationName: '读温度探头配置',
    cmdType: 'ab',                         // afn 的命令类型
    cmdCode: '09',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readTemperatureProbes'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readTemperatureProbes'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readTemperatureProbes(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readTemperatureProbes,
  }, type)
  if (readTemperatureProbesResult) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('读温度探头配置成功', 'grey');

  let readPressureProbesProbesResult = await serialPortOperation(context, {
    actionType: 'readPressureProbes',
    operationName: '读压力探头配置',
    cmdType: 'ab',                         // afn 的命令类型
    cmdCode: '90',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['readPressureProbes'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['readPressureProbes'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.readPressureProbes(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readPressureProbes,
  }, type)
  if (readPressureProbesProbesResult) {
    await playErrorAudio(context)
    return true
  }
  context.createLeftSpanMessage('读压力探头配置成功', 'grey');

  let writeAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（写地址）',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength['writeAddress'],
    expectedLength2: protocol.deviceActionResponseMessageLength2['writeAddress'],
    timeout: context.timeout,
    validateResponse: () => protocol.validateResponse.writeAddress(context.leftGenerateAddress, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.writeAddress,
  }, type)
  if (writeAddressResult) {
    await playErrorAudio(context)
    return true
  }
  return false

}
