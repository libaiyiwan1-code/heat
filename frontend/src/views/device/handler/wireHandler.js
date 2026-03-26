// import { vac100WriteUpperAndLowerTemperatureLimits} from "@/views/device/action/deviceWireAction";
import {badPrompt, readWireDeviceAddress,} from "@/views/device/operations/wireDeviceOperations";
import {
  calibrationVerification,
  deviceMainAndAuxiliaryValves,
  deviceSeparationAlarm,
  deviceTemperatureCalibration,
  deviceVersionMatch,
  deviceWriteAddress, doScanVerification, enterCalibration,
  fullCloseCalibration,
  fullOpenCalibration, outputCalibration,
  panelCommunication,
  swipeCardFunction,
  writeCompleteConfiguration,
  writeOutFactoryOpenCondition
} from "@/views/device/action/deviceWireAction";
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {addressCover, arrayBuffer2Hex} from "@/packBuffer/common/comUtil";

const Log = require('ee-core/log');
export const executeWithAddress = async (protocolId, type, context, isInfraredDevice, action) => {
  let pass = await readWireDeviceAddress(protocolId, type, context, isInfraredDevice);
  const valveAddress = type === 'one' ? context.leftReadAddress : context.rightReadAddress;
  await action(valveAddress);
};


/**
 * 有线设备配置写入处理函数，支持动态起始点
 * @param {string} type - 工装位置 ('one' 或 'two') 代表左或右
 * @param {Object} context - 上下文对象
 * @param {string} protocolId - 协议ID
 * @param {string} [startOperation] -
 *    起始操作函数（
 *    writeAllConfig,
 *    factoryConditionFullyOpen,
 *    factoryConditionFullyClose
 *
 *    ）
 * @param isInitExecute 是否是初始化执行
 * @returns {Promise<boolean>} - 操作是否失败（true 表示失败，false 表示成功）
 */
export const executionProcess = async (type, protocolId, startOperation, context, isInitExecute = 0) => {
  let isCanceled = false;
  let openMission = false;
  let isInfraredDevice = false;
  if (
    context.configForm.produceModel === 'VAC130-4/20mA' || context.configForm.produceModel === 'VAC130-0/10V' || context.configForm.produceModel === 'VAC130-1/10V'||
    context.configForm.produceModel === 'VAC130H-4/20mA' || context.configForm.produceModel === 'VAC130H-0/10V' || context.configForm.produceModel === 'VAC130H-1/10V'

  ) {
    isInfraredDevice = true
  }
  if (type === 'one') {
    context.autoLeftWorkExecute = false;  //结束监听写地址聚焦
  } else if (type === 'two') {
    context.autoRightWorkExecute = false;  //结束监听写地址聚焦
  }
  let address = type === 'one' ? context.leftGenerateAddress : context.rightGenerateAddress
  if (address === '' || address === null || address === undefined) {
    if (type === 'one') {
      context.createLeftSpanMessage('请输入设备地址', 'red')
    } else {
      context.createRightSpanMessage('请输入设备地址', 'red')
    }
    context.$message.error('写地址前请输入设备地址')
    return false
  }
  if (address.length !== 8) {
    context.$message.error('写地址前请输入8位地址')
    if (type === 'one') {
      context.createLeftSpanMessage('写地址前请输入8位地址', 'red')
      context.leftGenerateAddress=''
    } else {
      context.createRightSpanMessage('写地址前请输入8位地址', 'red')
      context.rightGenerateAddress=''}
    return false
  }
  //按钮禁用全部,颜色初始化(灰色)
  context.wireDeviceButtonAwait(type)
  context.wireDeviceButtonDisabled(type)
  context.wireButtonDisabledStatus.printLabelOne=true
  context.wireButtonDisabledStatus.printLabelTwo=true
  //按钮颜色
  let configureWriteColor = type === 'one' ? 'configureWriteOneColor' : 'configureWriteTwoColor'
  let versionMatchColor = type === 'one' ? 'versionMatchOneColor' : 'versionMatchTwoColor'
  let writeAddressColor = type === 'one' ? 'writeAddressOneColor' : 'writeAddressTwoColor'
  let closeCalibrationColor = type === 'one' ? 'closeCalibrationOneColor' : 'closeCalibrationTwoColor'
  let openCalibrationColor = type === 'one' ? 'openCalibrationOneColor' : 'openCalibrationTwoColor'
  let panelCommunicationColor = type === 'one' ? 'panelCommunicationOneColor' : 'panelCommunicationTwoColor'
  let swipeCardFunctionColor = type === 'one' ? 'swipeCardFunctionOneColor' : 'swipeCardFunctionTwoColor'
  let separationAlarmColor = type === 'one' ? 'separationAlarmOneColor' : 'separationAlarmTwoColor'
  let mainAuxiliaryValveColor = type === 'one' ? 'mainAuxiliaryValveOneColor' : 'mainAuxiliaryValveTwoColor'
  let temperatureCalibrationColor = type === 'one' ? 'temperatureCalibrationOneColor' : 'temperatureCalibrationTwoColor'
  let factoryStatusWriteColor = type === 'one' ? 'factoryStatusWriteOneColor' : 'factoryStatusWriteTwoColor'
  let scanVerificationColor = type === 'one' ? 'scanVerificationOneColor' : 'scanVerificationTwoColor'
  let enterCalibrationColor = type === 'one' ? 'enterCalibrationOneColor' : 'enterCalibrationOneColor'
  let outputCalibrationColor = type === 'one' ? 'outputCalibrationOneColor' : 'outputCalibrationOneColor'
  let calibrationVerificationColor = type === 'one' ? 'calibrationVerificationOneColor' : 'calibrationVerificationOneColor'


  // 操作列顺序
  const operations = [
    {
      fn: writeCompleteConfiguration,
      name: '配置写入',
      actionType: 'writeCompleteConfiguration',
      buttonColor: configureWriteColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: deviceVersionMatch, name: '版本匹配', actionType: 'deviceVersionMatch', buttonColor: versionMatchColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: deviceWriteAddress, name: '地址写入', actionType: 'deviceWriteAddress', buttonColor: writeAddressColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: fullCloseCalibration,
      name: '全关标定',
      actionType: 'fullCloseCalibration',
      buttonColor: closeCalibrationColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: fullOpenCalibration, name: '全开标定', actionType: 'fullOpenCalibration', buttonColor: openCalibrationColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: panelCommunication, name: '面板通信', actionType: 'panelCommunication', buttonColor: panelCommunicationColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: swipeCardFunction, name: '刷卡功能', actionType: 'swipeCardFunction', buttonColor: swipeCardFunctionColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: deviceSeparationAlarm,
      name: '分离测试',
      actionType: 'deviceSeparationAlarm',
      buttonColor: separationAlarmColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: deviceMainAndAuxiliaryValves,
      name: '副阀通讯',
      actionType: 'deviceMainAndAuxiliaryValves',
      buttonColor: mainAuxiliaryValveColor,
      isInfraredDevice:isInfraredDevice,
    },
    {
      fn: deviceTemperatureCalibration,
      name: '温度标定',
      actionType: 'deviceTemperatureCalibration',
      buttonColor: temperatureCalibrationColor,
      isInfraredDevice:isInfraredDevice,
    },
    {
      fn: writeOutFactoryOpenCondition,
      name: '出厂配置',
      actionType: 'writeOutFactoryOpenCondition',
      buttonColor: factoryStatusWriteColor,
      isInfraredDevice:isInfraredDevice,
    },
    {
      fn: enterCalibration,
      name: '输入标定',
      actionType: 'deviceEnterCalibration',
      buttonColor: enterCalibrationColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: outputCalibration,
      name: '输出标定',
      actionType: 'deviceOutputCalibration',
      buttonColor: outputCalibrationColor,
      isInfraredDevice: isInfraredDevice,
    },
    {
      fn: calibrationVerification,
      name: '标定验证',
      actionType: 'deviceCalibrationVerification',
      buttonColor: calibrationVerificationColor,
      isInfraredDevice: isInfraredDevice,
    },


    {
      fn: doScanVerification, name: '扫码验证', actionType: 'doScanVerification', buttonColor: scanVerificationColor,
      isInfraredDevice: isInfraredDevice,
    },
  ];

  let startIndex = 0; //默认从配置写入开始执行
  // if (startOperation) {
  //   startIndex = operations.findIndex(op => op.actionType === startOperation);
  // }

  // 截取从起始操作开始的序列
  const operationsToExecute = operations.slice(startIndex);

  // 禁用按钮
  context.wireDeviceButtonDisabled(type);
  // 操作按钮文字变更
  if (type === 'one' && isInitExecute === 0) {
    context.processTextOne = '测试中'
  } else {
    context.processTextTwo = '测试中'
  }
  //控制上一次失败后续不在执行
  if (isCanceled) {
    return false
  }
  await executeWithAddress(protocolId, type, context, isInfraredDevice, async (valveAddress) => {
    //TODO 不接入设备直接失败
    if (valveAddress === undefined || valveAddress === '') {
      context.createLeftSpanMessage('读取地址失败', 'red')
      //流程失败从新执行 恢复监听与重试按钮
      if (type === 'one') {
        context.autoLeftWorkExecute = true;
        context.leftScanAddressMissionStop = false
        context.listenLeftFixture()
      } else if (type === 'two') {
        context.autoRightWorkExecute = true;
        context.rightScanAddressMissionStop = false
        context.listenRightFixture()

      }
      context.wireDeviceButtonEnabled(type);
      // context.wireDeviceButtonAwait(type)
      if (type === 'one') {
        context.processTextOne = '开始测试'
      } else {
        context.processTextTwo = '开始测试'
      }
      return
    }
    try {
      // 按顺序执行操作
      for (const {fn, name, actionType, buttonColor, isInfraredDevice} of operationsToExecute) {
        //写地址后的一个流程更新最新地址
        if (name === '全关标定') {
          await executeWithAddress(protocolId, type, context, isInfraredDevice, async (writeAfterAddress) => {
            valveAddress = writeAfterAddress;
          })
        }
        console.log(`当前执行流程： ${name} - ${type === 'one' ? '左侧工装' : '右侧工装'} `);
        Log.info(`当前执行流程： ${name} - ${type === 'one' ? '左侧工装' : '右侧工装'} `);
        if (name === '扫码验证') {
          if (type === 'one') {
            context.autoLeftWorkExecute = true;            //控制监听输入框地址录入的流程不执行
            context.leftScanAddressMissionStop = true            //控制监听输入框地址录入的流程不执行
            context.listenLeftFixture('scan', type)
          } else {
            context.autoRightWorkExecute = true;            //控制监听输入框地址录入的流程不执行
            context.rightScanAddressMissionStop = true            //控制监听输入框地址录入的流程不执行
            context.listenRightFixture('scan', type)
          }
        }
        const result = await fn(protocolId, type, context, buttonColor, isInfraredDevice);

        if (result) {
          if (type === 'one') {
            context.createLeftSpanMessage(name + ' 流程失败', 'red')
          } else {
            context.createRightSpanMessage(name + ' 流程失败', 'red')
          }
          console.log(`当前执行流程： ${name} - ${type === 'one' ? '左侧工装' : '右侧工装'} ,执行失败`);
          Log.info(`当前执行流程： ${name} - ${type === 'one' ? '左侧工装' : '右侧工装'} ,执行失败`);
          context.buttonError(buttonColor)
          // 操作失败 ，并从当前节点重试
          isCanceled = true; //取消上一次任务的标识
          //扫码验证流程失败上传最新地址
          if (name === '扫码验证') {
            await executeWithAddress(protocolId, type, context, isInfraredDevice, async (readAddress) => {
              await context.uploadMes(arrayBuffer2Hex(addressCover(readAddress.slice(0, 8))), 0, name + ' 流程失败')
            })
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          if (type === 'one') {
            context.leftWorkPrompt = '当前流程 ：' + name + '执行失败，请点击开始测试重新执行'
            context.leftWorkPromptColor = context.buttonColor.error
            context.leftBadProductQuantity++
            // 流程失败，焦点启动监听工装监听
            context.autoLeftWorkExecute = true;
            context.leftScanAddressMissionStop = false
            context.listenLeftFixture('scan')
          } else {
            context.rightWorkPrompt = '当前流程 ：' + name + '执行失败，请点击开始测试重新执行'
            context.rightWorkPromptColor = context.buttonColor.error
            context.rightBadProductQuantity++
            // 流程失败，焦点启动监听工装监听
            context.autoRightWorkExecute = true;
            context.rightScanAddressMissionStop = false
            context.listenRightFixture('scan')
          }
          context.wireDeviceButtonEnabled(type);
          // context.wireDeviceButtonAwait(type)
          if (type === 'one') {
            context.processTextOne = '开始测试'
          } else {
            context.processTextTwo = '开始测试'
          }
          openMission = false
          console.error('地址：', valveAddress, '执行失败的操作：', name);
          const params = {
            deviceName: context.defaultDeviceName,
            address: arrayBuffer2Hex(addressCover(valveAddress.substring(0, 8))),
            message: name + '失败',
            isDouble: context.configDetail.whetherDoubleRowPrinting==='是',
            width: context.configDetail.labelWith,
            margin: context.configDetail.labelMargin,
            marginLeft:context.configDetail.lableMarginLeft,
            secondColumnFontSize:context.configDetail.secondColumnFontSize,
            height: context.configDetail.labelHeight,
          };
          await ipc.send(ipcApiRoute.printErrorSingleRowInspectLabel5012, params)


          break

        } else {
          if (type === 'one') {
            if (name === '扫码验证') {
              context.processTextOne = '开始测试'
              context.leftGoodProductQuantity++
              context.leftWorkPrompt = '贴检验标签，完成后生产下一个'
              context.wireDeviceButtonEnabled(type);
              await executeWithAddress(protocolId, type, context, isInfraredDevice, async (readAddress) => {
                await context.uploadMes(arrayBuffer2Hex(addressCover(readAddress.slice(0, 8))), 1, '成功')
                const params = {
                   deviceName: context.defaultDeviceName,
                   address: arrayBuffer2Hex(addressCover(valveAddress.substring(0, 8))),
                    message: '检  ' + context.routerParam.pwd,
                    isDouble: context.configDetail.whetherDoubleRowPrinting==='是',
                    width: context.configDetail.labelWith,
                    margin: context.configDetail.labelMargin,
                    marginLeft:context.configDetail.lableMarginLeft,
                    secondColumnFontSize:context.configDetail.secondColumnFontSize,
                    height: context.configDetail.labelHeight,
                  }
                await ipc.send(ipcApiRoute.printSuccessSingleRowInspectLabel5012, params)
              })
              context.autoLeftWorkExecute = true
              context.leftScanAddressMissionStop = false
              //清空地址
              context.leftGenerateAddress = ''
              context.listenLeftFixture()
              break
            } else {
              context.leftWorkPrompt = '当前流程 ：' + name + '执行成功'
              context.leftWorkPromptColor = context.buttonColor.success
            }
          } else {
            if (name === '扫码验证') {
              context.processTextTwo = '开始测试'
              context.rightGoodProductQuantity++
              context.rightWorkPrompt = '贴检验标签，完成后生产下一个'
              context.wireDeviceButtonEnabled(type);
              await executeWithAddress(protocolId, type, context, isInfraredDevice, async (readAddress) => {
                await context.uploadMes(arrayBuffer2Hex(addressCover(readAddress.slice(0, 8))), 1, '成功')
                const params = {
                  deviceName: context.defaultDeviceName,
                  address: arrayBuffer2Hex(addressCover(valveAddress.substring(0, 8))),
                  message: '检  ' + context.routerParam.pwd,
                  isDouble: context.configDetail.whetherDoubleRowPrinting==='是',
                  width: context.configDetail.labelWith,
                  margin: context.configDetail.labelMargin,
                  marginLeft:context.configDetail.lableMarginLeft,
                  secondColumnFontSize:context.configDetail.secondColumnFontSize,
                  height: context.configDetail.labelHeight,
                };
                await ipc.send(ipcApiRoute.printSuccessSingleRowInspectLabel5012, params)
              })
              context.autoRightWorkExecute = true
              context.rightScanAddressMissionStop = false
              //清空地址
              context.rightGenerateAddress = ''
              context.listenRightFixture()
              break
            } else {
              context.rightWorkPrompt = '当前流程 ：' + name + '执行成功'
              context.rightWorkPromptColor = context.buttonColor.success
            }
            openMission = true
          }

        }
      }

    } catch (error) {
      console.error(`流程执行时发生错误 - ${type === 'one' ? '左侧工装' : '右侧工装'} 设备（地址: ${valveAddress}）: ${error.message}`);
      Log.error(`流程执行时发生错误 - ${type === 'one' ? '左侧工装' : '右侧工装'} 设备（地址: ${valveAddress}）: ${error.message}`);
      console.error(error.stack);
    }
  });

  return openMission;
};

//
// /**
//  * 重试，等待用户长按工装按钮触发报文交互并重新执行流程
//  * @param {string} type - 'one' 或 'two'
//  * @param {Object} context - 上下文对象
//  * @param {string} valveAddress - 设备地址
//  * @param {Array} operations - 完整的操作序列
//  * @param {string} protocolId - 协议ID
//  * @param {string} startOperation - 哪个流程失败了
//  * @returns {Promise<boolean>} - 重试成功或失败
//  */
// export const awaitRetry = async (type, context, valveAddress, operations, protocolId, startOperation, name) => {
//   let isExecute = false;  //默认不执行
//
//   // 等待用户长按工装按钮触发的报文
//   while (true) {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     const receivedData = type === 'one' ? context.receivedData.globalReceivedOneData : context.receivedData.globalReceivedTwoData;
//
//     if (receivedData === 'FEFEFE684685030F1F006416') {
//       // 清除接收数据
//       if (type === 'one') {
//         context.receivedData.globalReceivedOneData = '';
//       } else {
//         context.receivedData.globalReceivedTwoData = '';
//       }
//       isExecute = true;
//       break;
//     }
//
//     // 清除无效数据
//     if (type === 'one') {
//       context.receivedData.globalReceivedOneData = '';
//     } else {
//       context.receivedData.globalReceivedTwoData = '';
//     }
//   }
//
//   if (isExecute) {
//     await new Promise(resolve => setTimeout(resolve, 100));
//     if (type === 'one') {
//       context.leftWorkPrompt = ''
//       context.leftWorkPromptColor = context.buttonColor.waiting
//     } else {
//       context.rightWorkPrompt = ''
//       context.rightWorkPromptColor = context.buttonColor.waiting
//     }
//     try {
//       console.log(`重试流程从 ${name} 开始 - ${type === 'one' ? '左侧工装' : '右侧工装'}`);
//       Log.info(`重试流程从 ${name} 开始 - ${type === 'one' ? '左侧工装' : '右侧工装'}  `);
//       await executionProcess(type, protocolId, startOperation, context, -1);
//     } catch (error) {
//       console.error(`重试流程失败- ${type === 'one' ? '左侧工装' : '右侧工装'} : ${error.message}`);
//       Log.error(`重试流程失败 - ${type === 'one' ? '左侧工装' : '右侧工装'} : ${error.message}`);
//     }
//   }
//
// };


