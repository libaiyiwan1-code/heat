import { parseAck } from './frame';

/** 输出 20mA 实际电流值标定（CC 04）应答。notPass：true 失败，false 成功。 */
export function outputs20mACurrentCalibration(context, responseMessage) {
  return parseAck(context, responseMessage, '输出20mA电流标定（CC 04）', 0x04, '输出20mA电流标定');
}
