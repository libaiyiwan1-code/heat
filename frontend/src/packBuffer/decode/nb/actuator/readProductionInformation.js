import {hex2arrayBuffer} from "@/packBuffer/common/comUtil";

/**
 * 读生产信息（F0 F0）解包
 * - 入参 responseMessage
 * - 每项前显示对应原始字节
 * - 每个字段一行，全部通过 context.createLeftSpanMessage 输出
 * @param {Object} context  Vue 组件实例
 * @param {String} responseMessage   十六进制字符串
 * @returns {Boolean} notPass  true=校验失败/解析失败；false=成功
 */
export function readProductionInformation(context, responseMessage) {
  const bytes = hex2arrayBuffer(responseMessage);
  const dataView = new DataView(bytes);

  //  索引从 22 开始 自发自收+3个FE
  const base = 22;

  // ---------- 1. 帧起始符校验 ----------
  if (dataView.getUint8(base) !== 0x68) {
    context.createLeftSpanMessage('读生产信息解析失败：帧起始符不是 0x68', 'red');
    return true;
  }

  // ---------- 2. 基础字段 ----------
  const frameType = dataView.getUint8(base + 1);   // T
  const ctrlCode = dataView.getUint8(base + 9);   // 控制码
  const dataLen = dataView.getUint8(base + 10);  // L(数据域长度)

  const notPass = ctrlCode !== 0x81;
  if (notPass) {
    context.createLeftSpanMessage(`读生产信息应答控制码异常：0x${ctrlCode.toString(16).toUpperCase()}（期望 0x81）`, 'red');
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
  context.createLeftSpanMessage('===== 执行器读生产信息（F0 F0）解析 =====', '#1976D2');

  // 仪表类型
  context.logRaw(rawHex(1, 1), '仪表类型 T', `0x${frameType.toString(16).padStart(2, '0').toUpperCase()}`);

  // 阀门地址（低字节在前，共 4 字节）
  const addr = Array.from({length: 4}, (_, i) =>
    readU8(2 + i).toString(16).padStart(2, '0')
  ).join('').toUpperCase();
  context.leftReadAddress = addr;
  context.logRaw(rawHex(2, 4),'阀门地址', addr);

  // 厂家代码（3 字节）
  const vendor = [6, 7, 8].map(i =>
    readU8(i).toString(16).padStart(2, '0').toUpperCase()
  ).join(' ');
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
  // ---------- 6. 数据解析（偏移 14 开始） ----------

  // 产品型号 24字节 ASCII
  context.logRaw(rawHex(14, 24), '产品型号', readAscii(14, 24));

  // 软件型号 12字节 ASCII
  context.logRaw(rawHex(38, 12), '软件型号', readAscii(38, 12));

  // 自检状态 1字节
  const selfCheckStatus = readU8(50);
  let statusText = '';
  if (selfCheckStatus === 0) statusText = '自检失败或未发生自检';
  else if (selfCheckStatus === 1) statusText = '自检通过';
  else statusText = `未知状态(${selfCheckStatus})`;
  context.logRaw(rawHex(50, 1), '生产自检状态', statusText);

  // 自检失败原因 2字节位图（低字节在前）
  const failReason = readU16(51);
  context.logRaw(rawHex(51, 2), '自检失败原因位图', `0x${failReason.toString(16).padStart(4, '0').toUpperCase()}`);

  // 如果自检失败（状态不是 1，或者失败原因不为 0），展开位图详情
  if (selfCheckStatus !== 1 || failReason !== 0) {
    const fLow = failReason & 0xFF;
    const fHigh = (failReason >> 8) & 0xFF;

    // 第一字节 (Byte 1)
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D0] EEP 检测失败', (fLow & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D1] 关方向超时', (fLow & 0x02) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D2] 开方向超时', (fLow & 0x04) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D3] 关方向反向', (fLow & 0x08) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D4] 开方向反向', (fLow & 0x10) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D5] 电机动作电流过低(未接电机/驱动无输出)', (fLow & 0x20) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D6] 电机动作电流过高', (fLow & 0x40) ? '异常' : '正常');
    context.logRaw(rawHex(51, 1), '  ├ [字节1-D7] 开关极限行程跨度不合法', (fLow & 0x80) ? '异常' : '正常');

    // 第二字节 (Byte 2)
    context.logRaw(rawHex(52, 1), '  ├ [字节2-D8] 动作到指定角度过程失败', (fHigh & 0x01) ? '异常' : '正常');
    context.logRaw(rawHex(52, 1), '  ├ [字节2-D9] 动作到指定角度过程超时', (fHigh & 0x02) ? '异常' : '正常');
    context.logRaw(rawHex(52, 1), '  ├ [字节2-D10] 动作到指定角度过程失败且动作超时', (fHigh & 0x04) ? '异常' : '正常');
    context.logRaw(rawHex(52, 1), '  ├ [字节2-D11] 角度传感器异常，位置变化过小', (fHigh & 0x08) ? '异常' : '正常');
    context.logRaw(rawHex(52, 1), '  └ [字节2-D14] 生产自检总流程超过3分钟未得到结果', (fHigh & 0x40) ? '异常' : '正常');
  }

  // 4-20mA 输入输出验证结果
  const check420 = readU8(53);
  context.logRaw(rawHex(53, 1), '4-20mA 输入输出验证', check420 === 1 ? '通过' : '未通过');

  // 2-10V 输入输出验证结果
  const check210 = readU8(54);
  context.logRaw(rawHex(54, 1), '2-10V 输入输出验证', check210 === 1 ? '通过' : '未通过');

  // ---------- 7. 结束 ----------
  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');
  return false;
}
// 读取 ASCII 字符串并去除末尾的 \0 和空格
const readAscii = (o, len) => {
  let str = '';
  for (let i = 0; i < len; i++) {
    const charCode = dataView.getUint8(base + o + i);
    if (charCode !== 0) str += String.fromCharCode(charCode);
  }
  return str.trim();
};
