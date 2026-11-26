import { parseInputCalibration } from './frame';

/** 写 20mA 实际输入电流值（CC 0A）应答。notPass：true 失败，false 成功。 */
export function write20MAInputCurrent(context, responseMessage) {
  return parseInputCalibration(
    context,
    responseMessage,
    '写 20MA实际输入电流值（CC 0A）',
    0x0A,
    '标定未通过，请检查硬件连接或电流源'
  );
}
