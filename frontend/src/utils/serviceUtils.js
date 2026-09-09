import {
  checkIMEIExistByCollectorProductDB, countProductCardValveDeviceQuantityCountByUserId,
  countProductCollectorQuantityCountByUserId,
  countProductLORADeviceQuantityCountByUserId,
  countProductNBDeviceQuantityCountByUserId,
  countVACProductQuantityCountByUserId, getIdByMacAddrCardValve,
  getIdByMacAddrCollector,
  getIdByMacAddrLORAProduce,
  getIdByMacAddrNB,
  getIdByMacAddrVACProduce, insertCardValueProduce,
  insertCollectorProduce, insertLORAValueProduce,
  insertNBValueProduce
} from "@/components/global/productdb";
import {playErrorAudio} from "@/utils/audioUtils";
import axios from "axios";
import {protocolIDMap} from "@/views/device/enum/enum";
import {checkTerminalIMEIExist, checkRecentlyUploadedData, checkCollectorIMEIExist} from "@/components/global/hemssdb";
import {badRecordUpload, handleSuccess, serialPortOperation} from "@/views/device/action/deviceAction";
import moment from "moment/moment";

const Log = require('ee-core/log');

/**
 *  12位地址（采集器）生成规则ABCDEXXX 采集器地址或12位
 *  2024 4.12
 *  //A: 如果是当前是1-9 月 天的十位+1 ,如果当前是10-12月 天的十位+5
 *  //B: 当前年个位
 *  //C: 当前月个位
 *  //D: 当前日个位
 *  //E: 生产员工ID(0-9) 根据登录成功传入的id
 *  //XXX:当前登录员工每天生产序列(0000001-9999999) 最多生产9999999个 否则生成地址的时候提示失败
 * */
export function assemblyAddressByCollector(employeeId, dailyProductionSequence) {
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
  console.log(dailyProductionSequence)
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

/**
 *
 *  规则ABCDEXXX
 *  2024 4.12
 *  //A: 如果是当前是1-9 月 天的十位+1 ,如果当前是10-12月 天的十位+5
 *  //B: 当前年个位
 *  //C: 当前月个位
 *  //D: 当前日个位
 *  //E: 生产员工ID(0-9) 根据登录成功传入的id
 *  //XXX:当前登录员工每天生产序列(001-999) 最多生产999个 否则生成地址的时候提示失败
 * */
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


/**
 * 采集器地址生成
 * */
export async function generateAddressByCollector(context) {
  let notPass = true
  let address = ''
  const currentDate = new Date(); // 获取当前日期
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
  const day = currentDate.getDate(); // 获取当前日期
  //生成地址
  let productQuantity = await countProductCollectorQuantityCountByUserId(context.routerParam.userId, `${year}-${month}-${day}`);
  //当日数量+1
  if (productQuantity.length === 0) {
    productQuantity[0] = []
    productQuantity[0].quantity = 0
  } else {
    productQuantity[0].quantity = Number(productQuantity[0].quantity)
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
    context.buttonError('selfTest')
    await playErrorAudio(context)
    context.GoodProductQuantity += 1;
    return {notPass, address}
  }
  address = assemblyAddressByCollector(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.leftGenerateAddress = address
  context.createLeftSpanMessage('生成的地址:' + address, 'grey');
  if ((context.leftGenerateAddress === undefined || context.leftGenerateAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  if (context.leftGenerateAddress.length !== 12) {
    console.error('生成地址非12位', address)
    Log.error('生成地址非12位', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return notPass
  }
  //地址重复查询
  let response = await getIdByMacAddrCollector(context.leftGenerateAddress);
  if (response.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


/**
 * NB设备地址生成
 * */
export async function generateAddressByNB(context) {
  let notPass = true
  let address = ''
  const currentDate = new Date(); // 获取当前日期
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
  const day = currentDate.getDate(); // 获取当前日期
  //生成地址
  let productQuantity = await countProductNBDeviceQuantityCountByUserId(context.routerParam.userId, `${year}-${month}-${day}`);
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
    context.buttonError('selfTest')
    await playErrorAudio(context)
    context.GoodProductQuantity += 1;
    return {notPass, address}
  }
  address = generateAddressByTerminal(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.leftGenerateAddress = address
  context.createLeftSpanMessage('生成的地址:' + address, 'grey');
  if ((context.leftGenerateAddress === undefined || context.leftGenerateAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  if (context.leftGenerateAddress.length !== 8) {
    console.error('生成地址非8位', address)
    Log.error('生成地址非8位', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return notPass
  }
  //地址重复查询
  let response = await getIdByMacAddrNB(context.leftGenerateAddress);
  if (response.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


/**
 * LORA设备地址生成
 * */
export async function generateAddressByLORA(context) {
  let notPass = true
  let address = ''
  const currentDate = new Date(); // 获取当前日期
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
  const day = currentDate.getDate(); // 获取当前日期
  //生成地址
  let productQuantity = await countProductLORADeviceQuantityCountByUserId(context.routerParam.userId, `${year}-${month}-${day}`);
 //增加读序号 响应超时、连接超时
  if (!productQuantity){
    await playErrorAudio(context)
    return notPass
 }

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
    context.buttonError('selfTest')
    await playErrorAudio(context)
    context.GoodProductQuantity += 1;
    return {notPass, address}
  }
  address = generateAddressByTerminal(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.leftGenerateAddress = address
  context.createLeftSpanMessage('生成的地址:' + address, 'grey');
  if ((context.leftGenerateAddress === undefined || context.leftGenerateAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  if (context.leftGenerateAddress.length !== 8) {
    console.error('生成地址非8位', address)
    Log.error('生成地址非8位', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return notPass
  }
  //地址重复查询
  let response = await getIdByMacAddrLORAProduce(context,context.leftGenerateAddress);
  if (response.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


/**
 *  卡阀一体地址生成
 * */
export async function generateAddressByCardValve(context) {
  let notPass = true
  let address = ''
  const currentDate = new Date(); // 获取当前日期
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
  const day = currentDate.getDate(); // 获取当前日期
  //生成地址
  let productQuantity = await countProductCardValveDeviceQuantityCountByUserId(context.routerParam.userId, `${year}-${month}-${day}`);
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
    context.buttonError('selfTest')
    await playErrorAudio(context)
    context.GoodProductQuantity += 1;
    return {notPass, address}
  }
  address = generateAddressByTerminal(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.leftGenerateAddress = address
  context.createLeftSpanMessage('生成的地址:' + address, 'grey');
  if ((context.leftGenerateAddress === undefined || context.leftGenerateAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  if (context.leftGenerateAddress.length !== 8) {
    console.error('生成地址非8位', address)
    Log.error('生成地址非8位', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return notPass
  }
  //地址重复查询
  let response = await getIdByMacAddrCardValve(context.leftGenerateAddress);
  if (response.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


/**
 * VAC 设备地址生成
 *
 * */
export async function generateAddressByVACProduce(context) {
  let notPass = true
  let address = ''
  const currentDate = new Date(); // 获取当前日期
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
  const day = currentDate.getDate(); // 获取当前日期
  //生成地址
  let productQuantity = await countVACProductQuantityCountByUserId(context.routerParam.userId, `${year}-${month}-${day}`);
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
    context.buttonError('selfTest')
    await playErrorAudio(context)
    context.GoodProductQuantity += 1;
    return {notPass, address}
  }
  address = generateAddressByTerminal(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.valveAddress = address
  context.createSpanMessage('生成的地址:' + address, 'green')
  if ((context.valveAddress === undefined || context.valveAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.updateOperationMessage('写地址失败(生成地址非法)', 'red');
    context.createSpanMessage('生成地址不合格', 'red')
    return {notPass, address}
  }
  if (context.leftGenerateAddress.length !== 8) {
    console.error('生成地址非8位', address)
    Log.error('生成地址非8位', address)
    context.leftWorkPrompt = `地址写入失败(生成地址非法)`;
    context.createLeftSpanMessage('生成地址非法:' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return notPass
  }
  //地址重复查询
  let response = await getIdByMacAddrLORAProduce(context,context.valveAddress);
  // 连接超时或sql响应超时
  if (!response){
    await playErrorAudio(context)
    return true
  }
  if (response.length > 0) {
    context.leftWorkPrompt = `地址写入失败(生成地址非法,生产库已存在该地址)`;
    context.createLeftSpanMessage('生产库已存在该地址 ,请重新写地址 :' + address, 'red');
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


export async function nbDeviceRegister(context, type, notPass,printLabel) {
  let registerResponse
  try {
    //http://124.70.68.52:20206
    registerResponse = await axios.post(`http://hems.chaobiao.qdhlm.cn:20206/produce/imei/${context.leftGenerateAddress}?joinMode=${protocolIDMap[context.configForm.produceModel].joinMode}&model=${protocolIDMap[context.configForm.produceModel].model}&imei=${context.imei}&protocolCode=${protocolIDMap[context.configForm.produceModel].protocolCode}&simNumber=${context.iccid}&applicationId=2&productId=3`,
      null, {
        // let registerResponse = await axios.post(`http://124.70.68.52:20206/produce/imei/${context.leftGenerateAddress}?joinMode=2&model=${protocolIDMap[context.configForm.produceModel].model}&imei=${context.imei}&protocolCode=${protocolIDMap[context.configForm.produceModel].protocolCode}&simNumber=${context.iccid}`, null, {
        headers: {
          Authorization: '3a80979e67318eea69f03e65fe9a8e49' //正式
          // Authorization: '18fce9806e6a99feebf5a7d034eebbd3' //dev
        },
        timeout: 8000
      });
  } catch (e) {
    let errorMsg = '平台接口请求超时:'+e.message;
    // 执行失败日志及流程控制
    context.createLeftSpanMessage(errorMsg, 'red');
    context.leftWorkPrompt = `地址写入失败(${errorMsg})`;
    Log.error(`${errorMsg}: ${e.message}`);
    console.error(errorMsg, e);
    return true;
  }
  if (registerResponse.data.s === 0 && registerResponse.status === 200) {
    context.createLeftSpanMessage('hems平台注册成功', 'grey');
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
      TempProbeAddr: context.configDetail.temperatureProbe, //温度探头
      PressProbe: context.configDetail.pressureProbes, //压力探头
      TorqueNM: context.torque,//扭矩
      valveDN: context.configDetail.nominalCaliber //WAC330HE口径
    };

    let insertResult = await insertNBValueProduce(context,productionData);
    if (insertResult) {
      context.createLeftSpanMessage('生产入库成功', 'grey');
      await context.uploadMes(context.leftGenerateAddress, 1, '成功')
      if (printLabel==='PTC100-CAT1'){
        await context.modbusPrintLabel( true, protocolIDMap[context.configForm.produceModel].protocolId, type)
      }else{
        await context.printLabel(context, true, protocolIDMap[context.configForm.produceModel].protocolId, type)

      }
      return false;
    } else {
      await context.uploadMes(context.leftGenerateAddress, 0, '生产入库失败')
      return true;
    }
  } else {
    context.createLeftSpanMessage('平台注册失败:'+registerResponse.data.msg, 'red');
    await context.uploadMes(context.leftGenerateAddress, 0, '平台注册失败:'+registerResponse.data.msg)
    context.leftWorkPrompt = '地址写入失败(平台注册失败)';
    return true;
  }

}

export async function productionLORALibraryRegistration(context,type) {
  let notPass=false
  //生产入库
  const productionData = {
    userid: context.routerParam.userId, // 生产账号id
    customerid: null, // 出厂客户id
    valveModel: context.productName, // 阀门型号
    valveVersion: context.version, // 阀门版本号
    protocolid: context.protocolId, // 协议ID号
    netprovider: context.netprovider, // 运营商（00：无 01：电信，02：移动）
    macaddr: context.leftGenerateAddress, // 设备8位地址
    produceDate: new Date(), // 生产日期
    deliverDate: null, // 出库日期
    description: null, // 描述
    status: 0, // 状态
    customer: null, // 定制厂家
    expireDate: null, // SIM卡到期时间
    TempProbeAddr: context.readDeviceTemperatureProbes, //温度探头
    PressProbe: context.readDevicePressureProbes, //压力探头
    TorqueNM: context.torque,//扭矩
    valveDN: null //WAC330HE口径
  };

  let insertResult = await  insertLORAValueProduce(productionData);
  if (insertResult) {
    context.createLeftSpanMessage('生产入库成功', 'grey');
    await context.uploadMes(context.leftGenerateAddress, 1, '成功')
    await context.printLabel(context, true, protocolIDMap[context.configForm.produceModel].protocolId, type)
    return  notPass
  } else {
    context.createLeftSpanMessage('生产入库失败', 'red');
    await context.uploadMes(context.leftGenerateAddress, 0, '生产入库失败')
    //写默认出厂地址全0
    context.context.leftGenerateAddress='00000000'
    let writeAddressResult = await serialPortOperation(context, {
      actionType: 'writeAddress',
      operationName: '地址写入（写地址）',
      cmdType: 'a0',                         // afn 的命令类型
      cmdCode: '18',                         // fn 的命令码
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
    }, 'cj88')
    if (writeAddressResult) {
      context.createLeftSpanMessage('生产入库失败,请重新写地址', 'red');
      await playErrorAudio(context)
      return true
    }
    context.createLeftSpanMessage('生产入库失败,请重新写地址', 'red');
    //打印不合格的标签
    context.printWarehouseEntryFailedLabel()
    return true
  }
}

export async function vacProduceDeviceRegister(context,type) {
  //生产入库
  const productionData = {
    TempProbeAddr: context.configDetail.temperatureProbe,
    PressProbe: context.configDetail.pressureProbes,
    userid: context.routerParam.userId, // 生产账号id
    customerid: null, // 出厂客户id
    valvetypeid: 38,
    valveVersion: context.version, // 阀门版本号
    macaddr: context.leftGenerateAddress, // 设备8位地址
    valveModel: context.productName, // 设备型号
    produceDate: new Date(), // 生产日期
    deliverDate: null, // 出库日期
    description: null, // 描述
    customer: null, // 定制厂家
  };

  let insertResult = await insertNBValueProduce(context,productionData);
  if (insertResult) {
    await context.uploadMes(context.leftGenerateAddress, 1, '成功')
    context.createSpanMessage('生产入库成功', 'green')
    await context.printLabel(context, true, protocolIDMap[context.configForm.produceModel].protocolId, type)
  } else {
    await context.uploadMes(context.leftGenerateAddress, 0, '生产库注册(失败)')
    context.createSpanMessage('生产入库失败', 'red')
  }

}

export async function productionNBLibraryRegistration(context,type) {
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
    TempProbeAddr: context.configDetail.temperatureProbe, //温度探头
    PressProbe: context.configDetail.pressureProbes, //压力探头
    TorqueNM: context.torque,//扭矩
    valveDN: context.configDetail.nominalCaliber //WAC330HE口径
  };

  let insertResult = await insertNBValueProduce(context,productionData);
  if (insertResult) {
    context.createLeftSpanMessage('生产入库成功', 'grey');
    await context.uploadMes(context.leftGenerateAddress, 1, '成功')
    await context.printLabel(true, protocolIDMap[context.configForm.produceModel].protocolId, type)
  } else {
    await context.uploadMes(context.leftGenerateAddress, 0, '生产入库失败')
    context.createLeftSpanMessage('生产入库失败', 'red');
  }
}

export async function productionCollectorPlatformRegistration(context, newAddress) {
  let result = true;
  let registerResponse
  let params = {
    customerId: 195, // 生产检测专用
    collectorNo: newAddress,
    type: 4, // 智能采集器
    model: 6, // 低功耗采集器
    status: 2, // 待同步
    serverAddr1: '119.3.233.106', // 正式环境地址
    serverPort1: 1883, // 正式环境端口
    project: 'hems',
    produceKey: 'rft200',
    mqttName: 'hems',
    mqttPassword: 'root',
    installAddr: '青岛',
    collectMode: 1,
    timing: '01-03:30,01-12:00',
    serialNo: 1,
    baudRate: 9600,
    verifyMode: 0,
    stopBit: 1,
    communicateProtocol: 0,
    uploadCycle: 1440,
    heatSeasonStart: '0619',
    heatSeasonEnd: '0618',
    nonHeatingAutoTimingMode: 0,
    iccid: context.iccid,
    imei: context.imei,
  }
  try {
    registerResponse = await axios.post(`http://hems.chaobiao.qdhlm.cn:20206/produce/collector`,
      // let registerResponse = await axios.post(`http://124.70.68.52:20206/produce/collector`,
      params,
      {
        headers: {
          Authorization: '3a80979e67318eea69f03e65fe9a8e49' //正式
          // Authorization: '79256bec3711c5774dcb520e60690f5b' //dev
        },
        timeout: 8000
      }
    );
  } catch (e) {
    let errorMsg = '平台接口请求超时'+e.message;
    // 执行失败日志及流程控制
    context.createLeftSpanMessage(errorMsg, 'red');
    context.leftWorkPrompt = `地址写入失败(${errorMsg})`;
    context.buttonError('writeAddress');
    await playErrorAudio(context);
    Log.error(`${errorMsg}: ${e.message}`);
    console.error(errorMsg, e);
    result = true
  }

  if (registerResponse.data.s === 0 && registerResponse.status === 200) {
    result = false
  }
  return {result, registerResponse}
}


export async function productionCollectorLibraryRegistration(context,type) {
  let notPass = true
  let registerResponseData;
  if (context.configDetail.printLabel === 'RFT200-CAT1') {
    let {result, registerResponse} = await productionCollectorPlatformRegistration(context, context.leftGenerateAddress)
    notPass = result
    registerResponseData = registerResponse
    if (notPass) {
      context.createLeftSpanMessage('hems平台注册失败:' + registerResponseData.data.msg, 'red');
      Log.error('hems平台注册失败,msg:' + registerResponseData.data.msg);
      console.error('hems平台注册失败,msg:' + registerResponseData.data.msg);
      return notPass
    }

  }

  //生产入库
  const productionData = {
    userid: context.routerParam.userId, // 生产账号id
    customerid: null, // 出厂客户id
    collectorModel: context.productName, // 型号
    collectorVersion: context.version, // 阀版本号
    protocolid: context.protocolId, // 协议ID号
    IMEI: context.imei, // IMEI
    netprovider: context.netprovider, // 运营商（00：无 01：电信，02：移动）
    macaddr: context.leftGenerateAddress, // 阀门14位地址
    produceDate: new Date(), // 生产日期
    deliverDate: null, // 出库日期
    description: null, // 描述
    status: 0, // 状态 正常=0  删除=1
    iccid: context.iccid, // ICCID
    customer: null, // 定制厂家
  };
  console.log(productionData)
  let insertResult = await insertCollectorProduce(productionData);
  if (insertResult) {
    context.createLeftSpanMessage('生产入库成功', 'grey');
    await context.uploadMes(context.leftGenerateAddress, 1, '成功')
    await context.printLabel(true, protocolIDMap[context.configForm.produceModel].protocolId, type)
    notPass=false
  } else {
    context.createLeftSpanMessage('生产入库失败', 'red');
    await context.uploadMes(context.leftGenerateAddress, 0, '生产入库失败')
    notPass=true
  }

  return notPass
}

export async function productionCardValveLibraryRegistration(context,type) {
  //生产入库
  const productionData = {
    userid: context.routerParam.userId, // 生产账号id
    customerid: null, // 出厂客户id
    valveModel: context.productName, // 阀门型号
    valveVersion: context.version, // 阀门版本号
    protocolid: context.protocolId, // 协议ID号
    IMEI: null, // IMEI
    netprovider: 4, // 运营商（00：无 01：电信，02：移动）
    macaddr: context.leftGenerateAddress, // 阀门14位地址
    produceDate: new Date(), // 生产日期
    deliverDate: null, // 出库日期
    description: null, // 描述
    status: 0, // 状态
    iccid: null, // ICCID
    customer: null, // 定制厂家
    expireDate: null, // SIM卡到期时间
    TempProbeAddr: context.configDetail.temperatureProbe // 温度探头
  };
  console.log(productionData)
  let insertResult = await insertCardValueProduce(productionData);
  if (insertResult) {
    context.createLeftSpanMessage('生产入库成功', 'grey');
    await context.uploadMes(context.leftGenerateAddress, 1, '成功')
    await context.printLabel(true, protocolIDMap[context.configForm.produceModel].protocolId, type)
  } else {
    context.createLeftSpanMessage('生产入库失败', 'red');
    await context.uploadMes(context.leftGenerateAddress, 0, '生产入库失败')
  }
}

export const checkIMEIByTerminal = async (context) => {
  let notPass = true
  let imeiExist = await checkTerminalIMEIExist(context.imei);
  if (imeiExist.length > 0) {
    if (imeiExist[0].imei !== '' || imeiExist[0].imei !== undefined) {
      await badRecordUpload(context, '平台注册', 'IMEI已存在:' + context.imei, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '平台注册(IMEI已存在)' + context.imei)
      context.leftBadProductQuantity += 1;
      await playErrorAudio(context)
      Log.error('平台注册失败 IMEI已存在: ' + context.imei);
      console.error('平台注册失败 IMEI已存在: ');
    }
  } else {
    notPass = false
  }
  return notPass

}

export const checkIMEIByCollector = async (context) => {
  let notPass = true
  let imeiExist = await checkCollectorIMEIExist(context.imei);
  if (imeiExist.length > 0) {
    if (imeiExist[0].imei !== '' || imeiExist[0].imei !== undefined) {
      await badRecordUpload(context, '平台注册', 'IMEI已存在:' + context.imei, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '平台注册(IMEI已存在)' + context.imei)
      context.leftBadProductQuantity += 1;
      await playErrorAudio(context)
      Log.error('平台注册失败 IMEI已存在: ' + context.imei);
      console.error('平台注册失败 IMEI已存在: ');
    }
  } else {
    notPass = false
  }
  return notPass

}


export const checkIMEIByProductDB = async (context) => {
  let notPass = true
  let imeiExist = await checkIMEIExistByCollectorProductDB(context.imei);
  if (imeiExist.length > 0) {
    if (imeiExist[0].imei !== '' || imeiExist[0].imei !== undefined) {
      await badRecordUpload(context, 'imei验证', 'IMEI已存在:' + context.imei, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress, 0, '生产库注册(IMEI已存在)' + context.imei)
      context.leftBadProductQuantity += 1;
      await playErrorAudio(context)
      Log.error('生产库注册失败 IMEI已存在: ' + context.imei);
      console.error('生产库注册失败 IMEI已存在: ');
    }
  } else {
    notPass = false
  }
  return notPass

}


