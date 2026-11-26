import { openActuatorResponse } from './frame';

/**
 * 读设备模拟量采集值（CC 0F）解包。
 * 应答控制码 0x81，L=08：通道 1 字节 + 实际值 float 小端。
 * @returns {Boolean} notPass true=失败，false=成功
 */
export function readDeviceAnalogAcquisitionValue(context, responseMessage) {
  const frame = openActuatorResponse(context, responseMessage, {
    title: '读设备模拟量采集值（CC 0F）',
    ctrlCode: 0x81,
    di0: 0xCC,
    di1: 0x0F,
    dataLen: 0x08,
  });
  if (!frame) return true;

  const channel = frame.readU8(14);
  const channelStr = channel === 0x00 ? '电流通道' : (channel === 0x01 ? '电压通道' : `未知(${channel})`);
  context.logRaw(frame.rawHex(14, 1), '采集通道', channelStr);

  const floatValue = frame.readFloat32(15);
  const unit = channel === 0x00 ? ' mA' : ' V';
  context.logRaw(frame.rawHex(15, 4), '采集值', floatValue.toFixed(3), unit);

  context.createLeftSpanMessage('===== 解析结束 =====', '#1976D2');
  return false;
}
