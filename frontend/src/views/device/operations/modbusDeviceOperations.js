import {checkPort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {doCurrent4To20mADemarcateAEC100} from "@/views/device/operations/nb/collector/aec100/4-20mACalibration";
import {doZeroMpaDemarcatePTC100420MA} from "@/views/device/operations/modbus/ptc100-4-20ma/zeroMpaDemarcate";
import {
  doOnePointSixMpaDemarcatePTC100420MA
} from "@/views/device/operations/modbus/ptc100-4-20ma/onePointSixMpaDemarcate";
import {doDeviceInspectionPTC100420MA} from "@/views/device/operations/modbus/ptc100-4-20ma/deviceInspection";
import {
  dosSingleChannelCalibrationPTC100420MA
} from "@/views/device/operations/modbus/ptc100-4-20ma/singleChannelCalibration";
import {
  dosDoubleChannelCalibrationPTC100420MA
} from "@/views/device/operations/modbus/ptc100-4-20ma/doubleChannelCalibration";
import * as CPT100 from './nb/otherdevice/cpt100'
import * as BDC100 from './nb/otherdevice/bdc100'
import * as PTC100_CAT1 from './modbus/ptc100-cat1'
import {
  onePointSixMpaDemarcate,
  zeroMpaDemarcate
} from "@/views/device/operations/modbus/ptc100-cat1/pressureCalibration";
import {nbDeviceRegister} from "@/utils/serviceUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";


const Log = require('ee-core/log');


export const doZeroMpaDemarcate = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  //ptc100-cat1 只用UTM串口通讯即可
  if (context.configForm.produceModel !== 'PTC100-CAT1') {
    if (!checkPort(context, 'voltmeter')) {
      await playErrorAudio(context);
      return;
    }
  }

  const executeFunctionList = {
    'PTC100-4-20MA': doZeroMpaDemarcatePTC100420MA,
    // 'PTC100-RS485': doZeroMpaDemarcatePTC100RS485,
    'PTC100-CAT1': PTC100_CAT1.zeroMpaDemarcate,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '0MPa标定失败'
    setTimeout(() => {
      context.buttonWaiting('zeroMpaDemarcate');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `0MPa标定成功`;
  context.buttonSuccess('zeroMpaDemarcate');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('zeroMpaDemarcate');
  }, 2000);

  await playSuccessAudio(context);
};
export const doOnePointSixMpaDemarcate = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (context.configForm.produceModel !== 'PTC100-CAT1') {
    if (!checkPort(context, 'voltmeter')) {
      await playErrorAudio(context);
      return;
    }
  }
  const executeFunctionList = {
    'PTC100-4-20MA': doOnePointSixMpaDemarcatePTC100420MA,
    // 'PTC100-RS485': doOnePointSixMpaDemarcatePTC100RS485,
    'PTC100-CAT1': PTC100_CAT1.onePointSixMpaDemarcate,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '1.6MPa标定失败'
    setTimeout(() => {
      context.buttonWaiting('onePointSixMpaDemarcate');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `1.6MPa标定成功`;
  context.buttonSuccess('onePointSixMpaDemarcate');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('onePointSixMpaDemarcate');
  }, 2000);

  await playSuccessAudio(context);
};
export const doDeviceInspection = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (context.configForm.produceModel !== 'PTC100-CAT1') {
    if (!checkPort(context, 'voltmeter')) {
      await playErrorAudio(context);
      return;
    }
  }
  const executeFunctionList = {
    'PTC100-4-20MA': doDeviceInspectionPTC100420MA,
    // 'PTC100-RS485': doDeviceInspectionPTC100RS485,
    'PTC100-CAT1': PTC100_CAT1.pressureTest,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '检验电压失败'
    setTimeout(() => {
      context.buttonWaiting('deviceInspection');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `检验电压成功`;
  context.buttonSuccess('deviceInspection');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('deviceInspection');
  }, 2000);

  await playSuccessAudio(context);
};


export const doPowerInspection = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'CPT100': CPT100.verify,
    'CPT100-10A': CPT100.verify,
    'BDC100&C17': BDC100.verify,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, protocolId, type)) {
    context.leftWorkPrompt = '检验电压失败'
    context.buttonError('powerInspection')
    await playErrorAudio(context);
    setTimeout(() => {
      context.buttonWaiting('powerInspection');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `检验电压成功`;
  context.buttonSuccess('powerInspection');
  context.buttonEnable()
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('powerInspection');
  }, 2000);

  await playSuccessAudio(context);
};


export const doPowerCalibration = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'BDC100&C17': BDC100.calibration,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, protocolId, type)) {
    context.leftWorkPrompt = '校准电压失败'
    context.buttonError('powerCalibration')
    await playErrorAudio(context);
    setTimeout(() => {
      context.buttonWaiting('powerCalibration');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `校准电压成功`;
  context.buttonSuccess('powerCalibration');
  context.buttonEnable()
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('powerCalibration');
  }, 2000);

  await playSuccessAudio(context);
};

export const doReadTemperature = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }

  const executeFunctionList = {
    'PTC100-RS485': doReadSelfTestStatusPTC100RS485,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '读温度成功'
    setTimeout(() => {
      context.buttonWaiting('readSelfTestStatus');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `读温度失败`;
  context.buttonSuccess('readSelfTestStatus');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('readSelfTestStatus');
  }, 2000);

  await playSuccessAudio(context);
};
export const doSingleChannelCalibration = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }


  const executeFunctionList = {
    'PTC100-4-20MA': dosSingleChannelCalibrationPTC100420MA,
    'DPC100-4/20mA': dosSingleChannelCalibrationPTC100420MA,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '单通道标定失败'
    setTimeout(() => {
      context.buttonWaiting('singleChannelCalibration');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `单通道标定成功`;
  context.buttonSuccess('singleChannelCalibration');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('singleChannelCalibration');
  }, 2000);

  await playSuccessAudio(context);
};
export const doDoubleChannelCalibration = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }


  const executeFunctionList = {
    'PTC100-4-20MA': dosDoubleChannelCalibrationPTC100420MA,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '双通道标定失败'
    setTimeout(() => {
      context.buttonWaiting('doubleChannelCalibration');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `双通道标定成功`;
  context.buttonSuccess('doubleChannelCalibration');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('doubleChannelCalibration');
  }, 2000);

  await playSuccessAudio(context);
};
export const doCurrent4To20mADemarcate = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const selfTestStrategies = {
    'AEC100': doCurrent4To20mADemarcateAEC100
  };
  const produceModel = context.configForm.produceModel;
  const selfTestFunction = selfTestStrategies[produceModel];
  if (selfTestFunction && await selfTestFunction(context, protocolId, type)) {
    context.leftWorkPrompt = '4-20Ma标定失败'
    setTimeout(() => {
      context.buttonWaiting('calibration4to20mA');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `4-20Ma标定成功`;
  context.buttonSuccess('calibration4to20mA');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('calibration4to20mA');
  }, 2000);

  await playSuccessAudio(context);
};

export const doModbusSelfTest = async (context, type, protocolId) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const selfTestStrategies = {
    'PTC100-CAT1': PTC100_CAT1.selfTest,

  };
  const produceModel = context.configForm.produceModel;
  const selfTestFunction = selfTestStrategies[produceModel];
  if (selfTestFunction && await selfTestFunction(context, protocolId, type)) {
    context.leftWorkPrompt = '自检开启失败'
    setTimeout(() => {
      context.buttonWaiting('selfTest');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `自检开启成功`;
  context.buttonSuccess('selfTest');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('selfTest');
  }, 2000);

  await playSuccessAudio(context);
};


export const doModbusWriteAddress = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const writeAddressStrategies = {
    'PTC100-CAT1': PTC100_CAT1.writeAddress,

  };
  const produceModel = context.configForm.produceModel;
  const writeAddressFunction = writeAddressStrategies[produceModel];
  if (writeAddressFunction && await writeAddressFunction(context, protocolId, type)) {
    context.buttonError('writeAddress')
    context.buttonEnable()
    setTimeout(() => {
      context.buttonWaiting('writeAddress');
    }, 2000);
    return;
  }
  if (context.configDetail.printLabel === 'PTC100-CAT1') {
    let notPass = false
    notPass = await nbDeviceRegister(context, type, notPass,context.configDetail.printLabel)
    if (notPass) {
      context.leftWorkPrompt = `地址写入失败`;
      await playErrorAudio(context)
      context.buttonError('writeAddress')
      setTimeout(() => {
        context.buttonWaiting('writeAddress');
      }, 2000);
      context.leftBadProductQuantity += 1
    } else {
      context.leftWorkPrompt = `地址写入成功`;
      await playSuccessAudio(context)
      context.buttonSuccess('writeAddress')
      setTimeout(() => {
        context.buttonWaiting('writeAddress');
      }, 2000);
      context.leftGoodProductQuantity += 1
    }

  }

};


export const doModbusExitSelfTest = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const returnSelfTestStrategies = {
    'PTC100-CAT1': PTC100_CAT1.exitSelfTest,

  };
  const produceModel = context.configForm.produceModel;
  const returnSelfTestFunction = returnSelfTestStrategies[produceModel];
  if (returnSelfTestFunction && await returnSelfTestFunction(context, protocolId, type)) {
    setTimeout(() => {
      context.buttonWaiting('breakSelfTest');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `退出自检成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('breakSelfTest')
  setTimeout(() => {
    context.buttonWaiting('breakSelfTest');
  }, 2000);

}


export const doModbusPrintLabel = async (context, flag, protocolId, type) => {

  let printAddress
  let printNotPass = true
  if (flag) {
    //写地址成功
    printAddress = context.leftGenerateAddress
    printNotPass = false
  } else {
    context.messageClean()
    //手动打印，需要读地址
    if (!checkPort(context, type)) {
      await playErrorAudio(context)
      return
    }
    if (context.configForm.produceModel === 'PTC100-CAT1'
    ) {
      const {configForm, maxRetries, receivedData} = context;
      const produceModel = configForm.produceModel;
      const protocolConfig = protocolIDMap[produceModel];

      const readAddressActionConfig = {
        actionType: 'readAddress',
        operationName: '读地址',
        cmdType: '05',
        cmdCode: '06',
        protocolId: protocolId,
        maxRetries: maxRetries,
        expectedLength: protocolConfig.deviceActionResponseMessageLength['readAddress'],
        expectedLength2: protocolConfig.deviceActionResponseMessageLength2['readAddress'],
        timeout: 4000,
        validateResponse: () => protocolConfig.validateResponse.readAddress(context, receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolConfig.isInfraredDevice,
        isTransparentTransmissionProtocol: protocolConfig.isDeviceActionTransparentTransmissionProtocol.readAddress,
        uplinkCommunicationTarget: {
          baudRate: 2400,
          checkDigit: '偶校验',
          method: 'INFRARED',
          includeUTM100Device: true
        }
      };
      const result = await serialPortOperation(
        context,
        readAddressActionConfig,
        type,
        'UTM100-NB'
      );

      if (result) {
        await playErrorAudio(context);
        return true;
      }
      printAddress = context.leftReadAddress
      printNotPass = result
    }
  }
  if (printNotPass) {
    await playErrorAudio(context)
    return
  }
  console.log('触发打印 , 当前打印机:', context.defaultDeviceName)
  Log.info('触发打印 , 当前打印机:', context.defaultDeviceName)
  console.log('打印型号：', context.configForm.produceModel)
  const params = {
    deviceName: context.defaultDeviceName,
    address: printAddress,
    model: context.configDetail.customizePrintLabel,
    configModel: context.configDetail.printLabel,
    listDoubleRowLabels: context.listDoubleRowLabels,
    width: context.configDetail.labelWith,
    margin: context.configDetail.labelMargin,
    marginLeft: context.configDetail.lableMarginLeft,
    secondColumnFontSize: context.configDetail.secondColumnFontSize,
    height: context.configDetail.labelHeight,
    isDouble: context.configDetail.whetherDoubleRowPrinting === '是',
    netprovider: context.netprovider,//1电信  2移动

  };
  if (context.configForm.produceModel === 'PTC100-CAT1') {
    await ipc.send(ipcApiRoute.doPrintTest, params)
  }
  context.buttonSuccess('labelPrint')
  context.createLeftSpanMessage('打印成功，设备地址:' + printAddress, 'grey');
  context.buttonSuccess('leftWorkPromptColor')
  await playSuccessAudio(context)
  context.leftWorkPrompt = '打印成功'
  setTimeout(() => {
    context.buttonWaiting('labelPrint')
  }, 2000);
}
