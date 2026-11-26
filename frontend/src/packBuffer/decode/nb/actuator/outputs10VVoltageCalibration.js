import { parseAck } from './frame';

/** 输出 10V 实际电压值标定（CC 06）应答。notPass：true 失败，false 成功。 */
export function outputs10VVoltageCalibration(context, responseMessage) {
  return parseAck(context, responseMessage, '输出10V电压标定（CC 06）', 0x06, '输出10V电压标定');
}
