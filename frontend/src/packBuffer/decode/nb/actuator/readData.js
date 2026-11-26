import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

/**
 * 执行器读数据（90 20）解包
 * - 入参 responseMessage
 * - 每项前显示对应原始字节
 * - 每个字段一行，全部通过 context.createLeftSpanMessage 输出
 * @param {Object} context  Vue 组件实例
 * @param {String} responseMessage   十六进制字符串
 * @returns {Boolean} notPass  true=校验失败/解析失败；false=成功
 */
export function readData(context, responseMessage) {
  console.log(context )
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);
  const u8 = new Uint8Array(bytes);


  // ---------- 1. 动态定位从站应答帧（自动跳过红外自发自收 0x01 请求帧及不定长 0xFE） ----------
  let base = -1;
  for (let i = 0; i + 12 < u8.length; i++) {
    if (
      u8[i] === 0x68 &&
      u8[i + 9] === 0x81 &&
      u8[i + 11] === 0x90 &&
      u8[i + 12] === 0x20
    ) {
      base = i;
      break;
    }
  }
  if (base === -1) {
    context.createLeftSpanMessage('读数据解析失败：未找到有效的 90 20 从站应答帧（0x68 ... 0x81）', 'red');
    return true;
  }

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('读数据解析失败：帧起始符不是 0x68', 'red');
    return true;
  }




  // ---------- 2. 基础字段与帧完整性校验（长度、结束符、CS 累加和） ----------
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode = dataView.getUint8(base + 9);    // 控制码 0x81
  const dataLen = dataView.getUint8(base + 10);   // L(数据域长度，固定 0x64 = 100)

  console.log('base:', base, 'dataLen:', dataLen, 'frameType:', frameType,'ctrlCode:', ctrlCode)
  console.log('dataLen !== 0x64:', dataLen !== 0x64)

  if (dataLen !== 0x64) {
    context.createLeftSpanMessage(`读数据长度异常：${dataLen}（期望 100 / 0x64）`, 'red');
    return true;
  }

  const totalFrameLen = 11 + dataLen + 2; // 113 字节（base+0 到 base+112）
  if (base + totalFrameLen > u8.length) {
    context.createLeftSpanMessage(`读数据报文不完整：期望 ${base + totalFrameLen} 字节，实际 ${u8.length} 字节`, 'red');
    return true;
  }

  const endFlag = dataView.getUint8(base + totalFrameLen - 1);
  if (endFlag !== 0x16) {
    context.createLeftSpanMessage(`读数据帧结束符异常：0x${endFlag.toString(16).toUpperCase()}（期望 0x16）`, 'red');
    return true;
  }

  let csCalc = 0;
  for (let i = 0; i < totalFrameLen - 2; i++) {
    csCalc = (csCalc + dataView.getUint8(base + i)) & 0xFF;
  }
  const csRaw = dataView.getUint8(base + totalFrameLen - 2);
  console.log('csCalc:', csCalc, 'csRaw:', csRaw)
  if (csCalc !== csRaw) {
    context.createLeftSpanMessage(
      `读数据 CS 校验失败：计算 0x${csCalc.toString(16).padStart(2, '0').toUpperCase()}，报文 0x${csRaw.toString(16).padStart(2, '0').toUpperCase()}`,
      'red'
    );
    return true;
  }

  // ---------- 3. 工具函数 ----------
  const readU8 = (o) => dataView.getUint8(base + o);
  const readU16 = (o) => dataView.getUint16(base + o, true);  // 小端
  const readU32 = (o) => dataView.getUint32(base + o, true);  // 小端
  // 取从 base + o 起 len 个字节的原始 hex
  const rawHex = (o, len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(dataView.getUint8(base + o + i).toString(16).padStart(2, '0').toUpperCase());
    }
    return arr.join(' ');
  };


  // ---------- 4. 头信息 ----------
  context.createLeftSpanMessage('===== 执行器读数据（90 20）解析 =====', '#1976D2');

  // 仪表类型
  context.logRaw(rawHex(1, 1), '仪表类型 T', `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`);

  // 阀门地址（低字节在前，共 4 字节）
  const addr = Array.from({length: 4}, (_, i) =>
    readU8(2 + i).toString(16).padStart(2, '0')
  ).reverse().join('').toUpperCase();
  context.leftReadAddress = addr;
  context.logRaw(rawHex(2, 4),'阀门地址', addr);

  // 厂家代码（3 字节）
  const vendor = [6, 7, 8].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).reverse().join(' ');
  context.logRaw(rawHex(6, 3),'厂家代码', vendor);

  // 控制码
  context.logRaw(rawHex(9, 1),'控制码', `0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`);

  // 数据长度
  context.logRaw(rawHex(10, 1),'数据长度 L', dataLen);

  // 数据标识（2 字节）+ 序列号（1 字节）
  const dataId = [11, 12].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  context.logRaw(rawHex(11, 2),'数据标识', dataId);
  context.logRaw(rawHex(13, 1),'序列号', readU8(13));


  if (readU8(11) !== 0x90 || readU8(12) !== 0x20) {
    context.createLeftSpanMessage(
      `数据标识异常：${dataId}（期望 90 20）`,
      'red'
    );
    return true;
  }
  // ---------- 5. 累计类（BIN，uint32） ----------
  context.logRaw(rawHex(14, 4), '累积工作时间',   readU32(14), ' 分钟');
  context.logRaw(rawHex(18, 4), '累积阀开时间',   readU32(18), ' 分钟');
  context.logRaw(rawHex(22, 4), '执行器动作次数', readU32(22), ' 次');
  context.logRaw(rawHex(26, 4), '执行器开关次数', readU32(26), ' 次');
  context.logRaw(rawHex(30, 4), '执行器累计行程', readU32(30));
  context.logRaw(rawHex(34, 4), '累计自检次数',   readU32(34), ' 次');
  context.logRaw(rawHex(38, 4), '累计自适应次数', readU32(38), ' 次');
  context.logRaw(rawHex(42, 4), '累计堵转次数',   readU32(42), ' 次');
  context.logRaw(rawHex(46, 4), '累计超时次数',   readU32(46), ' 次');

  // ---------- 6. 补偿电角度 ----------
  context.logRaw(rawHex(50, 2), '正转补偿电角度', (readU16(50) * 0.1).toFixed(1), ' °');
  context.logRaw(rawHex(52, 2), '反转补偿电角度', (readU16(52) * 0.1).toFixed(1), ' °');

  // ---------- 7. 当前运行模式 ----------
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
  context.logRaw(rawHex(54, 1), '当前运行模式',
    `${runModeMap[runModeRaw] ?? '未知'}（0x${runModeRaw.toString(16).padStart(2, '0').toUpperCase()}）`
  );

  // ---------- 8. 模拟量输入/输出信号配置 ----------
  const analogCfgMap = {0x00: '电流', 0x01: '电压', 0x02: 'RS485'};
  const inCfg = readU8(55);
  const outCfg = readU8(56);
  context.logRaw(rawHex(55, 1), '模拟量输入信号配置',
    analogCfgMap[inCfg] ?? `未知(0x${inCfg.toString(16).padStart(2, '0').toUpperCase()})`
  );
  context.logRaw(rawHex(56, 1), '模拟量输出信号配置',
    analogCfgMap[outCfg] ?? `未知(0x${outCfg.toString(16).padStart(2, '0').toUpperCase()})`
  );

  // ---------- 9. 模拟量数值（uint32 ×0.001） ----------
  context.logRaw(rawHex(57, 4), '模拟量输入电流值', (readU32(57) * 0.001).toFixed(3), ' mA');
  context.logRaw(rawHex(61, 4), '模拟量输入电压值', (readU32(61) * 0.001).toFixed(3), ' V');
  context.logRaw(rawHex(65, 4), '模拟量输出电流值', (readU32(65) * 0.001).toFixed(3), ' mA');
  context.logRaw(rawHex(69, 4), '模拟量输出电压值', (readU32(69) * 0.001).toFixed(3), ' V');

  // ---------- 10. 开度相关 ----------
  const resolution = readU8(73);                    // 1=千分级，10=百分级
  const openScale = resolution === 1 ? 0.1 : 1;     // 换算系数
  const resolutionText = resolution === 1 ? '千分级'
    : resolution === 10 ? '百分级'
      : `未知(${resolution})`;
  context.logRaw(rawHex(73, 1), '当前开度分辨率', resolutionText);

  context.logRaw(rawHex(74, 2), '当前开度', (readU16(74) * openScale).toFixed(1), ' %');
  context.logRaw(rawHex(76, 2), '输入信号死区', (readU16(76) * 0.1).toFixed(1), ' %');

  const dirRaw = readU8(78);
  context.logRaw(rawHex(78, 1), '输入信号增大对应动作', dirRaw === 0 ? '开' : '关');

  context.logRaw(rawHex(79, 2), '模拟量输入换算目标开度', (readU16(79) * openScale).toFixed(1), ' %');
  context.logRaw(rawHex(81, 2), '模拟量输入对应目标开度（死区外）', (readU16(81) * openScale).toFixed(1), ' %');
  context.logRaw(rawHex(83, 2), '最终目标开度', (readU16(83) * openScale).toFixed(1), ' %');


  // ---------- 11. 电机相关 ----------
  context.logRaw(rawHex(85, 2), '当前电机电流 AD 值', readU16(85));
  context.logRaw(rawHex(87, 2), '当前控制电机 PWM 占空比', (readU16(87) * 0.1).toFixed(1), ' %');
  context.logRaw(rawHex(89, 2), '当前开度到位死区', (readU16(89) * 0.1).toFixed(1), ' %');
  context.logRaw(rawHex(91, 2), '当前行程时间档位', readU16(91), ' ms');
  context.logRaw(rawHex(93, 2), '当前转速', readU16(93), ' rpm');
  context.logRaw(rawHex(95, 2), '目标转速', readU16(95), ' rpm');

  const torqueMap = {0: '3Nm', 1: '5Nm', 2: '10Nm'};
  const torqueRaw = readU8(97);
  context.logRaw(rawHex(97, 1), '当前扭矩档位', torqueMap[torqueRaw] ?? `未知(${torqueRaw})`);

  context.logRaw(rawHex(98, 2), '当前过流限制 AD 值', readU16(98));

  // ---------- 12. 拨码组合位图 ----------
  const dip = readU16(100);
  const dipLow = dip & 0xFF; // 第一字节（有效定义字节）  把 dip 和 0xFF 的每一个二进制位对齐，逐位做 AND 运算
  const dipHigh = (dip >> 8) & 0xFF; // 第二字节（预留）
  //dip (16位)  =  [ 高8位 ] [ 低8位 ]
  //                bit15~8    bit7~0
  context.logRaw(rawHex(100, 2), '当前拨码组合位图', `0x${dip.toString(16).padStart(4, '0').toUpperCase()}`);

    // Bit0: S1-1 信号增大执行器开/关  Bit0=0x01 hex
    context.logRaw(rawHex(100, 1),'  ├ [拨码-字节1-Bit0] S1-1', (dipLow & 0x01) ? 'OFF 状态，信号增大执行器开' : 'ON 状态，信号增大执行器关');

    // Bit2: S1-3 控制信号类型        Bit2=0x04 hex
    context.logRaw(rawHex(100, 1),'  ├ [拨码-字节1-Bit2] S1-3', (dipLow & 0x04) ? 'OFF 状态，控制信号为电流型' : 'ON 状态，控制信号为电压型');

    // Bit3: S1-4 反馈信号类型        Bit3=0x08 hex
    context.logRaw(rawHex(100, 1),'  ├ [拨码-字节1-Bit3] S1-4', (dipLow & 0x08) ? 'OFF 状态，反馈信号为电流型' : 'ON 状态，反馈信号为电压型');

    // Bit4: S1-5 断信号开关功能        Bit4=0x10 hex
    const bit4On = (dipLow & 0x10) === 0; // 0 表示 ON，断信号启用
    context.logRaw(rawHex(100, 1),'  ├ [拨码-字节1-Bit4] S1-5', bit4On ? 'ON 状态，断信号开关功能启用' : 'OFF 状态，断信号开关功能禁用');

    // Bit5: S1-6 断信号开关状态（仅当 Bit4 启用时有效）
    if (bit4On) {
      context.logRaw(rawHex(100, 1),'  └ [拨码-字节1-Bit5] S1-6', (dipLow & 0x20) ? 'OFF 状态，断信号关' : 'ON 状态，断信号开');
    } else {
      context.logRaw(rawHex(100, 1),'  └ [拨码-字节1-Bit5] S1-6', '（断信号开关功能未启用，忽略）[断信号保位]');
    }

    // 预留字节提示（如有需要）
    if (dipHigh !== 0) {
      context.logRaw(rawHex(101, 1),'  └ [拨码-字节2] 预留字节', `0x${dipHigh.toString(16).padStart(2, '0').toUpperCase()}（暂无定义）`);
    }


  // ---------- 13. 状态 / 标定 ----------
  context.logRaw(rawHex(102, 1), '模拟量输入信号是否存在', readU8(102) === 1 ? '存在' : '不存在');
  context.logRaw(rawHex(103, 1), '4-20mA 输入输出全标定通过', readU8(103) === 1 ? '通过' : '未通过');
  context.logRaw(rawHex(104, 1), '2-10V 输入输出全标定通过', readU8(104) === 1 ? '通过' : '未通过');

  // ---------- 14. 最近一次自适应信息位图（2 字节） ----------
  const adaptive = readU16(105);
  context.logRaw(rawHex(105, 2), '最近一次自适应信息位图',
    `0x${adaptive.toString(16).padStart(4, '0').toUpperCase()}` +
    (adaptive === 0 ? '（自适应通过或未触发过自适应）' : '')
  );

  /**
   * ============================================================
   * 自适应信息位图解析（2 字节）
   * ============================================================
   *
   * 【何时展开】
   *   仅当 adaptive !== 0 时才逐位输出；
   *   adaptive === 0 表示“通过 / 未触发”，不展开明细。
   *
   * 【位图约定】
   *   位 = 1 → 该异常发生（显示“异常”）
   *   位 = 0 → 正常
   *   注意：一个字节里可以同时有多个 bit 为 1，
   *        表示多个异常同时发生，这是正常的。
   *
   * 【字节 1】（低 8 位，aLow = adaptive & 0xFF）
   *   用 2 的幂掩码逐位检查。
   *   掩码自身二进制里只有 1 位是 1（如 0x01 = 0000 0001），
   *   所以每次 & 运算只针对目标那一位，
   *   即使 aLow 里同时有多个 bit 为 1，也不会互相干扰。
   *
   *   掩码        D 位   含义
   *   0x01  →   D0    关方向超时
   *   0x02  →   D1    开方向超时
   *   0x04  →   D2    关方向角度变化错误
   *   0x08  →   D3    开方向角度变化错误
   *   0x10  →   D4    电机动作时电流过低
   *   0x20  →   D5    电机动作时电流过高
   *   0x40  →   D6    开关极限行程跨度不合法
   *   0x80  →   D7    动作到指定角度过程失败
   *
   * 【字节 2】（高 8 位，aHigh = (adaptive >> 8) & 0xFF）
   *   仅取两个特殊位，其余位暂未定义：
   *   0x01  →   D0    动作到指定角度过程失败且动作超时
   *   0x80  →   D7    自适应总流程超时仍未得到结果
   * ============================================================
   */
  if (adaptive !== 0) {
    const aLow = adaptive & 0xFF;
    const aHigh = (adaptive >> 8) & 0xFF;
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D0] 关方向超时', (aLow & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D1] 开方向超时', (aLow & 0x02) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D2] 关方向角度变化错误', (aLow & 0x04) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D3] 开方向角度变化错误', (aLow & 0x08) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D4] 电机动作时电流过低', (aLow & 0x10) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D5] 电机动作时电流过高', (aLow & 0x20) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D6] 开关极限行程跨度不合法', (aLow & 0x40) ? '异常' : '正常');
    context.logRaw(rawHex(105, 1), '  ├ [自适应-字节1-D7] 动作到指定角度过程失败', (aLow & 0x80) ? '异常' : '正常');
    context.logRaw(rawHex(106, 1), '  ├ [自适应-字节2-D0] 动作到指定角度过程失败且动作超时', (aHigh & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(106, 1), '  └ [自适应-字节2-D7] 自适应总流程超时仍未得到结果', (aHigh & 0x80) ? '异常' : '正常');
  }

  // ---------- 15. 最近一次生产信息位图（2 字节） ----------
  const production = readU16(107);
  context.logRaw(rawHex(107, 2),'最近一次生产信息位图',
    `0x${production.toString(16).padStart(4, '0').toUpperCase()}` +
    (production === 0 ? '（生产自检通过或未触发过自检）' : '')
  );

  if (production !== 0) {
    const pLow = production & 0xFF;
    const pHigh = (production >> 8) & 0xFF;
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D0] EEP检测失败', (pLow & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D1] 关方向超时', (pLow & 0x02) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D2] 开方向超时', (pLow & 0x04) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D3] 关方向角度变化错误', (pLow & 0x08) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D4] 开方向角度变化错误', (pLow & 0x10) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D5] 电机动作时电流过低', (pLow & 0x20) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D6] 电机动作时电流过高', (pLow & 0x40) ? '异常' : '正常');
    context.logRaw(rawHex(107, 1), '  ├ [生产-字节1-D7] 开关极限行程跨度不合法', (pLow & 0x80) ? '异常' : '正常');
    context.logRaw(rawHex(108, 1), '  ├ [生产-字节2-D0] 拨码开关异常', (pHigh & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(108, 1), '  ├ [生产-字节2-D1] 动作到指定角度过程失败', (pHigh & 0x02) ? '异常' : '正常');
    context.logRaw(rawHex(108, 1), '  ├ [生产-字节2-D2] 动作到指定角度过程失败且动作超时', (pHigh & 0x04) ? '异常' : '正常');
    context.logRaw(rawHex(108, 1), '  ├ [生产-字节2-D3] 角度传感器异常，位置变化过小', (pHigh & 0x08) ? '异常' : '正常');
    context.logRaw(rawHex(108, 1), '  ├ [生产-字节2-D7] 生产自检总流程超时', (pHigh & 0x80) ? '异常' : '正常');
  }

  // ---------- 16. 故障状态 ST（2 字节） ----------
  const st = readU16(109);
  const stLow = st & 0xFF;
  const stHigh = (st >> 8) & 0xFF;

  context.logRaw(rawHex(109, 2), '故障状态 ST', `0x${st.toString(16).padStart(4, '0').toUpperCase()}`);

  // 第一字节
  context.logRaw(rawHex(109, 1), '  ├ [ST-字节1-D6] 电机过流', (stLow & 0x40) ? '过流' : '正常');
  context.logRaw(rawHex(109, 1), '  ├ [ST-字节1-D3] 阀门堵转', (stLow & 0x8) ? '堵转故障' : '正常');
  context.logRaw(rawHex(109, 1), '  ├ [ST-字节1-D2] 阀门超时', (stLow & 0x04) ? '超时故障' : '正常');

  //0x01 & 0x03  // = 1   →  二进制 01  →  "开"
  // 0x02 & 0x03  // = 2   →  二进制 10  →  "关"
  // 0x03 & 0x03  // = 3   →  二进制 11  →  "故障"
  const valveState = stLow & 0x03;   // D1D0：01开 10关 11故障
  const valveStateMap = {0b00: '未知', 0b01: '开', 0b10: '关', 0b11: '故障'}; //等同于 0 , 1 , 2, 3
  context.logRaw(rawHex(109, 1), '  ├ [ST-字节1-D1D0] 阀门状态', valveStateMap[valveState]);

  // 第二字节
  context.logRaw(rawHex(110, 1), '  └ [ST-字节2-D14] 角度传感器', (stHigh & 0x40) ? '故障' : '正常');
  // ---------- 17. 结束 ----------
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');
  return false;
}

