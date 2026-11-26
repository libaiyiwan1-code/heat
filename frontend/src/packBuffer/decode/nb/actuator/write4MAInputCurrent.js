import { parseInputCalibration } from './frame';

/** 写 4mA 实际输入电流值（CC 09）应答。notPass：true 失败，false 成功。 */
export function write4MAInputCurrent(context, responseMessage) {
  return parseInputCalibration(
    context,
    responseMessage,
    '写 4MA实际输入电流值（CC 09）',
    0x09,
    '标定未通过，请检查硬件连接或电流源'
  );
}
