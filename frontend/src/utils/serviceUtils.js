import {countProductQuantityCountByUserId, getIdByMacAddr, insertNBValueProduce} from "@/components/global/productdb";
import {playErrorAudio} from "@/utils/audioUtils";
import axios from "axios";
import {protocolIDMap} from "@/views/device/enum/enum";
import {checkIMEIExist, checkRecentlyUploadedData} from "@/components/global/hemssdb";
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

export async function generateAddress(context) {
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
    context.buttonError('leftWorkPromptColor')
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
    context.buttonError('leftWorkPromptColor')
    context.buttonError('writeAddress')
    context.leftBadProductQuantity += 1;
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
    }
    await playErrorAudio(context)
    return {notPass, address}
  }
  notPass = false
  return notPass

}


export async function nbDeviceRegister(context) {
  let registerResponse = await axios.post(`http://hems.chaobiao.qdhlm.cn:20206/produce/imei/${context.leftGenerateAddress}?joinMode=${protocolIDMap[context.configForm.produceModel].joinMode}&model=${protocolIDMap[context.configForm.produceModel].model}&imei=${context.imei}&protocolCode=${protocolIDMap[context.configForm.produceModel].protocolCode}&simNumber=${context.iccid}&applicationId=2&productId=3`, null, {
    // let registerResponse = await axios.post(`http://124.70.68.52:20206/produce/imei/${context.leftGenerateAddress}?joinMode=2&model=${protocolIDMap[context.configForm.produceModel].model}&imei=${context.imei}&protocolCode=${protocolIDMap[context.configForm.produceModel].protocolCode}&simNumber=${context.iccid}`, null, {
    headers: {
      Authorization: '3a80979e67318eea69f03e65fe9a8e49' //正式
      // Authorization: '18fce9806e6a99feebf5a7d034eebbd3' //dev
    }
  });
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
      TempProbeAddr: context.readDeviceTemperatureProbes, //温度探头
      PressProbe: context.readDevicePressureProbes, //压力探头
      TorqueNM: context.torque,//扭矩
    };

    let insertResult = await insertNBValueProduce(productionData);
    if (insertResult) {
      context.createLeftSpanMessage('生产入库成功', 'grey');
      await context.uploadMes(context.leftReadAddress, 1, '成功')
      await context.printLabel(true)
    } else {
      if (!context.uploadAddressList.includes(context.leftReadAddress)) {
        context.uploadAddressList.push(context.leftReadAddress)
        context.leftBadProductQuantity += 1;
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
    if (!context.uploadAddressList.includes(context.leftReadAddress)) {
      context.uploadAddressList.push(context.leftReadAddress)
      context.leftBadProductQuantity += 1;
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
export const checkIMEI = async (context) => {
  let notPass = true
  let imeiExist = await checkIMEIExist(context.imei);
  if (imeiExist.length > 0) {
    if (imeiExist[0].imei !== '' || imeiExist[0].imei !== undefined) {
      context.buttonError('leftWorkPromptColor')
      await badRecordUpload(context, '平台注册', 'IMEI已存在:'+context.imei, 'writeAddress')
      await context.uploadMes(context.leftGenerateAddress,0,'平台注册(IMEI已存在)'+context.imei)
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
