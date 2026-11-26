/**
 * 产品型号可见性排除表
 * key   = 配置字段名
 * value = 该字段下【不展示】的型号黑名单
 */
const MODEL_VISIBILITY_EXCLUDE = {
  pressureProbes: [
    'NBT200', 'NBT400', 'WAC330HE', 'WAC330CE', 'AEC100',
    'CTW100', 'NTR300', 'NTR300RB', 'CPT100', 'BDC100&C17',
    'CPT100-10A', 'WAC330N', 'VAC005C', 'WAC300NY', 'CAT200P',
    'CAT200', 'CAT400', 'CAT400S', 'WAC230CF', 'WAC300SC',
    'PTC100-CAT1', 'WAC300NS',
  ],

  // 测温类型
  temperatureProbes: [
    'NBT200', 'NBT400', 'WAC330HE', 'WAC330CE', 'AEC100',
    'NTR300', 'NTR300RB', 'CPT100', 'BDC100&C17',
    'CPT100-10A', 'WAC330N', 'CAT200P', 'CAT200',
    'CAT400', 'CAT400S', 'WAC230CF', 'PTC100-CAT1',
  ],

  // 液位探头
  liquidLevelSensor: ['CTW100'],

  // 屏幕显示
  screenDisplay: [
    'NBT200', 'NBT400', 'AEC100', 'CTW100', 'NTR300',
    'NTR300RB', 'CPT100', 'BDC100&C17', 'CPT100-10A',
    'WAC330N', 'CAT200P', 'CAT200', 'CAT400', 'CAT400S',
    'WAC230CF', 'PTC100-CAT1',
  ],

  // 配置信息卡片左列
  configCardLeft: [
    'WAC330HE', 'WAC330CE', 'AEC100', 'CTW100', 'NBT400',
    'NBT200', 'NTR300', 'NTR300RB', 'CPT100', 'BDC100&C17',
    'CPT100-10A', 'WAC330N', 'CAT200P', 'CAT200', 'CAT400',
    'CAT400S', 'WAC230CF', 'PTC100-CAT1',
  ],
  // 模拟量误差
  analogError: [
    'VAC130-4/20mA',
    'VAC130-0/10V',
    'VAC130-1/10V',
    'VAC130H-4/20mA',
    'VAC130H-0/10V',
    'VAC130H-1/10V',
  ],
  // 功率误差
  powerError: [
    'CPT100-10A',
    'CPT100',
    'BDC100&C17',
  ],
  // 温度误差
  temperatureDiff: [
    'CPT100', 'BDC100&C17', 'CPT100-10A', 'AEC100', 'NBT400',
    'NBT200', 'NTR300', 'NTR300RB', 'WAC330N', 'CAT200P', 'CAT400',
    'CAT400S', 'WAC230CF', 'PTC100-CAT1'
  ],
  //使用电压表的设备
  equipmentUsesVoltmeter: [
    'PTC100-4-20MA', 'PTC100-RS485', 'CPT100', 'BDC100&C17', 'CPT100-10A'
  ],
  //电压流程处理按钮组
  voltageProcessingProcedureButtonGroup: [
    'PTC100-4-20MA', 'PTC100-RS485', 'PTC100-CAT1'
  ],
  //PTC100系列按钮组
  PTC100SeriesButtonGroup: [
    'PTC100-4-20MA', 'PTC100-RS485'
  ],
  //电压检验按钮
  powerInspectionButton: [
    'CPT100', 'BDC100&C17','CPT100-10A'
  ],
  //联网唤醒按钮
  awakenButton:[
    'WAC230CF', 'WAC710CD', 'WAC300CD', 'BeaconM',
    'NTP100C', 'CT1000', 'ET01', 'WAC300N', 'WAC300SC',
    'WAC330HE', 'WAC330CE', 'WAC300NH', 'WAC300NY',
    'CAT400', 'CAT200', 'CAT200P', 'CAT400S', 'CTW100',
    'WAC100N', 'WAC100NY', 'WAC200N', 'WAC300NZ',
    'WAC300NC', 'WAC300C-LG', 'WAC300CY', 'WAC300CS',
    'WAC400N', 'WAC730C', 'WAC730N', 'WAC300NS'
  ],
  //扫码验证按钮
  scanCodeVerificationButton:[
    'WAC710CD', 'WAC230CF', 'WAC300CD', 'BeaconM', 'NTP100C',
    'LPC210', 'LPC210E', 'LPC230', 'LPC230E', 'AEC100', 'CT1000', 'ET01',
    'WAC330HE', 'WAC330CE', 'WAC300N', 'WAC300SC', 'WAC300NH',
    'WAC300NY', 'CAT400', 'CAT200', 'CAT200P', 'CAT400S', 'CTW100',
    'WAC300NS', 'WAC400NS', 'VAC710S', 'WAC100N',
    'WAC100NY', 'WAC200N', 'WAC300NZ', 'WAC300NC', 'WAC300C',
    'WAC300C-LG', 'WAC300CY', 'WAC300CS', 'WAC400N',
    'VAC710', 'VAC710-JL', 'WAC500N', 'WAC510N', 'WAC520N',
    'WAC530N', 'WAC710N', 'WAC710NS', 'WAC710CS', 'WAC710L',
    'WAC550N', 'WAC600N', 'WAC610N', 'NBT100-AC',
    'NTC100', 'NBT400-AC', 'NTR200', 'NTR300', 'NTR300GZ',
    'WAT300NH', 'VAT100', 'NTP100', 'WAC710C'
  ],
  //退出自检按钮
  breakSelfTestButton:[
    'WAC710CD', 'WAC300CD', 'BeaconM', 'NTP100C', 'WAC730C',
    'LPC230E', 'AEC100', 'CT1000', 'ET01', 'WAC300N',
    'WAC300SC', 'WAC330HE', 'WAC330CE', 'WAC300NH', 'WAC300NY',
    'CAT400', 'CAT200', 'CAT200P', 'CAT400S',
    'NTR300C', 'PTC100-4-20MA', 'PTC100-RS485',
    'CTW100', 'WAC300NS', 'WAC400NS', 'WAC100N', 'WAC100NY',
    'WAC200N', 'WAC300NZ', 'WAC300NC', 'WAC300C', 'WAC300C-LG',
    'WAC300CY', 'WAC300CS', 'WAC400N', 'VAC710', 'VAC710-JL',
    'WAC500N', 'WAC510N', 'WAC520N', 'WAC530N', 'WAC710N',
    'WAC710NS', 'WAC710CS', 'WAC730N', 'WAC710L', 'WAC550N',
    'WAC600N', 'WAC610N', 'NBT100-AC', 'NTC100', 'NBT400-AC',
    'NTR200', 'NTR300', 'NTR300GZ', 'NTR300RB', 'WAT300NH',
    'VAT100', 'NTP100', 'NBT400', 'NBT200', 'WAC330N',
    'WAC710C', 'WAC230CF'
  ],

};


/**
 * 判断某型号在指定字段下是否应被隐藏
 */
export const isModelHiddenInField = (model, fieldKey) => {
  const list = MODEL_VISIBILITY_EXCLUDE[fieldKey];
  return Array.isArray(list) && list.includes(model);
};
