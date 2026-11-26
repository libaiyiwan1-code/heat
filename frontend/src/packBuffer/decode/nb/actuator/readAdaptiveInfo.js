import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";

/**
 * 读自适应信息（F0 DF）解包
 * @param {Object} context Vue 组件实例
 * @param {String} responseMessage 十六进制字符串
 * @returns {Boolean} notPass true=校验失败/解析失败；false=成功
 */
export function readAdaptiveInfo(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  // 索引从 22 开始（自发自收 + 3 个 FE）
  const base = 22;

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('读自适应信息解析失败：帧起始符不是 0x68', 'red');
    return true;
  }

  // ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode  = dataView.getUint8(base + 9);   // 控制码
  const dataLen   = dataView.getUint8(base + 10);  // L(数据域长度)

  const notPass = ctrlCode !== 0x81;
  if (notPass) {
    context.createLeftSpanMessage(
      `读自适应信息应答控制码异常：0x${ctrlCode.toString(16).toUpperCase()}（期望 0x81）`,
      'red'
    );
    return true;
  }

  // ---------- 3. 工具函数 ----------
  const readU8  = (o) => dataView.getUint8(base + o);
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
  const log = (label, value, unit = '', color = 'grey') => {
    context.createLeftSpanMessage(`${label}：${value}${unit}`, color);
  };
  // 读取 ASCII 字符串并去除末尾的 \0 和空格
  const readAscii = (o, len) => {
    let str = '';
    for (let i = 0; i < len; i++) {
      const charCode = dataView.getUint8(base + o + i);
      if (charCode !== 0) str += String.fromCharCode(charCode);
    }
    return str.trim();
  };
  // ---------- 4. 头信息 ----------
  context.createLeftSpanMessage('===== 读自适应信息（F0 DF）解析 =====', '#1976D2');

  context.logRaw(rawHex(1, 1), '仪表类型 T', `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`);

  // 阀门地址（低字节在前，共 4 字节）
  const addr = Array.from({ length: 4 }, (_, i) =>
    readU8(2 + i).toString(16).padStart(2, '0')
  ).join('').toUpperCase();
  context.leftReadAddress = addr;
  context.logRaw(rawHex(2, 4), '阀门地址', addr);

  // 厂家代码（3 字节）
  const vendor = [6, 7, 8].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  context.logRaw(rawHex(6, 3), '厂家代码', vendor);

  // 控制码 / 数据长度
  context.logRaw(rawHex(9, 1), '控制码', `0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`);
  context.logRaw(rawHex(10, 1), '数据长度 L', dataLen);
  // 数据标识（2 字节）+ 序列号（1 字节）
  const dataId = [11, 12].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  context.logRaw(rawHex(11, 2), '数据标识', dataId);
  context.logRaw(rawHex(13, 1), '序列号', readU8(13));

  // ---------- 5. 数据标识校验 ----------
  if (readU8(11) !== 0xF0 || readU8(12) !== 0xDF) {
    context.createLeftSpanMessage(
      `数据标识异常：${dataId}（期望 F0 DF）`,
      'red'
    );
    return true;
  }
// ---------- 6. 解析自适应信息数据 ----------
  // 偏移 14：自适应状态
  const adaptStatus = readU8(14);
  let statusText = '';
  if (adaptStatus === 0) statusText = '自适应失败或未自适过';
  else if (adaptStatus === 1) statusText = '自适应正常';
  else statusText = `未知(${adaptStatus})`;
  context.logRaw(rawHex(14, 1), '自适应状态', statusText);

  // 偏移 15：自适应失败原因 2 字节位图（小端）
  const failReason = readU16(15);
  context.logRaw(rawHex(15, 2), '自适应失败原因位图', `0x${failReason.toString(16).padStart(4, '0').toUpperCase()}`);

  // 如果失败原因不为 0，则展开位图
  if (failReason !== 0) {
    const fLow = failReason & 0xFF;
    const fHigh = (failReason >> 8) & 0xFF;

    // 第一字节 (Byte 1, D0~D7)
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D0] 关方向超时', (fLow & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D1] 开方向超时', (fLow & 0x02) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D2] 关方向反向', (fLow & 0x04) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D3] 开方向反向', (fLow & 0x08) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D4] 电机动作电流过低(未接电机/驱动无输出)', (fLow & 0x10) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D5] 电机动作电流过高', (fLow & 0x20) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D6] 开关行程跨度不合法', (fLow & 0x40) ? '异常' : '正常');
    context.logRaw(rawHex(15, 1), '  ├ [字节1-D7] 动作到指定角度过程失败', (fLow & 0x80) ? '异常' : '正常');

    // 第二字节 (Byte 2, D8~D15)
    context.logRaw(rawHex(16, 1), '  ├ [字节2-D12] 动作到指定角度过程失败且动作超时', (fHigh & 0x10) ? '异常' : '正常');
    context.logRaw(rawHex(16, 1), '  └ [字节2-D15] 自适应总流程超时', (fHigh & 0x80) ? '异常' : '正常');
  }

  // ---------- 7. 结束 ----------
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');

  return false;
}
