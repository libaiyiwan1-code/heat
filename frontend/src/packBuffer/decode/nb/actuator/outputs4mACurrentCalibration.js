import { parseAck } from './frame';

/** 输出 4mA 实际电流值标定（CC 03）应答。notPass：true 失败，false 成功。 */
export function outputs4mACurrentCalibration(context, responseMessage) {
  return parseAck(context, responseMessage, '输出4mA电流标定（CC 03）', 0x03, '输出4mA电流标定');
}
