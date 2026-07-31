import {checkPort} from "@/views/device/handler/portHandler";
import {playErrorAudio, playSuccessAudio} from "@/utils/audioUtils";
import {doCurrent4To20mADemarcateAEC100} from "@/views/device/operations/nb/collector/aec100/4-20mACalibration";
import {doZeroMpaDemarcatePTC100420MA} from "@/views/device/operations/modbus/ptc100-4-20ma/zeroMpaDemarcate";
import {
  doOnePointSixMpaDemarcatePTC100420MA
} from "@/views/device/operations/modbus/ptc100-4-20ma/onePointSixMpaDemarcate";
import {doDeviceInspectionPTC100420MA} from "@/views/device/operations/modbus/ptc100-4-20ma/deviceInspection";
import {
  dosSingleChannelCalibrationPTC100420MA
} from "@/views/device/operations/modbus/ptc100-4-20ma/singleChannelCalibration";
import {
  dosDoubleChannelCalibrationPTC100420MA
} from "@/views/device/operations/modbus/ptc100-4-20ma/doubleChannelCalibration";
import {doZeroMpaDemarcatePTC100RS485} from "@/views/device/operations/modbus/ptc100-RS485/zeroMpaDemarcate";
import {
  doOnePointSixMpaDemarcatePTC100RS485
} from "@/views/device/operations/modbus/ptc100-RS485/onePointSixMpaDemarcate";
import {doDeviceInspectionPTC100RS485} from "@/views/device/operations/modbus/ptc100-RS485/deviceInspection";

const Log = require('ee-core/log');

import * as CPT100 from './nb/otherdevice/cpt100'
import * as BDC100 from './nb/otherdevice/bdc100'

export const doZeroMpaDemarcate = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'PTC100-4-20MA': doZeroMpaDemarcatePTC100420MA,
    'PTC100-RS485': doZeroMpaDemarcatePTC100RS485,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '0MPa标定失败'
    setTimeout(() => {
      context.buttonWaiting('zeroMpaDemarcate');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `0MPa标定成功`;
  context.buttonSuccess('zeroMpaDemarcate');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('zeroMpaDemarcate');
  }, 2000);

  await playSuccessAudio(context);
};
export const doOnePointSixMpaDemarcate = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'PTC100-4-20MA': doOnePointSixMpaDemarcatePTC100420MA,
    'PTC100-RS485': doOnePointSixMpaDemarcatePTC100RS485,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '1.6MPa标定失败'
    setTimeout(() => {
      context.buttonWaiting('onePointSixMpaDemarcate');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `1.6MPa标定成功`;
  context.buttonSuccess('onePointSixMpaDemarcate');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('onePointSixMpaDemarcate');
  }, 2000);

  await playSuccessAudio(context);
};
export const doDeviceInspection = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'PTC100-4-20MA': doDeviceInspectionPTC100420MA,
    'PTC100-RS485': doDeviceInspectionPTC100RS485,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '检验电压失败'
    setTimeout(() => {
      context.buttonWaiting('deviceInspection');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `检验电压成功`;
  context.buttonSuccess('deviceInspection');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('deviceInspection');
  }, 2000);

  await playSuccessAudio(context);
};


export const doPowerInspection = async (context,protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'CPT100': CPT100.verify,
    'CPT100-10A': CPT100.verify,
    'BDC100&C17': BDC100.verify,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context,protocolId, type)) {
    context.leftWorkPrompt = '检验电压失败'
    context.buttonError('powerInspection')
    await playErrorAudio(context);
    setTimeout(() => {
      context.buttonWaiting('powerInspection');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `检验电压成功`;
  context.buttonSuccess('powerInspection');
  context.buttonEnable()
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('powerInspection');
  }, 2000);

  await playSuccessAudio(context);
};


export const doPowerCalibration = async (context,protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }
  const executeFunctionList = {
    'BDC100&C17': BDC100.calibration,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context,protocolId, type)) {
    context.leftWorkPrompt = '校准电压失败'
    context.buttonError('powerCalibration')
    await playErrorAudio(context);
    setTimeout(() => {
      context.buttonWaiting('powerCalibration');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `校准电压成功`;
  context.buttonSuccess('powerCalibration');
  context.buttonEnable()
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('powerCalibration');
  }, 2000);

  await playSuccessAudio(context);
};

export const doReadTemperature = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }

  const executeFunctionList = {
    'PTC100-RS485': doReadSelfTestStatusPTC100RS485,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '读温度成功'
    setTimeout(() => {
      context.buttonWaiting('readSelfTestStatus');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `读温度失败`;
  context.buttonSuccess('readSelfTestStatus');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('readSelfTestStatus');
  }, 2000);

  await playSuccessAudio(context);
};
export const doSingleChannelCalibration = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }


  const executeFunctionList = {
    'PTC100-4-20MA': dosSingleChannelCalibrationPTC100420MA,
    'DPC100-4/20mA': dosSingleChannelCalibrationPTC100420MA,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '单通道标定失败'
    setTimeout(() => {
      context.buttonWaiting('singleChannelCalibration');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `单通道标定成功`;
  context.buttonSuccess('singleChannelCalibration');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('singleChannelCalibration');
  }, 2000);

  await playSuccessAudio(context);
};
export const doDoubleChannelCalibration = async (context, type) => {
  context.messageClean();
  if (!checkPort(context, 'one')) {
    await playErrorAudio(context);
    return;
  }
  if (!checkPort(context, 'voltmeter')) {
    await playErrorAudio(context);
    return;
  }


  const executeFunctionList = {
    'PTC100-4-20MA': dosDoubleChannelCalibrationPTC100420MA,
  };
  const produceModel = context.configForm.produceModel;
  const executeFunction = executeFunctionList[produceModel];
  if (executeFunction && await executeFunction(context, type)) {
    context.leftWorkPrompt = '双通道标定失败'
    setTimeout(() => {
      context.buttonWaiting('doubleChannelCalibration');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `双通道标定成功`;
  context.buttonSuccess('doubleChannelCalibration');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('doubleChannelCalibration');
  }, 2000);

  await playSuccessAudio(context);
};
export const doCurrent4To20mADemarcate = async (context, protocolId, type) => {
  context.messageClean();
  if (!checkPort(context, type)) {
    await playErrorAudio(context);
    return;
  }
  const selfTestStrategies = {
    'AEC100': doCurrent4To20mADemarcateAEC100
  };
  const produceModel = context.configForm.produceModel;
  const selfTestFunction = selfTestStrategies[produceModel];
  if (selfTestFunction && await selfTestFunction(context, protocolId, type)) {
    context.leftWorkPrompt = '4-20Ma标定失败'
    setTimeout(() => {
      context.buttonWaiting('calibration4to20mA');
    }, 2000);
    return;
  }
  context.leftWorkPrompt = `4-20Ma标定成功`;
  context.buttonSuccess('calibration4to20mA');
  // 2 秒后切换为成功状态
  setTimeout(() => {
    context.buttonWaiting('calibration4to20mA');
  }, 2000);

  await playSuccessAudio(context);
};




