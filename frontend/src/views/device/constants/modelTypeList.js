/* ============ 1. 型号列表 ============ */
export const VAC_ACTUATORS = [
  'VAC002', 'VAC005C', 'VAC400', 'VAC100', 'VAC100R', 'VAC100Y',
  'VAC101', 'VAC103', 'VAC200', 'VAC200C', 'VAC200Y', 'VAC200S',
  'VAC200SC', 'VAC201', 'VAC203', 'VAC230', 'VAC330C', 'VAC300',
  'VAC300Z', 'VAC300H', 'VAC300HC', 'VAC710S', 'VAC710', 'VAC710-JL',
]

export const WAC_ACTUATORS = [
  'WAC100N', 'WAC100NY', 'WAC100L', 'WAC230CF', 'WAC200L', 'WAC200N',
  'WAC330N', 'WAC330NZ', 'WAC300L', 'WAC300LH', 'WAC303L', 'WAC300N',
  'WAC300SC', 'WAC300NH', 'WAC300NY', 'WAC300NZ', 'WAC300NS', 'WAC300NC',
  'WAC300C', 'WAC300C-LG', 'WAC300CY', 'WAC300CS', 'WAC330NE', 'WAC330HE',
  'WAC330CE', 'WAC300CD', 'BeaconM', 'WAC400N', 'WAC400NS', 'WAC500N',
  'WAC510N', 'WAC520N', 'WAC530N', 'WAC550N', 'WAC600N', 'WAC610N',
  'WAC730C', 'WAC710N', 'WAC710NS', 'WAC710CD', 'WAC710CS', 'WAC710C',
  'WAC730N', 'WAC710L',
]

export const TEMPERATURE_CONTROL_PANELS = [
  'TPC100', 'TPC400', 'TPC004', 'FKC100', 'TPC010',
  'TPC002', 'TPC003', 'TPC006', 'NBT100-AC',
]

export const ROOM_TEMPERATURE_COLLECTORS = [
  'NBC100', 'NBC200', 'NBC200C', 'NBT200', 'CAT200', 'CAT200P',
  'NTC100', 'NBT400', 'NBT400-AC', 'NBT400S', 'CAT400', 'CAT400S',
  'NTR200', 'NTR300', 'NTR300RB', 'NTR300C', 'NTR300GZ', 'WAT300NH',
  'VAT100', 'NTP100', 'NTP100C', 'VTP100',
  'PTC100-CAT1', 'PTC100-RF', 'PTC100-4-20mA', 'PTC100-RS485',
  'LPC300', 'LPC100-NB', 'LPC100-Cat1', 'LPC210', 'LPC210E',
  'LPC230-DF', 'LPC230-E', 'LPC110',
  'LPC130E-NB', 'LPC130B-NB', 'LPC130E-Cat1', 'LPC130B-Cat1',
  'CPT100', 'BDC100&C17', 'CPT100-10A', 'VPT100',
  'AEC100', 'CTW100',
]

/**
 * 低功耗采集器（原代码里是硬编码的型号）
 * 注意：这里的 'LPC230' / 'LPC230E' 与上面列表中的 'LPC230-DF' / 'LPC230-E' 是不同型号
 */
export const LOW_POWER_COLLECTORS = [
  'LPC230', 'LPC230E', 'AEC100',
  // 'RFT200', 'RFT200-CAT1',   ← printLabel 相关，已删
]

/* ============ 2. 系列标题 ============ */

export const SERIES_TITLE = {
  VAC:     '生产测试软件 - 执行器VAC系列 - ',
  WAC:     '生产测试软件 - 执行器WAC系列 - ',
  TPC:     '生产测试软件 - 温控面板系列 - ',
  RTC:     '生产测试软件 - 室温采集器系列 - ',
  LPC:     '生产测试软件 - 低功耗采集器系列 - ',
  DEFAULT: '生产测试软件',
}

/* ============ 3. 解析函数 ============ */

/**
 * 根据产品型号解析出标题
 * @param {string} produceModel - configForm.produceModel
 * @returns {string}
 */
export function resolveProductModelTitle(produceModel) {
  if (VAC_ACTUATORS.includes(produceModel))               return SERIES_TITLE.VAC
  if (WAC_ACTUATORS.includes(produceModel))               return SERIES_TITLE.WAC
  if (TEMPERATURE_CONTROL_PANELS.includes(produceModel))  return SERIES_TITLE.TPC
  if (ROOM_TEMPERATURE_COLLECTORS.includes(produceModel)) return SERIES_TITLE.RTC
  if (LOW_POWER_COLLECTORS.includes(produceModel))        return SERIES_TITLE.LPC
  return SERIES_TITLE.DEFAULT
}
