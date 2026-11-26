import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";

/**
 * 执行器读数据（90 20）解包
 * - 入参 responseMessage
 * - 每个字段一行，全部通过 context.createLeftSpanMessage 输出
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
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode  = dataView.getUint8(base + 9);   // 控制码
  const dataLen   = dataView.getUint8(base + 10);  // L(数据域长度)

  const notPass = ctrlCode !== 0x81;
  if (notPass) {
    context.createLeftSpanMessage(
      `读数据应答控制码异常：0x${ctrlCode.toString(16).toUpperCase()}（期望 0x81）`,
      'red'
    );
    return true;
  }

  // ---------- 3. 工具函数 ----------
  const readU8  = (o) => dataView.getUint8(base + o);
  const readU16 = (o) => dataView.getUint16(base + o, true);  // 小端
  const readU32 = (o) => dataView.getUint32(base + o, true);  // 小端

  // 颜色常量
  const COLOR = {
    TITLE: '#1976D2',   // 区块标题：蓝
    LABEL: '#616161',   // 普通标签：灰
    VALUE: '#212121',   // 数值：深灰
    OK:    '#388E3C',   // 正常：绿
    WARN:  '#F57C00',   // 注意：橙
    ERR:   '#D32F2F',   // 异常：红
  };

  // 计算字符串显示宽度：中文/全角算 2，英文/半角算 1
  const strWidth = (str) => {
    let w = 0;
    for (const ch of str) {
      w += /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(ch) ? 2 : 1;
    }
    return w;
  };

  // 标签列显示宽度（按需调整，保证最长标签后仍有余量）
  const LABEL_WIDTH = 36;

  // 区块标题：上下加分隔线
  const title = (text) => {
    context.createLeftSpanMessage(`───── ${text} ─────`, COLOR.TITLE);
  };

  // 左对齐 + 值列对齐：标签补空格到固定显示宽度
  const log = (label, value, unit = '', color = COLOR.LABEL) => {
    const pad = ' '.repeat(Math.max(0, LABEL_WIDTH - strWidth(label)));
    context.createLeftSpanMessage(`${label}${pad}${value}${unit}`, color);
  };

  // 布尔型字段：正常绿 / 异常红
  const logBool = (label, isBad, badText = '异常', okText = '正常') => {
    log(label, isBad ? badText : okText, '', isBad ? COLOR.ERR : COLOR.OK);
  };

  // 汇总行：非零位图先给结论
  const logSummary = (label, value, extra = '') => {
    const hasIssue = value !== 0;
    log(
      label,
      `0x${value.toString(16).padStart(4, '0').toUpperCase()}${extra}`,
      '',
      hasIssue ? COLOR.WARN : COLOR.OK
    );
  };

  // ---------- 4. 头信息 ----------
  title('执行器读数据（90 20）解析');

  log('仪表类型 T', `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`);

  // 阀门地址（低字节在前，共 4 字节）
  const addr = Array.from({ length: 4 }, (_, i) =>
    readU8(2 + i).toString(16).padStart(2, '0')
  ).join('').toUpperCase();
  context.leftReadAddress = addr;
  log('阀门地址', addr);

  // 厂家代码（3 字节）
  const vendor = [6, 7, 8].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  log('厂家代码', vendor);

  log('控制码', `0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`);
  log('数据长度 L', dataLen);

  // 数据标识（2 字节）+ 序列号（1 字节）
  const dataId = [11, 12].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  log('数据标识', dataId);
  log('序列号', readU8(13));

  // ---------- 5. 累计类（BIN，uint32） ----------
  title('累计信息');
  log('累积工作时间',   readU32(14), ' 分钟');
  log('累积阀开时间',   readU32(18), ' 分钟');
  log('执行器动作次数', readU32(22), ' 次');
  log('执行器开关次数', readU32(26), ' 次');
  log('执行器累计行程', readU32(30));
  log('累计自检次数',   readU32(34), ' 次');
  log('累计自适应次数', readU32(38), ' 次');
  log('累计堵转次数',   readU32(42), ' 次');
  log('累计超时次数',   readU32(46), ' 次');

  // ---------- 6. 补偿电角度 ----------
  title('补偿电角度');
  log('正转补偿电角度', (readU16(50) * 0.1).toFixed(1), ' °');
  log('反转补偿电角度', (readU16(52) * 0.1).toFixed(1), ' °');

  // ---------- 7. 当前运行模式 ----------
  title('当前运行模式');
  const runModeMap = {
    0x00: '正常',
    0x01: '自适应',
    0x02: '生产自检标定',
    0x03: '堵转测试',
    0x04: '无刷电机效率测试',
    0x05: '开关寿命测试',
    0x06: '其他测试',
  };
  const runModeRaw = readU8(54);
  log(
    '当前运行模式',
    `${runModeMap[runModeRaw] ?? '未知'}（0x${runModeRaw.toString(16).padStart(2, '0').toUpperCase()}）`
  );

  // ---------- 8. 模拟量输入/输出信号配置 ----------
  title('模拟量信号配置');
  const analogCfgMap = { 0x00: '电流', 0x01: '电压', 0x02: 'RS485' };
  const inCfg  = readU8(55);
  const outCfg = readU8(56);
  log(
    '模拟量输入信号配置',
    analogCfgMap[inCfg] ?? `未知(0x${inCfg.toString(16).padStart(2, '0').toUpperCase()})`
  );
  log(
    '模拟量输出信号配置',
    analogCfgMap[outCfg] ?? `未知(0x${outCfg.toString(16).padStart(2, '0').toUpperCase()})`
  );

  // ---------- 9. 模拟量数值（uint32 ×0.001） ----------
  title('模拟量数值');
  log('模拟量输入电流值', (readU32(57) * 0.001).toFixed(3), ' mA');
  log('模拟量输入电压值', (readU32(61) * 0.001).toFixed(3), ' V');
  log('模拟量输出电流值', (readU32(65) * 0.001).toFixed(3), ' mA');
  log('模拟量输出电压值', (readU32(69) * 0.001).toFixed(3), ' V');

  // ---------- 10. 开度相关 ----------
  title('开度信息');
  const resolution = readU8(73);                    // 1=千分级，10=百分级
  const openScale  = resolution === 1 ? 0.1 : 1;    // 换算系数
  const resolutionText = resolution === 1 ? '千分级'
    : resolution === 10 ? '百分级'
      : `未知(${resolution})`;
  log('当前开度分辨率', resolutionText);

  log('当前开度', (readU16(74) * openScale).toFixed(1), ' %');
  log('输入信号死区', (readU16(76) * 0.1).toFixed(1), ' %');

  const dirRaw = readU8(78);
  log('输入信号增大对应动作', dirRaw === 0 ? '开' : '关');

  log('模拟量输入换算目标开度', (readU16(79) * openScale).toFixed(1), ' %');
  log('模拟量输入对应目标开度（死区外）', (readU16(81) * openScale).toFixed(1), ' %');
  log('最终目标开度', (readU16(83) * openScale).toFixed(1), ' %');

  // ---------- 11. 电机相关 ----------
  title('电机信息');
  log('当前电机电流 AD 值', readU16(85));
  log('当前控制电机 PWM 占空比', (readU16(87) * 0.1).toFixed(1), ' %');
  log('当前开度到位死区', (readU16(89) * 0.1).toFixed(1), ' %');
  log('当前行程时间档位', readU16(91), ' ms');
  log('当前转速', readU16(93), ' rpm');
  log('目标转速', readU16(95), ' rpm');

  const torqueMap = { 0: '3Nm', 1: '5Nm', 2: '10Nm' };
  const torqueRaw = readU8(97);
  log('当前扭矩档位', torqueMap[torqueRaw] ?? `未知(${torqueRaw})`);

  log('当前过流限制 AD 值', readU16(98));

  // ---------- 12. 拨码组合位图 ----------
  title('拨码组合位图');
  const dip     = readU16(100);
  const dipLow  = dip & 0xFF;        // 第一字节（有效定义字节）
  const dipHigh = (dip >> 8) & 0xFF; // 第二字节（预留）

  logSummary('拨码组合位图', dip);

  if (dip !== 0) {
    // Bit0: S1-1 信号增大执行器开/关
    logBool('  S1-1 信号增大', dipLow & 0x01, 'OFF，信号增大执行器开', 'ON，信号增大执行器关');

    // Bit2: S1-3 控制信号类型
    logBool('  S1-3 控制信号', dipLow & 0x04, 'OFF，电流型', 'ON，电压型');

    // Bit3: S1-4 反馈信号类型
    logBool('  S1-4 反馈信号', dipLow & 0x08, 'OFF，电流型', 'ON，电压型');

    // Bit4: S1-5 断信号开关功能（0 表示 ON，启用）
    const bit4On = (dipLow & 0x10) === 0;
    logBool('  S1-5 断信号功能', !bit4On, 'OFF，功能禁用', 'ON，功能启用');

    // Bit5: S1-6 断信号开关状态（仅当 Bit4 启用时有效）
    if (bit4On) {
      logBool('  S1-6 断信号状态', dipLow & 0x20, 'OFF，断信号关', 'ON，断信号开');
    } else {
      log('  S1-6 断信号状态', '功能未启用，忽略', '', COLOR.LABEL);
    }

    // 预留字节提示（如有需要）
    if (dipHigh !== 0) {
      log('  预留字节', `0x${dipHigh.toString(16).padStart(2, '0').toUpperCase()}（暂无定义）`, '', COLOR.WARN);
    }
  }

  // ---------- 13. 状态 / 标定 ----------
  title('状态 / 标定');
  logBool('模拟量输入信号是否存在', readU8(102) !== 1, '不存在', '存在');
  logBool('4-20mA 输入输出全标定通过', readU8(103) !== 1, '未通过', '通过');
  logBool('2-10V 输入输出全标定通过', readU8(104) !== 1, '未通过', '通过');

  // ---------- 14. 最近一次自适应信息位图（2 字节） ----------
  title('最近一次自适应信息位图');
  const adaptive = readU16(105);
  logSummary('自适应位图', adaptive, adaptive === 0 ? '（通过或未触发）' : '（存在异常）');

  if (adaptive !== 0) {
    const aLow  = adaptive & 0xFF;
    const aHigh = (adaptive >> 8) & 0xFF;

    logBool('  字节1-D0 关方向超时',       aLow & 0x01);
    logBool('  字节1-D1 开方向超时',       aLow & 0x02);
    logBool('  字节1-D2 关方向角度错误',   aLow & 0x04);
    logBool('  字节1-D3 开方向角度错误',   aLow & 0x08);
    logBool('  字节1-D4 电机电流过低',     aLow & 0x10);
    logBool('  字节1-D5 电机电流过高',     aLow & 0x20);
    logBool('  字节1-D6 行程跨度不合法',   aLow & 0x40);
    logBool('  字节1-D7 到指定角度失败',   aLow & 0x80);
    logBool('  字节2-D0 到角度失败且超时', aHigh & 0x01);
    logBool('  字节2-D7 自适应总流程超时', aHigh & 0x80);
  }

  // ---------- 15. 最近一次生产信息位图（2 字节） ----------
  title('最近一次生产信息位图');
  const production = readU16(107);
  logSummary('生产位图', production, production === 0 ? '（通过或未触发）' : '（存在异常）');

  if (production !== 0) {
    const pLow  = production & 0xFF;
    const pHigh = (production >> 8) & 0xFF;

    logBool('  字节1-D0 EEP检测失败',       pLow & 0x01);
    logBool('  字节1-D1 关方向超时',         pLow & 0x02);
    logBool('  字节1-D2 开方向超时',         pLow & 0x04);
    logBool('  字节1-D3 关方向角度错误',     pLow & 0x08);
    logBool('  字节1-D4 开方向角度错误',     pLow & 0x10);
    logBool('  字节1-D5 电机电流过低',       pLow & 0x20);
    logBool('  字节1-D6 电机电流过高',       pLow & 0x40);
    logBool('  字节1-D7 行程跨度不合法',     pLow & 0x80);
    logBool('  字节2-D0 拨码开关异常',       pHigh & 0x01);
    logBool('  字节2-D1 到指定角度失败',     pHigh & 0x02);
    logBool('  字节2-D2 到角度失败且超时',   pHigh & 0x04);
    logBool('  字节2-D3 角度传感器异常',     pHigh & 0x08);
    logBool('  字节2-D7 生产自检总流程超时', pHigh & 0x80);
  }

  // ---------- 16. 故障状态 ST（2 字节） ----------
  title('故障状态 ST');
  const st     = readU16(109);
  const stLow  = st & 0xFF;
  const stHigh = (st >> 8) & 0xFF;

  logSummary('故障状态 ST', st);

  // 第一字节
  logBool('  字节1-D6 电机过流', stLow & 0x40, '过流', '正常');
  logBool('  字节1-D3 阀门堵转', stLow & 0x08, '堵转故障', '正常');
  logBool('  字节1-D2 阀门超时', stLow & 0x04, '超时故障', '正常');

  // D1D0 阀门状态：01 开、10 关、11 故障
  const valveState = stLow & 0x03;
  const valveStateMap = ['未知', '开', '关', '故障'];
  log(
    '  字节1-D1D0 阀门状态',
    valveStateMap[valveState],
    '',
    valveState === 0b11 ? COLOR.ERR : COLOR.OK
  );

  // 第二字节：D14 角度传感器 → stHigh 的 bit6 = 0x40
  logBool('  字节2-D14 角度传感器', stHigh & 0x40, '故障', '正常');

  // ---------- 17. 结束 ----------
  title('解析结束');

  return false;
}
