import {
  packReadData,
  packReadIMEI,
  packReadSelfTestStatus,
  packSelfTest,
  packSelfTestInquiry,
  packWriteAddress,
  packWritePressureProbe,
  packWriteTemperatureProbe
} from "@/utils/packBuffer/vac710s/encode/vac710s";
import {doWritePort} from "@/views/device/handler/portHandler";
import {
  checkWriteNotPass,
  decodeCheckAFNAndFN,
  decodeCheckAgreementID,
  decodeCheckFrame,
  decodeCheckInquireSelfTest,
  decodeCheckReadData,
  decodeCheckSelfTest,
  decodeCheckSumLength,
  decodeGetProductModel,
  decodeGetProtocolId,
  decodeGetVersion,
  decodeNetProvider,
  decodeReadAddress,
  decodeTemperature,
  decodeWriteConfigParam,
  decodeWritePressureProbe
} from "@/utils/packBuffer/vac710s/decode/vac710s";
import {arrayBuffer2Hex} from "@/utils/util";

const Log = require('ee-core/log');

export const writeConfigParam = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 34;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  let packBuffer = packWriteTemperatureProbe(context.routerParam.selectTemperatureProbes);
  console.log('[请求报文]   写硬件配置参数 ,探头:' + context.routerParam.selectTemperatureProbes, arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]   写硬件配置参数 ,探头:' + context.routerParam.selectTemperatureProbes, arrayBuffer2Hex(packBuffer));
  context.globalReceivedData = ''
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      Log.error('写硬件配置参数-写入串口失败');
      console.error('写硬件配置参数-写入串口失败');
      context.updateOperationMessage('自检失败', 'red');
      context.receptionText = context.receptionText + '写硬件配置参数-写入串口失败' + '\n';
      context.globalReceivedData = ''
      retries++;
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      console.warn('写硬件配置参数报文:', context.globalReceivedData);
      console.warn('写硬件配置参数报文长度:', context.globalReceivedData.length);
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('[响应报文]  写硬件配置参数=>  ', context.globalReceivedData);
    Log.info('[响应报文]  写硬件配置参数=>  ', context.globalReceivedData)
    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('写硬件配置参数失败 进行重试 次数:', retries);
      console.warn('写硬件配置参数失败 进行重试 次数:', retries);
      context.receptionText += '写硬件配置参数 失败进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    if (decodeWriteConfigParam(context.globalReceivedData)) {
      retries++;
      Log.warn('写硬件配置参数失败 进行重试 次数:', retries);
      console.warn('写硬件配置参数失败 进行重试 次数:', retries);
      context.receptionText += '写硬件配置参数失败 进行重试 次数:' + retries + '\n';
      continue; // Retry
    }

    notPass = false;
  }

  if (retries >= maxRetries) {
    context.updateOperationMessage('自检失败', 'red');
    Log.error('写硬件配置参数失败');
    console.log('写硬件配置参数失败');
    context.receptionText = context.receptionText + '写硬件配置参数失败' + '\n';
    context.globalReceivedData = '';
    return notPass;
  }
  Log.info('写硬件配置参数成功 稍后写压力探头，开启自检');
  console.log('写硬件配置参数成功 稍后写压力探头，开启自检');
  context.receptionText = context.receptionText + '写硬件配置参数成功 稍后写压力探头，开启自检' + '\n';
  context.globalReceivedData = '';
  return notPass;
}


export const writeWritePressureProbe = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 34;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  // let packBuffer = packWriteTemperatureProbe(context.routerParam.selectTemperatureProbes);
  let packBuffer = packWritePressureProbe();
  console.log('[请求报文]   写压力探头:' + context.routerParam.selectPressureProbes, arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]   写压力探头:' + context.routerParam.selectPressureProbes, arrayBuffer2Hex(packBuffer));
  context.globalReceivedData = ''
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      Log.error('写压力探头-写入串口失败');
      console.error('写压力探头-写入串口失败');
      context.updateOperationMessage('自检失败', 'red');
      context.receptionText = context.receptionText + '写压力探头-写入串口失败' + '\n';
      context.globalReceivedData = ''
      retries++;
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      console.warn('写压力探头报文:', context.globalReceivedData);
      console.warn('写压力探头报文长度:', context.globalReceivedData.length);
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('写压力探头失败 进行重试 次数:', retries);
      console.warn('写压力探头失败 进行重试 次数:', retries);
      context.receptionText += '写压力探头失败 失败进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    if (decodeWritePressureProbe(context.globalReceivedData)) {
      retries++;
      Log.warn('写压力探头失败 进行重试 次数:', retries);
      console.warn('写压力探头失败 进行重试 次数:', retries);
      context.receptionText += '写压力探头失败 进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    console.log('[响应报文]  写压力探头=>  ', context.globalReceivedData);
    Log.info('[响应报文]  写压力探头=>  ', context.globalReceivedData)

    notPass = false;
  }

  if (retries >= maxRetries) {
    context.updateOperationMessage('自检失败', 'red');
    Log.error('写压力探头失败');
    console.log('写压力探头失败');
    context.receptionText = context.receptionText + '写压力探头失败' + '\n';
    context.globalReceivedData = '';
    return notPass;
  }
  Log.info('写压力探头成功 稍后开启自检');
  console.log('写压力探头成功 稍后开启自检');
  context.receptionText = context.receptionText + '写压力探头成功 稍后开启自检' + '\n';
  context.globalReceivedData = '';
  return notPass;
}


export const selfTest = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 34;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  let packBuffer = packSelfTestInquiry();
  console.log('[请求报文]   自检询问', arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]   自检询问', arrayBuffer2Hex(packBuffer));
  context.globalReceivedData = ''
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      Log.error('自检询问-写入串口失败');
      console.error('自检询问-写入串口失败');
      context.updateOperationMessage('自检失败', 'red');
      context.receptionText = context.receptionText + '自检询问-写入串口失败' + '\n';
      context.globalReceivedData = ''
      retries++;
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      console.warn('自检询问报文:', context.globalReceivedData);
      console.warn('自检询问报文长度:', context.globalReceivedData.length);
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('[响应报文]  自检询问=>  ', context.globalReceivedData);
    Log.info('[响应报文]  自检询问=>  ', context.globalReceivedData)
    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('线路验证失败  进行重试 次数:', retries);
      console.warn('线路验证失败  进行重试 次数:', retries);
      context.receptionText += '线路验证失败  失败进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    if (decodeCheckInquireSelfTest(context.globalReceivedData)) {
      retries++;
      Log.warn('线路验证失败 进行重试 次数:', retries);
      console.warn('线路验证失败 进行重试 次数:', retries);
      context.receptionText += '线路验证失败 进行重试 次数:' + retries + '\n';
      continue; // Retry
    }

    notPass = false;
  }

  if (retries >= maxRetries) {
    context.updateOperationMessage('自检失败', 'red');
    Log.error('线路验证失败');
    console.log('线路验证失败');
    context.receptionText += '线路验证失败' + '\n';
    context.globalReceivedData = '';
    return notPass;
  }
  Log.info('线路验证成功 稍后写硬件配置参数、开启自检');
  console.log('线路验证成功 稍后写硬件配置参数、开启自检');
  context.receptionText += '线路验证成功 稍后写硬件配置参数、开启自检' + '\n';
  context.globalReceivedData = '';
  return notPass;
}


export const selfTestStartAction = async (context) => {
  context.globalReceivedData = ''
  let selfTestBuffer = packSelfTest(context.routerParam.selectTemperatureProbes, context.routerParam.selectPressureProbes);
  console.log('[请求报文]   开启自检=>  ', arrayBuffer2Hex(selfTestBuffer));
  Log.info('[请求报文]   开启自检=>  ', arrayBuffer2Hex(selfTestBuffer))
  try {
    await doWritePort(context.serialPort, selfTestBuffer)
  } catch {
    Log.error('开启自检-写入串口失败');
    console.error('开启自检-写入串口失败');
    context.updateOperationMessage('自检失败', 'red');
    context.receptionText += '开启自检-写入串口失败' + '\n';
    context.globalReceivedData = '';
    return
  }
  Log.info('开启自检成功');
  console.log('开启自检成功');
  context.receptionText = context.receptionText + '开启自检' + '\n';
  context.updateOperationMessage('自检成功', 'green');
  context.globalReceivedData = '';
}


export const readSelfTestStatusAction = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 73;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  let protocolId = '', version = '', productName = '', netprovider = 2
  let packBuffer = packReadSelfTestStatus()
  console.log('[请求报文]  读自检状态=>  ', arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]  读自检状态=>  ', arrayBuffer2Hex(packBuffer))
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      Log.error('读自检状态-写入串口失败');
      console.error('读自检状态-写入串口失败');
      context.updateOperationMessage('写地址失败', 'red');
      context.receptionText += '读自检状态-写入串口失败' + '\n';
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('读自检状态进行重试 次数:', retries);
      console.warn('读自检状态进行重试 次数:', retries);
      context.receptionText += '读自检状态失败进行重试 次数:' + retries + '\n';
      continue; // Retry
    }

    console.log('[响应报文]  读自检状态=>  ', context.globalReceivedData);
    Log.info('[响应报文]  读自检状态=>  ', context.globalReceivedData)
    //基础报文验证
    let checkSumLengthNotPass = decodeCheckSumLength(context.globalReceivedData);
    let checkStartFrameNotPass = decodeCheckFrame(context.globalReceivedData);
    // let checkControlCodeNotPass = decodeCheckControlCode(context.globalReceivedData);
    let checkAgreementIDNotPass = decodeCheckAgreementID(context.globalReceivedData);
    let checkAFNAndFNNotPass = decodeCheckAFNAndFN(context.globalReceivedData);
    if (checkSumLengthNotPass || checkStartFrameNotPass || checkAgreementIDNotPass || checkAFNAndFNNotPass) {
      context.receptionText = context.receptionText + '自检-报文验证不通过 ' + '\n';
      console.error('自检 报文验证不通过 ' +
        'checkSumLengthNotPass:' + checkSumLengthNotPass
        + 'checkStartFrameNotPass:' + checkStartFrameNotPass
        + 'checkAgreementIDNotPass:' + checkAgreementIDNotPass
        + 'checkAFNAndFNNotPass:' + checkAFNAndFNNotPass);
      Log.error('自检 报文验证不通过 ' +
        'checkSumLengthNotPass:' + checkSumLengthNotPass
        + 'checkStartFrameNotPass:' + checkStartFrameNotPass
        + 'checkAgreementIDNotPass:' + checkAgreementIDNotPass
        + 'checkAFNAndFNNotPass:' + checkAFNAndFNNotPass);
      context.updateOperationMessage('写地址失败', 'red');
      context.receptionText += '自检-报文验证不通过 ' + '\n';
      context.globalReceivedData = '';
      break
    }

    //EEP、联网网络、电压、进回温标定、阀门开关标定
    //自检判断
    let {selfTestState, msg} = decodeCheckSelfTest(context.globalReceivedData);
    if (selfTestState) {
      Log.error('自检不通过')
      console.error('自检不通过')
      context.updateOperationMessage('写地址失败', 'red');
      context.receptionText += '自检不通过:' + msg + '\n';
      context.globalReceivedData = ''
      break
    }

    protocolId = decodeGetProtocolId(context.globalReceivedData)
    version = decodeGetVersion(context.globalReceivedData)
    netprovider = decodeNetProvider(context.globalReceivedData)
    productName = decodeGetProductModel(context.globalReceivedData)
    notPass = false;
  }
  if (retries >= maxRetries) {
    Log.error('读自检状态 失败-重试次数达到上限，操作失败');
    console.error('读自检状态 失败-重试次数达到上限，操作失败');
    context.updateOperationMessage('写地址失败', 'red');
    context.receptionText += '读自检状态 失败-重试次数达到上限，操作失败' + '\n';
    context.globalReceivedData = '';
    return {notPass, protocolId, version, productName, netprovider};
  }
  context.receptionText += '自检状态通过，准备写地址 ' + '\n';
  console.log('读自检通过')
  Log.info('读自检通过')
  context.globalReceivedData = '';
  console.warn('protocolId:', protocolId, 'version:', version, 'productName:', productName, 'netprovider:', netprovider);
  return {notPass, protocolId, version, productName, netprovider};
}


export const writeAddress = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 16;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  let packBuffer = packWriteAddress(context.valveAddress)
  console.log('[请求报文]   写地址=>  ', arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]   写地址=>  ', arrayBuffer2Hex(packBuffer))
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      Log.error('写地址-写入串口失败');
      console.error('写地址-写入串口失败');
      context.receptionText += '写地址-写入串口失败' + '\n';
      context.updateOperationMessage('写地址失败', 'red');
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('写地址进行重试 次数:', retries);
      console.warn('写地址进行重试 次数:', retries);
      context.receptionText += '写地址进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    console.log('[响应报文]   写地址=>  ', context.globalReceivedData);
    Log.info('[响应报文]   写地址=>  ', context.globalReceivedData)

    let writeAddressNotPass = checkWriteNotPass(context.valveAddress, context.globalReceivedData)
    if (writeAddressNotPass) {
      Log.error('写地址不通过');
      console.log('写地址不通过');
      context.receptionText += '写地址失败' + '\n';
      context.globalReceivedData = '';
      break;
    }
    notPass = false;
  }
  if (retries >= maxRetries) {
    Log.error('写地址-重试次数达到上限，操作失败');
    console.error('写地址-重试次数达到上限，操作失败');
    context.receptionText += '写地址-重试次数达到上限，操作失败' + '\n';
    context.updateOperationMessage('写地址失败', 'red');
    context.globalReceivedData = '';
    return notPass;
  }
  context.receptionText = context.receptionText + '写地址通过' + '\n';
  Log.info('写地址通过')
  console.log('写地址通过')
  context.globalReceivedData = '';
  return notPass;

}


export const readAddress = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 84;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  let address = '';
  let packBuffer = packReadData();
  console.log('[请求报文]   读地址', arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]   读地址', arrayBuffer2Hex(packBuffer));
  context.globalReceivedData=''
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      Log.error('读地址-写入串口失败');
      console.error('读地址-写入串口失败');
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      console.warn('读地址报文:', context.globalReceivedData);
      console.warn('读地址报文长度:', context.globalReceivedData.length);
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    console.log('[响应报文]  读地址=>  ', context.globalReceivedData);
    Log.info('[响应报文]  读地址=>  ', context.globalReceivedData)
    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('读地址 进行重试 次数:', retries);
      console.warn('读地址 进行重试 次数:', retries);
      continue; // Retry
    }

    notPass = false;
  }

  if (retries >= maxRetries) {
    Log.error('读地址 失败-重试次数达到上限，操作失败');
    console.error('读地址 失败-重试次数达到上限，操作失败');
    context.globalReceivedData = '';
    return {notPass, address};
  }
  //
  address = decodeReadAddress(context.globalReceivedData);
  context.globalReceivedData = '';
  return {notPass, address};
}


export const readData = async (context) => {
  const maxRetries = 3;  // 最大重试次数
  const expectedPacketLength = 84;  // byte length
  const writeTimeout = 3000; // Timeout
  let retries = 0;  //已重试次数
  let notPass = true;
  let packBuffer = packReadData();
  console.log('[请求报文]   读数据', arrayBuffer2Hex(packBuffer));
  Log.info('[请求报文]   读数据', arrayBuffer2Hex(packBuffer));
  context.globalReceivedData = ''
  while (notPass && retries < maxRetries) {
    context.globalReceivedData = ''
    try {
      await doWritePort(context.serialPort, packBuffer)
    } catch {
      context.updateOperationMessage('验证温度失败', 'red');
      Log.error('读数据-写入串口失败');
      console.error('读数据-写入串口失败');
      context.receptionText = context.receptionText + '读数据-写入串口失败' + '\n';
      context.globalReceivedData = ''
      retries++;
      break;
    }
    //记录重试前开始的时间戳
    const startWaitTime = Date.now();
    while (Date.now() - startWaitTime < writeTimeout) {
      if (context.globalReceivedData !== '' && context.globalReceivedData.length / 2 === expectedPacketLength) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 超时重新发包
    if (context.globalReceivedData === '' || context.globalReceivedData.length / 2 < expectedPacketLength) {
      retries++;
      Log.warn('读数据失败 进行重试 次数:', retries);
      console.warn('读数据失败 进行重试 次数:', retries);
      context.receptionText += '读数据失败 失败进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    if (decodeCheckReadData(context.globalReceivedData)) {
      retries++;
      Log.warn('读数据失败进行重试 次数:', retries);
      console.warn('读数据失败进行重试 次数:', retries);
      context.receptionText += '读数据失败进行重试 次数:' + retries + '\n';
      continue; // Retry
    }
    console.log('[响应报文]  读数据=>  ', context.globalReceivedData);
    Log.info('[响应报文]  读数据=>  ', context.globalReceivedData)

    notPass = false;
  }

  if (retries >= maxRetries) {
    context.updateOperationMessage('验证温度失败', 'red');
    Log.error('读数据失败，已超出最大重试次数');
    console.log('读数据失败，已超出最大重试次数');
    context.receptionText = context.receptionText + '读数据失败，已超出最大重试次数' + '\n';
    context.globalReceivedData = '';
    return notPass;
  }

  //解析进回温
  let {address, inTemperature, outTemperature} = decodeTemperature(context.globalReceivedData);
  context.readDataAddress = address
  context.deviceInTemperature = inTemperature;
  context.deviceOutTemperature = outTemperature;
  Log.info('读数据成功 进温：' + inTemperature + ' 回温：' + outTemperature);
  console.log('读数据成功 进温：' + inTemperature + ' 回温：' + outTemperature);
  context.receptionText = context.receptionText + '读数据成功' + '\n';
  context.globalReceivedData = '';
  return notPass;
}





