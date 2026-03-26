import {
  creditCard,
  deviceReadsCurrent,
  deviceReadsVoltage,
  faceplateCommunication,
  factoryConditionFullyClose,
  factoryConditionFullyOpen,
  fullOffCalibrationOperations,
  fullOpenCalibrationOperations,
  inTemperatureCalibration,
  mainAndAuxiliaryValvesVerify,
  output20MAActualCurrentValueCalibration,
  output4MAActualCurrentValueCalibration,
  outTemperatureCalibration,
  readCurrentAmmeterInputLoop,
  readCurrentAmmeterOutputLoop,
  readInAndOutTemperature,
  readValveState,
  readVersion,
  readVoltageAmmeterInputLoop,
  readVoltageAmmeterOutputLoop,
  separationAlarm,
  sourceOutputs10V,
  sourceOutputs12mA,
  sourceOutputs1V,
  sourceOutputs20mA,
  sourceOutputs4mA,
  sourceOutputs5V,
  writeAddressOperations,
  writeAllConfig,
  writeCleaningValveCycle,
  writeFixedOutput10V,
  writeFixedOutput1V,
  writeFixedOutput20MA,
  writeFixedOutput4MA,
  writeForcedTemperatureSetting,
  writeHeatingDate,
  writeInput10vActuals,
  writeInput1vActuals,
  writeOutput10vActuals,
  writeOutput1vActuals,
  writePowerOffAndWirelessError,
  writeProbesConfig,
  writesActualInputCurrentValue20MA,
  writesActualInputCurrentValue4MA,
  writeWorkChannel010V,
  writeWorkChannel110V,
  writeWorkChannel420mA
} from "@/views/device/operations/wireDeviceOperations";
import {addressCover, arrayBuffer2Hex} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');

/**
 * 配置写入 如果不需要修改按照通过处理 按钮颜色->绿色
 *
 *
 * */
export const writeCompleteConfiguration = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  console.warn('当前生产软件生产型号：' + context.wireValveCardForm.model)
  if (context.wireValveCardForm.model.includes('VAC20') ||
    context.wireValveCardForm.model.includes('VAC30') ||
    context.wireValveCardForm.model.includes('VAC40')
    // ||
    // context.wireValveCardForm.model.includes('VAC13')
  ) {
    console.warn('写配置：', context.wireValveCardForm.model)
    Log.warn('写配置：', context.wireValveCardForm.model)
    if (await writeConfigAC02(protocolId, type, context, buttonColor, isInfraredDevice)) {
      return true;
    }

    if (await writeConfigA026(protocolId, type, context, buttonColor, isInfraredDevice)) {
      return true;
    }
    return await writeConfigA022(protocolId, type, context, buttonColor, isInfraredDevice);
  } else if (context.wireValveCardForm.model.includes('VAC10')) {
    console.warn('写配置：', context.wireValveCardForm.model)
    Log.warn('写配置：', context.wireValveCardForm.model)
    if (await writeConfigA026(protocolId, type, context, buttonColor)) {
      return true;
    }
    if (await writeConfigA022(protocolId, type, context, buttonColor)) {
      return true;
    }
    if (await writeConfigAC04(protocolId, type, context, buttonColor)) {
      return true;
    }
    if (await writeConfigAC09(protocolId, type, context, buttonColor)) {
      return true;
    }
    if (await writeConfigA019(protocolId, type, context, buttonColor)) {
      return true;
    }
    if (await writeCleaningValveCycleA02C(protocolId, type, context, buttonColor)) {
      return true;
    }

  }
}

/**
 * 写强制设温
 *
 * */
export const writeConfigAC04 = async (protocolId, type, context, buttonColor) => {
  let regulationMode = context.wireValveCardFormShow.regulationMode
  let regulationModeValue = context.wireValveCardFormShow.regulationModeValue
  console.warn('regulationMode:', regulationMode)
  console.warn('regulationModeValue:', regulationModeValue)
  if (regulationMode || regulationModeValue) {
    console.warn('写AC/04 写目标调节值')
    let result = await writeForcedTemperatureSetting(protocolId, type, context);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}

/**
 * 写温度探头屏幕显示
 *
 * */
export const writeConfigAC09 = async (protocolId, type, context, buttonColor) => {
  let screenDisplay = context.wireValveCardFormShow.screenDisplay
  let temperatureProbe = context.wireValveCardFormShow.temperatureProbe
  console.warn('screenDisplay:', screenDisplay)
  console.warn('temperatureProbe:', temperatureProbe)
  if (temperatureProbe || temperatureProbe) {
    console.warn('写AC/09 写温度探头屏幕显示')
    let result = await writeProbesConfig(protocolId, type, context);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}
/**
 * 写开启/结束计量日期
 *
 * */
export const writeConfigA019 = async (protocolId, type, context, buttonColor) => {
  let heatingDate = context.wireValveCardFormShow.heatingDate
  console.warn('heatingDate:', heatingDate)
  if (heatingDate) {
    console.warn('写A0/19 heatingDate')
    let result = await writeHeatingDate(protocolId, type, context);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}


/**
 * 写清洗阀门周期
 *
 * */
export const writeCleaningValveCycleA02C = async (protocolId, type, context, buttonColor) => {
  let cleaningCycle = context.wireValveCardFormShow.cleaningCycle
  console.warn('cleaningCycle:', cleaningCycle)
  if (cleaningCycle) {
    console.warn('写A0/2C cleaningCycle')
    let result = await writeCleaningValveCycle(protocolId, type, context);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}
/**
 * 配置写入 写电源断电、无线异常
 *
 * */
export const writeConfigA026 = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  //判断是否需要写电源断电 无线异常
  let powerState = context.wireValveCardFormShow.powerState
  let wirelessAnomaly = context.wireValveCardFormShow.wirelessAnomaly

  if (powerState || wirelessAnomaly) {
    let result = await writePowerOffAndWirelessError(protocolId, type, context, isInfraredDevice);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}


/**
 * 写强制设温
 *
 * */
export const writeConfigA022 = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  let strongTemperatureSetting = context.wireValveCardFormShow.strongTemperatureSetting
  let forcedTemperature = context.wireValveCardFormShow.forcedTemperature
  let temperatureUpperLimit = context.wireValveCardFormShow.temperatureUpperLimit
  let temperatureDownLimit = context.wireValveCardFormShow.temperatureDownLimit
  console.warn('strongTemperatureSetting:', strongTemperatureSetting)
  console.warn('forcedTemperature:', forcedTemperature)
  console.warn('temperatureUpperLimit:', temperatureUpperLimit)
  console.warn('temperatureDownLimit:', temperatureDownLimit)
  if (strongTemperatureSetting || forcedTemperature || temperatureUpperLimit || temperatureDownLimit) {
    console.warn('写A022')
    let result = await writeForcedTemperatureSetting(protocolId, type, context, isInfraredDevice);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}


/**
 * 配置写入
 *
 * */
export const writeConfigAC02 = async (protocolId, type, context, buttonColor) => {
  //         AC-02 :
  //         openingUpperLimit: false,   //开度上限
  //         openingDownLimit: false,      //开度下限
  //         regulationMode: false,        //调节模式   0:  面板模式 1:远程模式  2:回温模式   3:温差模式
  //         selfRegulating: false,   //自调节 0：   0:启动 1:是
  //         regulationModeValue: false,  //调节值
  //         adjustmentCycle: false,//调节周期
  //         adjustDeadZone: false,// 调节死区
  //         screenDisplay: false, //屏幕显示 : 0:不轮显 1:轮显
  //         temperatureProbe: false,   //温度探头 ： 0 ：无探头  1：蓝色回温探头  2：红色进温探头 3：红蓝双探头
  //         cleaningCycle: false, //清洗周期
  //         heatingDate: false, // 供暖日期
  //         proportionalAdjustment: false, //定比例调节值
  //判断是否需要写调节值
  let screenDisplay = context.wireValveCardFormShow.screenDisplay
  let temperatureProbe = context.wireValveCardFormShow.temperatureProbe
  let heatingDate = context.wireValveCardFormShow.heatingDate
  let openingUpperLimit = context.wireValveCardFormShow.openingUpperLimit
  let openingDownLimit = context.wireValveCardFormShow.openingDownLimit
  let cleaningCycle = context.wireValveCardFormShow.cleaningCycle
  let regulationMode = context.wireValveCardFormShow.regulationMode
  let adjustmentCycle = context.wireValveCardFormShow.adjustmentCycle
  let adjustDeadZone = context.wireValveCardFormShow.adjustDeadZone
  let selfRegulating = context.wireValveCardFormShow.selfRegulating
  let regulationModeValue = context.wireValveCardFormShow.regulationModeValue
  let proportionalAdjustment = context.wireValveCardFormShow.proportionalAdjustment
  if (screenDisplay || temperatureProbe || heatingDate || openingUpperLimit || openingDownLimit ||
    cleaningCycle || regulationMode || adjustmentCycle || adjustDeadZone || selfRegulating || regulationModeValue || proportionalAdjustment) {
    let result = await writeAllConfig(protocolId, type, context);
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.buttonSuccess(buttonColor)
  }
  return false
}


/**
 * 版本匹配
 *
 * */
export const deviceVersionMatch = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  let result = await readVersion(protocolId, type, context, isInfraredDevice);
  if (result) {
    context.buttonError(buttonColor)
    return true;
  }
  if (context.readVersion === '' || context.readVersion === undefined) {
    if (type === 'one') {
      context.createLeftSpanMessage('版本不匹配,设备版本：' + context.readVersion + '配置版本：' + context.wireValveCardForm.version, 'red');
    } else {
      context.createRightSpanMessage('版本不匹配,设备版本：' + context.readVersion + '配置版本：' + context.wireValveCardForm.version, 'red');
    }
    context.buttonError(buttonColor)
    return true
  }
  let result1 = context.wireValveCardForm.version !== context.readVersion.toString()
  if (result1) {
    context.buttonError(buttonColor)
    if (type === 'one') {
      context.createLeftSpanMessage('版本不匹配,设备版本：' + context.readVersion + '配置版本：' + context.wireValveCardForm.version, 'red');
    } else {
      context.createRightSpanMessage('版本不匹配,设备版本：' + context.readVersion + '配置版本：' + context.wireValveCardForm.version, 'red');
    }
    return true
  }
  context.buttonSuccess(buttonColor)
  return result1;
}


/**
 * 地址写入
 *
 * */
export const deviceWriteAddress = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  let result = await writeAddressOperations(protocolId, type, context, isInfraredDevice)
  if (result) {
    context.buttonError(buttonColor)
    return result
  }
  context.buttonSuccess(buttonColor)
  return result;
}
/**
 * 全开标定
 *
 * */
export const fullOpenCalibration = async (protocolId, type, context, buttonColor, isInfraredDevice) => {

  let result = await fullOpenCalibrationOperations(protocolId, type, context, isInfraredDevice);
  if (result) {
    context.buttonError(buttonColor)
  }
  context.buttonSuccess(buttonColor)
  return result
}
/**
 * 全关标定
 *
 * */
export const fullCloseCalibration = async (protocolId, type, context, buttonColor, isInfraredDevice) => {

  // await new Promise(resolve => setTimeout(resolve, 2000));
  let result = await fullOffCalibrationOperations(protocolId, type, context, isInfraredDevice);
  if (result) {
    context.buttonError(buttonColor)
    return result
  }
  context.buttonSuccess(buttonColor)
  return result
}


/**
 * 面板通信
 *
 * */
export const panelCommunication = async (protocolId, type, context, buttonColor) => {
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V' ||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    return false
  }

  if (context.wireValveCardForm.operatorLine === '3') {
    type === 'one' ? context.leftWorkPrompt = '开、关温控面板一次' : context.rightWorkPrompt = '开、关温控面板一次'
    let notPass = true
    let startTime = Date.now();
    let endTime = startTime + context.panelTestTimeout;
    while (true) {  //强制结束条件
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (endTime - Date.now() <= 0) {
        if (type === 'one') {
          context.createLeftSpanMessage('面板通信超时，流程失败', 'red');
        } else {
          context.createRightSpanMessage('面板通信超时，流程失败', 'red');
        }
        console.log(`超时退出 当前时间: ${Date.now()}, 结束时间: ${endTime}, 时间差: ${endTime - Date.now()}`);
        break
      }
      let result = await faceplateCommunication(protocolId, type, context);
      if (!result) {
        notPass = false
        break  //成功
      }
    }


    if (notPass) {
      context.buttonError(buttonColor)
      return notPass
    }
    context.buttonSuccess(buttonColor)
    return notPass
  }
  return false
}

/**
 * 刷卡功能
 *
 * */
export const swipeCardFunction = async (protocolId, type, context, buttonColor) => {
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V' ||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    return false
  }

  if (context.wireValveCardFormShow.swipeCard) {
    type === 'one' ? context.leftWorkPrompt = '请刷卡一次' : context.rightWorkPrompt = '请刷卡一次'
    let notPass = true
    let startTime = Date.now();
    let endTime = startTime + context.creditCardTestTimeout;
    while (true) { //强制结束条件
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (endTime - Date.now() <= 0) {
        if (type === 'one') {
          context.createLeftSpanMessage('刷卡超时，流程失败', 'red');
        } else {
          context.createRightSpanMessage('刷卡超时，流程失败', 'red');
        }
        console.log(`超时退出 当前时间: ${Date.now()}, 结束时间: ${endTime}, 时间差: ${endTime - Date.now()}`);
        break
      }

      let result = await creditCard(protocolId, type, context);
      if (!result) {
        notPass = false
        break//成功
      }
    }

    if (notPass) {
      context.buttonError(buttonColor)
      return notPass
    }
    context.buttonSuccess(buttonColor)
    return notPass
  }
  return false
}

/**
 * 分离警报验证
 * */
export const deviceSeparationAlarm = async (protocolId, type, context, buttonColor) => {
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V' ||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    return false
  }

  if (context.wireValveCardFormShow.separateWarn) {
    //1. 分离
    let result1 = await deviceSeparationAlarmNoneClose(protocolId, type, context)
    if (result1) {
      context.buttonError(buttonColor)
      return true
    }

    //2. 闭合
    let result2 = await deviceSeparationAlarmClose(protocolId, type, context)
    if (result2) {
      context.buttonError(buttonColor)
      return true
    }
    context.buttonSuccess(buttonColor)
    return false
  }
  return false
}


/**
 * 分离警报 分离
 *
 * */
export const deviceSeparationAlarmNoneClose = async (protocolId, type, context) => {
  //分离 ->闭合
  // 1 。 先分离状态 如果不是分离的 报错  =放开环
  // 2 。 后测闭合状态 ，如果不是闭合的报错  =手放环里
  type === 'one' ? context.leftWorkPrompt = '请取下阀体' : context.rightWorkPrompt = '请取下阀体'
  let notPass = true
  // 分离报警主副阀 验证流程 15秒内成功1次
  let startTime = Date.now();
  let endTime = startTime + context.separationTestTimeout;
  while (true) { //强制结束条件
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (endTime - Date.now() <= 0) {
      if (type === 'one') {
        context.createLeftSpanMessage('分离超时，流程失败', 'red');
      } else {
        context.createRightSpanMessage('分离超时，流程失败', 'red');
      }
      console.log(`超时退出 当前时间: ${Date.now()}, 结束时间: ${endTime}, 时间差: ${endTime - Date.now()}`);
      break
    }

    let result = await separationAlarm(protocolId, type, context, false)
    if (!result) {
      notPass = false
      break  //成功
    }
  }
  return notPass

}

/**
 * 分离警报 闭合
 * */

export const deviceSeparationAlarmClose = async (protocolId, type, context) => {

  //分离 ->闭合
  // 1 。 先分离状态 如果不是分离的 报错  =放开环
  // 2 。 后测闭合状态 ，如果不是闭合的报错  =手放环里
  type === 'one' ? context.leftWorkPrompt = '请放入阀体' : context.rightWorkPrompt = '请放入阀体'
  let notPass = true
  // 分离报警主副阀 验证流程 15秒内成功一次结束
  let startTime = Date.now();
  let endTime = startTime + context.separationTestTimeout;
  while (true) { //强制结束条件
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (endTime - Date.now() <= 0) {
      if (type === 'one') {
        context.createLeftSpanMessage('闭合超时，流程失败', 'red');
      } else {
        context.createRightSpanMessage('闭合超时，流程失败', 'red');
      }
      console.log(`超时退出 当前时间: ${Date.now()}, 结束时间: ${endTime}, 时间差: ${endTime - Date.now()}`);
      break
    }
    let result = await separationAlarm(protocolId, type, context, true)
    if (!result) {
      notPass = false
      break//成功
    }
  }
  return notPass


}


/**
 * 主副阀检测
 *
 * */
export const deviceMainAndAuxiliaryValves = async (protocolId, type, context, buttonColor) => {
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V' ||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    return false
  }


  if (context.wireValveCardFormShow.mainAuxiliaryValve) {
    type === 'one' ? context.leftWorkPrompt = '请连接主副阀' : context.rightWorkPrompt = '请连接主副阀'
    let notPass = true
    //  主副阀 验证流程 15秒内1次成功
    let startTime = Date.now();
    let endTime = startTime + context.mainAuxiliaryValvesTestTimeout;
    while (true) { //强制结束条件
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (endTime - Date.now() <= 0) {
        if (type === 'one') {
          context.createLeftSpanMessage('主副阀检测超时，流程失败', 'red');
        } else {
          context.createRightSpanMessage('主副阀检测超时，流程失败', 'red');
        }
        console.log(`超时退出 当前时间: ${Date.now()}, 结束时间: ${endTime}, 时间差: ${endTime - Date.now()}`);
        break
      }
      let result = await mainAndAuxiliaryValvesVerify(protocolId, type, context)
      if (!result) {
        notPass = false
        break
      }
    }
    if (notPass) {
      context.buttonError(buttonColor)
      return notPass
    }
    context.buttonSuccess(buttonColor)
    return notPass
  }
  return false

}


/**
 * 扫码验证
 *
 * * */
export const doScanVerification = async (protocolId, type, context, buttonColor) => {
  type === 'one' ? context.leftWorkPrompt = '请按压工装按钮' : context.rightWorkPrompt = '请按压工装按钮'
  let notPassResult = false
  let valveAddress = type === 'one' ? context.leftReadAddress : context.rightReadAddress
  if (type === 'one') {
    context.leftErrorScanValveAddress = context.leftGenerateAddress;
    context.leftGenerateAddress = '';
  } else {
    context.rightErrorScanValveAddress = context.rightGenerateAddress;
    context.rightGenerateAddress = '';
  }
  context.isScanCodeStatus = true
  // context.focusInput(type)
  let breakStatus = false
  //   获取扫码数据对比
  if (valveAddress === undefined) {
    context.buttonError(buttonColor)
    notPassResult = true
    return notPassResult
  }
  const startTime = Date.now();
  const endTime = startTime + context.scanAddressTestTimeout; // 15000 ms = 15秒
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 200)); // 1s检查一次 扫码是否匹配
    if (endTime - Date.now() <= 0) {
      if (type === 'one') {
        context.leftGenerateAddress = context.leftErrorScanValveAddress;
        context.leftErrorScanValveAddres = ''
      } else if (type === 'two') {
        context.rightGenerateAddress = context.rightErrorScanValveAddress;
        context.rightErrorScanValveAddress = ''
      }
      if (type === 'one') {
        context.createLeftSpanMessage('扫码超时，流程失败', 'red');
      } else {
        context.createRightSpanMessage('扫码超时，流程失败', 'red');
      }
      console.log(`超时退出 当前时间: ${Date.now()}, 结束时间: ${endTime}, 时间差: ${endTime - Date.now()}`);
      breakStatus = true
      break
    }

    if (type === 'one') {
      if (context.leftGenerateAddress.length === 8 && context.isLeftScanCompleted) {
        let scanValueAddress = arrayBuffer2Hex(addressCover(context.leftGenerateAddress)) + context.workDetail.vendorCode
        console.warn('扫码的地址:' + context.leftGenerateAddress +
          '扫码逆序后地址：' + arrayBuffer2Hex(addressCover(context.leftGenerateAddress)) +
          '供应商代码：' + context.workDetail.vendorCode +
          '最终扫码地址：' + scanValueAddress +
          '设备地址：' + valveAddress)
        Log.info(
          '扫码的地址:' + context.leftGenerateAddress +
          '扫码逆序后地址：' + arrayBuffer2Hex(addressCover(context.leftGenerateAddress)) +
          '供应商代码：' + context.workDetail.vendorCode +
          '最终扫码地址：' + scanValueAddress +
          '设备地址：' + valveAddress
        )
        console.warn('设备读取地址：', valveAddress)
        if (scanValueAddress.toLowerCase() === valveAddress.toLowerCase()) {
          if (type === 'one') {
            context.createLeftSpanMessage('扫码成功', 'grey');
          } else {
            context.createRightSpanMessage('扫码成功', 'grey');
          }
          console.warn('扫码成功')
          context.leftGenerateAddress = ''
          context.isLeftScanCompleted = false
          break;
        } else {
          if (type === 'one') {
            context.createLeftSpanMessage('扫码不匹配，扫码地址：' + scanValueAddress + '设备地址：' + valveAddress, 'red');
          } else {
            context.createRightSpanMessage('扫码不匹配，扫码地址：' + scanValueAddress + '设备地址：' + valveAddress, 'red');
          }
          context.leftGenerateAddress = ''
          breakStatus = true
          context.isLeftScanCompleted = false
          break
        }

      }
    } else {
      if (context.rightGenerateAddress.length === 8 && context.isRightScanCompleted) {
        let scanValueAddress = arrayBuffer2Hex(addressCover(context.rightGenerateAddress)) + context.workDetail.vendorCode
        console.warn('扫码地址：', scanValueAddress)
        console.warn('设备读取地址：', valveAddress)
        if (scanValueAddress.toLowerCase() === valveAddress.toLowerCase()) {
          if (type === 'one') {
            context.createLeftSpanMessage('扫码成功', 'grey');
          } else {
            context.createRightSpanMessage('扫码成功', 'grey');
          }
          console.warn('扫码成功')
          context.rightGenerateAddress = ''
          context.isRightScanCompleted = false
          break;
        } else {
          if (type === 'one') {
            context.createLeftSpanMessage('扫码不匹配，扫码地址：' + scanValueAddress + '设备地址：' + valveAddress, 'red');
          } else {
            context.createRightSpanMessage('扫码不匹配，扫码地址：' + scanValueAddress + '设备地址：' + valveAddress, 'red');
          }
          breakStatus = true
          context.rightGenerateAddress = ''
          context.isRightScanCompleted = false
          break
        }

      }
    }


  }
  context.isScanCodeStatus = false
  if (breakStatus) {
    context.buttonError(buttonColor)
    console.warn('扫码失败:地址不匹配')
    notPassResult = true
    return notPassResult
  }

  type === 'one' ? context.leftWorkPrompt = '数据验证中，请等待' : context.rightWorkPrompt = '数据验证中，请等待'
  if (context.wireValveCardForm.temperatureProbe !== '0') {
    // //连续三遍水温温度            根据当前探头 进温对比三遍 回温对比三遍 温差对比三遍
    // const threshold = 0.3; // 上下限
    // const maxAttempts = 3; // 连续读取次数
    // const referenceTemperature = 50; // 基准温度
    // const delay = 1000; // 每次读取之间的延迟（毫秒）
    //
    //
    // const delayMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // //回温
    // for (let i = 1; i <= maxAttempts; i++) {
    //   // 读取进温和回温
    //   let result = await readInAndOutTemperature(protocolId, type, context);
    //   if (result) {
    //     console.error('读取进回温失败')
    //     notPassResult = true
    //     break
    //   }
    //   // 获取左侧或右侧设备进回温
    //
    //   if (type==='one'){
    //     if (context.wireValveCardForm.temperatureProbe === '1') {
    //       // 只判断回温
    //       if (Math.abs(context.leftInTemperature - referenceTemperature) <= threshold) {
    //         context.leftOutTempHistory.push(context.leftInTemperature) //成功添加当前回温
    //       }
    //     } else if (context.wireValveCardForm.temperatureProbe === '2') {
    //       // 只判断进温
    //       if (Math.abs(context.leftInTemperature - referenceTemperature) <= threshold) {
    //         context.leftInTempHistory.push(context.leftInTemperature) //成功添加当前进温
    //       }
    //     } else if (context.wireValveCardForm.temperatureProbe === '3') {
    //       if (Math.abs(context.leftInTemperature - referenceTemperature) <= threshold) {
    //         context.leftOutTempHistory.push(context.leftInTemperature) //成功添加当前回温
    //       }
    //       if (Math.abs(context.leftInTemperature - referenceTemperature) <= threshold) {
    //         context.leftInTempHistory.push(context.leftInTemperature) //成功添加当前进温
    //       }
    //     }
    //   }else if (type==='two'){
    //     if (context.wireValveCardForm.temperatureProbe === '1') {
    //       // 只判断回温
    //       if (Math.abs(context.rightInTemperature - referenceTemperature) <= threshold) {
    //         context.rightOutTempHistory.push(context.rightInTemperature) //成功添加当前回温
    //       }
    //     } else if (context.wireValveCardForm.temperatureProbe === '2') {
    //       // 只判断进温
    //       if (Math.abs(context.rightInTemperature - referenceTemperature) <= threshold) {
    //         context.rightInTempHistory.push(context.rightInTemperature) //成功添加当前进温
    //       }
    //     } else if (context.wireValveCardForm.temperatureProbe === '3') {
    //       if (Math.abs(context.rightInTemperature - referenceTemperature) <= threshold) {
    //         context.rightOutTempHistory.push(context.rightInTemperature) //成功添加当前回温
    //       }
    //       if (Math.abs(context.rightInTemperature - referenceTemperature) <= threshold) {
    //         context.rightInTempHistory.push(context.rightInTemperature) //成功添加当前进温
    //       }
    //     }
    //
    //   }
    //   await delayMs(delay);
    // }
    // if (notPassResult) {
    //   console.error('读取进回温失败')
    //   context.buttonError(buttonColor)
    //   return true
    // }
    // if (type==='one'){
    //   console.log('左侧工装设备回温历史列表：', context.leftOutTempHistory)
    //   console.log('左侧工装设备进温历史列表：', context.leftInTempHistory)
    //   console.log('温度探头：', context.wireValveCardForm.temperatureProbe)
    //   if (context.wireValveCardForm.temperatureProbe === '1') {
    //     if (context.leftOutTempHistory.length < 3) {
    //       context.leftInTempHistory = []
    //       context.leftOutTempHistory = []
    //       context.buttonError(buttonColor)
    //       console.error('回温验证失败')
    //       notPassResult = true
    //       return notPassResult
    //     }
    //
    //   } else if (context.wireValveCardForm.temperatureProbe === '2') {
    //     if (context.leftInTempHistory.length < 3) {
    //       context.leftInTempHistory = []
    //       context.leftOutTempHistory = []
    //       context.buttonError(buttonColor)
    //       console.error('进温验证失败')
    //       notPassResult = true
    //       return notPassResult
    //     }
    //
    //   } else if (context.wireValveCardForm.temperatureProbe === '3') {
    //     if (context.leftOutTempHistory.length < 3 || context.leftInTempHistory.length < 3) {
    //       context.leftInTempHistory = []
    //       context.leftOutTempHistory = []
    //       context.buttonError(buttonColor)
    //       console.error('进回温验证失败')
    //       notPassResult = true
    //       return notPassResult
    //     }
    //   }
    // }else if(type==='two'){
    //   console.log('回温历史列表：', context.rightOutTempHistory)
    //   console.log('进温历史列表：', context.rightInTempHistory)
    //   console.log('温度探头：', context.wireValveCardForm.temperatureProbe)
    //   if (context.wireValveCardForm.temperatureProbe === '1') {
    //     if (context.rightOutTempHistory.length < 3) {
    //       context.rightInTempHistory = []
    //       context.rightOutTempHistory = []
    //       context.buttonError(buttonColor)
    //       console.error('回温验证失败')
    //       notPassResult = true
    //       return notPassResult
    //     }
    //
    //   } else if (context.wireValveCardForm.temperatureProbe === '2') {
    //     if (context.rightInTempHistory.length < 3) {
    //       context.rightInTempHistory = []
    //       context.rightOutTempHistory = []
    //       context.buttonError(buttonColor)
    //       console.error('进温验证失败')
    //       notPassResult = true
    //       return notPassResult
    //     }
    //
    //   } else if (context.wireValveCardForm.temperatureProbe === '3') {
    //     if (context.rightOutTempHistory.length < 3 || context.rightInTempHistory.length < 3) {
    //       context.rightInTempHistory = []
    //       context.rightOutTempHistory = []
    //       context.buttonError(buttonColor)
    //       console.error('进回温验证失败')
    //       notPassResult = true
    //       return notPassResult
    //     }
    //   }
    // }
    //
    //
    //
    //
    // //清除历史数据
    // context.inTempHistory = []
    // context.outTempHistory = []


    //读取1 遍水温温度            根据当前探头进行对比
    const threshold = 0.3; // 上下限
    // const maxAttempts = 3; // 连续读取次数
    const referenceTemperature = 50; // 基准温度
    // const delay = 1000; // 每次读取之间的延迟（毫秒）


    //回温
    // for (let i = 1; i <= maxAttempts; i++) {
    // 读取进温和回温
    let result = await readInAndOutTemperature(protocolId, type, context);
    if (result) {
      console.error('读取进回温失败')
      notPassResult = true
      return notPassResult
    }
    // 获取左侧或右侧设备进回温
    if (type === 'one') {
      if (context.wireValveCardForm.temperatureProbe === '1') {
        // 只判断回温
        if (Math.abs(context.leftOutTemperature - referenceTemperature) >= threshold) {
          context.createLeftSpanMessage('回温验证失败当前回温：' + context.leftOutTemperature, 'red');
          notPassResult = true
        }
        context.createLeftSpanMessage(' 回温:' + context.leftOutTemperature + ',回温验证成功', 'green');
      } else if (context.wireValveCardForm.temperatureProbe === '2') {
        // 只判断进温
        if (Math.abs(context.leftInTemperature - referenceTemperature) >= threshold) {
          context.createLeftSpanMessage('进温验证失败当前进温：' + context.leftInTemperature, 'red');
          notPassResult = true
        }
        context.createLeftSpanMessage(' 进温:' + context.leftInTemperature + ',进温验证成功', 'green');
      } else if (context.wireValveCardForm.temperatureProbe === '3') {
        if (Math.abs(context.leftOutTemperature - referenceTemperature) >= threshold) {
          context.createLeftSpanMessage('回温验证失败当前回温：' + context.leftOutTemperature, 'red');
          notPassResult = true
        }
        if (Math.abs(context.leftInTemperature - referenceTemperature) >= threshold) {
          context.createLeftSpanMessage('进温验证失败当前进温：' + context.leftInTemperature, 'red');
          notPassResult = true
        }
        context.createLeftSpanMessage('进温:' + context.leftInTemperature + ' 回温:' + context.leftOutTemperature + ',进回温验证成功', 'green');
      }
    } else if (type === 'two') {
      if (context.wireValveCardForm.temperatureProbe === '1') {
        // 只判断回温
        if (Math.abs(context.leftOutTemperature - referenceTemperature) >= threshold) {
          context.createRightSpanMessage('回温验证失败当前回温：' + context.rightOutTemperature, 'red');
          notPassResult = true
        }
        context.createLeftSpanMessage(' 回温:' + context.rightOutTemperature + ',回温验证成功', 'green');
      } else if (context.wireValveCardForm.temperatureProbe === '2') {
        // 只判断进温
        if (Math.abs(context.rightInTemperature - referenceTemperature) >= threshold) {
          context.createRightSpanMessage('进温验证失败当前进温：' + context.rightInTemperature, 'red');
          notPassResult = true
        }
        context.createLeftSpanMessage('进温:' + context.rightInTemperature + ',进温验证成功', 'green');
      } else if (context.wireValveCardForm.temperatureProbe === '3') {
        if (Math.abs(context.leftOutTemperature - referenceTemperature) >= threshold) {
          context.createRightSpanMessage('回温验证失败当前回温：' + context.rightOutTemperature, 'red');
          notPassResult = true
        }
        if (Math.abs(context.rightInTemperature - referenceTemperature) >= threshold) {
          context.createRightSpanMessage('进温验证失败当前进温：' + context.rightInTemperature, 'red');
          notPassResult = true
        }
        context.createLeftSpanMessage('进温:' + context.rightInTemperature + ' 回温:' + context.rightOutTemperature + ',进回温验证成功', 'green');
      }

    }
    if (notPassResult) {
      console.error('进回温验证失败')
      context.buttonError(buttonColor)
      return true
    }
    if (type === 'one') {

    } else if (type === 'two') {

    }


  }


  //出厂状态 0 全开  1 全关
  if (context.configForm.produceModel !== 'VAC130-4/20mA' && context.configForm.produceModel !== 'VAC130-0/10V' && context.configForm.produceModel !== 'VAC130-1/10V' &&
    context.configForm.produceModel !== 'VAC130H-4/20mA' && context.configForm.produceModel !== 'VAC130H-0/10V' && context.configForm.produceModel !== 'VAC130H-1/10V'
  ) {
    //验证阀门状态
    let result = await readValveState(protocolId, type, context)
    if (result) {
      if (type === 'one') {
        context.createLeftSpanMessage('读取阀门状态失败', 'red');
      } else {
        context.createRightSpanMessage('读取阀门状态失败', 'red');
      }
      context.buttonError(buttonColor)
      console.error('读取阀门状态失败')
      notPassResult = true
      return notPassResult
    }
    console.log('阀门状态：', context.leftValveState)
    console.log('出厂状态 0 全开，1全关：', context.wireValveCardForm.factoryOpening)
    if (type === 'one') {
      if (context.wireValveCardForm.factoryOpening === '0' && (context.leftValveState === '故障' || context.leftValveState === '阀关')) {
        console.error('阀故障或出厂状态不匹配')
        context.createLeftSpanMessage('阀故障或出厂状态不匹配', 'red');
        context.buttonError(buttonColor)
        notPassResult = true
        return notPassResult
      } else if (context.wireValveCardForm.factoryOpening === '1' && (context.leftValveState === '故障' || context.leftValveState === '阀开')) {
        console.error('阀故障或出厂状态不匹配')
        context.createLeftSpanMessage('阀故障或出厂状态不匹配', 'red');
        context.buttonError(buttonColor)
        notPassResult = true
        return notPassResult
      }
    } else {
      if (context.wireValveCardForm.factoryOpening === '0' && (context.rightValveState === '故障' || context.rightValveState === '阀关')) {
        console.error('阀故障或出厂状态不匹配')
        context.buttonError(buttonColor)
        context.createRightSpanMessage('阀故障或出厂状态不匹配', 'red');
        notPassResult = true
        return notPassResult
      } else if (context.wireValveCardForm.factoryOpening === '1' && (context.rightValveState === '故障' || context.rightValveState === '阀开')) {
        console.error('阀故障或出厂状态不匹配')
        context.buttonError(buttonColor)
        context.createRightSpanMessage('阀故障或出厂状态不匹配', 'red');
        notPassResult = true
        return notPassResult
      }
    }

  }

  console.warn('notPassResult', notPassResult)
  context.buttonSuccess(buttonColor)
  return notPassResult
}


/**
 * 出厂状态写入
 *
 * */
export const writeOutFactoryOpenCondition = async (protocolId, type, context, buttonColor) => {
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V' ||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    return false
  }

  await new Promise(resolve => setTimeout(resolve, 2000));
  if (context.wireValveCardFormShow.factoryOpening) {
    if (context.wireValveCardForm.factoryOpening === '1') {
      let result = await factoryConditionFullyClose(protocolId, type, context)
      if (result) {
        context.buttonError(buttonColor)
        return result
      } else {
        context.buttonSuccess(buttonColor)
        return result
      }
    } else {
      let result = await factoryConditionFullyOpen(protocolId, type, context);
      if (result) {
        context.buttonError(buttonColor)
        return result
      } else {
        context.buttonSuccess(buttonColor)
        return result
      }
    }
  }
}


/**
 * 输入标定
 * */

export const enterCalibration = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  let result
  //写工作模式
  if (context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130H-4/20mA') {
    //写工作模式4~20mA
    result = await writeWorkChannel420mA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      console.error('与4-20mA工装设备通信失败')
      context.createLeftSpanMessage('与4-20mA工装设备通信失败', 'red');
      return result
    }
  } else if (context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130H-0/10V') {
    //写工作模式0~10V
    result = await writeWorkChannel010V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      console.error('与0-10V工装设备通信失败')
      context.createLeftSpanMessage('与0-10V工装设备通信失败', 'red');
      return result
    }
  } else if (context.configForm.produceModel === 'VAC130-1/10V' || context.configForm.produceModel === 'VAC130H-1/10V') {
    //写工作模式1~10V
    result = await writeWorkChannel110V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      console.error('与1-10V工装设备通信失败')
      context.createLeftSpanMessage('与1-10V工装设备通信失败', 'red');
      return result
    }
  }
  if (context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130H-4/20mA') {
    result = await sourceOutputs4mA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      console.error('与4-20mA工装设备通信失败')
      context.createLeftSpanMessage('与4-20mA工装设备通信失败', 'red');
      return result
    }
    context.createLeftSpanMessage('请等待电流表值稳定...2s', 'grey');
    await new Promise(x => setTimeout(x, 2000)) //等待2s
    result = await readCurrentAmmeterInputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电流表输入实际值失败', 'red');
      return result
    }
    result = await writesActualInputCurrentValue4MA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('4ma标定AD值失败', 'red');
      return result
    }
    context.createLeftSpanMessage('4ma标定AD值成功', 'green');
    result = await sourceOutputs20mA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('与4-20mA工装设备通信失败', 'red');
      return result
    }
    context.createLeftSpanMessage('请等待电流表值稳定...5s', 'grey');
    await new Promise(x => setTimeout(x, 5000)) //等待5s
    result = await readCurrentAmmeterInputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电流表输入实际值失败', 'red');
      return result
    }
    result = await writesActualInputCurrentValue20MA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('20ma标定AD值失败', 'red');
      return result
    }
    context.createLeftSpanMessage('20ma标定AD值成功', 'green');
    context.createLeftSpanMessage('电流模拟量输入标定完成', 'green');
    context.buttonSuccess(buttonColor)
    return result
  } else if (context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130H-0/10V') {
    result = await sourceOutputs1V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      console.error('与0-10V工装设备通信失败')
      context.createLeftSpanMessage('与0-10V工装设备通信失败', 'red');
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...5s', 'grey');
    await new Promise(x => setTimeout(x, 5000)) //等待2s
    result = await readVoltageAmmeterInputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输入实际值失败', 'red');
      return result
    }
    result = await writeInput1vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('1V输入标定AD值失败', 'red');
      return result
    }
    context.createLeftSpanMessage('1V输入标定AD值成功', 'green');
    result = await sourceOutputs10V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('与0-10V工装设备通信失败', 'red');
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...5s', 'grey');
    await new Promise(x => setTimeout(x, 5000)) //等待5s
    result = await readVoltageAmmeterInputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输入实际值失败', 'red');
      return result
    }
    result = await writeInput10vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('10V输入标定AD值失败', 'red');
      return result
    }
    context.createLeftSpanMessage('10V输入标定AD值成功', 'green');
    context.createLeftSpanMessage('电压模拟量输入标定完成', 'green');
    context.buttonSuccess(buttonColor)
    return result

  } else if (context.configForm.produceModel === 'VAC130-1/10V' || context.configForm.produceModel === 'VAC130H-1/10V') {
    result = await sourceOutputs1V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      console.error('与1-10V工装设备通信失败')
      context.createLeftSpanMessage('与1-10V工装设备通信失败', 'red');
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...5s', 'grey');
    await new Promise(x => setTimeout(x, 5000)) //等待2s
    result = await readVoltageAmmeterInputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输入实际值失败', 'red');
      return result
    }
    result = await writeInput1vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('1V输入标定AD值失败', 'red');
      return result
    }
    context.createLeftSpanMessage('1V输入标定AD值成功', 'green');
    result = await sourceOutputs10V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('与1-10V工装设备通信失败', 'red');
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...5s', 'grey');
    await new Promise(x => setTimeout(x, 5000)) //等待5s
    result = await readVoltageAmmeterInputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输入实际值失败', 'red');
      return result
    }
    result = await writeInput10vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('10V输入标定AD值失败', 'red');
      return result
    }
    context.createLeftSpanMessage('10V输入标定AD值成功', 'green');
    context.createLeftSpanMessage('电压模拟量输入标定完成', 'green');
    context.buttonSuccess(buttonColor)
    return result

  }

}

/**
 * 输出标定
 * */
export const outputCalibration = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  if (context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130H-4/20mA') {
    let result
    result = await writeFixedOutput4MA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电流表值稳定...10s', 'grey');
    await new Promise(x => setTimeout(x, 10000)) //等待10s
    result = await readCurrentAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电流表输出实际值失败', 'red');
      return result
    }
    result = await output4MAActualCurrentValueCalibration(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('写入电流值范围不合格', 'red');
      return result
    }
    context.createLeftSpanMessage('输出4ma标定完成', 'green');
    result = await writeFixedOutput20MA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电流表值稳定...30s', 'grey');
    await new Promise(x => setTimeout(x, 30000)) //等待30s
    result = await readCurrentAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电流表输出实际值失败', 'red');
      return result
    }
    result = await output20MAActualCurrentValueCalibration(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('写入电流值范围不合格', 'red');
      return result
    }
    context.createLeftSpanMessage('输出20ma标定完成', 'green');
    context.createLeftSpanMessage('电流模拟量输出标定完成', 'green');

    context.buttonSuccess(buttonColor)
    return result

  } else if (context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130H-0/10V') {
    let result
    result = await writeFixedOutput1V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...10s', 'grey');
    await new Promise(x => setTimeout(x, 10000)) //等待10s
    result = await readVoltageAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输出实际值失败', 'red');
      return result
    }
    result = await writeOutput1vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('写入电压值范围不合格', 'red');
      return result
    }
    context.createLeftSpanMessage('输出1V标定完成', 'green');
    result = await writeFixedOutput10V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...10s', 'grey');
    await new Promise(x => setTimeout(x, 10000)) //等待10s
    result = await readVoltageAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输出实际值失败', 'red');
      return result
    }
    result = await writeOutput10vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('写入电流值范围不合格', 'red');
      return result
    }
    context.createLeftSpanMessage('输出10V标定完成', 'green');
    context.createLeftSpanMessage('电流模拟量输出标定完成', 'green');

    context.buttonSuccess(buttonColor)
    return result


  } else if (context.configForm.produceModel === 'VAC130-1/10V' || context.configForm.produceModel === 'VAC130H-1/10V') {
    let result
    result = await writeFixedOutput1V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...10s', 'grey');
    await new Promise(x => setTimeout(x, 10000)) //等待10s
    result = await readVoltageAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输出实际值失败', 'red');
      return result
    }
    result = await writeOutput1vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('写入电压值范围不合格', 'red');
      return result
    }
    context.createLeftSpanMessage('输出1V标定完成', 'green');
    result = await writeFixedOutput10V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...10s', 'grey');
    await new Promise(x => setTimeout(x, 10000)) //等待10s
    result = await readVoltageAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取电压表输出实际值失败', 'red');
      return result
    }
    result = await writeOutput10vActuals(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('写入电流值范围不合格', 'red');
      return result
    }
    context.createLeftSpanMessage('输出10V标定完成', 'green');
    context.createLeftSpanMessage('电流模拟量输出标定完成', 'green');

    context.buttonSuccess(buttonColor)
    return result


  }
}


/**
 * 标定验证
 * */
export const calibrationVerification = async (protocolId, type, context, buttonColor, isInfraredDevice) => {
  let result
  if (context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130H-4/20mA') {
    result = await sourceOutputs12mA(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电流表值稳定...20s', 'grey');
    await new Promise(x => setTimeout(x, 20000)) //等待6s
    result = await deviceReadsCurrent(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取设备电流失败', 'red');
      return result
    }
    let currentOutValue
    let currentEnterValue
    //读电流源输入,输出 与设备实际值对比
    result = await readCurrentAmmeterInputLoop(protocolId, type, context)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取输入电流表实际值失败', 'red');
      return result
    }
    currentEnterValue = parseFloat(context.ammeterReadCurrentValue)
    console.log('[标定验证] 电流表读输入电流:', currentEnterValue)
    result = await readCurrentAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取输出电流表实际值失败', 'red');
      return result
    }
    // 电流表读取的输出电流值
    currentOutValue = parseFloat(context.ammeterReadCurrentValue)
    console.log('[标定验证] 电流表读输出电流:', currentOutValue)

    // 获取设备实际电流和允许误差范围
    let deviceCurrent = parseFloat(context.vac130DeviceCurrentValue)
    let difference = parseFloat(context.configDetail.analogError) // 允许误差百分比

    console.warn(
      '电流表输入:', currentEnterValue,
      '电流表输出:', currentOutValue,
      'VAC130 4-20设备电流:', deviceCurrent,
      '允许误差±:', difference + '%'
    )
    // -------------------------------
    // 电流表输入 vs 设备电流 误差判断
    // -------------------------------
    let errorEnter = Math.abs(currentEnterValue - deviceCurrent) / deviceCurrent;
    errorEnter = parseFloat(errorEnter.toFixed(3)) // 保留三位精度

    if (errorEnter > difference / 100) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage(
        `输入电流偏差超出允许范围：误差 ${(errorEnter * 100).toFixed(3)}% > ${difference}%`, 'red'
      );
      console.error(`[输入误差超限] 实测: ${currentEnterValue} / 设备: ${deviceCurrent}`)
      result = true
      return result
    } else {
      context.createLeftSpanMessage(`[输入误差合格] ${errorEnter * 100}% <= ${difference}%`)
      console.log(`[输入误差合格] ${errorEnter * 100}% <= ${difference}%`)
    }

    // -------------------------------
    // 电流表输出 vs 设备电流 误差判断
    // -------------------------------
    let errorOut = Math.abs(currentOutValue - deviceCurrent) / deviceCurrent
    errorOut = parseFloat(errorOut.toFixed(3))

    if (errorOut > difference / 100) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage(
        `输出电流偏差超出允许范围：误差 ${(errorOut * 100).toFixed(3)}% > ${difference}%`, 'red'
      );
      console.error(`[输出误差超限] 实测: ${currentEnterValue} / 设备: ${deviceCurrent}`)
      result = true
      return result
    } else {
      result = false
      context.createLeftSpanMessage(`[输出误差合格] ${errorOut * 100}% <= ${difference}%`)
      console.log(`[输出误差合格] ${errorOut * 100}% <= ${difference}%`)
      context.createLeftSpanMessage('4-20mA标定验证合格', 'green');
    }

    context.buttonSuccess(buttonColor)
    return result
  } else if (context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130H-0/10V') {

    result = await sourceOutputs5V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...20s', 'grey');
    await new Promise(x => setTimeout(x, 20000)) //等待6s
    result = await deviceReadsVoltage(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取设备电压失败', 'red');
      return result
    }
    let voltageOutValue
    let voltageEnterValue
    //读电压源输入,输出 与设备实际值对比
    result = await readVoltageAmmeterInputLoop(protocolId, type, context)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取输入电压表实际值失败', 'red');
      return result
    }
    voltageEnterValue = parseFloat(context.voltmeterReadVoltageValue)
    console.log('[标定验证] 电压表读输入电压:', voltageEnterValue)
    result = await readVoltageAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取输出电压表实际值失败', 'red');
      return result
    }
    // 电压表读取的输出电压值
    voltageOutValue = parseFloat(context.voltmeterReadVoltageValue)
    console.log('[标定验证] 电压表读输出电压:', voltageOutValue)

    // 获取设备实际电流和允许误差范围
    let deviceVoltage = parseFloat(context.vac130DeviceVoltageValue)
    let difference = parseFloat(context.configDetail.analogError) // 允许误差百分比

    console.warn(
      '电压表输入:', voltageEnterValue,
      '电压表输出:', voltageOutValue,
      'VAC130 0-10V设备电压:', deviceVoltage,
      '允许误差±:', difference + '%'
    )
    // -------------------------------
    // 电压表输入 vs 设备电压 误差判断
    // -------------------------------
    let errorEnter = Math.abs(voltageEnterValue - deviceVoltage) / 9;
    errorEnter = parseFloat(errorEnter.toFixed(3)) // 保留三位精度

    if (errorEnter > difference / 100) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage(
        `输入电压偏差超出允许范围：误差 ${(errorEnter * 100).toFixed(3)}% > ${difference}%`, 'red'
      );
      console.error(`[输入误差超限] 实测: ${voltageEnterValue} / 设备: ${deviceVoltage}`)
      result = true
      return result
    } else {
      context.createLeftSpanMessage(`[输入误差合格] ${errorEnter * 100}% <= ${difference}%`)
      console.log(`[输入误差合格] ${errorEnter * 100}% <= ${difference}%`)
    }

    // -------------------------------
    // 电压表输出 vs 设备电压 误差判断
    // -------------------------------
    let errorOut = Math.abs(voltageOutValue - deviceVoltage) / 9
    errorOut = parseFloat(errorOut.toFixed(3))

    if (errorOut > difference / 100) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage(
        `输出电压偏差超出允许范围：误差 ${(errorOut * 100).toFixed(3)}% > ${difference}%`, 'red'
      );
      console.error(`[输出误差超限] 实测: ${voltageEnterValue} / 设备: ${deviceVoltage}`)
      result = true
      return result
    } else {
      result = false
      context.createLeftSpanMessage(`[输出误差合格] ${errorOut * 100}% <= ${difference}%`)
      console.log(`[输出误差合格] ${errorOut * 100}% <= ${difference}%`)
      context.createLeftSpanMessage('0-10V标定验证合格', 'green');
    }

    context.buttonSuccess(buttonColor)
    return result

  } else if (context.configForm.produceModel === 'VAC130-1/10V' || context.configForm.produceModel === 'VAC130H-1/10V') {
    result = await sourceOutputs5V(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      return result
    }
    context.createLeftSpanMessage('请等待电压表值稳定...20s', 'grey');
    await new Promise(x => setTimeout(x, 20000)) //等待6s
    result = await deviceReadsVoltage(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取设备电流失败', 'red');
      return result
    }
    let voltageOutValue
    let voltageEnterValue
    //读电压源输入,输出 与设备实际值对比
    result = await readVoltageAmmeterInputLoop(protocolId, type, context)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取输入电压表实际值失败', 'red');
      return result
    }
    voltageEnterValue = parseFloat(context.voltmeterReadVoltageValue)
    console.log('[标定验证] 电压表读输入电压:', voltageEnterValue)
    result = await readVoltageAmmeterOutputLoop(protocolId, type, context, isInfraredDevice)
    if (result) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage('读取输出电流表实际值失败', 'red');
      return result
    }
    // 电压表读取的输出电压值
    voltageOutValue = parseFloat(context.voltmeterReadVoltageValue)
    console.log('[标定验证] 电压表读输出电压:', voltageOutValue)

    // 获取设备实际电流和允许误差范围
    let deviceVoltage = parseFloat(context.vac130DeviceVoltageValue)
    let difference = parseFloat(context.configDetail.analogError) // 允许误差百分比

    console.warn(
      '电压表输入:', voltageEnterValue,
      '电压表输出:', voltageOutValue,
      'VAC130 1-10V设备电压:', deviceVoltage,
      '允许误差±:', difference + '%'
    )
    // -------------------------------
    // 电压表输入 vs 设备电压 误差判断
    // -------------------------------
    let errorEnter = Math.abs(voltageEnterValue - deviceVoltage) / 9;
    errorEnter = parseFloat(errorEnter.toFixed(3)) // 保留三位精度

    if (errorEnter > difference / 100) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage(
        `输入电压偏差超出允许范围：误差 ${(errorEnter * 100).toFixed(3)}% > ${difference}%`, 'red'
      );
      console.error(`[输入误差超限] 实测: ${voltageEnterValue} / 设备: ${deviceVoltage}`)
      result = true
      return result
    } else {
      context.createLeftSpanMessage(`[输入误差合格] ${errorEnter * 100}% <= ${difference}%`)
      console.log(`[输入误差合格] ${errorEnter * 100}% <= ${difference}%`)
    }

    // -------------------------------
    // 电压表输出 vs 设备电压 误差判断
    // -------------------------------
    let errorOut = Math.abs(voltageOutValue - deviceVoltage) / 9
    errorOut = parseFloat(errorOut.toFixed(3))

    if (errorOut > difference / 100) {
      context.buttonError(buttonColor)
      context.createLeftSpanMessage(
        `输出电压偏差超出允许范围：误差 ${(errorOut * 100).toFixed(3)}% > ${difference}%`, 'red'
      );
      console.error(`[输出误差超限] 实测: ${voltageEnterValue} / 设备: ${deviceVoltage}`)
      result = true
      return result
    } else {
      result = false
      context.createLeftSpanMessage(`[输出误差合格] ${errorOut * 100}% <= ${difference}%`)
      console.log(`[输出误差合格] ${errorOut * 100}% <= ${difference}%`)
      context.createLeftSpanMessage('1-10V标定验证合格', 'green');
    }

    context.buttonSuccess(buttonColor)
    return result


  }
}


/**
 * 单击工装按钮
 *
 * */
async function awaitExecuteNext(type, context) {
  // 主循环，每500毫秒检查一次 receivedData
  while (true) {
    console.log('预计等待。。。。。')
    await new Promise(resolve => setTimeout(resolve, 500));
    const receivedData = type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData;
    // console.warn('等待单击按钮设备响应报文:', receivedData)
    if (receivedData === 'FEFEFE684685030F0F005416') {
      console.warn('执行单点触发');
      // type === 'one' ? context.receivedData.globalReceivedOneData = '' : context.receivedData.globalReceivedTwoData = '';
      break;
    } else if (receivedData.length > 24) {
      // type === 'one' ? context.receivedData.globalReceivedOneData = '' : context.receivedData.globalReceivedTwoData = '';
    }

  }
}

/**
 * 温度标定
 *
 * */
export const deviceTemperatureCalibration = async (protocolId, type, context, buttonColor) => {
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V' ||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    return false
  }

  let notPass = false
  const temperatureProbe = context.wireValveCardForm.temperatureProbe;
  if (temperatureProbe === '1' || temperatureProbe === '2' || temperatureProbe === '3') {

    const calibrationMap = {
      '1': [outTemperatureCalibration], // 回温探头
      '2': [inTemperatureCalibration], // 进温探头
      '3': [inTemperatureCalibration, outTemperatureCalibration], // 双探头
    };

    const calibrations = calibrationMap[temperatureProbe];
    for (const calibrationFn of calibrations) {
      const result = await calibrationFn(protocolId, type, context);
      if (result) {
        if (type === 'one') {
          context.createLeftSpanMessage('温度标定失败', 'red');
        } else {
          context.createRightSpanMessage('温度标定失败', 'red');
        }
        notPass = true
        break;
      }
    }
    if (notPass) {
      context.buttonError(buttonColor)
      return notPass
    }
    context.buttonSuccess(buttonColor)
    return notPass;
  }
};
