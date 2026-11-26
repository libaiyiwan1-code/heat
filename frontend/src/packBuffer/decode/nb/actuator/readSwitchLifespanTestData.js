import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";

/**
 * 读开关寿命测试数据（CC 30）解包 ——
 * - 入参 responseMessage
 * - 每个字段一行，全部通过 context.createLeftSpanMessage 输出
 * @param {Object} context  Vue 组件实例
 * @param {String} responseMessage   十六进制字符串
 * @returns {Boolean} notPass  true=校验失败/解析失败；false=成功
 */
export function readSwitchLifespanTestData(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  // 索引从 22 开始（自发自收 + 3 个 FE）
  const base = 22;

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('开关寿命数据解析失败：帧起始符不是 0x68', 'red');
    return true;
  }

  // ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode  = dataView.getUint8(base + 9);   // 控制码
  const dataLen   = dataView.getUint8(base + 10);  // L(数据域长度)

  const notPass = ctrlCode !== 0x81;
  if (notPass) {
    context.createLeftSpanMessage(
      `开关寿命数据应答控制码异常：0x${ctrlCode.toString(16).toUpperCase()}（期望 0x81）`,
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

  // ---------- 4. 头信息 ----------
  context.createLeftSpanMessage('===== 读开关寿命测试数据（CC 30）开关寿命测试解析 =====', '#1976D2');

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

  // ---------- 5. 数据标识校验（可选） ----------
  if (readU8(11) !== 0xCC || readU8(12) !== 0x30) {
    context.createLeftSpanMessage(
      `数据标识异常：${dataId}（期望 CC 30）`,
      'red'
    );
    return true;
  }

  // ---------- 6. 开关寿命测试数据（6 个 uint32） ----------
  // 本次通电累计运行时间
  context.logRaw(rawHex(14, 4), '本次通电累计运行时间', readU32(14), ' ms');

  // 执行器动作次数
  context.logRaw(rawHex(18, 4), '执行器动作次数', readU32(18), ' 次');

  // 执行器开关次数（0位置→全开→0位置算一次）
  context.logRaw(rawHex(22, 4), '执行器开关次数', readU32(22), ' 次');

  // 执行器总行程开度
  context.logRaw(rawHex(26, 4), '执行器总行程开度', readU32(26));

  // 堵转次数
  context.logRaw(rawHex(30, 4), '堵转次数', readU32(30), ' 次');

  // 超时次数
  context.logRaw(rawHex(34, 4), '超时次数', readU32(34), ' 次');
  // ---------- 7. 结束 ----------
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');

  return false;
}
