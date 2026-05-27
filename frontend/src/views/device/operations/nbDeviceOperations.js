import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {badRecordUpload, handleSuccess, serialPortOperation,} from "@/views/device/action/deviceAction";
import {checkPort} from "@/views/device/handler/portHandler";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {
  nbDeviceRegister,
  productionCardValveLibraryRegistration,
  productionCollectorLibraryRegistration,
  productionLORALibraryRegistration,
  productionNBLibraryRegistration,
  vacProduceDeviceRegister
} from "@/utils/serviceUtils";
import {checkRecentlyUploadedData} from "@/components/global/hemssdb";
import moment from "moment";
import * as WAC230CF from './nb/wacdevice/wac230cf'
import * as WAC100NY from './nb/wacdevice/wac100ny'
import * as WAC100N from './nb/wacdevice/wac100n'
import * as WAC400NS from './nb/wacdevice/wac400ns'
import * as WAC300NS from './nb/wacdevice/wac300ns'
import * as WAC710C from './nb/wacdevice/wac710c'
import * as VAC710 from './nb/wacdevice/vac710'
import * as WAC710N from './nb/wacdevice/wac710n'
import * as WAC730N from './nb/wacdevice/wac730n'
import * as WAC300LH from './nb/wacdevice/wac300lh'
import * as WAC330HE from './nb/wacdevice/wac330he'
import * as WAC730C from './nb/wacdevice/wac730c'
import * as WAC300CD from './nb/wacdevice/wac300cd'
import * as WAC710CD from './nb/wacdevice/wac710cd'
import * as WAC300NH from './nb/wacdevice/wac300nh'
import * as WAC400N from './nb/wacdevice/wac400n'
import * as WAC300NY from './nb/wacdevice/wac300ny'
import * as WAC300N from './nb/wacdevice/wac300n'
import * as WAC330N from './nb/wacdevice/wac330n'
import * as RFT200 from './nb/otherdevice/rft200'
import * as RFT200CAT1 from './nb/otherdevice/rft200-cat1'
import * as VAC710S from './nb/otherdevice/vac710s'
import * as CTW100 from './nb/otherdevice/ctw100'
import * as PTC100RS485 from './nb/otherdevice/ptc100-rs485'
import * as PTC100420MA from './nb/otherdevice/ptc100-4-20ma'
import * as NTR300C from './nb/otherdevice/ntr300c'
import * as VPT100 from './nb/otherdevice/vpt100'
import * as CPT100 from './nb/otherdevice/cpt100'
import * as CAT400S from './nb/otherdevice/cat400s'
import * as CAT200 from './nb/otherdevice/cat200'
import * as CAT400 from './nb/otherdevice/cat400'
import * as LPC210 from './nb/otherdevice/lpc210'
import * as LPC210E from './nb/otherdevice/lpc210'
import * as NTP100C from './nb/otherdevice/ntp100c'
import * as ET01 from './nb/otherdevice/ct1000'
import * as CT1000 from './nb/otherdevice/ct1000'
import * as VAC005C from './nb/cardvalvedevice/vac005c'
import * as AEC100 from './nb/collector/aec100'
import * as LPC230 from './nb/collector/lpc230'
import * as LPC230E from './nb/collector/lpc230'
import * as NBT400 from './nb/point/NBT400'
import * as WAC300C from './nb/wacdevice/WAC300C'
import * as NTR300 from './nb/point/ntr300'
import * as BEACONM from './nb/wacdevice/beaconm'
import {selfTest} from "./nb/wacdevice/wac330n";

const Log = require('ee-core/log');


export const doSelfTest = async (context, protocolId, type) => {
  console.log(protocolId,type)
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const selfTestStrategies = {
    'WAC710CD': WAC710CD.selfTest,
    'WAC230CF': WAC230CF.selfTest,
    'WAC300CD': WAC300CD.selfTest,
    'CT1000': CT1000.selfTest,
    'ET01': ET01.selfTest,
    'NTP100C': NTP100C.selfTest,
    'WAC300NH': WAC300NH.selfTest,
    'WAC300NY': WAC300NY.selfTest,
    'WAC330HE': WAC330HE.selfTest,
    'LPC230': LPC230.selfTest,
    'LPC230E': LPC230E.selfTest,
    'LPC210': LPC210.selfTest,
    'LPC210E': LPC210E.selfTest,
    'WAC730C': WAC730C.selfTest,
    'CAT400': CAT400.selfTest,
    'CAT200': CAT200.selfTest,
    'CAT400S': CAT400S.selfTest,
    'CPT100': CPT100.selfTest,
    'AEC100': AEC100.selfTest,
    'VPT100': VPT100.selfTest,
    'NTR300C': NTR300C.selfTest,
    'PTC100-4-20MA': PTC100420MA.selfTest,
    'PTC100-RS485': PTC100RS485.selfTest,
    'CPT100-10A': CPT100.selfTest,
    'CTW100': CTW100.selfTest,
    'WAC300LH': WAC300LH.selfTest,
    'WAC710C': WAC710C.selfTest,
    'WAC300NS': WAC300NS.selfTest,
    'WAC400NS': WAC400NS.selfTest,
    'VAC710S': VAC710S.selfTest,
    'VAC005C': VAC005C.selfTest,
    'RFT200-CAT1': RFT200CAT1.selfTest,
    'RFT200': RFT200.selfTest,
    'WAC100N': WAC100N.selfTest,
    'WAC100NY': WAC100NY.selfTest,
    'NBT400': NBT400.selfTest,
    'WAC300C': WAC300C.selfTest,
    'NTR300': NTR300.selfTest,
    'WAC300N': WAC300N.selfTest,
    'WAC330N': WAC330N.selfTest,
    'WAC400N': WAC400N.selfTest,
    'VAC710': VAC710.selfTest,
    'WAC710N': WAC710N.selfTest,
    'WAC730N': WAC730N.selfTest,
    'BeaconM': BEACONM.selfTest,
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

export async function doWriteAddress(context, protocolId, type) {
  context.messageClean()
  if (!checkPort(context, type)) {
    await playErrorAudio(context)
    return
  }
  if (context.configDetail.version === '' || context.configForm.version === '' || context.configForm.version === undefined || context.configDetail.version === undefined) {
    context.createLeftSpanMessage(`写地址前请先配置版本号`, 'red');
    return
  }

  const writeAddressStrategies = {
    'WAC710CD': WAC710CD.writeAddress,
    'WAC230CF': WAC230CF.writeAddress,
    'WAC300CD': WAC300CD.writeAddress,
    'CT1000': CT1000.writeAddress,
    'ET01': ET01.writeAddress,
    'NTP100C': NTP100C.writeAddress,
    'WAC300NH': WAC300NH.writeAddress,
    'WAC300NY': WAC300NY.writeAddress,
    'WAC330HE': WAC330HE.writeAddress,
    'LPC230': LPC230.writeAddress,
    'LPC230E': LPC230E.writeAddress,
    'LPC210': LPC210.writeAddress,
    'LPC210E': LPC210E.writeAddress,
    'WAC730C': WAC730C.writeAddress,
    'CAT400': CAT400.writeAddress,
    'CAT200': CAT200.writeAddress,
    'CAT400S': CAT400S.writeAddress,
    'CPT100': CPT100.writeAddress,
    'CPT100-10A': CPT100.writeAddress,
    'AEC100': AEC100.writeAddress,
    'VPT100': VPT100.writeAddress,
    'NTR300C': NTR300C.writeAddress,
    'CTW100': CTW100.writeAddress,
    'WAC300LH': WAC300LH.writeAddress,
    'WAC710C': WAC710C.writeAddress,
    'WAC300NS': WAC300NS.writeAddress,
    'WAC400NS': WAC400NS.writeAddress,
    'VAC710S': VAC710S.writeAddress,
    'VAC005C': VAC005C.writeAddress,
    'RFT200-CAT1': RFT200CAT1.writeAddress,
    'RFT200': RFT200.writeAddress,
    'WAC100N': WAC100N.writeAddress,
    'WAC100NY': WAC100NY.writeAddress,
    'NBT400': NBT400.writeAddress,
    'WAC300C': WAC300C.writeAddress,
    'NTR300': NTR300.writeAddress,
    'WAC300N': WAC300N.writeAddress,
    'WAC330N': WAC330N.writeAddress,
    'WAC400N': WAC400N.writeAddress,
    'VAC710': VAC710.writeAddress,
    'WAC710N': WAC710N.writeAddress,
    'WAC730N': WAC730N.writeAddress,
    'BeaconM': BEACONM.writeAddress,



  };
  const produceModel = context.configForm.produceModel;
  const writeAddressFunction = writeAddressStrategies[produceModel];
  if (writeAddressFunction && await writeAddressFunction(protocolId, type, context)) {
    context.buttonError('writeAddress')
    context.buttonEnable()
    setTimeout(() => {
      context.buttonWaiting('writeAddress');
    }, 2000);
    return;
  }

  if (context.configDetail.printLabel === 'WAC330HE') {
    // 表阀一体 区分联网方式 有线不注册平台、无线注册平台
    if (context.configDetail.communication === '有线') {
      await productionNBLibraryRegistration(context)
      context.leftWorkPrompt = `地址写入成功`;
      await playSuccessAudio(context)
      context.buttonSuccess('writeAddress')
      setTimeout(() => {
        context.buttonWaiting('writeAddress');
      }, 2000);
    } else {
      await productionNBLibraryRegistration(context)
      await nbDeviceRegister(context);
      context.leftWorkPrompt = `地址写入成功`;

      await playSuccessAudio(context)
      context.buttonSuccess('writeAddress')
      setTimeout(() => {
        context.buttonWaiting('writeAddress');
      }, 2000);
    }
    context.leftGoodProductQuantity += 1
  } else {
    let notPass = false
    const label = context.configDetail.printLabel;
    switch (label) {
      case 'VPT100':
        await vacProduceDeviceRegister(context);
        break;
      case 'VAC710':
        await productionNBLibraryRegistration(context)
        break;
      case 'WAC300LH':
        // LORA 入库
        await productionLORALibraryRegistration(context);
        break;
      case 'VAC005C':
        // 卡阀一体
        await productionCardValveLibraryRegistration(context);
        break;
      case 'LPC230':
      case 'LPC230E':
      case 'AEC100':
        // 采集器
        await productionCollectorLibraryRegistration(context);
        break;
      default:
        // NB 设备
        await nbDeviceRegister(context, type, notPass);
    }
    if (notPass) {
      context.leftWorkPrompt = `地址写入失败`;
      await playSuccessAudio(context)
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


}

export const doAwaken = async (context, protocolId, type) => {
  context.messageClean()
  if (!checkPort(context, type)) {
    await playErrorAudio(context)
    return
  }
  let result = await serialPortOperation(context, {
    actionType: 'awaken',
    operationName: '唤醒',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: 'fd',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['awaken'],
    expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['awaken'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.awaken(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.awaken,
  }, type)
  if (result) {
    await playErrorAudio(context)
    setTimeout(() => {
      context.buttonWaiting('awaken');
    }, 2000);

    return
  }
  context.leftWorkPrompt = `唤醒成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('awaken')
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('awaken');
  }, 2000);

}
export const doExitSelfTest = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const returnSelfTestStrategies = {
    'WAC710CD': WAC710CD.exitSelfTest,
    'WAC230CF': WAC230CF.exitSelfTest,
    'WAC300CD': WAC300CD.exitSelfTest,
    'CT1000': CT1000.exitSelfTest,
    'ET01': ET01.exitSelfTest,
    'NTP100C': NTP100C.exitSelfTest,
    'WAC300N': WAC300N.exitSelfTest,
    'WAC300NH': WAC300NH.exitSelfTest,
    'WAC300NY': WAC300NY.exitSelfTest,
    'WAC330HE': WAC330HE.exitSelfTest,
    'WAC730C': WAC730C.exitSelfTest,
    'CAT400': CAT400.exitSelfTest,
    'CAT200': CAT200.exitSelfTest,
    'CAT400S': CAT400S.exitSelfTest,
    'AEC100': AEC100.exitSelfTest,
    'NTR300C': NTR300C.exitSelfTest,
    'PTC100-4-20MA': PTC100420MA.exitSelfTest,
    'PTC100-RS485': PTC100RS485.exitSelfTest,
    'WAC300NS': WAC300NS.exitSelfTest,
    'NBT400': NBT400.exitSelfTest,
    'WAC300C': WAC300C.exitSelfTest,
    'NTR300': NTR300.exitSelfTest,
    'WAC330N': WAC330N.exitSelfTest,
    'WAC710C': WAC710C.exitSelfTest,
    'WAC400N': WAC400N.exitSelfTest,
    'VAC710': VAC710.exitSelfTest,
    'WAC710N': WAC710N.exitSelfTest,
    'WAC730N': WAC730N.exitSelfTest,
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

export async function doScanCodeVerification(context, protocolId, type) {
  console.log('聚焦0')
  if (!checkPort(context, type)) {
    context.leftGenerateAddress = ''
    return
  }
  context.buttonDisabled()
  context.leftGenerateAddress = ''
  console.log('聚焦0')
  const input = context.$refs.input1.$el;
  if (input) {
    console.log('聚焦');
    input.focus();
    input.select();

    // 自动检测（每秒检查是否达到 8 位）
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 每秒检测一次
      if (context.leftGenerateAddress.length === 8) {
        break;
      }
      // 手动输入检测（每 2 秒检查是否未达到 8 位，则清空）
      await new Promise(resolve => setTimeout(resolve, 1000)); // 再等 1 秒（总共 2 秒）
      if (context.leftGenerateAddress.length !== 8) {
        context.leftGenerateAddress = ''; // 清空输入
      }
    }

    let notPass = await checkAddress(context, protocolId, type)
    console.log('writeAddressnotPass:', notPass)
    if (notPass) {
      context.buttonEnable();
      await playErrorAudio(context)
      setTimeout(() => {
        context.buttonWaiting('scanCode');
      }, 2000);
      return notPass
    }

    context.createLeftSpanMessage('地址验证成功', 'grey')
    if (
      context.configDetail.printLabel === 'WAC300NS' || context.configDetail.printLabel === 'WAC400NS' ||
      context.configDetail.printLabel === 'VAC710S' || context.configDetail.printLabel === 'WAC300C' ||
      context.configDetail.printLabel === 'WAC710C' || context.configDetail.printLabel === 'VAC710'||
      context.configDetail.printLabel==='WAC710N'
    ) {
      let cmdCode = '20'
      if (context.configDetail.printLabel === 'WAC400N') {
        cmdCode = '1f'
      }
      const model = context.configForm.produceModel;
      const protocol = protocolIDMap[model];
      //进回温验证
      //回温探头
      //等待2s 读取压差
      // await new Promise(resolve => setTimeout(resolve, 2000));
      let readDataResult = await serialPortOperation(context, {
        actionType: 'readData',
        operationName: '读数据',
        cmdType: '90',                         // afn 的命令类型
        cmdCode: cmdCode,                         // fn 的命令码
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

      //验证温度以及温度探头
      let baseTemperature = 50
      console.log('选择的探头：', context.configDetail.temperatureProbe)
      console.log('回水温度：', context.readOutTemperature)
      console.log('进水温度：', context.readInTemperature)
      console.log('温度误差：', context.configDetail.temperatureDiff)
      //鉴定温度是否合格 、是否选错探头的情况
      if (context.configDetail.temperatureProbe === '回温探头') {
        if (Math.abs(baseTemperature - Number(context.readOutTemperature)) > context.configDetail.temperatureDiff) {
          context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  验证温度失败,回温:' + context.readOutTemperature, 'red');
          context.leftGenerateAddress = ''
          notPass = true
          context.buttonEnable();
          context.buttonError('scanCode')
          await playErrorAudio(context)
          setTimeout(() => {
            context.buttonWaiting('scanCode');
          }, 2000);
          return notPass
        }
        console.log(context.readInTemperature)
      } else if (context.configDetail.temperatureProbe === '进温探头') {
        if (Math.abs(baseTemperature - Number(context.readInTemperature)) > context.configDetail.temperatureDiff) {
          context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  验证温度失败,进温:' + context.readInTemperature, 'red');
          context.leftGenerateAddress = ''
          notPass = true
          context.buttonEnable();
          context.buttonError('scanCode')
          await playErrorAudio(context)
          setTimeout(() => {
            context.buttonWaiting('scanCode');
          }, 2000);
          return notPass
        }
      } else if (context.configDetail.temperatureProbe === '双探头') {
        if (Math.abs(baseTemperature - Number(context.readOutTemperature)) > context.configDetail.temperatureDiff) {
          context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  验证温度失败。,回温:' + context.readOutTemperature, 'red');
          context.leftGenerateAddress = ''
          notPass = true
          context.buttonEnable();
          context.buttonError('scanCode')
          await playErrorAudio(context)
          setTimeout(() => {
            context.buttonWaiting('scanCode');
          }, 2000);
          return notPass
        }
        if (Math.abs(baseTemperature - Number(context.readInTemperature)) > context.configDetail.temperatureDiff) {
          context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  验证温度失败,进温:' + context.readInTemperature, 'red');
          context.leftGenerateAddress = ''
          notPass = true
          context.buttonEnable();
          context.buttonError('scanCode')
          await playErrorAudio(context)
          setTimeout(() => {
            context.buttonWaiting('scanCode');
          }, 2000);
          return notPass
        }
      }

      context.createLeftSpanMessage('温度验证成功,回温:' + context.readOutTemperature + ',进温:' + context.readInTemperature, 'grey')
    }

    if (context.configDetail.printLabel === 'WAC300C') {
      //读信号、
      const model = context.configForm.produceModel;
      const protocol = protocolIDMap[model];
      let readSignalResult = await serialPortOperation(context, {
        actionType: 'readSignal',
        operationName: '读信号',
        cmdType: '05',                         // afn 的命令类型
        cmdCode: '07',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['readSignal'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['readSignal'],
        timeout: context.timeout,
        validateResponse: () => {
          return protocol.validateResponse.readSignal(context, context.receivedData.globalReceivedOneData)
        },
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readSignal,
      }, type)
      if (readSignalResult) {
        await playErrorAudio(context)
        return true
      }

      if (context.deviceSignal < 5) {
        context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  信号验证失败，当前信号值：' + context.deviceSignal, 'red');
        context.leftGenerateAddress = ''
        notPass = true
        context.buttonEnable();
        await playErrorAudio(context)
        setTimeout(() => {
          context.buttonWaiting('scanCode');
        }, 2000);
        return notPass
      }
      let readBatteryVoltageResult = await serialPortOperation(context, {
        actionType: 'readBatteryVoltage',
        operationName: '读电池电压',
        cmdType: '05',                         // afn 的命令类型
        cmdCode: '0a',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocol.deviceActionResponseMessageLength['readBatteryVoltage'],
        expectedLength2: protocol.deviceActionResponseMessageLength2['readBatteryVoltage'],
        timeout: context.timeout,
        validateResponse: () => {
          return protocol.validateResponse.readBatteryVoltage(context, context.receivedData.globalReceivedOneData)
        },
        preprocess: () => {
        },
        isInfraredDevice: protocol.isInfraredDevice,
        isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.readBatteryVoltage,
      }, type)
      if (readBatteryVoltageResult) {
        await playErrorAudio(context)
        return true
      }

      //验证电压
      if (context.deviceBatteryVoltage < 3.4) {
        context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  电池电压验证失败,当前电池电压值:' + context.deviceBatteryVoltage, 'red');
        context.leftGenerateAddress = ''
        notPass = true
        context.buttonEnable();
        await playErrorAudio(context)
        setTimeout(() => {
          context.buttonWaiting('scanCode');
        }, 2000);
        return notPass
      }
      context.leftWorkPrompt = `扫码验证成功`;
      await playSuccessAudio(context)
      context.buttonSuccess('scanCode')
      context.buttonEnable();
      setTimeout(() => {
        context.buttonWaiting('scanCode');
      }, 2000);

    }

    // 验证联网
    if (context.configDetail.printLabel !== 'WAC300C' &&
      context.configDetail.printLabel !== 'NTR300' &&
      context.configDetail.printLabel !== 'WAC710C'
    ) {
      if (!await checkNetWork(context, protocolId, type)) {
        context.leftGoodProductQuantity += 1;
        context.leftGenerateAddress = ''; // 成功后清空地
      }else{
        context.buttonError('scanCode')
        context.leftWorkPrompt = `扫码验证失败`;
        setTimeout(() => {
          context.buttonWaiting('scanCode');
        }, 2000);
        return
      }
    }
    context.leftWorkPrompt = `扫码验证成功`;
    await playSuccessAudio(context)
    context.buttonEnable();
    context.buttonSuccess('scanCode')
    setTimeout(() => {
      context.buttonWaiting('scanCode');
    }, 2000);
  }

}

const checkAddress = async (context, protocolId, type) => {
  let notPass = true;
  //根据型号区分走不同扫码验证逻辑
  if (context.configDetail.printLabel === 'WAC230CF' || context.configDetail.printLabel === 'WAC710CD' ||
    context.configDetail.printLabel === 'WAC300CD' || context.configDetail.printLabel === 'NTP100C' ||
    context.configDetail.printLabel === 'CT1000' || context.configDetail.printLabel === 'ET01' ||
    context.configDetail.printLabel === 'WAC330HE' || context.configDetail.printLabel === 'WAC730C' ||
    context.configDetail.printLabel === 'LPC230' || context.configDetail.printLabel === 'LPC230E' ||
    context.configDetail.printLabel === 'AEC100' ||
    context.configDetail.printLabel === 'CAT400' ||
    context.configDetail.printLabel === 'CAT200' ||
    context.configDetail.printLabel === 'CAT400S' || context.configDetail.printLabel === 'CTW100' ||
    context.configDetail.printLabel === 'WAC100N' || context.configDetail.printLabel === 'WAC100NY' ||
    context.configDetail.printLabel === 'WAC300C' || context.configDetail.printLabel === 'NTR300' ||
    context.configDetail.printLabel === 'WAC710C' || context.configDetail.printLabel === 'WAC400N' ||
    context.configDetail.printLabel === 'VAC710'||context.configDetail.printLabel==='WAC710N'

  ) {
    let readAddressResult = await serialPortOperation(context, {
      actionType: undefined,
      operationName: '读地址',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '06',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    }, type)
    if (readAddressResult) {
      context.leftGenerateAddress = ''
      context.buttonEnable();
      await playErrorAudio(context)
      setTimeout(() => {
        context.buttonWaiting('scanCode');
      }, 2000);
      return notPass
    }
  } else if (
    context.configDetail.printLabel === 'WAC300NH'
    || context.configDetail.printLabel === 'WAC300NY'
    || context.configDetail.printLabel === 'WAC300N') {
    let readAddressResult = await serialPortOperation(context, {
      actionType: undefined,
      operationName: '读地址',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '0b',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    }, type)
    if (readAddressResult) {
      await playErrorAudio(context)
      context.leftGenerateAddress = ''
      context.buttonEnable();
      setTimeout(() => {
        context.buttonWaiting('scanCode');
      }, 2000);
      return notPass
    }
  } else if (context.configDetail.printLabel === 'WAC300NS' || context.configDetail.printLabel === 'WAC400NS' || context.configDetail.printLabel === 'VAC710S') {
    let readAddressResult = await serialPortOperation(context, {
      actionType: undefined,
      operationName: '读地址',
      cmdType: '90',                         // afn 的命令类型
      cmdCode: '20',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    }, type)

    if (readAddressResult) {
      context.buttonEnable();
      await playErrorAudio(context)
      setTimeout(() => {
        context.buttonWaiting('scanCode');
      }, 2000);
      context.leftGenerateAddress = ''
      return notPass
    }
  }
  // 地址验证
  console.log('地址：', context.leftGenerateAddress)
  console.log('读地址：', context.leftReadAddress)
  if (context.leftReadAddress !== context.leftGenerateAddress) {
    context.leftBadProductQuantity += 1;
    await badRecordUpload(context, '扫码地址验证联网', '扫码地址与设备地址不匹配', 'scanCode')
    await context.uploadMes(context.leftGenerateAddress, 0, '扫码地址验证联网(扫码地址与设备地址不匹配) ')
    context.leftBadProductQuantity += 1
    context.leftGenerateAddress = ''
    context.buttonEnable();
    await playErrorAudio(context)
    setTimeout(() => {
      context.buttonWaiting('scanCode');
    }, 2000);
    return notPass
  }
  //地址通过后LPC230不注册平台,不需要后续验证
  if (context.configDetail.printLabel === 'LPC230' ||
    context.configDetail.printLabel === 'LPC230E' ||
    context.configDetail.printLabel === 'AEC100' ||
    context.configDetail.printLabel === 'WAC300NS'
  ) {
    context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '扫码验证地址成功', 'grey');
    context.buttonSuccess('scanCode')
    context.leftGenerateAddress = ''
  }
  notPass = false
  return notPass
}
const checkNetWork = async (context, protocolId, type) => {
  let notPass = true
  let data
  // 个别设备不验证联网
  if(context.configDetail.printLabel === 'WAC710N'){
    return false
  }
  if (context.configDetail.printLabel === 'WAC230CF') {
    data = await checkRecentlyUploadedData(context.leftGenerateAddress, 'col_terminal_data_meter_valve')
  } else if (context.configDetail.printLabel === 'WAC710CD' || context.configDetail.printLabel === 'WAC300CD' ||
    context.configDetail.printLabel === 'WAC300NH'
    || context.configDetail.printLabel === 'WAC300NY'
    || context.configDetail.printLabel === 'WAC300N' || context.configDetail.printLabel === 'WAC300NS'
    || context.configDetail.printLabel === 'WAC400NS' || context.configDetail.printLabel === 'WAC400N'
    ||context.configDetail.printLabel==='WAC300NY'
  ) {
    data = await checkRecentlyUploadedData(context.leftGenerateAddress, 'col_terminal_data_valve')
  } else if (
    context.configDetail.printLabel === 'NTP100C' || context.configDetail.printLabel === 'CT1000' || context.configDetail.printLabel === 'ET01' ||
    context.configDetail.printLabel === 'CAT400' || context.configDetail.printLabel === 'CAT400S' || context.configDetail.printLabel === 'CTW100'||
    context.configDetail.printLabel === 'CAT200'
  ) {
    data = await checkRecentlyUploadedData(context.leftGenerateAddress, 'col_terminal_data_measure_point')
  } else if (context.configDetail.printLabel === 'WAC330HE' || context.configDetail.printLabel === 'WAC730C') {
    data = await checkRecentlyUploadedData(context.leftGenerateAddress, 'col_terminal_data_meter_valve')
  }
  console.log('hems最近上传的数据', data[0])
  if (data===undefined||data[0] === undefined || data [0] === null) {
    if (!context.uploadAddressList.includes(context.leftReadAddress)) {
      context.uploadAddressList.push(context.leftReadAddress)
      context.leftBadProductQuantity += 1;
    }
    await badRecordUpload(context, '扫码地址验证联网', '网络未上传', 'scanCode')
    context.createLeftSpanMessage('扫码地址验证联网(网络未上传) ','red')
    await context.uploadMes(context.leftGenerateAddress, 0, '扫码地址验证联网(网络未上传) ')
    context.leftBadProductQuantity += 1
    context.leftGenerateAddress = ''
    context.buttonEnable();

    await playErrorAudio(context)
    setTimeout(() => {
      context.buttonWaiting('scanCode');
    }, 2000);
    return notPass
  } else {
    let formattedTime = moment(data[0].collectTime).format('YYYY-MM-DD HH:mm:ss');
    await handleSuccess(context, '扫码地址验证联网', '地址：' + context.leftGenerateAddress + ' 联网验证成功', 'scanCode')
    context.createLeftSpanMessage('地址：' + context.leftGenerateAddress + '  网络上传成功,上传时间：' + formattedTime, 'grey');
    context.buttonSuccess('scanCode')
    context.leftGenerateAddress = ''
  }
  notPass = false
  context.buttonEnable();
  return notPass

}
// export const doPrintLabel = async (context, flag, protocolId, type) => {
//
//   let printAddress
//   let printNotPass = true
//   if (flag) {
//     //写地址成功
//     printAddress = context.leftGenerateAddress
//     printNotPass = false
//   } else {
//     // context.messageClean()
//     //手动打印，需要读地址
//     // if (!checkPort(context, type)) {
//     //   await playErrorAudio(context)
//     //   return
//     // }
//
//   }
//
//   console.log('触发打印 , 当前打印机:', context.defaultDeviceName)
//   Log.info('触发打印 , 当前打印机:', context.defaultDeviceName)
//   console.log('打印型号：', context.configForm.produceModel)
//   const params = {
//     deviceName: context.defaultDeviceName,
//     address: '12345678',
//     model: context.configDetail.customizePrintLabel,
//     configModel: context.configDetail.printLabel,
//     listDoubleRowLabels: context.listDoubleRowLabels,
//     width: context.configDetail.labelWith,
//     margin: context.configDetail.labelMargin,
//     marginLeft: context.configDetail.lableMarginLeft,
//     secondColumnFontSize: context.configDetail.secondColumnFontSize,
//     height: context.configDetail.labelHeight,
//     isDouble: context.configDetail.whetherDoubleRowPrinting === '是',
//   };
//   if (context.configForm.produceModel === 'NTP100C' || context.configForm.produceModel === 'WAC710CD' || context.configForm.produceModel === 'WAC300CD'
//     || context.configForm.produceModel === 'CT1000' || context.configForm.produceModel === 'WAC230CF' || context.configForm.produceModel === 'WAC300N'
//     || context.configForm.produceModel === 'WAC300NH' || context.configForm.produceModel === 'WAC300NY' || context.configForm.produceModel === 'ET01'
//     || context.configForm.produceModel === 'WAC730C'
//     || context.configForm.produceModel === 'CAT400' || context.configForm.produceModel === 'CAT400S' || context.configForm.produceModel === 'CPT100'
//     || context.configForm.produceModel === 'VPT100' || context.configForm.produceModel === 'CTW100' || context.configForm.produceModel === 'WAC300LH'
//     || context.configForm.produceModel === 'LPC230' || context.configForm.produceModel === 'LPC230E' || context.configForm.produceModel === 'AEC100'
//     || context.configForm.produceModel === 'WAC710C' || context.configForm.produceModel === 'WAC300NS' || context.configForm.produceModel === 'WAC400NS'
//     || context.configForm.produceModel === 'VAC005C' || context.configForm.produceModel === 'VAC710S' || context.configForm.produceModel === 'RFT200-CAT1'
//     || context.configForm.produceModel === 'RFT200' || context.configForm.produceModel === 'NBT400' || context.configForm.produceModel === 'WAC300C'
//     || context.configForm.produceModel === 'NTR300' || context.configForm.produceModel === 'CPT100-10A'
//     || context.configForm.produceModel === 'WAC330N' || context.configForm.produceModel === 'WAC400N' || context.configForm.produceModel === 'VAC710'
//   ) {
//     await ipc.send(ipcApiRoute.doPrintTest, params)
//   } else if (context.configForm.produceModel === 'WAC330HE') {
//     let commonTraffic;
//     let flowRange;
//     if (context.configDetail.nominalCaliber === 'DN15') {
//       commonTraffic = '1.5m³/h';
//       flowRange = '(0.03-3)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN20') {
//       commonTraffic = '2.5m³/h';
//       flowRange = '(0.05-5)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN25') {
//       commonTraffic = '3.5m³/h';
//       flowRange = '(0.07-7)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN32') {
//       commonTraffic = '6m³/h';
//       flowRange = '(0.12-12)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN40') {
//       commonTraffic = '10m³/h';
//       flowRange = '(0.2-20)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN50') {
//       commonTraffic = '15m³/h';
//       flowRange = '(0.3-30)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN65') {
//       commonTraffic = '25m³/h';
//       flowRange = '(0.5-50)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN80') {
//       commonTraffic = '40m³/h';
//       flowRange = '(0.8-80)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN100') {
//       commonTraffic = '60m³/h';
//       flowRange = '(1.2-120)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN125') {
//       commonTraffic = '100m³/h';
//       flowRange = '(2-200)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN150') {
//       commonTraffic = '150m³/h';
//       flowRange = '(3-300)m³/h';
//     } else if (context.configDetail.nominalCaliber === 'DN200') {
//       commonTraffic = '250m³/h';
//       flowRange = '(5-500)m³/h';
//     }
//     let params = {
//       craftsmanCaliber: context.configDetail.nominalCaliber,
//       commonTraffic: commonTraffic,
//       flowRange: flowRange,
//       deviceName: context.defaultDeviceName,
//       address: printAddress,
//       model: context.configDetail.customizePrintLabel,
//       configModel: context.configDetail.printLabel,
//       listDoubleRowLabels: context.listDoubleRowLabels,
//       width: context.configDetail.labelWith,
//       margin: context.configDetail.labelMargin,
//       marginLeft: context.configDetail.lableMarginLeft,
//       secondColumnFontSize: context.configDetail.secondColumnFontSize,
//       height: context.configDetail.labelHeight,
//       isDouble: context.configDetail.whetherDoubleRowPrinting === '是',
//     }
//     console.log('打印参数：', params)
//     await ipc.send(ipcApiRoute.doPrintTest, params)
//   }
//
//   context.buttonSuccess('labelPrint')
//   context.createLeftSpanMessage('打印成功，设备地址:' + printAddress, 'grey');
//   context.buttonSuccess('leftWorkPromptColor')
//   await playSuccessAudio(context)
//   context.leftWorkPrompt = '打印成功'
//   setTimeout(() => {
//     context.buttonWaiting('labelPrint')
//   }, 2000);
// }




export const doPrintLabel = async (context, flag, protocolId, type) => {

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
    if (context.configForm.produceModel !== 'WAC300N' &&
      context.configForm.produceModel !== 'WAC300NH' &&
      context.configForm.produceModel !== 'WAC300NY' &&
      context.configForm.produceModel !== 'LPC230' &&
      context.configForm.produceModel !== 'LPC230E' &&
      context.configForm.produceModel !== 'LPC210' &&
      context.configForm.produceModel !== 'LPC210E' &&
      context.configForm.produceModel !== 'WAC230CF'&&
      context.configForm.produceModel!=='VAC005C'
    ) {
      let readAddressResult = await serialPortOperation(context, {
        actionType: 'labelPrint',
        operationName: '读地址',
        cmdType: '05',                         // afn 的命令类型
        cmdCode: '06',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
        expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
        timeout: context.timeout,
        validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
        isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
      }, type)
      printAddress = context.leftReadAddress
      printNotPass = readAddressResult
    } else if (context.configForm.produceModel === 'LPC210' || context.configForm.produceModel === 'LPC210E') {
      let readAddressResult = await serialPortOperation(context, {
        actionType: 'readAddress',
        operationName: '读地址',
        cmdType: '05',                         // afn 的命令类型
        cmdCode: '0b',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readIMEI'],
        expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readIMEI'],
        timeout: context.timeout,
        validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
        isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readIMEI,
      }, type)
      printAddress = context.leftReadAddress
      printNotPass = readAddressResult
    } else if (context.configForm.produceModel === 'WAC300LH') {
      let readAddressResult = await serialPortOperation(context, {
        actionType: 'readAddress',
        operationName: '读地址',
        cmdType: 'dd',                         // afn 的命令类型
        cmdCode: 'f0',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
        expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
        timeout: context.timeout,
        validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
        isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
      }, 'cj88')
      printAddress = context.leftReadAddress
      printNotPass = readAddressResult
    } else if (context.configForm.produceModel === 'WAC300NS' || context.configForm.produceModel === 'WAC400NS' || context.configDetail.printLabel === 'VAC710S') {
      let readAddressResult = await serialPortOperation(context, {
        actionType: 'readAddress',
        operationName: '读地址',
        cmdType: '90',                         // afn 的命令类型
        cmdCode: '20',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
        expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
        timeout: context.timeout,
        validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
        isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
      }, type)
      printAddress = context.leftReadAddress
      printNotPass = readAddressResult
    } else if (context.configForm.produceModel === 'VAC005C') {
      let readAddressResult = await serialPortOperation(context, {
        actionType: 'labelPrint',
        operationName: '读地址',
        cmdType: '81',                         // afn 的命令类型
        cmdCode: '0a',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
        expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
        timeout: context.timeout,
        validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
        isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
      }, 'cj88')
      printAddress = context.leftReadAddress
      printNotPass = readAddressResult
    } else {
      let readAddressResult = await serialPortOperation(context, {
        actionType: 'labelPrint',
        operationName: '读地址',
        cmdType: '05',                         // afn 的命令类型
        cmdCode: '0b',                         // fn 的命令码
        protocolId: protocolId,
        maxRetries: context.maxRetries,
        expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
        expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
        timeout: context.timeout,
        validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
        preprocess: () => {
        },
        isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
        isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
      }, type)
      printAddress = context.leftReadAddress
      printNotPass = readAddressResult
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
  };
  if (context.configForm.produceModel === 'NTP100C' || context.configForm.produceModel === 'WAC710CD' || context.configForm.produceModel === 'WAC300CD'
    || context.configForm.produceModel === 'CT1000' || context.configForm.produceModel === 'WAC230CF' || context.configForm.produceModel === 'WAC300N'
    || context.configForm.produceModel === 'WAC300NH' || context.configForm.produceModel === 'WAC300NY' || context.configForm.produceModel === 'ET01'
    || context.configForm.produceModel === 'WAC730C'||  context.configForm.produceModel === 'CAT200'
    || context.configForm.produceModel === 'CAT400' || context.configForm.produceModel === 'CAT400S' || context.configForm.produceModel === 'CPT100'
    || context.configForm.produceModel === 'VPT100' || context.configForm.produceModel === 'CTW100' || context.configForm.produceModel === 'WAC300LH'
    || context.configForm.produceModel === 'LPC230' || context.configForm.produceModel === 'LPC230E' || context.configForm.produceModel === 'AEC100'
    || context.configForm.produceModel === 'WAC710C' || context.configForm.produceModel === 'WAC300NS' || context.configForm.produceModel === 'WAC400NS'
    || context.configForm.produceModel === 'VAC005C' || context.configForm.produceModel === 'VAC710S' || context.configForm.produceModel === 'RFT200-CAT1'
    || context.configForm.produceModel === 'RFT200' || context.configForm.produceModel === 'NBT400' || context.configForm.produceModel === 'WAC300C'
    || context.configForm.produceModel === 'NTR300' || context.configForm.produceModel === 'CPT100-10A'
    || context.configForm.produceModel === 'WAC330N' || context.configForm.produceModel === 'WAC400N'
    || context.configForm.produceModel === 'VAC710'||context.configForm.produceModel === 'WAC710N'
  ) {
    await ipc.send(ipcApiRoute.doPrintTest, params)
  } else if (context.configForm.produceModel === 'WAC330HE') {
    let commonTraffic;
    let flowRange;
    if (context.configDetail.nominalCaliber === 'DN15') {
      commonTraffic = '1.5m³/h';
      flowRange = '(0.03-3)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN20') {
      commonTraffic = '2.5m³/h';
      flowRange = '(0.05-5)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN25') {
      commonTraffic = '3.5m³/h';
      flowRange = '(0.07-7)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN32') {
      commonTraffic = '6m³/h';
      flowRange = '(0.12-12)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN40') {
      commonTraffic = '10m³/h';
      flowRange = '(0.2-20)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN50') {
      commonTraffic = '15m³/h';
      flowRange = '(0.3-30)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN65') {
      commonTraffic = '25m³/h';
      flowRange = '(0.5-50)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN80') {
      commonTraffic = '40m³/h';
      flowRange = '(0.8-80)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN100') {
      commonTraffic = '60m³/h';
      flowRange = '(1.2-120)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN125') {
      commonTraffic = '100m³/h';
      flowRange = '(2-200)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN150') {
      commonTraffic = '150m³/h';
      flowRange = '(3-300)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN200') {
      commonTraffic = '250m³/h';
      flowRange = '(5-500)m³/h';
    }
    let params = {
      craftsmanCaliber: context.configDetail.nominalCaliber,
      commonTraffic: commonTraffic,
      flowRange: flowRange,
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
    }
    console.log('打印参数：', params)
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
export const doPrintLabelTODO = async (context, flag, protocolId, type) => {

  let printAddress = '12345678'
  console.log('触发打印 , 当前打印机:', context.defaultDeviceName)
  Log.info('触发打印 , 当前打印机:', context.defaultDeviceName)
  console.log('打印型号：', context.configForm.produceModel)
  const params = {
    deviceName: context.defaultDeviceName,
    address: printAddress,
    model: 'CAT200',
    configModel: 'CAT200',
    listDoubleRowLabels: context.listDoubleRowLabels,
    width: context.configDetail.labelWith,
    margin: context.configDetail.labelMargin,
    marginLeft: context.configDetail.lableMarginLeft,
    secondColumnFontSize: context.configDetail.secondColumnFontSize,
    height: context.configDetail.labelHeight,
    isDouble: context.configDetail.whetherDoubleRowPrinting === '否',
  };
  if (context.configForm.produceModel === 'NTP100C' || context.configForm.produceModel === 'WAC710CD' || context.configForm.produceModel === 'WAC300CD'
    || context.configForm.produceModel === 'CT1000' || context.configForm.produceModel === 'WAC230CF' || context.configForm.produceModel === 'WAC300N'
    || context.configForm.produceModel === 'WAC300NH' || context.configForm.produceModel === 'WAC300NY' || context.configForm.produceModel === 'ET01' || context.configForm.produceModel === 'WAC730C'
    || context.configForm.produceModel === 'CAT400' || context.configForm.produceModel === 'CAT200'||
    context.configForm.produceModel === 'CAT400S' || context.configForm.produceModel === 'CPT100'
    || context.configForm.produceModel === 'VPT100' || context.configForm.produceModel === 'CTW100' || context.configForm.produceModel === 'WAC300LH'
    || context.configForm.produceModel === 'LPC230' || context.configForm.produceModel === 'LPC230E' || context.configForm.produceModel === 'AEC100'
    || context.configForm.produceModel === 'WAC710C' || context.configForm.produceModel === 'WAC300NS' || context.configForm.produceModel === 'WAC400NS'
    || context.configForm.produceModel === 'VAC005C' || context.configForm.produceModel === 'VAC710S' || context.configForm.produceModel === 'RFT200-CAT1'
    || context.configForm.produceModel === 'RFT200' || context.configForm.produceModel === 'NBT400'
  ) {
    await ipc.send(ipcApiRoute.doPrintTest, params)
  } else if (context.configForm.produceModel === 'WAC330HE') {
    let commonTraffic;
    let flowRange;
    if (context.configDetail.nominalCaliber === 'DN15') {
      commonTraffic = '1.5m³/h';
      flowRange = '(0.03-3)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN20') {
      commonTraffic = '2.5m³/h';
      flowRange = '(0.05-5)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN25') {
      commonTraffic = '3.5m³/h';
      flowRange = '(0.07-7)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN32') {
      commonTraffic = '6m³/h';
      flowRange = '(0.12-12)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN40') {
      commonTraffic = '10m³/h';
      flowRange = '(0.2-20)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN50') {
      commonTraffic = '15m³/h';
      flowRange = '(0.3-30)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN65') {
      commonTraffic = '25m³/h';
      flowRange = '(0.5-50)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN80') {
      commonTraffic = '40m³/h';
      flowRange = '(0.8-80)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN100') {
      commonTraffic = '60m³/h';
      flowRange = '(1.2-120)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN125') {
      commonTraffic = '100m³/h';
      flowRange = '(2-200)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN150') {
      commonTraffic = '150m³/h';
      flowRange = '(3-300)m³/h';
    } else if (context.configDetail.nominalCaliber === 'DN200') {
      commonTraffic = '250m³/h';
      flowRange = '(5-500)m³/h';
    }
    let params = {
      craftsmanCaliber: context.configDetail.nominalCaliber,
      commonTraffic: commonTraffic,
      flowRange: flowRange,
      deviceName: context.defaultDeviceName,
      address: printAddress,
      model: context.configDetail.customizePrintLabel,
      listDoubleRowLabels: context.listDoubleRowLabels,
      width: context.configDetail.labelWith,
      margin: context.configDetail.labelMargin,
      marginLeft: context.configDetail.lableMarginLeft,
      secondColumnFontSize: context.configDetail.secondColumnFontSize,
      height: context.configDetail.labelHeight,
      isDouble: context.configDetail.whetherDoubleRowPrinting === '是',
    }
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

export const doReadSelfTestStatus = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }

  const executeFunctionList = {
    'PTC100-4-20MA': PTC100420MA.readSelfTestStatus,
    'PTC100-RS485': PTC100RS485.readSelfTestStatus,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '读自检失败'
    setTimeout(() => {
      context.buttonWaiting('readSelfTestStatus');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `读自检成功`;
  context.buttonSuccess('readSelfTestStatus');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('readSelfTestStatus');
  }, 2000);

  await playSuccessAudio(context);
};
export const doQuadraticVerification = async (context, protocolId, type) => {
  context.messageClean()
  if (!checkPort(context, type)) {
    await playErrorAudio(context)
    return
  }

  // 先验证地址
  if (context.configForm.produceModel === '东元热表') {
    let readAddressResult = await serialPortOperation(context, {
      actionType: 'readAddress',
      operationName: '读地址',
      cmdType: '81',                         // afn 的命令类型
      cmdCode: '0a-东元',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isWireDevice: true,
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    }, type)
    if (readAddressResult) {
      await playErrorAudio(context)
      return
    }
    if (context.leftReadAddress !== context.secondaryInspectionGenerateAddress) {
      await playErrorAudio(context)
      context.createLeftSpanMessage(`东元热表-地址验证失败,设备地址：${context.leftReadAddress}, 扫码地址：${context.secondaryInspectionGenerateAddress}`, 'red');
      return
    } else {
      await playSuccessAudio(context)
      context.createLeftSpanMessage(`东元热表-地址验证成功，设备地址：${context.leftReadAddress}, 扫码地址：${context.secondaryInspectionGenerateAddress}`, 'grey');
    }

  } else if (context.configForm.produceModel === 'NBT200') {
    let readAddressResult = await serialPortOperation(context, {
      actionType: 'readAddress',
      operationName: '读地址',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '06',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isWireDevice: false,
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    }, type)
    if (readAddressResult) {
      await playErrorAudio(context)
      return
    }
    if (context.leftReadAddress !== context.secondaryInspectionGenerateAddress) {
      await playErrorAudio(context)
      context.createLeftSpanMessage(`NBT200-地址验证失败,设备地址：${context.leftReadAddress}, 扫码地址：${context.secondaryInspectionGenerateAddress}`, 'grey');
      return
    } else {
      await playSuccessAudio(context)
      context.createLeftSpanMessage(`NBT200-地址验证成功，设备地址：${context.leftReadAddress}, 扫码地址：${context.secondaryInspectionGenerateAddress}`, 'grey');
    }

    let readVersionResult = await serialPortOperation(context, {
      actionType: 'readVersion',
      operationName: '读版本',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '09',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readVersion'],
      expectedLength2: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength2['readVersion'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readVersion(context, context.receivedData.globalReceivedOneData, type),
      preprocess: () => {
      },
      isWireDevice: false,
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readVersion,
    }, type)
    if (readVersionResult) {
      await playErrorAudio(context)
      return
    }

    if (context.configDetail.version.toString() !== context.readVersion.toString()) {
      context.createLeftSpanMessage(`NBT200-版本验证失败，设备版本：${context.readVersion}, 配置版本：${context.configDetail.version}`, 'grey');
      await playErrorAudio(context)
      return
    } else {
      context.createLeftSpanMessage(`NBT200-版本验证成功，设备版本：${context.readVersion}, 配置版本：${context.configDetail.version}`, 'grey');
      await playSuccessAudio(context)
    }

  }


  context.leftWorkPrompt = `验证成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('quadraticVerify')
  context.secondaryInspectionGenerateAddress = undefined

}
