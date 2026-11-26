import { parseInputCalibration } from './frame';

/** 写 2V 实际输入电压值（CC 13）应答。notPass：true 失败，false 成功。 */
export function write2VInputVoltage(context, responseMessage) {
  return parseInputCalibration(
    context,
    responseMessage,
    '写 2V实际输入电压值（CC 13）',
    0x13,
    '标定未通过，请检查硬件连接或电压源'
  );
}
