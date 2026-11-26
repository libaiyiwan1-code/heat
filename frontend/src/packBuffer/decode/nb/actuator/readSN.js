import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";

/**
 * 读SN序列号（F0 E0）解包
 * - 入参 responseMessage
 * - 每个字段一行，全部通过 context.createLeftSpanMessage 输出
 * @param {Object} context  Vue 组件实例
 * @param {String} responseMessage   十六进制字符串
 * @returns {Boolean} notPass  true=校验失败/解析失败；false=成功
 */
export function readSN(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  // 索引从 22 开始（自发自收 + 3 个 FE）
  const base = 22;

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('读SN序列号解析失败：帧起始符不是 0x68', 'red');
    return true;
  }

  // ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode  = dataView.getUint8(base + 9);   // 控制码
  const dataLen   = dataView.getUint8(base + 10);  // L(数据域长度)

  const notPass = ctrlCode !== 0x81;
  if (notPass) {
    context.createLeftSpanMessage(
      `读SN序列号应答控制码异常：0x${ctrlCode.toString(16).toUpperCase()}（期望 0x81）`,
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
  context.createLeftSpanMessage('===== 读SN序列号（F0 E0）解析 =====', '#1976D2');

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
  if (readU8(11) !== 0xF0 || readU8(12) !== 0xE0) {
    context.createLeftSpanMessage(
      `数据标识异常：${dataId}（期望 F0 E0）`,
      'red'
    );
    return true;
  }

  // ---------- 6. 解析 SN 序列号数据 ----------
  // 从偏移 14 开始解析：1 字节长度 + 对应长度的 ASCII 字符
  const snLen = readU8(14);
  context.logRaw(rawHex(14, 1), 'SN序列号长度 L', snLen);

  const snStr = readAscii(15, snLen);
  context.logRaw(rawHex(15, snLen), 'SN序列号', snStr);

  // ---------- 7. 结束 ----------
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');

  return false;
}
