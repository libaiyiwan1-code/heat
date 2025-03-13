import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {
  readAddress,
  readSelfTestStatusAction,
  selfTest,
  selfTestStartAction,
  writeAddress, writeConfigParam, writeWritePressureProbe,
} from "@/views/device/action/deviceAction";
import {countProductQuantityCountByUserId, getIdByMacAddr, insertNBValueProduce,} from "@/components/global/productdb";
import {checkPort} from "@/views/device/handler/portHandler";
import {checkIMEIExist} from "@/components/global/hemssdb";
import axios from "axios";

const Log = require('ee-core/log');


export const doPrintLabel = async (context, flag) => {
  let printAddress
  let printNotPass = true
  if (flag) {
    //写地址成功
    printAddress = context.valveAddress
    printNotPass = false
  } else {
    //手动打印，需要读地址
    if (!checkPort(context)) {
      return
    }
    let {address, notPass} = await readAddress(context)
    console.log(address)
    context.valveAddress = address
    printAddress = address
    printNotPass = notPass
  }
  if ((context.valveAddress === null || context.valveAddress === undefined || context.valveAddress === '') && flag) {
    context.receptionText += '地址非法' + '\n';
    return
  }
  if (context.valveAddress.length !== 8 && flag) {
    context.receptionText += '地址非法' + '\n';
    return;
  }
  if (printNotPass) {
    return
  }
  console.log('触发打印 , 当前打印机:', context.defaultDeviceName)
  Log.info('触发打印 , 当前打印机:', context.defaultDeviceName)
  const params = {
    deviceName: context.defaultDeviceName,
    address: printAddress,
    // selectPrintModel: context.routerParam.selectPrintModel,
    date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
  };
  ipc.send(ipcApiRoute.print, params)
}
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


export const doSelfTest = async (context) => {
  if (!checkPort(context)) {
    return
  }
  context.operationMessage = ''
  context.receptionText = ''; //初始化 文本框.receptionText
  if (!await selfTest(context)) {
    if (!await writeConfigParam(context)) {
      if (!await writeWritePressureProbe(context)) {
        await selfTestStartAction(context)
      }
    }
  }
}


/*
  *
  *  12位地址生成规则ABCDEXXX
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
    context.updateOperationMessage('写地址失败', 'red');
    context.receptionText += '当前登录用户:' + context.routerParam.userId + '每日生产的地址数量超过999 当前生产:' + productQuantity[0].quantity + '请更换登录账号' + '\n';
    return {notPass, address}
  }
  address = generateAddressByTerminal(context.routerParam.userId, productQuantity[0].quantity)
  console.log('生成的设备地址', address)
  Log.info('生成的设备地址', address)
  context.valveAddress = address
  context.receptionText += '生成的地址:' + address + '\n';
  if ((context.valveAddress === undefined || context.valveAddress === null)) {
    console.error('生成地址不合格', address)
    Log.error('生成地址不合格', address)
    context.updateOperationMessage('写地址失败', 'red');
    context.receptionText += '生成地址不合格' + '\n';
    return {notPass, address}
  }
  if (context.valveAddress.length !== 8) {
    console.error('生成地址非8位', address)
    Log.error('生成地址非8位', address)
    context.updateOperationMessage('写地址失败', 'red');
    context.receptionText += '生成地址不合格' + '\n';
    return {notPass, address}
  }
  //地址重复查询
  let response = await getIdByMacAddr(context.valveAddress);
  if (response.length > 0) {
    context.updateOperationMessage('写地址失败', 'red');
    context.receptionText += '生产库已存在该地址 ,请重新写地址 ' + '\n';
    Log.error('生产库已存在该地址 ,请重新写地址  ', context.valveAddress)
    return {notPass, address}
  }
  notPass = false
  return {notPass, address}

}


export async function doWriteAddress(context) {
  if (!checkPort(context)) {
    return
  }
  context.operationMessage = ''
  context.receptionText = ''; //初始化 文本框.receptionText

  let {address, notPass} = await generateAddress(context)
  if (notPass) {
    return
  }
  //读自检状态
  let {
    notPass: readSelfTestNotPass,
    protocolId,
    version,
    productName,
    netprovider
  } = await readSelfTestStatusAction(context)
  if (readSelfTestNotPass) {
    return
  }

  //写地址
  let writeAddressNotPass = await writeAddress(context)
  if (writeAddressNotPass) {
    return
  }

  //生产入库
  const productionData = {
    userid: context.routerParam.userId, // 生产账号id
    customerid: null, // 出厂客户id
    valveModel: productName, // 阀门型号
    valveVersion: version, // 阀门版本号
    protocolid: protocolId, // 协议ID号
    IMEI: 0, // IMEI
    netprovider: netprovider, // 运营商（00：无 01：电信，02：移动）
    macaddr: context.valveAddress, // 设备8位地址
    produceDate: new Date(), // 生产日期
    deliverDate: null, // 出库日期
    description: null, // 描述
    status: 0, // 状态
    iccid: null, // ICCID
    customer: null, // 定制厂家
    expireDate: null, // SIM卡到期时间
    TempProbeAddr: null
  };

  let insertResult = await insertNBValueProduce(productionData);
  if (insertResult) {
    context.receptionText = context.receptionText + '生产入库成功' + '\n';
    context.updateOperationMessage('写地址成功', 'green');
    context.printLabel(true)
  } else {
    context.receptionText = context.receptionText + '生产入库失败' + '\n';
    context.updateOperationMessage('写地址失败', 'red');
    Log.error('生产入库失败');
    console.error('生产入库失败')
  }
}
