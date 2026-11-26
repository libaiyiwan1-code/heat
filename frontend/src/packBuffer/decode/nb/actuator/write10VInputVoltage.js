import { parseInputCalibration } from './frame';

/** 写 10V 实际输入电压值（CC 0C）应答。notPass：true 失败，false 成功。 */
export function write10VInputVoltage(context, responseMessage) {
  return parseInputCalibration(
    context,
    responseMessage,
    '写 10V实际输入电压值（CC 0C）',
    0x0C,
    '标定未通过，请检查硬件连接或电压源'
  );
}
