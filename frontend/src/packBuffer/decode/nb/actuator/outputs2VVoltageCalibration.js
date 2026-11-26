import { parseAck } from './frame';

/** 输出 2V 实际电压值标定（CC 10）应答。notPass：true 失败，false 成功。 */
export function outputs2VVoltageCalibration(context, responseMessage) {
  return parseAck(context, responseMessage, '输出2V电压标定（CC 10）', 0x10, '输出2V电压标定');
}
