// import {checkPort, doWritePort} from "@/views/device/handler/portHandler";
//
// import {arrayBuffer2Hex} from "@/utils/util";
// import {
//   decodeCreditCardDone,
//   decodeCreditCardToBeContinued,
//   decodeCreditCardVerify,
//   decodeFactoryConditionFullyCloseVerify,
//   decodeFactoryConditionFullyOpenVerify,
//   decodeFullOffCalibrationVerify,
//   decodeFullOpenCalibrationVerify,
//   decodeGetInAndOutTemperature,
//   decodeGetVersion,
//   decodeInTemperatureCalibrationVerify,
//   decodeMainAndAuxiliaryValvesDone,
//   decodeMainAndAuxiliaryValvesToBeContinued,
//   decodeMainAndAuxiliaryValvesVerify,
//   decodeOutTemperatureCalibrationVerify,
//   decodePanelDetectionLostContact,
//   decodePanelDetectionLostNormal,
//   decodePanelDetectionVerify,
//   decodeReadAddress,
//   decodeReadVersionVerify,
//   decodeSeparationAlarmDone,
//   decodeSeparationAlarmToBeContinued,
//   decodeSeparationAlarmVerify,
//   decodeUpdateFullOffCalibrationState,
//   decodeUpdateFullOpenCalibrationState,
//   decodeValveStateClose,
//   decodeValveStateFault,
//   decodeValveStateOpen,
//   decodeWriteAddressVerify,
//   decodeWriteCompleteConfigurationVerify,
//   decodeWriteHeatingDateVerify,
//   decodeWritePowerOutagesAndWirelessAnomaliesVerify,
//   decodeWriteProbeConfigurationVerify,
//   decodeWriteUpperAndLowerTemperatureLimitsVerify
// } from "@/utils/decodebuffer/vacDevice";
// import {
//   handleError,
//   handleInfo,
//   handleMaxRetries,
//   handleRetry,
//   handleSuccess
// } from "@/views/device/components/messageNotifications";
// import {
//   doAddressWrite,
//   doCloseCalibration,
//   doConfigWrite,
//   doFactoryConditionFullyClose,
//   doFactoryConditionFullyOpen,
//   doMainAuxiliaryValve,
//   doOpenCalibration,
//   doPanelCommunication,
//   doScanVerification,
//   doSeparationAlarm,
//   doSwipeCardFunction,
//   doTemperatureCalibration,
//   doVersionMatch
// } from "@/views/device/handler/vacDeviceHandler";
// /*
// * state=1 重试执行
// * state=0 执行中
// * state=2 初始化执行
// * */
// const Log = require('ee-core/log');
//
//
// export const doVersionMatch = async (type, context) => {
//   let notPassResult = false
//   await executeWithAddress(type, context, async (valveAddress) => {
//     if (valveAddress === undefined) {
//       notPassResult = true
//       return notPassResult
//     }
//     let {pass, version} = await readVersion(type, context, valveAddress);
//     if (!pass) {
//       context.buttonError(type, 'versionMatch')
//       handleError(context, valveAddress, type, '读版本号失败');
//       notPassResult = true
//       return notPassResult
//     }
//     console.log('设备版本号:', version);
//     Log.info('设备版本号:', version);
//     if (version.toString() !== context.configDetail.version) {
//       context.buttonError(type, 'versionMatch')
//       handleError(context, valveAddress, type, '版本号不匹配');
//       notPassResult = true
//       return notPassResult
//     }
//     context.buttonSuccess(type, 'versionMatch')
//   });
//   return notPassResult
// };
//
//
// export const vac100WriteUpperAndLowerTemperatureLimits = async (type, context, valveAddress, data, state) => {
//   type === 'one' ? context.leftAllInButtonExecuteStatus = 1 : context.rightAllInButtonExecuteStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packWriteConfigAccordingToFunction(valveAddress, 'A0', '11', data);
//   handleInfo(context, valveAddress, type, '[请求报文]VAC100写温度上下限=>' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, 'VAC100写温度上下限-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('VAC100写温度上下限报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写温度上下限进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]VAC100写温度上下限=>' + receivedData);
//     if (decodeWriteUpperAndLowerTemperatureLimitsVerify(receivedData)) {
//       handleError(context, valveAddress, type, 'VAC100写温度上下限失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写温度上下限进行重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '写温度上下限失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, 'VAC100写温度上下限');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, () => doConfigWrite(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false;
//     }
//   }
//   handleSuccess(context, valveAddress, type, 'VAC100写温度上下限');
//   console.warn('触发流程 =========================>vac100 config write init')
//   if (pass) {
//     context.buttonSuccess(type, 'configureWrite')
//   } else {
//     context.buttonError(type, 'configureWrite')
//   }
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------vac100 写温度上限限,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('写温度上下限 节点初始化')
//   if (await vac100WritePowerOutagesAndWirelessAnomalies(type, context, valveAddress, data, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     if (await vac100WriteHeatingDate(type, context, valveAddress, data, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (await vac100WriteProbeConfiguration(type, context, valveAddress, data, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doVersionMatch(type, context) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           let newAddress = type === 'one' ? context.view.portAttribute.addressOne : context.view.portAttribute.addressTwo
//           if (!await doAddressWrite(type, context, newAddress, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doCloseCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.operatorLine === '3') {
//                   if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.swipeCard === '1') {
//                       if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.separateWarn === '1') {
//                           if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.mainAuxiliaryValve === '1') {
//                                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (context.configDetail.factoryOpening === '0') {
//                                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                           context.uploadSuccess(type, valveAddress, 0)
//                                         } else {
//                                           console.warn('doScanVerification 停止任务重试执行')
//                                           pass = false
//                                         }
//                                       } else {
//                                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                           context.uploadSuccess(type, valveAddress, 0)
//                                         } else {
//                                           console.warn('doScanVerification 停止任务重试执行')
//                                           pass = false
//                                         }
//                                       } else {
//                                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     }
//                                   } else {
//                                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 //主副阀无 继续执行
//                                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (context.configDetail.factoryOpening === '0') {
//                                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     //全关
//                                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                       pass = false
//                                     }
//
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               }
//
//                             } else {
//                               console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                             }
//                           } else {
//                             console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //分离警报 无, 判断主副阀
//                           if (context.configDetail.mainAuxiliaryValve === '1') {
//                             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//
//                                   } else {
//                                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //主副阀无 继续执行
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 //全关
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//
//                         }
//                       } else {
//                         console.warn('doSwipeCardFunction 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //刷卡无判断 分离警报
//                       if (context.configDetail.separateWarn === '1') {
//                         if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.mainAuxiliaryValve === '1') {
//                               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (context.configDetail.factoryOpening === '0') {
//                                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //主副阀无 继续执行
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   //全关
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//
//                           } else {
//                             console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                           }
//                         } else {
//                           console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //分离警报 无, 判断主副阀
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       }
//
//
//                     }
//                   } else {
//                     console.warn('doPanelCommunication 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //面板通信无 判断刷卡
//                   if (context.configDetail.swipeCard === '1') {
//                     if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.separateWarn === '1') {
//                         if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.mainAuxiliaryValve === '1') {
//                               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (context.configDetail.factoryOpening === '0') {
//                                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //主副阀无 继续执行
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   //全关
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//
//                           } else {
//                             console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                           }
//                         } else {
//                           console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //分离警报 无, 判断主副阀
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       }
//                     } else {
//                       console.warn('doSwipeCardFunction 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //刷卡无判断 分离警报
//                     if (context.configDetail.separateWarn === '1') {
//                       if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.mainAuxiliaryValve === '1') {
//                             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //主副阀无 继续执行
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 //全关
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//
//                         } else {
//                           console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                         }
//                       } else {
//                         console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //分离警报 无, 判断主副阀
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     }
//
//
//                   }
//
//
//                 }
//               } else {
//                 console.warn('doOpenCalibration 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doCloseCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           } else {
//             console.warn('doAddressWrite 停止任务重试执行')
//             pass = false
//           }
//
//         } else {
//           console.warn('doVersionMatch 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         console.warn('vac100WriteProbeConfiguration 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       console.warn('vac100WriteHeatingDate 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     console.warn('vac100WritePowerOutagesAndWirelessAnomalies 停止任务重试执行')
//     pass = false
//   }
//   return pass
// }
//
//
// export const vac100WritePowerOutagesAndWirelessAnomalies = async (type, context, valveAddress, data, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonExecuteStatus = 1 : context.button.rightAllInButtonExecuteStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packWriteConfigAccordingToFunction(valveAddress, 'A0', '26', data);
//   handleInfo(context, valveAddress, type, '[请求报文]VAC100写电源断电、无线异常=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, 'VAC100写电源断电、无线异常-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('VAC100写电源断电、无线异常报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写电源断电、无线异常进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]VAC100写电源断电、无线异常=>' + receivedData);
//     if (decodeWritePowerOutagesAndWirelessAnomaliesVerify(receivedData)) {
//       handleError(context, valveAddress, type, 'VAC100写电源断电、无线异常失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写电源断电、无线异常进行重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '写电源断电无线异常失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, 'VAC100写电源断电、无线异常');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     let retryResult = await awaitRetry(type, context, valveAddress, () => doConfigWrite(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false;
//     }
//   }
//   handleSuccess(context, valveAddress, type, 'VAC100写电源断电、无线异常');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------vac100 VAC100写电源断电、无线异常,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('vac100写电源断电、无线异常 节点初始化')
//   if (await vac100WriteHeatingDate(type, context, valveAddress, data, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     if (await vac100WriteProbeConfiguration(type, context, valveAddress, data, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (!await doVersionMatch(type, context) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         let newAddress = type === 'one' ? context.view.portAttribute.addressOne : context.view.portAttribute.addressTwo
//         if (!await doAddressWrite(type, context, newAddress, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (!await doCloseCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.operatorLine === '3') {
//                 if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.swipeCard === '1') {
//                     if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.separateWarn === '1') {
//                         if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.mainAuxiliaryValve === '1') {
//                               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (context.configDetail.factoryOpening === '0') {
//                                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                         context.uploadSuccess(type, valveAddress, 0)
//                                       } else {
//                                         console.warn('doScanVerification 停止任务重试执行')
//                                         pass = false
//                                       }
//                                     } else {
//                                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //主副阀无 继续执行
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   //全关
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//
//                           } else {
//                             console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                           }
//                         } else {
//                           console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //分离警报 无, 判断主副阀
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       }
//                     } else {
//                       console.warn('doSwipeCardFunction 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //刷卡无判断 分离警报
//                     if (context.configDetail.separateWarn === '1') {
//                       if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.mainAuxiliaryValve === '1') {
//                             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //主副阀无 继续执行
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 //全关
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//
//                         } else {
//                           console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                         }
//                       } else {
//                         console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //分离警报 无, 判断主副阀
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     }
//
//
//                   }
//                 } else {
//                   console.warn('doPanelCommunication 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //面板通信无 判断刷卡
//                 if (context.configDetail.swipeCard === '1') {
//                   if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.separateWarn === '1') {
//                       if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.mainAuxiliaryValve === '1') {
//                             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //主副阀无 继续执行
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 //全关
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//
//                         } else {
//                           console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                         }
//                       } else {
//                         console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //分离警报 无, 判断主副阀
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     }
//                   } else {
//                     console.warn('doSwipeCardFunction 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //刷卡无判断 分离警报
//                   if (context.configDetail.separateWarn === '1') {
//                     if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       } else {
//                         console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                       }
//                     } else {
//                       console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //分离警报 无, 判断主副阀
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   }
//
//
//                 }
//
//
//               }
//             } else {
//               console.warn('doOpenCalibration 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doCloseCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         } else {
//           console.warn('doAddressWrite 停止任务重试执行')
//           pass = false
//         }
//
//       } else {
//         console.warn('doVersionMatch 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       console.warn('vac100WriteProbeConfiguration 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     console.warn('vac100WriteHeatingDate 停止任务重试执行')
//     pass = false
//   }
//
//
//   return pass
// };
//
//
// export const vac100WriteHeatingDate = async (type, context, valveAddress, data, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packWriteConfigAccordingToFunction(valveAddress, 'A0', '19', data);
//   handleInfo(context, valveAddress, type, '[请求报文]VAC100写供暖起始、结束日期=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, 'VAC100写供暖起始、结束日期-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('VAC100写供暖起始、结束日期报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写供暖起始、结束日期进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]VAC100写供暖起始、结束日期=>' + receivedData);
//     if (decodeWriteHeatingDateVerify(receivedData)) {
//       handleError(context, valveAddress, type, 'VAC100写供暖起始、结束日期失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写供暖起始、结束日期进行重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '写供暖起始、结束日期失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, 'VAC100写供暖起始、结束日期');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doConfigWrite(type, context, 1))
//
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//
//   handleSuccess(context, valveAddress, type, 'VAC100写供暖起始、结束日期');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------vac100 VAC100写供暖起始、结束日期,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('VAC100写供暖起始、结束日期 节点初始化')
//   if (await vac100WriteProbeConfiguration(type, context, valveAddress, data, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     if (!await doVersionMatch(type, context) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       let newAddress = type === 'one' ? context.view.portAttribute.addressOne : context.view.portAttribute.addressTwo
//       if (!await doAddressWrite(type, context, newAddress, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doCloseCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.operatorLine === '3') {
//               if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.swipeCard === '1') {
//                   if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.separateWarn === '1') {
//                       if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.mainAuxiliaryValve === '1') {
//                             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (context.configDetail.factoryOpening === '0') {
//                                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                       context.uploadSuccess(type, valveAddress, 0)
//                                     } else {
//                                       console.warn('doScanVerification 停止任务重试执行')
//                                       pass = false
//                                     }
//                                   } else {
//                                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //主副阀无 继续执行
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 //全关
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//
//                         } else {
//                           console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                         }
//                       } else {
//                         console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //分离警报 无, 判断主副阀
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     }
//                   } else {
//                     console.warn('doSwipeCardFunction 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //刷卡无判断 分离警报
//                   if (context.configDetail.separateWarn === '1') {
//                     if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       } else {
//                         console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                       }
//                     } else {
//                       console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //分离警报 无, 判断主副阀
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   }
//
//
//                 }
//               } else {
//                 console.warn('doPanelCommunication 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //面板通信无 判断刷卡
//               if (context.configDetail.swipeCard === '1') {
//                 if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.separateWarn === '1') {
//                     if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       } else {
//                         console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                       }
//                     } else {
//                       console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //分离警报 无, 判断主副阀
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   }
//                 } else {
//                   console.warn('doSwipeCardFunction 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //刷卡无判断 分离警报
//                 if (context.configDetail.separateWarn === '1') {
//                   if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     } else {
//                       console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                     }
//                   } else {
//                     console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //分离警报 无, 判断主副阀
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 }
//
//
//               }
//
//
//             }
//           } else {
//             console.warn('doOpenCalibration 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           console.warn('doCloseCalibration 停止任务重试执行')
//           pass = false
//         }
//
//       } else {
//         console.warn('doAddressWrite 停止任务重试执行')
//         pass = false
//       }
//
//     } else {
//       console.warn('doVersionMatch 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     console.warn('vac100WriteProbeConfiguration 停止任务重试执行')
//     pass = false
//   }
//
//
//   return pass
// };
//
// export const vac100WriteProbeConfiguration = async (type, context, valveAddress, data, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packWriteConfigAccordingToFunction(valveAddress, 'AC', '09', data);
//   handleInfo(context, valveAddress, type, '[请求报文]VAC100写探头配置参数=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, 'VAC100写探头配置参数-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('写探头配置参数报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写探头配置参数进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]VAC100写探头配置参数=>' + receivedData);
//     if (decodeWriteProbeConfigurationVerify(receivedData)) {
//       handleError(context, valveAddress, type, 'VAC100写探头配置参数失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, 'VAC100写探头配置参数进行重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '写探头配置参数失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, 'VAC100写探头配置参数');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doConfigWrite(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, 'VAC100写探头配置参数');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------vac100 VAC100写探头配置参数,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('VAC100写探头配置参数 节点初始化')
//   if (!await doVersionMatch(type, context) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     let newAddress = type === 'one' ? context.view.portAttribute.addressOne : context.view.portAttribute.addressTwo
//     if (!await doAddressWrite(type, context, newAddress, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (!await doCloseCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.operatorLine === '3') {
//             if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.swipeCard === '1') {
//                 if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.separateWarn === '1') {
//                     if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       } else {
//                         console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                       }
//                     } else {
//                       console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //分离警报 无, 判断主副阀
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   }
//                 } else {
//                   console.warn('doSwipeCardFunction 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //刷卡无判断 分离警报
//                 if (context.configDetail.separateWarn === '1') {
//                   if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     } else {
//                       console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                     }
//                   } else {
//                     console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //分离警报 无, 判断主副阀
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 }
//
//
//               }
//             } else {
//               console.warn('doPanelCommunication 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //面板通信无 判断刷卡
//             if (context.configDetail.swipeCard === '1') {
//               if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.separateWarn === '1') {
//                   if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     } else {
//                       console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                     }
//                   } else {
//                     console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //分离警报 无, 判断主副阀
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 }
//               } else {
//                 console.warn('doSwipeCardFunction 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //刷卡无判断 分离警报
//               if (context.configDetail.separateWarn === '1') {
//                 if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   } else {
//                     console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                   }
//                 } else {
//                   console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //分离警报 无, 判断主副阀
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               }
//
//
//             }
//
//
//           }
//         } else {
//           console.warn('doOpenCalibration 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         console.warn('doCloseCalibration 停止任务重试执行')
//         pass = false
//       }
//
//     } else {
//       console.warn('doAddressWrite 停止任务重试执行')
//       pass = false
//     }
//
//   } else {
//     console.warn('doVersionMatch 停止任务重试执行')
//     pass = false
//   }
//
//
//   return pass
// };
//
// export const vac200WriteCompleteConfiguration = async (type, context, valveAddress, data, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packWriteConfigAccordingToFunction(valveAddress, 'AC', '02', data);
//   handleInfo(context, valveAddress, type, '[请求报文]写入完整配置=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '写入完整配置-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       console.log('写入完整配置报文:',receivedData)
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('写入完整配置-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '写入完整配置进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]写入完整配置=>' + receivedData);
//     if (decodeWriteCompleteConfigurationVerify(receivedData)) {
//       handleError(context, valveAddress, type, '写入完整配置失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '写入完整配置进行重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '写入完整配置失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '写入完整配置');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doConfigWrite(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//
//   }
//
//   handleSuccess(context, valveAddress, type, '写入完整配置');
//   if (pass) {
//     context.buttonSuccess(type, 'configureWrite')
//   } else {
//     context.buttonError(type, 'configureWrite')
//   }
//   if (state === 1 || state === 0) {
//     console.warn('----------------------------- VAC200写入完整配置,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('VAC200写入完整配置 节点初始化')
//
//   if (!await doVersionMatch(type, context) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     let newAddress = type === 'one' ? context.view.portAttribute.addressOne : context.view.portAttribute.addressTwo
//     if (!await doAddressWrite(type, context, newAddress, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (!await doCloseCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.operatorLine === '3') {
//             if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.swipeCard === '1') {
//                 if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.separateWarn === '1') {
//                     if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.mainAuxiliaryValve === '1') {
//                           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (context.configDetail.factoryOpening === '0') {
//                                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                     context.uploadSuccess(type, valveAddress, 0)
//                                   } else {
//                                     console.warn('doScanVerification 停止任务重试执行')
//                                     pass = false
//                                   }
//                                 } else {
//                                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                   pass = false
//                                 }
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //主副阀无 继续执行
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               //全关
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//
//                       } else {
//                         console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                       }
//                     } else {
//                       console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //分离警报 无, 判断主副阀
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   }
//                 } else {
//                   console.warn('doSwipeCardFunction 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //刷卡无判断 分离警报
//                 if (context.configDetail.separateWarn === '1') {
//                   if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     } else {
//                       console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                     }
//                   } else {
//                     console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //分离警报 无, 判断主副阀
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 }
//
//
//               }
//             } else {
//               console.warn('doPanelCommunication 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //面板通信无 判断刷卡
//             if (context.configDetail.swipeCard === '1') {
//               if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.separateWarn === '1') {
//                   if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.mainAuxiliaryValve === '1') {
//                         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (context.configDetail.factoryOpening === '0') {
//                               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                   context.uploadSuccess(type, valveAddress, 0)
//                                 } else {
//                                   console.warn('doScanVerification 停止任务重试执行')
//                                   pass = false
//                                 }
//                               } else {
//                                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                                 pass = false
//                               }
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //主副阀无 继续执行
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             //全关
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//
//                     } else {
//                       console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                     }
//                   } else {
//                     console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //分离警报 无, 判断主副阀
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 }
//               } else {
//                 console.warn('doSwipeCardFunction 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //刷卡无判断 分离警报
//               if (context.configDetail.separateWarn === '1') {
//                 if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   } else {
//                     console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                   }
//                 } else {
//                   console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //分离警报 无, 判断主副阀
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               }
//
//
//             }
//
//
//           }
//         } else {
//           console.warn('doOpenCalibration 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         console.warn('doCloseCalibration 停止任务重试执行')
//         pass = false
//       }
//
//     } else {
//       console.warn('doAddressWrite 停止任务重试执行')
//       pass = false
//     }
//
//   } else {
//     console.warn('doVersionMatch 停止任务重试执行')
//     pass = false
//   }
//
//   return pass
// };
//
//
// export const writeAddress = async (type, context, valveAddress, newValveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packWriteAddress(context,valveAddress, newValveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]写地址=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '写地址-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       console.log('写地址完整报文:',receivedData)
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('写地址失败-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '写地址-进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]写地址=>' + receivedData);
//     if (decodeWriteAddressVerify(receivedData, newValveAddress)) {
//       handleError(context, valveAddress, type, '写地址失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '写地址失败进行重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '写地址失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '写地址失败');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doAddressWrite(type, context, newValveAddress), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, '写地址成功');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------写地址,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('写地址 节点初始化')
//   if (!await doCloseCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (context.configDetail.operatorLine === '3') {
//         if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.swipeCard === '1') {
//             if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.separateWarn === '1') {
//                 if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.mainAuxiliaryValve === '1') {
//                       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (context.configDetail.factoryOpening === '0') {
//                             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doTemperatureCalibration 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                                 context.uploadSuccess(type, valveAddress, 0)
//                               } else {
//                                 console.warn('doScanVerification 停止任务重试执行')
//                                 pass = false
//                               }
//                             } else {
//                               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                               pass = false
//                             }
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //主副阀无 继续执行
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           //全关
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//
//                   } else {
//                     console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                   }
//                 } else {
//                   console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //分离警报 无, 判断主副阀
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               }
//             } else {
//               console.warn('doSwipeCardFunction 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //刷卡无判断 分离警报
//             if (context.configDetail.separateWarn === '1') {
//               if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 } else {
//                   console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                 }
//               } else {
//                 console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //分离警报 无, 判断主副阀
//               if (context.configDetail.mainAuxiliaryValve === '1') {
//                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //主副阀无 继续执行
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //全关
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//
//             }
//
//
//           }
//         } else {
//           console.warn('doPanelCommunication 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         //面板通信无 判断刷卡
//         if (context.configDetail.swipeCard === '1') {
//           if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.separateWarn === '1') {
//               if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 } else {
//                   console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                 }
//               } else {
//                 console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //分离警报 无, 判断主副阀
//               if (context.configDetail.mainAuxiliaryValve === '1') {
//                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 } else {
//                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //主副阀无 继续执行
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //全关
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//
//             }
//           } else {
//             console.warn('doSwipeCardFunction 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //刷卡无判断 分离警报
//           if (context.configDetail.separateWarn === '1') {
//             if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               } else {
//                 console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//               }
//             } else {
//               console.warn('doSeparationAlarm-分离 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //分离警报 无, 判断主副阀
//             if (context.configDetail.mainAuxiliaryValve === '1') {
//               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               } else {
//                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                 pass = false
//               }
//
//             } else {
//               //主副阀无 继续执行
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //全关
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//
//           }
//
//
//         }
//
//
//       }
//     } else {
//       console.warn('doOpenCalibration 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     console.warn('doCloseCalibration 停止任务重试执行')
//     pass = false
//   }
//
//
//   return pass
// };
//
// export const fullOffCalibration = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 22;  // byte length
//   const writeTimeout = 30000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packFullOffCalibration(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]全关标定=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '全关标定-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('全关标定-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '全关标定进行重试 报文长度不符合');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]全关标定=>' + receivedData);
//     if (decodeFullOffCalibrationVerify(receivedData)) {
//       handleError(context, valveAddress, type, '全关标定失败 ');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '全关标定进行重试  报文解析不符合');
//       continue;
//     }
//     let state = decodeUpdateFullOffCalibrationState(receivedData, type)
//     if (state === '02') {
//       handleError(context, valveAddress, type, '全关-标定失败(标定值不在限定范围)');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '全关-标定失败(标定值不在限定范围)'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doCloseCalibration(type, context), 1);
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     } else if (state === '03') {
//       handleError(context, valveAddress, type, '全关-标定超时');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '全关-标定超时'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doCloseCalibration(type, context), 1);
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     } else if (state === '04') {
//       handleError(context, valveAddress, type, '全关-标定故障');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '全关-标定故障'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doCloseCalibration(type, context), 1);
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '全关标定失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '全关标定');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doCloseCalibration(type, context), 1);
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, '全关标定');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------全关标定,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('全关标定 节点初始化')
//   if (!await doOpenCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     if (context.configDetail.operatorLine === '3') {
//       if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (context.configDetail.swipeCard === '1') {
//           if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.separateWarn === '1') {
//               if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.mainAuxiliaryValve === '1') {
//                     if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (context.configDetail.factoryOpening === '0') {
//                           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doTemperatureCalibration 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                               context.uploadSuccess(type, valveAddress, 0)
//                             } else {
//                               console.warn('doScanVerification 停止任务重试执行')
//                               pass = false
//                             }
//                           } else {
//                             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                             pass = false
//                           }
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //主副阀无 继续执行
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         //全关
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//
//                 } else {
//                   console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//                 }
//               } else {
//                 console.warn('doSeparationAlarm-分离 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //分离警报 无, 判断主副阀
//               if (context.configDetail.mainAuxiliaryValve === '1') {
//                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //主副阀无 继续执行
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //全关
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//
//             }
//           } else {
//             console.warn('doSwipeCardFunction 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //刷卡无判断 分离警报
//           if (context.configDetail.separateWarn === '1') {
//             if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               } else {
//                 console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//               }
//             } else {
//               console.warn('doSeparationAlarm-分离 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //分离警报 无, 判断主副阀
//             if (context.configDetail.mainAuxiliaryValve === '1') {
//               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //主副阀无 继续执行
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //全关
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//
//           }
//
//
//         }
//       } else {
//         console.warn('doPanelCommunication 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       //面板通信无 判断刷卡
//       if (context.configDetail.swipeCard === '1') {
//         if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.separateWarn === '1') {
//             if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               } else {
//                 console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//               }
//             } else {
//               console.warn('doSeparationAlarm-分离 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //分离警报 无, 判断主副阀
//             if (context.configDetail.mainAuxiliaryValve === '1') {
//               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               } else {
//                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //主副阀无 继续执行
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //全关
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//
//           }
//         } else {
//           console.warn('doSwipeCardFunction 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         //刷卡无判断 分离警报
//         if (context.configDetail.separateWarn === '1') {
//           if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.mainAuxiliaryValve === '1') {
//                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //主副阀无 继续执行
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //全关
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//
//             } else {
//               console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//             }
//           } else {
//             console.warn('doSeparationAlarm-分离 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //分离警报 无, 判断主副阀
//           if (context.configDetail.mainAuxiliaryValve === '1') {
//             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             } else {
//               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//               pass = false
//             }
//
//           } else {
//             //主副阀无 继续执行
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //全关
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           }
//
//         }
//
//
//       }
//
//
//     }
//   } else {
//     console.warn('doOpenCalibration 停止任务重试执行')
//     pass = false
//   }
//
//
//   return pass
// };
//
// export const fullOpenCalibration = async (type, context, valveAddress, state) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 22;  // byte length
//   const writeTimeout = 30000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packFullOpenCalibration(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]全开标定=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '全开标定-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('全开标定-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '全开标定进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]全开标定=>' + receivedData);
//     if (decodeFullOpenCalibrationVerify(receivedData)) {
//       handleError(context, valveAddress, type, '全开标定失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '全开标定进行重试');
//       continue;
//     }
//     let state = decodeUpdateFullOpenCalibrationState(receivedData, type)
//     if (state === '02') {
//       handleError(context, valveAddress, type, '全开-标定失败(标定值不在限定范围)');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '全开-标定失败(标定值不在限定范围)'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doOpenCalibration(type, context), 1)
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//
//     } else if (state === '03') {
//       handleError(context, valveAddress, type, '全开-标定超时');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '全开-标定超时'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doOpenCalibration(type, context), 1)
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     } else if (state === '04') {
//       handleError(context, valveAddress, type, '全开标定故障');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '全开标定故障'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doOpenCalibration(type, context), 1)
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '全开标定失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '全开标定');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doOpenCalibration(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//
//   }
//
//   handleSuccess(context, valveAddress, type, '全开标定');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------全开标定,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('全开标定 节点初始化')
//   if (context.configDetail.operatorLine === '3') {
//     if (!await doPanelCommunication(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (context.configDetail.swipeCard === '1') {
//         if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.separateWarn === '1') {
//             if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.mainAuxiliaryValve === '1') {
//                   if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (context.configDetail.factoryOpening === '0') {
//                         if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doTemperatureCalibration 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                             context.uploadSuccess(type, valveAddress, 0)
//                           } else {
//                             console.warn('doScanVerification 停止任务重试执行')
//                             pass = false
//                           }
//                         } else {
//                           console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                           pass = false
//                         }
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //主副阀无 继续执行
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       //全关
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//
//               } else {
//                 console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//               }
//             } else {
//               console.warn('doSeparationAlarm-分离 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //分离警报 无, 判断主副阀
//             if (context.configDetail.mainAuxiliaryValve === '1') {
//               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //主副阀无 继续执行
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //全关
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//
//           }
//         } else {
//           console.warn('doSwipeCardFunction 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         //刷卡无判断 分离警报
//         if (context.configDetail.separateWarn === '1') {
//           if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.mainAuxiliaryValve === '1') {
//                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //主副阀无 继续执行
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //全关
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//
//             } else {
//               console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//             }
//           } else {
//             console.warn('doSeparationAlarm-分离 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //分离警报 无, 判断主副阀
//           if (context.configDetail.mainAuxiliaryValve === '1') {
//             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //主副阀无 继续执行
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //全关
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           }
//
//         }
//
//
//       }
//     } else {
//       console.warn('doPanelCommunication 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     //面板通信无 判断刷卡
//     if (context.configDetail.swipeCard === '1') {
//       if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (context.configDetail.separateWarn === '1') {
//           if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.mainAuxiliaryValve === '1') {
//                 if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (context.configDetail.factoryOpening === '0') {
//                       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doTemperatureCalibration 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                           context.uploadSuccess(type, valveAddress, 0)
//                         } else {
//                           console.warn('doScanVerification 停止任务重试执行')
//                           pass = false
//                         }
//                       } else {
//                         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                         pass = false
//                       }
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //主副阀无 继续执行
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     //全关
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//
//             } else {
//               console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//             }
//           } else {
//             console.warn('doSeparationAlarm-分离 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //分离警报 无, 判断主副阀
//           if (context.configDetail.mainAuxiliaryValve === '1') {
//             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             } else {
//               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //主副阀无 继续执行
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //全关
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           }
//
//         }
//       } else {
//         console.warn('doSwipeCardFunction 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       //刷卡无判断 分离警报
//       if (context.configDetail.separateWarn === '1') {
//         if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.mainAuxiliaryValve === '1') {
//               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //主副阀无 继续执行
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //全关
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//
//           } else {
//             console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//           }
//         } else {
//           console.warn('doSeparationAlarm-分离 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         //分离警报 无, 判断主副阀
//         if (context.configDetail.mainAuxiliaryValve === '1') {
//           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           } else {
//             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//             pass = false
//           }
//
//         } else {
//           //主副阀无 继续执行
//           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.factoryOpening === '0') {
//               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //全关
//               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//           } else {
//             console.warn('doTemperatureCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         }
//
//       }
//
//
//     }
//
//
//   }
//
//
//   return pass
// };
//
// export const faceplateCommunication = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 55;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packSeparationAlarmVerify(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]面板通信检测=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '面板通信检测-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('面板通信检测-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '面板通信检测进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]面板通信检测=>' + receivedData);
//     if (decodePanelDetectionVerify(receivedData)) {
//       handleError(context, valveAddress, type, '面板通信检测失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '面板通信检测进行重试');
//       continue;
//     }
//     let lostContactState = decodePanelDetectionLostContact(receivedData, type)
//     let lostNormal = decodePanelDetectionLostNormal(receivedData, type)
//     if (lostContactState) {
//       handleError(context, valveAddress, type, '面板通信检测失败-面板失联');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '面板通信检测失败-面板失联'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doPanelCommunication(type, context), 1)
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//
//     } else if (lostNormal) {
//       //正常
//       handleSuccess(context, valveAddress, type, '面板通信检测');
//       pass = true;
//     } else {
//       handleError(context, valveAddress, type, '面板通信检测失败-面板失联');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '面板通信检测失败-面板失联'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doPanelCommunication(type, context), 1)
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//
//     }
//     pass = true
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '面板通信检测失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '面板通信检测');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doPanelCommunication(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, '面板通信检测成功');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------面板通信检测,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('面板通信检测 节点初始化')
//   //面板通信无 判断刷卡
//   if (context.configDetail.swipeCard === '1') {
//     if (!await doSwipeCardFunction(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (context.configDetail.separateWarn === '1') {
//         if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.mainAuxiliaryValve === '1') {
//               if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (context.configDetail.factoryOpening === '0') {
//                     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doTemperatureCalibration 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                         context.uploadSuccess(type, valveAddress, 0)
//                       } else {
//                         console.warn('doScanVerification 停止任务重试执行')
//                         pass = false
//                       }
//                     } else {
//                       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                       pass = false
//                     }
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doMainAuxiliaryValve 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //主副阀无 继续执行
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   //全关
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//
//           } else {
//             console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//           }
//         } else {
//           console.warn('doSeparationAlarm-分离 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         //分离警报 无, 判断主副阀
//         if (context.configDetail.mainAuxiliaryValve === '1') {
//           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           } else {
//             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //主副阀无 继续执行
//           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.factoryOpening === '0') {
//               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //全关
//               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//           } else {
//             console.warn('doTemperatureCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         }
//
//       }
//     } else {
//       console.warn('doSwipeCardFunction 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     //刷卡无判断 分离警报
//     if (context.configDetail.separateWarn === '1') {
//       if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.mainAuxiliaryValve === '1') {
//             if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (context.configDetail.factoryOpening === '0') {
//                   if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doTemperatureCalibration 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                       context.uploadSuccess(type, valveAddress, 0)
//                     } else {
//                       console.warn('doScanVerification 停止任务重试执行')
//                       pass = false
//                     }
//                   } else {
//                     console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                     pass = false
//                   }
//                 }
//               } else {
//                 console.warn('doTemperatureCalibration 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doMainAuxiliaryValve 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //主副阀无 继续执行
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 //全关
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//
//           }
//
//         } else {
//           console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//         }
//       } else {
//         console.warn('doSeparationAlarm-分离 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       //分离警报 无, 判断主副阀
//       if (context.configDetail.mainAuxiliaryValve === '1') {
//         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.factoryOpening === '0') {
//               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                 pass = false
//               }
//             }
//           } else {
//             console.warn('doTemperatureCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         } else {
//           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//           pass = false
//         }
//
//       } else {
//         //主副阀无 继续执行
//         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.factoryOpening === '0') {
//             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //全关
//             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//               pass = false
//             }
//
//           }
//         } else {
//           console.warn('doTemperatureCalibration 停止任务重试执行')
//           pass = false
//         }
//
//       }
//
//     }
//
//
//   }
//
//
//   return pass
// };
//
// export const creditCard = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 84;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packCreditCardVerify(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]刷卡检测=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '刷卡检测-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('刷卡检测-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '刷卡检测进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]刷卡检测=>' + receivedData);
//     if (decodeCreditCardVerify(receivedData)) {
//       handleError(context, valveAddress, type, '刷卡检测失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '刷卡检测进行重试');
//       continue;
//     }
//     let done = decodeCreditCardDone(receivedData, type)
//     let continuedState = decodeCreditCardToBeContinued(receivedData, type)
//     console.log(done)
//     if (done) {
//       //正常
//       handleSuccess(context, valveAddress, type, '刷卡检测');
//     } else if (continuedState) {
//       handleError(context, valveAddress, type, '刷卡检测检测失败');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '刷卡检测检测失败'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       let retryResult = await awaitRetry(type, context, valveAddress, () => doSwipeCardFunction(type, context), 1)
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//
//     } else {
//       handleError(context, valveAddress, type, '刷卡检测检测失败');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '刷卡检测检测失败'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doSwipeCardFunction(type, context), 1)
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '刷卡检测失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '刷卡检测');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doSwipeCardFunction(type, context), 1)
//
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, '刷卡检测');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------刷卡检测,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('刷卡检测 节点初始化')
//   //刷卡无判断 分离警报
//   if (context.configDetail.separateWarn === '1') {
//     if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (!await doSeparationAlarm(type, context, true, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (context.configDetail.mainAuxiliaryValve === '1') {
//           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doTemperatureCalibration 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //主副阀无 继续执行
//           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.factoryOpening === '0') {
//               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //全关
//               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//           } else {
//             console.warn('doTemperatureCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         }
//
//       } else {
//         console.warn('doSeparationAlarm-不分离 停止任务重试执行')
//       }
//     } else {
//       console.warn('doSeparationAlarm-分离 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     //分离警报 无, 判断主副阀
//     if (context.configDetail.mainAuxiliaryValve === '1') {
//       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.factoryOpening === '0') {
//             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//               pass = false
//             }
//           }
//         } else {
//           console.warn('doTemperatureCalibration 停止任务重试执行')
//           pass = false
//         }
//
//       } else {
//         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//         pass = false
//       }
//
//     } else {
//       //主副阀无 继续执行
//       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (context.configDetail.factoryOpening === '0') {
//           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               context.uploadSuccess(type, valveAddress, 0)
//             } else {
//               console.warn('doScanVerification 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //全关
//           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               context.uploadSuccess(type, valveAddress, 0)
//             } else {
//               console.warn('doScanVerification 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//             pass = false
//           }
//
//         }
//       } else {
//         console.warn('doTemperatureCalibration 停止任务重试执行')
//         pass = false
//       }
//
//     }
//
//   }
//
//
//   return pass
// };
//
// export const separationAlarm = async (type, context, valveAddress, separate, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 55;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packSeparationAlarmVerify(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]分离警报检测=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '分离警报检测-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('分离警报检测-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '分离警报检测进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]分离警报检测=>' + receivedData);
//     if (decodeSeparationAlarmVerify(receivedData)) {
//       handleError(context, valveAddress, type, '分离警报检测失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '分离警报检测重试');
//       continue;
//     }
//     let separationState = decodeSeparationAlarmToBeContinued(receivedData, type)
//     let done = decodeSeparationAlarmDone(receivedData, type)
//     if (separationState && separate) {
//       //分离验证成功
//       handleSuccess(context, valveAddress, type, '分离警报检测-分离');
//     } else if (done && !separate) {
//       handleSuccess(context, valveAddress, type, '分离警报检测-未分离');
//     } else {
//       handleError(context, valveAddress, type, '分离警报检测失败');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '分离警报检测失败'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doSeparationAlarm(type, context, separate), 1)
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '分离警报检测失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '分离警报检测');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doSeparationAlarm(type, context, separate), 1)
//
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------分离警报,当前函数已执行完成,取消当前重试或主流程执行上一次线程'
//       , '流程状态:', state === 1 ? '重试执行' : state === 0 ? '执行中' : '初始化执行')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('分离警报 节点初始化')
//   if (!separate) {
//     if (context.configDetail.mainAuxiliaryValve === '1') {
//       if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.factoryOpening === '0') {
//             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//
//             } else {
//               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//               pass = false
//             }
//
//           }
//         } else {
//           console.warn('doTemperatureCalibration 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         console.warn('doMainAuxiliaryValve 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       //主副阀无 继续执行
//       if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (context.configDetail.factoryOpening === '0') {
//           if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               context.uploadSuccess(type, valveAddress, 0)
//             } else {
//               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //全关
//           if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               context.uploadSuccess(type, valveAddress, 0)
//             } else {
//               console.warn('doScanVerification 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//             pass = false
//           }
//
//         }
//       } else {
//         console.warn('doTemperatureCalibration 停止任务重试执行')
//         pass = false
//       }
//
//     }
//
//   } else {
//     if (context.configDetail.separateWarn === '1') {
//       if (!await doSeparationAlarm(type, context, false, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (context.configDetail.mainAuxiliaryValve === '1') {
//           if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (context.configDetail.factoryOpening === '0') {
//                 if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//                 } else {
//                   console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                     context.uploadSuccess(type, valveAddress, 0)
//                   } else {
//                     console.warn('doScanVerification 停止任务重试执行')
//                     pass = false
//                   }
//
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//
//               }
//             } else {
//               console.warn('doTemperatureCalibration 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             console.warn('doMainAuxiliaryValve 停止任务重试执行')
//             pass = false
//           }
//         } else {
//           //主副阀无 继续执行
//           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.factoryOpening === '0') {
//               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               //全关
//               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                 pass = false
//               }
//
//             }
//           } else {
//             console.warn('doTemperatureCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         }
//       } else {
//         console.warn('doSeparationAlarm 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       //分离警报 无, 判断主副阀
//       if (context.configDetail.mainAuxiliaryValve === '1') {
//         if (!await doMainAuxiliaryValve(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//             if (context.configDetail.factoryOpening === '0') {
//               if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                   context.uploadSuccess(type, valveAddress, 0)
//                 } else {
//                   console.warn('doScanVerification 停止任务重试执行')
//                   pass = false
//                 }
//               } else {
//                 console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//                 pass = false
//               }
//             }
//           } else {
//             console.warn('doTemperatureCalibration 停止任务重试执行')
//             pass = false
//           }
//
//         } else {
//           console.warn('doMainAuxiliaryValve 停止任务重试执行')
//           pass = false
//         }
//
//       } else {
//         //主副阀无 继续执行
//         if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           if (context.configDetail.factoryOpening === '0') {
//             if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//               pass = false
//             }
//           } else {
//             //全关
//             if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//               if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//                 context.uploadSuccess(type, valveAddress, 0)
//               } else {
//                 console.warn('doScanVerification 停止任务重试执行')
//                 pass = false
//               }
//             } else {
//               console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//               pass = false
//             }
//
//           }
//         } else {
//           console.warn('doTemperatureCalibration 停止任务重试执行')
//           pass = false
//         }
//
//       }
//
//     }
//
//
//   }
//
//
//   return pass
// };
//
// export const mainAndAuxiliaryValves = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 58;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packMainAndAuxiliaryValvesVerify(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]主副阀检测=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '主副阀检测-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('主副阀检测-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '主副阀检测进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]主副阀检测=>' + receivedData);
//     if (decodeMainAndAuxiliaryValvesVerify(receivedData)) {
//       handleError(context, valveAddress, type, '主副阀检测失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '主副阀检测重试');
//       continue;
//     }
//     let continuedState = decodeMainAndAuxiliaryValvesToBeContinued(receivedData, type)
//     let done = decodeMainAndAuxiliaryValvesDone(receivedData, type)
//     if (continuedState) {
//       handleError(context, valveAddress, type, '副阀检测失败');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '副阀检测失败'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       // 获取重试后的结果
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doMainAuxiliaryValve(type, context), 1);
//
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//     } else if (done) {
//       //正常
//       handleSuccess(context, valveAddress, type, '主副阀检测');
//     } else {
//       handleError(context, valveAddress, type, '副阀检测失败');
//       let data = {
//         address: valveAddress,
//         workNo: context.routerParam.workNumber,
//         logot: 0,
//         machineNumber: context.routerParam.number,
//         badMemo: '副阀检测失败'
//       }
//       context.uploadDataList.push(data)
//       context.badQuantityChange(type)
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       await bad(type, context, valveAddress)
//       // 获取重试后的结果
//       const retryResult = await awaitRetry(type, context, valveAddress, () => doMainAuxiliaryValve(type, context), 1);
//       if (!retryResult) {
//         console.warn('重试失败，流程终止');
//         return false; // 重试失败返回 false
//       }
//
//
//     }
//
//
//     pass = true;
//
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '主副阀检测失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '主副阀检测');
//     await bad(type, context, valveAddress)
//     // 获取重试后的结果
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doMainAuxiliaryValve(type, context), 1);
//
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------当前函数已执行完成,取消当前重试或主流程执行上一次线程')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('主副阀检测 节点初始化')
//   if (!await doTemperatureCalibration(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     if (context.configDetail.factoryOpening === '0') {
//       if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           context.uploadSuccess(type, valveAddress, 0)
//         } else {
//           console.warn('doScanVerification 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//           context.uploadSuccess(type, valveAddress, 0)
//         } else {
//           console.warn('doScanVerification 停止任务重试执行')
//           pass = false
//         }
//       } else {
//         console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//         pass = false
//       }
//     }
//   } else {
//     console.warn('doTemperatureCalibration 停止任务重试执行')
//     pass = false
//   }
//
//   return pass
// };
//
// export const inTemperatureCalibration = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packInTemperatureCalibration(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]进温标定=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '进温标定-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('进温标定-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '进温标定进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]进温标定=>' + receivedData);
//     if (decodeInTemperatureCalibrationVerify(receivedData)) {
//       handleError(context, valveAddress, type, '进温标定失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '进温标定重试');
//       continue;
//     }
//     pass = true;
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '进温标定失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '进温标定');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doTemperatureCalibration(type, context, state), 1)
//
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, '进温标定');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------进温标定已执行完成,取消当前重试或主流程执行上一次线程')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('进温标定 节点初始化')
//   return pass
// };
//
// export const outTemperatureCalibration = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 19;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packOutTemperatureCalibration(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]回温标定=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '回温标定-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('回温标定-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '回温标定进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]回温标定=>' + receivedData);
//     if (decodeOutTemperatureCalibrationVerify(receivedData)) {
//       handleError(context, valveAddress, type, '回温标定失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '回温标定重试');
//       continue;
//     }
//     pass = true;
//
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '回温标定失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '回温标定');
//     await bad(type, context, valveAddress)
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doTemperatureCalibration(type, context), 1)
//
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//   }
//   handleSuccess(context, valveAddress, type, '回温标定');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------回温标定已执行完成,取消当前重试或主流程执行上一次线程')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('回温标定 节点初始化')
//   if (context.configDetail.factoryOpening === '0') {
//     if (!await doFactoryConditionFullyOpen(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         context.uploadSuccess(type, valveAddress, 0)
//       } else {
//         console.warn('doScanVerification 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       console.warn('doFactoryConditionFullyOpen 停止任务重试执行')
//       pass = false
//     }
//   } else {
//     if (!await doFactoryConditionFullyClose(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//       if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//         context.uploadSuccess(type, valveAddress, 0)
//       } else {
//         console.warn('doScanVerification 停止任务重试执行')
//         pass = false
//       }
//     } else {
//       console.warn('doFactoryConditionFullyClose 停止任务重试执行')
//       pass = false
//     }
//   }
//
//   return pass
// };
//
// export const factoryConditionFullyOpen = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 21;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packFactoryConditionFullyOpen(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]出厂状态全开=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '出厂状态全开-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('出厂状态全开-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '出厂状态全开进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]出厂状态全开=>' + receivedData);
//     if (decodeFactoryConditionFullyOpenVerify(receivedData)) {
//       handleError(context, valveAddress, type, '出厂状态全开失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '出厂状态全开重试');
//       continue;
//     }
//     pass = true;
//
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '出厂状态全开失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '出厂状态全开');
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     await bad(type, context, valveAddress)
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doFactoryConditionFullyOpen(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//
//
//   }
//   handleSuccess(context, valveAddress, type, '出厂状态全开');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------出厂状态全开,取消当前重试或主流程执行上一次线程')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('出厂状态全开 节点初始化')
//   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     context.uploadSuccess(type, valveAddress, 0)
//   } else {
//     console.warn('doScanVerification 停止任务重试执行')
//     pass = false
//   }
//
//   return pass
// };
// export const factoryConditionFullyClose = async (type, context, valveAddress, state = 1) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 21;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   if (!checkPort(context, type)) {
//     pass = false
//     return pass
//   }
//   let packBuffer = packFactoryConditionFullyClose(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]出厂状态全关=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '出厂状态全关-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('出厂状态全关-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '出厂状态全关进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]出厂状态全关=>' + receivedData);
//     if (decodeFactoryConditionFullyCloseVerify(receivedData)) {
//       handleError(context, valveAddress, type, '出厂状态全关失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '出厂状态全关重试');
//       continue;
//     }
//     pass = true;
//
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '出厂状态全关失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '出厂状态全关');
//     await bad(type, context, valveAddress)
//     await new Promise(resolve => setTimeout(resolve, 1500));
//     const retryResult = await awaitRetry(type, context, valveAddress, () => doFactoryConditionFullyClose(type, context), 1)
//     if (!retryResult) {
//       console.warn('重试失败，流程终止');
//       return false; // 重试失败返回 false
//     }
//
//   }
//   handleSuccess(context, valveAddress, type, '出厂状态全关');
//   if (state === 1 || state === 0) {
//     console.warn('-----------------------------出厂状态全关,取消当前重试或主流程执行上一次线程')
//     //返回任务执行合格状态
//     return true
//   }
//   console.warn('出厂状态全关 节点初始化')
//   if (!await doScanVerification(type, context, 0) && !(type === 'one' ? context.leftMissionRetry : context.rightMissionRetry)) {
//     context.uploadSuccess(type, valveAddress, 0)
//   } else {
//     console.warn('doScanVerification 停止任务重试执行')
//     pass = false
//   }
//   return pass
// };
//
// export const readVersion = async (type, context, valveAddress) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 20;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   let version;
//   if (!checkPort(context, type)) {
//     pass = false
//     return {pass, version}
//   }
//   let packBuffer = packReadVersion(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]读版本号=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '读版本号-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('读版本号-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     console.log('笨笨好', receivedData)
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '读版本号进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]读版本号=>' + receivedData);
//     if (decodeReadVersionVerify(receivedData)) {
//       handleError(context, valveAddress, type, '读版本号失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '读版本号重试');
//       continue;
//     }
//     pass = true;
//     version = decodeGetVersion(receivedData)
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '读版本号失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '读版本号');
//     return {pass, version};
//   }
//   handleSuccess(context, valveAddress, type, '读版本号');
//   return {pass, version}
//
// }
//
// export const readInAndOutTemperature = async (type, context, valveAddress) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 55;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   let inTemperature, outTemperature
//   if (!checkPort(context, type)) {
//     pass = false
//     return {pass, inTemperature, outTemperature}
//   }
//   let packBuffer = packSeparationAlarmVerify(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]读取进回温=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '读取进回温-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('读取进回温-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '读取进回温进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]读取进回温=>' + receivedData);
//     if (decodeSeparationAlarmVerify(receivedData)) {
//       handleError(context, valveAddress, type, '读取进回温失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '读取进回温重试');
//       continue;
//     }
//     ({inTemperature, outTemperature} = decodeGetInAndOutTemperature(receivedData))
//     pass = true
//
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '读取进回温失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     handleMaxRetries(context, valveAddress, type, '读取进回温');
//     return {pass, inTemperature, outTemperature}
//   }
//
//
//   return {pass, inTemperature, outTemperature}
// };
//
// export const readValveState = async (type, context, valveAddress) => {
//   type === 'one' ? context.button.leftAllInButtonStatus = 1 : context.button.rightAllInButtonStatus = 1
//   const maxRetries = 3;  // 最大重试次数
//   const expectedPacketLength = 55;  // byte length
//   const writeTimeout = 5000; // Timeout
//   let retries = 0;  //已重试次数
//   let pass = false;
//   let valveState
//   if (!checkPort(context, type)) {
//     pass = false
//     return {pass, valveState}
//   }
//   let packBuffer = packSeparationAlarmVerify(valveAddress);
//   handleInfo(context, valveAddress, type, '[请求报文]读阀门状态=> ' + arrayBuffer2Hex(packBuffer));
//   while (!pass && retries < maxRetries) {
//     try {
//       await writePort(context, packBuffer, type);
//     } catch {
//       handleError(context, valveAddress, type, '读阀门状态-写入串口失败');
//       continue;
//     }
//     //记录重试前开始的时间戳
//     const startWaitTime = Date.now();
//     while (Date.now() - startWaitTime < writeTimeout) {
//       const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//       if (receivedData !== '' && receivedData.length / 2 === expectedPacketLength) {
//         console.log('读阀门状态-报文长度:', receivedData.length);
//         break;
//       }
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//     // 超时重新发包
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     if (receivedData === '' || receivedData.length / 2 !== expectedPacketLength) {
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '读阀门状态进行重试');
//       continue; // Retry
//     }
//     handleInfo(context, valveAddress, type, '[响应报文]读阀门状态=>' + receivedData);
//     if (decodeSeparationAlarmVerify(receivedData)) {
//       handleError(context, valveAddress, type, '读阀门状态失败');
//       retries++;
//       handleRetry(context, valveAddress, type, retries, '读阀门状态重试');
//       continue;
//     }
//     pass = true
//     if (decodeValveStateFault(receivedData)) {
//       valveState = '故障'
//     } else if (decodeValveStateClose(receivedData)) {
//       valveState = '阀关'
//     } else if (decodeValveStateOpen(receivedData)) {
//       valveState = '阀开'
//     }
//   }
//   if (retries >= maxRetries) {
//     let data = {
//       address: valveAddress,
//       workNo: context.routerParam.workNumber,
//       logot: 0,
//       machineNumber: context.routerParam.number,
//       badMemo: '读阀门状态失败'
//     }
//     context.uploadDataList.push(data)
//     context.badQuantityChange(type)
//     await handleMaxRetries(context, valveAddress, type, '读阀门状态');
//     return {pass, valveState}
//   }
//
//
//   return {pass, valveState}
// };
//
//
// export const awaitRetry = async (type, context, valveAddress, action, state) => {
//   let isExecute = true
//   while (true) {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     if (type === 'one' ? context.leftMissionRetry : context.rightMissionRetry) {
//       //任务从试结束 .
//       console.warn('流程全部重试触发  action no execute ')
//       isExecute = false
//       break
//     }
//     const receivedData = type === 'one' ? context.view.receivedData.globalReceivedOneData : context.view.receivedData.globalReceivedTwoData;
//     // console.warn('重试等待报文=====>', receivedData)
//     if (receivedData === 'FEFEFE684685030F1F006416') {
//       type === 'one' ? context.view.receivedData.globalReceivedOneData = '' : context.view.receivedData.globalReceivedTwoData = '';
//       break
//     }
//     type === 'one' ? context.view.receivedData.globalReceivedOneData = '' : context.view.receivedData.globalReceivedTwoData = '';
//   }
//   if (isExecute) {
//     await action(state)
//   } else {
//     return false
//   }
// };
// export const bad = async (type, context, valveAddress) => {
//   if (!checkPort(context, type)) {
//     return
//   }
//   handleInfo(context, valveAddress, type, '[请求报文]不良品提示=> ' + arrayBuffer2Hex(packBad()));
//   try {
//     await writePort(context, packBad(), type);
//   } catch {
//     handleError(context, valveAddress, type, '不良品提示-写入串口失败');
//   }
//
//   type === 'one' ? context.view.receivedData.globalReceivedOneData = '' : context.view.receivedData.globalReceivedTwoData = '';
// }
