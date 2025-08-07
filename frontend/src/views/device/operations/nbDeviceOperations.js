import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {serialPortOperation,} from "@/views/device/action/deviceAction";
import {checkPort} from "@/views/device/handler/portHandler";
import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {doSelfTestWAC710CD} from "@/views/device/operations/nb/wac710cd/selfTest";
import {doSelfTestWAC230CF} from "@/views/device/operations/nb/wac230cf/selfTest";
import {doSelfTestNTP100C} from "@/views/device/operations/nb/ntp100c/selfTest";
import {doSelfTestCT1000} from "@/views/device/operations/nb/ct1000/selfTest";
import {doSelfTestWAC300CD} from "@/views/device/operations/nb/wac300cd/selfTest";
import {returnSelfTestNTP100C} from "@/views/device/operations/nb/ntp100c/returnSelfTest";
import {returnSelfTestCT1000} from "@/views/device/operations/nb/ct1000/returnSelfTest";
import {returnSelfTestWAC300CD} from "@/views/device/operations/nb/wac300cd/returnSelfTest";
import {returnSelfTestWAC710CD} from "@/views/device/operations/nb/wac710cd/returnSelfTest";
import {returnSelfTestWAC230CF} from "@/views/device/operations/nb/wac230cf/returnSelfTest";
import {nbDeviceRegister} from "@/utils/serviceUtils";
import {writeAddressCT1000} from "@/views/device/operations/nb/ct1000/writeAddress";
import {writeAddressNTP100C} from "@/views/device/operations/nb/ntp100c/writeAddress";
import {writeAddressWAC230CF} from "@/views/device/operations/nb/wac230cf/writeAddress";
import {writeAddressWAC710CD} from "@/views/device/operations/nb/wac710cd/writeAddress";
import {writeAddressWAC300CD} from "@/views/device/operations/nb/wac300cd/writeAddress";
import {doSelfTestWAC300N} from "@/views/device/operations/nb/wac300n/selfTest";
import {returnSelfTestWAC300N} from "@/views/device/operations/nb/wac300n/returnSelfTest";
import {writeAddressWAC300N} from "@/views/device/operations/nb/wac300n/writeAddress";
import {doSelfTestWAC300NH} from "@/views/device/operations/nb/wac300nh/selfTest";
import {returnSelfTestWAC300NH} from "@/views/device/operations/nb/wac300nh/returnSelfTest";
import {writeAddressWAC300NH} from "@/views/device/operations/nb/wac300nh/writeAddress";

const Log = require('ee-core/log');


export const doSelfTest = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const selfTestStrategies = {
    'WAC710CD': doSelfTestWAC710CD,
    'WAC230CF': doSelfTestWAC230CF,
    'WAC300CD': doSelfTestWAC300CD,
    'CT1000': doSelfTestCT1000,
    'NTP100C': doSelfTestNTP100C,
    'WAC300N':doSelfTestWAC300N,
    'WAC300NH':doSelfTestWAC300NH
  };
  const produceModel = context.configForm.produceModel;
  const selfTestFunction = selfTestStrategies[produceModel];
  if (selfTestFunction && await selfTestFunction(context, protocolId, type)) {
    return;
  }
  context.leftWorkPrompt = `自检开启成功`;
  context.buttonSuccess('selfTest');
  context.buttonSuccess('leftWorkPromptColor');
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
      context.createLeftSpanMessage(`NBT200-地址验证失败,设备地址：${context.leftReadAddress}, 扫码地址：${context.secondaryInspectionGenerateAddress}`, 'red');
      return
    } else {
      await playSuccessAudio(context)
      context.createLeftSpanMessage(`NBT200-地址验证成功，设备地址：${context.leftReadAddress}, 扫码地址：${context.secondaryInspectionGenerateAddress}`, 'green');
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
      context.createLeftSpanMessage(`NBT200-版本验证失败，设备版本：${context.readVersion}, 配置版本：${context.configDetail.version}`, 'red');
      await playErrorAudio(context)
      return
    } else {
      context.createLeftSpanMessage(`NBT200-版本验证成功，设备版本：${context.readVersion}, 配置版本：${context.configDetail.version}`, 'green');
      await playSuccessAudio(context)
    }

  }


  context.leftWorkPrompt = `验证成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('quadraticVerify')
  context.secondaryInspectionGenerateAddress = undefined

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
    return
  }
  context.leftWorkPrompt = `唤醒成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('awaken')

}


export const doBreakSelfTest = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const returnSelfTestStrategies = {
    'WAC710CD': returnSelfTestWAC710CD,
    'WAC230CF': returnSelfTestWAC230CF,
    'WAC300CD': returnSelfTestWAC300CD,
    'CT1000': returnSelfTestCT1000,
    'NTP100C': returnSelfTestNTP100C,
    'WAC300N': returnSelfTestWAC300N,
    'WAC300NH': returnSelfTestWAC300NH
  };
  const produceModel = context.configForm.produceModel;
  const returnSelfTestFunction = returnSelfTestStrategies[produceModel];
  if (returnSelfTestFunction && await returnSelfTestFunction(context, protocolId, type)) {
    return;
  }
  context.leftWorkPrompt = `退出自检成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('breakSelfTest')
}


export async function doWriteAddress(context, protocolId, type) {
  context.messageClean()
  if (!checkPort(context, type)) {
    await playErrorAudio(context)
    return
  }

  const writeAddressStrategies = {
    'WAC710CD': writeAddressWAC710CD,
    'WAC230CF': writeAddressWAC230CF,
    'WAC300CD': writeAddressWAC300CD,
    'CT1000': writeAddressCT1000,
    'NTP100C': writeAddressNTP100C,
    'WAC300N': writeAddressWAC300N,
    'WAC300NH': writeAddressWAC300NH
  };
  const produceModel = context.configForm.produceModel;
  const writeAddressFunction = writeAddressStrategies[produceModel];
  if (writeAddressFunction && await writeAddressFunction(context, protocolId, type)) {
    return;
  }
  await nbDeviceRegister(context);
  context.leftWorkPrompt = `地址写入成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('writeAddress')

}


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
   if (context.configForm.produceModel!=='WAC300N'&& context.configForm.produceModel!=='WAC300NH') {
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
   }else{
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
  const params = {
    deviceName: context.defaultDeviceName,
    address: printAddress,
    selectPrintModel: context.configDetail.customizePrintLabel,
    date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
    width: context.printLabelWidth,
    height: context.printLabelHeight,
    listDoubleRowLabels: context.listDoubleRowLabels,
  };
  if (context.configForm.produceModel === 'NTP100C' || context.configForm.produceModel === 'WAC710CD' || context.configForm.produceModel === 'WAC300CD'
    || context.configForm.produceModel === 'CT1000'||context.configForm.produceModel==='WAC230CF' || context.configForm.produceModel === 'WAC300N' || context.configForm.produceModel === 'WAC300NH'
  ) {
    await ipc.send(ipcApiRoute.printDoubleRowLabel4020, params)
  } else {
    await ipc.send(ipcApiRoute.print, params)
  }

  context.buttonSuccess('labelPrint')
  context.createLeftSpanMessage('打印成功，设备地址:' + printAddress, 'green');
  context.buttonSuccess('leftWorkPromptColor')
  await playSuccessAudio(context)
  context.leftWorkPrompt = '打印成功'
}


