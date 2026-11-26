import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";

/**
 * 触发自适应（DD/F4）应答解包
 * - 每项前显示对应原始字节，统一走 context.logRaw
 * @param {Object} context  Vue 组件实例
 * @param {String} responseMessage   十六进制字符串（含回显+应答）
 * @returns {Boolean} notPass  true=校验失败/解析失败；false=成功
 */
export function triggerAdaptive(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  // ---------- 1. 帧起始符校验（偏移 3） ----------
  if (dataView.getUint8(25) !== 0x68) {
    context.createLeftSpanMessage('触发自适应解析失败：帧起始符不是 0x68', 'red');
    return true;
  }

// ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(26);    // T
  const ctrlCode  = dataView.getUint8(34);   // 控制码
  const dataLen   = dataView.getUint8(35);   // L

  // ---------- 3. 工具函数 ----------
  // 取从绝对偏移 o 起 len 个字节的原始 hex
  const rawHex = (o, len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(dataView.getUint8(o + i).toString(16).padStart(2, '0').toUpperCase());
    }
    return arr.join(' ');
  };

  // 阀门地址（低字节在前，4 字节，偏移 5~8）
  const addr = Array.from({ length: 4 }, (_, i) =>
    dataView.getUint8(5 + i).toString(16).padStart(2, '0')
  ).join('').toUpperCase();

  // ---------- 4. 控制码校验 ----------
  // 写数据应答：0x84（异常：0xC4）
  if (ctrlCode !== 0x84) {
    context.createLeftSpanMessage(
      `触发自适应失败：异常应答，错误码 0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`,
      'red'
    );
    return true;
  }

  // ---------- 5. 数据标识 / 序列号校验 ----------
  const dataId1 = dataView.getUint8(36);
  const dataId2 = dataView.getUint8(37);
  const seq     = dataView.getUint8(38);

  const expected = (dataId1 === 0xDD && dataId2 === 0xF4);
  if (!expected) {
    context.createLeftSpanMessage(
      `触发自适应应答数据标识异常：${dataId1.toString(16).padStart(2, '0').toUpperCase()} ` +
      `${dataId2.toString(16).padStart(2, '0').toUpperCase()} ${seq.toString(16).padStart(2, '0').toUpperCase()} ` +
      `（期望 DD F4）`,
      'red'
    );
    return true;
  }

  // ---------- 6. 成功 ----------
  context.createLeftSpanMessage('===== 触发自适应（DD F4）应答解析 =====', '#1976D2');

  context.logRaw(rawHex(26, 1), '仪表类型 T',
    `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`);

  context.logRaw(rawHex(5, 4), '阀门地址', addr);

  context.logRaw(rawHex(34, 1), '控制码',
    `0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`);

  context.logRaw(rawHex(35, 1), '数据长度 L', dataLen);

  context.logRaw(rawHex(36, 2), '数据标识',
    `${dataId1.toString(16).padStart(2, '0').toUpperCase()} ${dataId2.toString(16).padStart(2, '0').toUpperCase()}`);

  context.logRaw(rawHex(38, 1), '序列号', seq);

  // 成功提示：无单字段对应，原始报文列用 '--' 占位
  context.logRaw('--', '触发自适应', '成功', '', '#388E3C');

  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');

  return false;
}
