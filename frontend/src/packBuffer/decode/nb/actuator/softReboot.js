import { hex2arrayBuffer } from "@/packBuffer/common/comUtil";


/**
 * 软重启（FF 55）应答解析
 * @param {Object} context Vue 组件实例
 * @param {String} responseMessage 十六进制字符串（含回显+应答）
 * @returns {Boolean} notPass true=校验失败/解析失败；false=成功
 */
export function softReboot(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  // 索引从 22 开始（自发自收 + 3 个 FE）
  const base = 22;

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('软重启解析失败：帧起始符不是 0x68', 'red');
    return true;
  }


  // ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode  = dataView.getUint8(base + 9);   // 控制码
  const dataLen   = dataView.getUint8(base + 10);  // L(数据域长度)


  //  应答用 84，有些用 81，只要不是异常码 C4 就往下走
  if ( ctrlCode !== 0x81) {
    const errCode = ctrlCode.toString(16).toUpperCase();
    context.createLeftSpanMessage(
      `软重启失败：异常应答，错误码 0x${errCode}${ctrlCode !== 0x81 ? '（校验错/格式错）' : ''}`,
      'red'
    );
    return true;
  }



  // ---------- 3. 工具函数 ----------
  const readU8 = (o) => dataView.getUint8(base + o);
  const rawHex = (o, len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr.push(dataView.getUint8(base + o + i).toString(16).padStart(2, '0').toUpperCase());
    }
    return arr.join(' ');
  };



  // ---------- 4. 头信息 ----------
  context.createLeftSpanMessage('===== 软重启（FF 55）应答解析 =====', '#1976D2');

  context.logRaw(rawHex(1, 1), '仪表类型 T', `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`);

  // 阀门地址（低字节在前，共 4 字节）
  const addr = Array.from({ length: 4 }, (_, i) =>
    readU8(2 + i).toString(16).padStart(2, '0')
  ).join('').toUpperCase();
  context.logRaw(rawHex(2, 4), '阀门地址', addr);

  // 厂家代码（3 字节）
  const vendor = [6, 7, 8].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
  context.logRaw(rawHex(6, 3), '厂家代码', vendor);

  // 控制码 / 数据长度
  context.logRaw(rawHex(9, 1), '控制码', `0x${ctrlCode.toString(16).padStart(2, '0').toUpperCase()}`);
  context.logRaw(rawHex(10, 1), '数据长度 L', dataLen);

  // 数据标识（F0 E1）+ 序列号（01）
  const dataId1 = readU8(11);
  const dataId2 = readU8(12);
  const seq     = readU8(13);
  context.logRaw(rawHex(11, 2), '数据标识',
    `${dataId1.toString(16).padStart(2, '0').toUpperCase()} ${dataId2.toString(16).padStart(2, '0').toUpperCase()}`
  );
  context.logRaw(rawHex(13, 1), '序列号', seq);

  // ---------- 5. 数据标识校验 ----------
  if (dataId1 !== 0xFF || dataId2 !== 0x55) {
    context.createLeftSpanMessage(`应答数据标识异常（期望 FF 55）`, 'red');
    return true;
  }

  // ---------- 6. 成功 ----------
  context.logRaw('--', '写入结果', '成功', '', '#388E3C');
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');

  return false;
}
