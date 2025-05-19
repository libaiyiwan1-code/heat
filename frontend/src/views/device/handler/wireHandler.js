// import { vac100WriteUpperAndLowerTemperatureLimits} from "@/views/device/action/deviceWireAction";
import {serialPortOperation} from "@/views/device/action/deviceAction";
import {protocolIDMap} from "@/views/device/enum/enum";
import {readWireDeviceAddress} from "@/views/device/operations/wireDeviceOperations";

const executeWithAddress = async (protocolId,type, context, action) => {
  let pass = await readWireDeviceAddress(protocolId,type, context);
  if (!pass) {
    return action(undefined)
  }
  const valveAddress = type === 'one' ? context.leftGenerateAddress: context.rightGenerateAddress;
  await action(valveAddress);
};


export const wireConfigWriteHandler = async (type, context, state = 1,protocolId) => {
  const productModel = context.workDetail.productModel;
  const regexVAC100 = /^VAC100/;
  const regexVAC200_300 = /^VAC[23]00/;
  let notPassResult = false
  console.log(regexVAC200_300.test(productModel))
  await executeWithAddress(protocolId,type, context, async (valveAddress) => {
    console.log(valveAddress)
    if (valveAddress === undefined) {
      notPassResult = true
      return notPassResult
    }
    console.warn('判断模式:', regexVAC100.test(productModel), regexVAC200_300.test(productModel))
    if (regexVAC100.test(productModel)) {
      // 多命令写入
      // if (await vac100WriteUpperAndLowerTemperatureLimits(type, context, valveAddress, context.configDetail, state)) {
      //   context.buttonSuccess( 'configureWrite')
      //   context.createLeftSpanMessage(context, valveAddress, type, 'VAC100-配置写入成功');
      //   // console.warn('--------vac100 执行任务 写温度上下限')
      //   // if (await vac100WritePowerOutagesAndWirelessAnomalies(type, context, valveAddress, context.configDetail, state)) {
      //   //   if (await vac100WriteHeatingDate(type, context, valveAddress, context.configDetail, state)) {
      //   //     if (await vac100WriteProbeConfiguration(type, context, valveAddress, context.configDetail, state)) {
      //   //       context.buttonSuccess(type, 'configureWrite')
      //   //       handleSuccess(context, valveAddress, type, 'VAC100-配置写入成功');
      //   //     } else {
      //   //       context.buttonError(type, 'configureWrite')
      //   //       handleError(context, valveAddress, type, 'VAC100-探头配置写入失败');
      //   //       notPassResult = true
      //   //       return notPassResult
      //   //     }
      //   //   } else {
      //   //     context.buttonError(type, 'configureWrite')
      //   //     handleError(context, valveAddress, type, 'VAC100-供暖日期写入失败');
      //   //     notPassResult = true
      //   //     return notPassResult
      //   //   }
      //   // } else {
      //   //   context.buttonError(type, 'configureWrite')
      //   //   handleError(context, valveAddress, type, 'VAC100-无线异常写入失败');
      //   //   notPassResult = true
      //   //   return notPassResult
      //   // }
      // } else {
      //   context.buttonError(type, 'configureWrite')
      //   handleError(context, valveAddress, type, 'VAC100-写配置失败');
      //   notPassResult = true
      //   return notPassResult
      // }
    } else if (regexVAC200_300.test(productModel)) {
      // 写全部配置
      let pass = await vac200WriteCompleteConfiguration(type, context, valveAddress, context.configDetail, state);
      if (pass) {
        // context.buttonSuccess(type, 'configureWrite')
      } else {
        // context.buttonError(type, errorNode)
        notPassResult = true
        return notPassResult

      }
    } else {
      context.$message.error('产品型号不前不匹配,当前产品型号：' + productModel)
    }
  });
  return notPassResult
};
