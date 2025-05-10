import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {handleRightError, handleRightSuccess, serialPortOperation,} from "@/views/device/action/deviceAction";
import {countProductQuantityCountByUserId, getIdByMacAddr, insertNBValueProduce,} from "@/components/global/productdb";
import {checkPort} from "@/views/device/handler/portHandler";
import {protocolIDMap} from "@/views/device/enum/enum";
import {decodeReadAddress} from "@/packBuffer/decode/decode";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {checkIMEIExist, checkRecentlyUploadedData} from "@/components/global/hemssdb";
import axios from "axios";
import moment from "moment";

const Log = require('ee-core/log');


export const doGetPrinter = async (context) => {
  ipc.invoke(ipcApiRoute.getPrinterList, {}).then(res => {
    context.printerList = res;
  })
  context.modalShow = true
}
export const doTogglePrinterSelection = async (context, printer) => {
  // 取消其他打印机的选择状态
  context.printerList.forEach(item => {
    if (item !== printer) {
      item.isSelected = false;
    }
  });
  // 设置当前打印机的选择状态
  printer.isSelected = true;
  // 将选中的打印机名称赋值给 defaultDeviceName
  context.defaultDeviceName = printer.name
  context.modalShow = false
}


export const doSelfTest = async (context, protocolId,type) => {
  context.messageClean()
  if (!checkPort(context,type)) {
    return
  }
  let requireSelfTestResult = await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检询问',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'f0',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['inquireSelfTest'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.inquireSelfTest(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
  },type)
  if (requireSelfTestResult) {
    return
  }
  //一些设备需要写配置
  if (context.configForm.produceModel === 'WAC710CD') {
    let writeTorqueConfigResult = await serialPortOperation(context, {
      actionType: 'selfTest',
      operationName: '写扭矩配置',
      cmdType: 'ac',                         // afn 的命令类型
      cmdCode: '82',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeTorqueConfig'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeTorqueConfig(context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writeTorqueConfig,
    },type)
    if (writeTorqueConfigResult) {
      return
    }
  }
  //一些设备需要写配置
  if (context.configForm.produceModel === 'WAC710CD') {
    let writeTemperatureProbesConfigResult = await serialPortOperation(context, {
      actionType: 'selfTest',
      operationName: '写温度探头配置',
      cmdType: 'ac',                         // afn 的命令类型
      cmdCode: '09',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeTemperatureProbesConfig'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeTemperatureProbesConfig(context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writeTemperatureProbesConfig,
    },type)
    if (writeTemperatureProbesConfigResult) {
      return
    }
  }

  if (context.configForm.produceModel === 'WAC710CD') {
    let writeTemperatureProbesConfigResult = await serialPortOperation(context, {
      actionType: 'selfTest',
      operationName: '写压力探头配置',
      cmdType: 'ac',                         // afn 的命令类型
      cmdCode: '90',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writePressureProbesConfig'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writePressureProbesConfig(context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writePressureProbesConfig,
    },type)
    if (writeTemperatureProbesConfigResult) {
      return
    }
  }
  let cmdCode='f2'
  if(context.configForm.produceModel === 'WAC710CD'||context.configForm.produceModel === 'WAC300CD'){
    cmdCode='f3'
  }
  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: cmdCode,                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['selfTest'],
    timeout: context.timeout,
    validateResponse: () => {
    },
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.selfTest,
  },type)

  context.leftWorkPrompt = `自检开启成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('selfTest')
  context.buttonSuccess('leftWorkPromptColor')
}

export const doAwaken = async (context, protocolId,type) => {
  context.messageClean()
  if (!checkPort(context,type)) {
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
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.awaken(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.awaken,
  },type)
  if (result) {
    return
  }
  context.leftWorkPrompt = `唤醒成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('awaken')

}


export const doBreakSelfTest = async (context, protocolId,type) => {
  context.messageClean()
  if (!checkPort(context,type)) {
    return
  }
  let result = await serialPortOperation(context, {
    actionType: 'returnSelfTestStatus',
    operationName: '退出自检',
    cmdType: 'dd',                         // afn 的命令类型
    cmdCode: 'aa',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['returnSelfTestStatus'],
    timeout: context.timeout,
    validateResponse: () => {},
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.returnSelfTestStatus,
  },type)
  if (result) {
    return
  }
  context.leftWorkPrompt = `退出自检成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('breakSelfTest')

}



/*
  *
  *  12位地址生成规则ABCDEXXX 采集器地址或12位
  * 2024 4.12
    //A: 如果是当前是1-9 月 天的十位+1 ,如果当前是10-12月 天的十位+5
    //B: 当前年个位
    //C: 当前月个位
    //D: 当前日个位
    //E: 生产员工ID(0-9) 根据登录成功传入的id
    //XXX:当前登录员工每天生产序列(0000001-9999999) 最多生产9999999个 否则生成地址的时候提示失败
  * */
//34420000
// 00 00 42 34
export function assembleAddress(employeeId, dailyProductionSequence) {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  let ruleA = 0;
  if (month >= 1 && month <= 9) {
    ruleA = Math.floor(day / 10) + 1;
  } else if (month >= 10 && month <= 12) {
    ruleA = Math.floor(day / 10) + 5;
  }

  const ruleB = currentDate.getFullYear() % 10;
  const ruleC = month % 10;
  const ruleD = day % 10;

  if (dailyProductionSequence < 10) {
    dailyProductionSequence = '000000' + `${dailyProductionSequence}`;
  } else if (dailyProductionSequence < 100) {
    dailyProductionSequence = '00000' + `${dailyProductionSequence}`;
  } else if (dailyProductionSequence < 1000) {
    dailyProductionSequence = '0000' + `${dailyProductionSequence}`
  } else if (dailyProductionSequence < 10000) {
    dailyProductionSequence = '000' + `${dailyProductionSequence}`;
  } else if (dailyProductionSequence < 100000) {
    dailyProductionSequence = '00' + `${dailyProductionSequence}`;
  } else if (dailyProductionSequence < 1000000) {
    dailyProductionSequence = '0' + `${dailyProductionSequence}`
  } else if (dailyProductionSequence < 10000000) {
    dailyProductionSequence = `${dailyProductionSequence}`;
  }

  const address = `${ruleA}${ruleB}${ruleC}${ruleD}${employeeId}${dailyProductionSequence}`;
  console.log(address)
  console.log('ruleA:', ruleA);
  console.log('ruleA:', ruleB);
  console.log('ruleA:', ruleC);
  console.log('ruleA:', ruleD);
  console.log('dailyProductionSequence:', dailyProductionSequence);
  return address;
}


/*
  *
  *  规则ABCDEXXX
  * 2024 4.12
    //A: 如果是当前是1-9 月 天的十位+1 ,如果当前是10-12月 天的十位+5
    //B: 当前年个位
    //C: 当前月个位
    //D: 当前日个位
    //E: 生产员工ID(0-9) 根据登录成功传入的id
    //XXX:当前登录员工每天生产序列(001-999) 最多生产999个 否则生成地址的时候提示失败
  * */
//34420000
// 00 00 42 34
export function generateAddressByTerminal(employeeId, dailyProductionSequence) {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  let ruleA = 0;
  if (month >= 1 && month <= 9) {
    ruleA = Math.floor(day / 10) + 1;
  } else if (month >= 10 && month <= 12) {
    ruleA = Math.floor(day / 10) + 5;
  }

  const ruleB = currentDate.getFullYear() % 10;
  const ruleC = month % 10;
  const ruleD = day % 10;

  if (dailyProductionSequence < 10) {
    dailyProductionSequence = '00' + `${dailyProductionSequence}`;
  } else if (dailyProductionSequence < 100) {
    dailyProductionSequence = '0' + `${dailyProductionSequence}`;
  }

  const address = `${ruleA}${ruleB}${ruleC}${ruleD}${employeeId}${dailyProductionSequence}`;
  console.log(address)
  console.log('ruleA:', ruleA);
  console.log('ruleA:', ruleB);
  console.log('ruleA:', ruleC);
  console.log('ruleA:', ruleD);
  console.log('dailyProductionSequence:', dailyProductionSequence);
  return address;
}

async function generateAddress(context) {
  let notPass = true
  let address = ''
  const currentDate = new Date(); // 获取当前日期
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
  const day = currentDate.getDate(); // 获取当前日期
  //生成地址
  let productQuantity = await countProductQuantityCountByUserId(context.routerParam.userId, `${year}-${month}-${day}`);
  //当日数量+1
  if (productQuantity.length === 0) {
    productQuantity[0] = []
    productQuantity[0].quantity = 0
  }
  //当前地址+1
  productQuantity[0].quantity = productQuantity[0].quantity + 1
  console.log('员工每日生产的地址序列号', productQuantity[0].quantity)
  Log.info('员工每日生产的地址序列号', productQuantity[0].quantity)
  if (productQuantity[0].quantity > 999) {
    console.error('当前登录用户:' + context.routerParam.userId + '每日生产的地址数量超过999', productQuantity[0].quantity)
    Log.error('当前登录用户:' + context.routerParam.userId + '每日生产的地址数量超过999', productQuantity[0].quantity)
    context.leftWorkPrompt = `地址写入失败(当前账户超量生产)`;
    context.createLeftSpanMessage('当前登录用户:' + context.routerParam.userId + '每日生产的地址数量超过999', productQuantity[0].quantity, 'red');
    context.buttonError('leftWorkPromptColor')
    context.buttonError('selfTest')
    await playErrorAudio(context)
    context.GoodProductQuantity += 1;
    context.uploadMes(undefined, 0, '无法超量生产')
    return {notPass, address}
  }
  address = generateAddressByTerminal(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.leftGenerateAddress = address
  context.createLeftSpanMessage('生成的地址:' + address, 'green');
  if ((context.leftGenerateAddress === undefined || context.leftGenerateAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('leftWorkPromptColor')
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    context.uploadMes(address, 0, '生成地址非法')

    await playErrorAudio(context)
    return {notPass, address}
  }
  if (context.leftGenerateAddress.length !== 8) {
    console.error('生成地址非8位', address)
    Log.error('生成地址非8位', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('leftWorkPromptColor')
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    context.uploadMes(address, 0, '生成地址非法')
    await playErrorAudio(context)
    return notPass
  }
  //地址重复查询
  let response = await getIdByMacAddr(context.leftGenerateAddress);
  if (response.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + address, 'red');
    context.buttonError('leftWorkPromptColor')
    context.buttonError('writeAddress')
    if (!context.uploadAddressList.includes(context.leftGenerateAddress)) {
      context.uploadAddressList.push(context.leftGenerateAddress)
      context.leftBadProductQuantity += 1;
      context.uploadMes(address, 0, '生产库已存在该地址')
    }
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


export async function doWriteAddress(context, protocolId,type) {
  context.messageClean()
  if (!checkPort(context,type)) {
    return
  }

  let notPass = await generateAddress(context)
  if (notPass) {
    return
  }
  if (context.configForm.produceModel === 'WAC710CD' || context.configForm.produceModel === 'WAC300CD') {
    let readSelfTestStatusResult = await serialPortOperation(context, {
      actionType: 'writeAddress',
      operationName: '地址写入（读自检状态）',
      cmdType: 'f0',                         // afn 的命令类型
      cmdCode: 'de',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readSelfTestStatus'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readSelfTestStatus(context,context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
    },type)
    if (readSelfTestStatusResult) {
      return
    }
  } else {
    let readSelfTestStatusResult = await serialPortOperation(context, {
      actionType: 'writeAddress',
      operationName: '地址写入（读自检状态）',
      cmdType: 'f0',                         // afn 的命令类型
      cmdCode: 'dd',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readSelfTestStatus'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readSelfTestStatus(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readSelfTestStatus,
    },type)
    if (readSelfTestStatusResult) {
      return
    }
  }

  let readIMEIResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读IEMI）',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '0b',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readIMEI'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readIMEI(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readIMEI,
  },type)
  if (readIMEIResult) {
    return
  }
  //校验imei
  if (await checkIMEI(context)) {
    return
  }

  let readICCIDResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（读ICCID）',
    cmdType: '05',                         // afn 的命令类型
    cmdCode: '08',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readICCID'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readICCID(context, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readICCID,
  },type)
  if (readICCIDResult) {
    return
  }


  if (context.configForm.produceModel === 'WAC710CD') {
    let readTorqueConfigResult = await serialPortOperation(context, {
      actionType: 'writeAddress',
      operationName: '地址写入（读扭矩配置）',
      cmdType: 'ab',                         // afn 的命令类型
      cmdCode: '82',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readTorqueConfig'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readTorqueConfig(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readTorqueConfig,
    },type)
    if (readTorqueConfigResult) {
      return
    }
   context.createLeftSpanMessage('读扭矩配置成功:'+context.torque, 'green');
  }


  let writeAddressResult = await serialPortOperation(context, {
    actionType: 'writeAddress',
    operationName: '地址写入（写地址）',
    cmdType: '03',                         // afn 的命令类型
    cmdCode: '06',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['writeAddress'],
    timeout: context.timeout,
    validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.writeAddress(context.leftGenerateAddress, context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.writeAddress,
  },type)
  if (writeAddressResult) {
    return
  }

  await nbDeviceRegister(context);
  context.leftWorkPrompt = `地址写入成功`;
  await playSuccessAudio(context)
  context.buttonSuccess('leftWorkPromptColor')
  context.buttonSuccess('writeAddress')

}


const checkIMEI = async (context) => {
  let notPass = true
  let imeiExist = await checkIMEIExist(context.imei);
  if (imeiExist.length > 0) {
    if (imeiExist[0].imei !== '' || imeiExist[0].imei !== undefined) {
      context.leftWorkPrompt = '地址写入失败(此设备已写入过地址)'
      context.buttonError('leftWorkPromptColor')
      context.createLeftSpanMessage('平台注册失败 IMEI已存在: ' + context.imei, 'red');
      context.buttonError('writeAddress')
      context.uploadMes(undefined, 0, '平台注册失败,重复注册')
      if (!context.uploadAddressList.includes(context.leftGenerateAddress)) {
        context.uploadAddressList.push(context.leftGenerateAddress)
        context.leftBadProductQuantity += 1;
      }
      await playErrorAudio(context)
      Log.error('平台注册失败 IMEI已存在: ' + context.imei);
      console.error('平台注册失败 IMEI已存在: ');
    }
  } else {
    notPass = false
  }
  return notPass

}


async function nbDeviceRegister(context) {
  // let registerResponse = await axios.post(`http://hems.chaobiao.qdhlm.cn:20206/produce/imei/${context.generateAddress}?joinMode=2&model=${protocolIDMap[context.configForm.produceModel].model}&imei=${context.imei}&protocolCode=${protocolIDMap[context.configForm.produceModel].protocolCode}&simNumber=${context.iccid}`, null, {
  let registerResponse = await axios.post(`http://124.70.68.52:20206/produce/imei/${context.leftGenerateAddress}?joinMode=2&model=${protocolIDMap[context.configForm.produceModel].model}&imei=${context.imei}&protocolCode=${protocolIDMap[context.configForm.produceModel].protocolCode}&simNumber=${context.iccid}`, null, {
    headers: {
      // Authorization: '3a80979e67318eea69f03e65fe9a8e49' //正式
      Authorization: '18fce9806e6a99feebf5a7d034eebbd3' //dev
    }
  });
  if (registerResponse.data.s === 0 && registerResponse.status === 200) {
    context.createLeftSpanMessage('hems平台注册成功', 'green');
    //生产入库
    const productionData = {
      userid: context.routerParam.userId, // 生产账号id
      customerid: null, // 出厂客户id
      valveModel: context.productName, // 阀门型号
      valveVersion: context.version, // 阀门版本号
      protocolid: context.protocolId, // 协议ID号
      IMEI: context.imei,
      netprovider: context.netprovider, // 运营商（00：无 01：电信，02：移动）
      macaddr: context.leftGenerateAddress, // 设备8位地址
      produceDate: new Date(), // 生产日期
      deliverDate: null, // 出库日期
      description: null, // 描述
      status: 0, // 状态
      iccid: context.iccid, // ICCID
      customer: null, // 定制厂家
      expireDate: null, // SIM卡到期时间
      TempProbeAddr: null
    };

    let insertResult = await insertNBValueProduce(productionData);
    if (insertResult) {
      context.createLeftSpanMessage('生产入库成功', 'green');
      context.uploadMes(context.readAddress, 1, '成功')
      await context.printLabel(true)
    } else {
      if (!context.uploadAddressList.includes(context.readAddress)) {
        context.uploadAddressList.push(context.readAddress)
        context.leftBadProductQuantity += 1;
        context.uploadMes(context.readAddress, 0, '生产入库失败')
      }
      context.createLeftSpanMessage('生产入库失败', 'red');
      context.leftWorkPrompt = '地址写入失败(生产入库失败)';
      context.buttonError('leftWorkPromptColor')
      context.buttonError('writeAddress')
      await playErrorAudio(context)
      Log.error('生产入库失败');
      console.error('生产入库失败')
    }
  } else {
    if (!context.uploadAddressList.includes(context.readAddress)) {
      context.uploadAddressList.push(context.readAddress)
      context.leftBadProductQuantity += 1;
      context.uploadMes(context.readAddress, 0, '平台注册失败')
    }
    context.createLeftSpanMessage('平台注册失败', 'red');
    context.leftWorkPrompt = '地址写入失败(平台注册失败)';
    context.buttonError('leftWorkPromptColor')
    context.buttonError('writeAddress')
    await playErrorAudio(context)
    Log.error('平台注册失败');
    console.error('平台注册失败')
  }
}

export const doPrintLabel = async (context, flag, protocolId,type) => {

  let printAddress
  let printNotPass = true
  if (flag) {
    //写地址成功
    printAddress = context.leftGenerateAddress
    printNotPass = false
  } else {
    context.messageClean()
    //手动打印，需要读地址
    if (!checkPort(context,type)) {
      return
    }

    let readAddressResult = await serialPortOperation(context, {
      actionType: 'labelPrint',
      operationName: '读地址',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '06',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    },type)
    printAddress = context.readAddress
    printNotPass = readAddressResult
  }
  if (printNotPass) {
    return
  }
  console.log('触发打印 , 当前打印机:', context.defaultDeviceName)
  Log.info('触发打印 , 当前打印机:', context.defaultDeviceName)
  const params = {
    deviceName: context.defaultDeviceName,
    address: printAddress,
    selectPrintModel: context.configForm.produceModel,
    date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
  };
  await ipc.send(ipcApiRoute.print, params)
  context.buttonSuccess('labelPrint')
  context.createLeftSpanMessage('打印成功，设备地址:' + printAddress, 'green');
  context.buttonSuccess('leftWorkPromptColor')
  await playSuccessAudio(context)
  context.leftWorkPrompt = '打印成功'
}


export const checkNetWork = async (context, protocolId,type) => {
  let notPass = true;
  //根据型号区分走不同扫码验证逻辑
  if (context.configDetail.printLabel === 'WAC230CF'||context.configDetail.printLabel === 'WAC710CD') {
    let readAddressResult = await serialPortOperation(context, {
      actionType: undefined,
      operationName: '读地址',
      cmdType: '05',                         // afn 的命令类型
      cmdCode: '06',                         // fn 的命令码
      protocolId: protocolId,
      maxRetries: context.maxRetries,
      expectedLength: protocolIDMap[context.configForm.produceModel].deviceActionResponseMessageLength['readAddress'],
      timeout: context.timeout,
      validateResponse: () => protocolIDMap[context.configForm.produceModel].validateResponse.readAddress(context, context.receivedData.globalReceivedOneData),
      preprocess: () => {
      },
      isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
      isTransparentTransmissionProtocol: protocolIDMap[context.configForm.produceModel].isDeviceActionTransparentTransmissionProtocol.readAddress,
    },type)
    if (readAddressResult) {
      context.scanAddress = ''
      return notPass
    }
    // 地址验证
    if (context.readAddress !== context.scanAddress) {
      if (!context.uploadAddressList.includes(context.readAddress)) {
        context.uploadAddressList.push(context.readAddress)
        context.leftBadProductQuantity += 1;
        context.uploadMes(context.scanAddress, 0, '扫码地址与设备地址不匹配')
      }
      await handleRightError(context, '扫码地址验证 联网|温度', '扫码地址与设备地址不匹配', undefined)
      context.scanAddress = ''
      return notPass
    }
    //联网验证
    let data
    if (context.configDetail.printLabel === 'WAC230CF'){
      data= await checkRecentlyUploadedData(context.scanAddress, 'col_terminal_data_meter_valve')
    }else if (context.configDetail.printLabel==='WAC710CD'){
       data = await checkRecentlyUploadedData(context.scanAddress,'col_terminal_data_valve')
    }
    console.log('hems最近上传的数据', data[0])
    if (data[0] === undefined || data [0] === null) {
      if (!context.uploadAddressList.includes(context.readAddress)) {
        context.uploadAddressList.push(context.readAddress)
        context.leftBadProductQuantity += 1;
        context.uploadMes(context.scanAddress, 0, '网络未上传')
      }
      await handleRightError(context, '扫码地址验证 联网|温度', '地址：' + context.scanAddress + ' 网络未上传', undefined)
      context.scanAddress = ''
    } else {
      let formattedTime = moment(data[0].collectTime).format('YYYY-MM-DD HH:mm:ss');
      await handleRightSuccess(context, '扫码地址验证 联网|温度', '地址：' + context.scanAddress + ' 联网验证成功', undefined)
      context.createRightSpanMessage('地址：' + context.scanAddress + '  网络上传成功,上传时间：' + formattedTime, 'green');
      context.uploadMes(context.scanAddress, 1, '成功')
      context.scanAddress = ''
    }
    notPass = false


    return notPass
  }
}
