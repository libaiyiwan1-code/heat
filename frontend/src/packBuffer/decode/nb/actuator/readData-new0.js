import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";

/**
 * 执行器读数据（90 20）解包
 * - 每一项前显示对应原始字节
 * - 格式：xx xx // 字段名：值
 * @param {Object} context  Vue 组件实例
 * @param {String} responseMessage   十六进制字符串
 * @returns {Boolean} notPass  true=校验失败/解析失败；false=成功
 */
export function readData(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  // 索引从 22 开始 自发自收 + 3 个 FE
  const base = 22;

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('读数据解析失败：帧起始符不是 0x68', 'red');
    return true;
  }

  // ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(base + 1);
  const ctrlCode  = dataView.getUint8(base + 9);
  const dataLen   = dataView.getUint8(base + 10);

  if (ctrlCode !== 0x81) {
    context.createLeftSpanMessage(
      `读数据应答控制码异常：0x${ctrlCode.toString(16).toUpperCase()}（期望 0x81）`,
      'red'
    );
    return true;
  }

  // ---------- 3. 工具函数 ----------
  const readU8  = (o) => dataView.getUint8(base + o);
  const readU16 = (o) => dataView.getUint16(base + o, true);
  const readU32 = (o) => dataView.getUint32(base + o, true);

  // 取原始 hex
  const rawHex = (o, len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(dataView.getUint8(base + o + i).toString(16).padStart(2, '0').toUpperCase());
    }
    return arr.join(' ');
  };

  // 每一项前加原始 hex
  const log = (label, value, unit = '', color = 'grey', raw = '') => {
    const prefix = raw ? `${raw} // ` : '';
    context.createLeftSpanMessage(`${prefix}${label}：${value}${unit}`, color);
  };

  // ---------- 4. 头信息 ----------
  context.createLeftSpanMessage('===== 执行器读数据（90 20）解析 =====', '#1976D2');

  log('仪表类型 T', `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`, '', 'grey', rawHex(1, 1));

  const addr = Array.from({ length: 4 }, (_, i) =>
    readU8(2 + i).toString(16).padStart(2, '0')
  ).join('').toUpperCase();
  context.leftReadAddress = addr;
  log('阀门地址', addr, '', 'grey', rawHex(2, 4));

  const vendor = [6, 7, 8].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  log('厂家代码', vendor, '', 'grey', rawHex(6, 3));

  log('控制码', `0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`, '', 'grey', rawHex(9, 1));
  log('数据长度 L', dataLen, '', 'grey', rawHex(10, 1));

  const dataId = [11, 12].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  log('数据标识', dataId, '', 'grey', rawHex(11, 2));
  log('序列号', readU8(13), '', 'grey', rawHex(13, 1));

  // ---------- 5. 累计类 ----------
  log('累积工作时间',   readU32(14), ' 分钟', 'grey', rawHex(14, 4));
  log('累积阀开时间',   readU32(18), ' 分钟', 'grey', rawHex(18, 4));
  log('执行器动作次数', readU32(22), ' 次',   'grey', rawHex(22, 4));
  log('执行器开关次数', readU32(26), ' 次',   'grey', rawHex(26, 4));
  log('执行器累计行程', readU32(30), '',      'grey', rawHex(30, 4));
  log('累计自检次数',   readU32(34), ' 次',   'grey', rawHex(34, 4));
  log('累计自适应次数', readU32(38), ' 次',   'grey', rawHex(38, 4));
  log('累计堵转次数',   readU32(42), ' 次',   'grey', rawHex(42, 4));
  log('累计超时次数',   readU32(46), ' 次',   'grey', rawHex(46, 4));

  // ---------- 6. 补偿电角度 ----------
  log('正转补偿电角度', (readU16(50) * 0.1).toFixed(1), ' °', 'grey', rawHex(50, 2));
  log('反转补偿电角度', (readU16(52) * 0.1).toFixed(1), ' °', 'grey', rawHex(52, 2));

  // ---------- 7. 当前运行模式 ----------
  const runModeMap = {
    0x00: '正常', 0x01: '自适应', 0x02: '生产自检标定',
    0x03: '堵转测试', 0x04: '无刷电机效率测试',
    0x05: '开关寿命测试', 0x06: '其他测试',
  };
  const runModeRaw = readU8(54);
  log('当前运行模式',
    `${runModeMap[runModeRaw] ?? '未知'}（0x${runModeRaw.toString(16).padStart(2, '0').toUpperCase()}）`,
    '', 'grey', rawHex(54, 1)
  );

  // ---------- 8. 模拟量输入/输出信号配置 ----------
  const analogCfgMap = { 0x00: '电流', 0x01: '电压', 0x02: 'RS485' };
  const inCfg  = readU8(55);
  const outCfg = readU8(56);
  log('模拟量输入信号配置',
    analogCfgMap[inCfg] ?? `未知(0x${inCfg.toString(16).padStart(2, '0').toUpperCase()})`,
    '', 'grey', rawHex(55, 1)
  );
  log('模拟量输出信号配置',
    analogCfgMap[outCfg] ?? `未知(0x${outCfg.toString(16).padStart(2, '0').toUpperCase()})`,
    '', 'grey', rawHex(56, 1)
  );

  // ---------- 9. 模拟量数值 ----------
  log('模拟量输入电流值', (readU32(57) * 0.001).toFixed(3), ' mA', 'grey', rawHex(57, 4));
  log('模拟量输入电压值', (readU32(61) * 0.001).toFixed(3), ' V',  'grey', rawHex(61, 4));
  log('模拟量输出电流值', (readU32(65) * 0.001).toFixed(3), ' mA', 'grey', rawHex(65, 4));
  log('模拟量输出电压值', (readU32(69) * 0.001).toFixed(3), ' V',  'grey', rawHex(69, 4));

  // ---------- 10. 开度相关 ----------
  const resolution = readU8(73);
  const openScale  = resolution === 1 ? 0.1 : 1;
  const resolutionText = resolution === 1 ? '千分级'
    : resolution === 10 ? '百分级'
      : `未知(${resolution})`;
  log('当前开度分辨率', resolutionText, '', 'grey', rawHex(73, 1));

  log('当前开度', (readU16(74) * openScale).toFixed(1), ' %', 'grey', rawHex(74, 2));
  log('输入信号死区', (readU16(76) * 0.1).toFixed(1), ' %', 'grey', rawHex(76, 2));

  const dirRaw = readU8(78);
  log('输入信号增大对应动作', dirRaw === 0 ? '开' : '关', '', 'grey', rawHex(78, 1));

  log('模拟量输入换算目标开度', (readU16(79) * openScale).toFixed(1), ' %', 'grey', rawHex(79, 2));
  log('模拟量输入对应目标开度（死区外）', (readU16(81) * openScale).toFixed(1), ' %', 'grey', rawHex(81, 2));
  log('最终目标开度', (readU16(83) * openScale).toFixed(1), ' %', 'grey', rawHex(83, 2));

  // ---------- 11. 电机相关 ----------
  log('当前电机电流 AD 值', readU16(85), '', 'grey', rawHex(85, 2));
  log('当前控制电机 PWM 占空比', (readU16(87) * 0.1).toFixed(1), ' %', 'grey', rawHex(87, 2));
  log('当前开度到位死区', (readU16(89) * 0.1).toFixed(1), ' %', 'grey', rawHex(89, 2));
  log('当前行程时间档位', readU16(91), ' ms', 'grey', rawHex(91, 2));
  log('当前转速', readU16(93), ' rpm', 'grey', rawHex(93, 2));
  log('目标转速', readU16(95), ' rpm', 'grey', rawHex(95, 2));

  const torqueMap = { 0: '3Nm', 1: '5Nm', 2: '10Nm' };
  const torqueRaw = readU8(97);
  log('当前扭矩档位', torqueMap[torqueRaw] ?? `未知(${torqueRaw})`, '', 'grey', rawHex(97, 1));

  log('当前过流限制 AD 值', readU16(98), '', 'grey', rawHex(98, 2));

  // ---------- 12. 拨码组合位图 ----------
  const dip     = readU16(100);
  const dipLow  = dip & 0xFF;
  const dipHigh = (dip >> 8) & 0xFF;
  log('当前拨码组合位图', `0x${dip.toString(16).padStart(4, '0').toUpperCase()}`, '', 'grey', rawHex(100, 2));

  if (dip !== 0) {
    log('  ├ [拨码-字节1-Bit0] S1-1',
      (dipLow & 0x01) ? 'OFF 状态，信号增大执行器开' : 'ON 状态，信号增大执行器关',
      '', 'grey', rawHex(100, 1));
    log('  ├ [拨码-字节1-Bit2] S1-3',
      (dipLow & 0x04) ? 'OFF 状态，控制信号为电流型' : 'ON 状态，控制信号为电压型',
      '', 'grey', rawHex(100, 1));
    log('  ├ [拨码-字节1-Bit3] S1-4',
      (dipLow & 0x08) ? 'OFF 状态，反馈信号为电流型' : 'ON 状态，反馈信号为电压型',
      '', 'grey', rawHex(100, 1));

    const bit4On = (dipLow & 0x10) === 0;
    log('  ├ [拨码-字节1-Bit4] S1-5',
      bit4On ? 'ON 状态，断信号开关功能启用' : 'OFF 状态，断信号开关功能禁用',
      '', 'grey', rawHex(100, 1));

    if (bit4On) {
      log('  └ [拨码-字节1-Bit5] S1-6',
        (dipLow & 0x20) ? 'OFF 状态，断信号关' : 'ON 状态，断信号开',
        '', 'grey', rawHex(100, 1));
    } else {
      log('  └ [拨码-字节1-Bit5] S1-6',
        '（断信号开关功能未启用，忽略）[断信号保位]',
        '', 'grey', rawHex(100, 1));
    }

    if (dipHigh !== 0) {
      log('  └ [拨码-字节2] 预留字节',
        `0x${dipHigh.toString(16).padStart(2, '0').toUpperCase()}（暂无定义）`,
        '', 'grey', rawHex(101, 1));
    }
  }

  // ---------- 13. 状态 / 标定 ----------
  log('模拟量输入信号是否存在', readU8(102) === 1 ? '存在' : '不存在', '', 'grey', rawHex(102, 1));
  log('4-20mA 输入输出全标定通过', readU8(103) === 1 ? '通过' : '未通过', '', 'grey', rawHex(103, 1));
  log('2-10V 输入输出全标定通过', readU8(104) === 1 ? '通过' : '未通过', '', 'grey', rawHex(104, 1));

  // ---------- 14. 自适应信息位图 ----------
  const adaptive = readU16(105);
  log('最近一次自适应信息位图',
    `0x${adaptive.toString(16).padStart(4, '0').toUpperCase()}` +
    (adaptive === 0 ? '（自适应通过或未触发过自适应）' : ''),
    '', 'grey', rawHex(105, 2)
  );

  if (adaptive !== 0) {
    const aLow  = adaptive & 0xFF;
    const aHigh = (adaptive >> 8) & 0xFF;
    log('  ├ [自适应-字节1-D0] 关方向超时',           (aLow & 0x01) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D1] 开方向超时',           (aLow & 0x02) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D2] 关方向角度变化错误',   (aLow & 0x04) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D3] 开方向角度变化错误',   (aLow & 0x08) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D4] 电机动作时电流过低',   (aLow & 0x10) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D5] 电机动作时电流过高',   (aLow & 0x20) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D6] 开关极限行程跨度不合法', (aLow & 0x40) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节1-D7] 动作到指定角度过程失败', (aLow & 0x80) ? '异常' : '正常', '', 'grey', rawHex(105, 1));
    log('  ├ [自适应-字节2-D0] 动作到指定角度过程失败且动作超时', (aHigh & 0x01) ? '异常' : '正常', '', 'grey', rawHex(106, 1));
    log('  └ [自适应-字节2-D7] 自适应总流程超时仍未得到结果',     (aHigh & 0x80) ? '异常' : '正常', '', 'grey', rawHex(106, 1));
  }

  // ---------- 15. 生产信息位图 ----------
  const production = readU16(107);
  log('最近一次生产信息位图',
    `0x${production.toString(16).padStart(4, '0').toUpperCase()}` +
    (production === 0 ? '（生产自检通过或未触发过自检）' : ''),
    '', 'grey', rawHex(107, 2)
  );

  if (production !== 0) {
    const pLow  = production & 0xFF;
    const pHigh = (production >> 8) & 0xFF;
    log('  ├ [生产-字节1-D0] EEP检测失败',                 (pLow & 0x01) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D1] 关方向超时',                 (pLow & 0x02) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D2] 开方向超时',                 (pLow & 0x04) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D3] 关方向角度变化错误',         (pLow & 0x08) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D4] 开方向角度变化错误',         (pLow & 0x10) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D5] 电机动作时电流过低',         (pLow & 0x20) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D6] 电机动作时电流过高',         (pLow & 0x40) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节1-D7] 开关极限行程跨度不合法',     (pLow & 0x80) ? '异常' : '正常', '', 'grey', rawHex(107, 1));
    log('  ├ [生产-字节2-D0] 拨码开关异常',               (pHigh & 0x01) ? '异常' : '正常', '', 'grey', rawHex(108, 1));
    log('  ├ [生产-字节2-D1] 动作到指定角度过程失败',     (pHigh & 0x02) ? '异常' : '正常', '', 'grey', rawHex(108, 1));
    log('  ├ [生产-字节2-D2] 动作到指定角度过程失败且动作超时', (pHigh & 0x04) ? '异常' : '正常', '', 'grey', rawHex(108, 1));
    log('  ├ [生产-字节2-D3] 角度传感器异常，位置变化过小', (pHigh & 0x08) ? '异常' : '正常', '', 'grey', rawHex(108, 1));
    log('  └ [生产-字节2-D7] 生产自检总流程超时',         (pHigh & 0x80) ? '异常' : '正常', '', 'grey', rawHex(108, 1));
  }

  // ---------- 16. 故障状态 ST ----------
  const st     = readU16(109);
  const stLow  = st & 0xFF;
  const stHigh = (st >> 8) & 0xFF;
  log('故障状态 ST', `0x${st.toString(16).padStart(4, '0').toUpperCase()}`, '', 'grey', rawHex(109, 2));

  log('  ├ [ST-字节1-D6] 电机过流', (stLow & 0x40) ? '过流' : '正常', '', 'grey', rawHex(109, 1));
  log('  ├ [ST-字节1-D3] 阀门堵转', (stLow & 0x08) ? '堵转故障' : '正常', '', 'grey', rawHex(109, 1));
  log('  ├ [ST-字节1-D2] 阀门超时', (stLow & 0x04) ? '超时故障' : '正常', '', 'grey', rawHex(109, 1));

  const valveState = stLow & 0x03;
  const valveStateMap = { 0b00: '未知', 0b01: '开', 0b10: '关', 0b11: '故障' };
  log('  ├ [ST-字节1-D1D0] 阀门状态', valveStateMap[valveState], '', 'grey', rawHex(109, 1));

  log('  └ [ST-字节2-D14] 角度传感器', (stHigh & 0x40) ? '故障' : '正常', '', 'grey', rawHex(110, 1));

  // ---------- 17. 结束 ----------
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');
  return false;
}
