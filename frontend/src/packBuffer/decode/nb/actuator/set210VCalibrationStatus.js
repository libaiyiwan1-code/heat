import { parseAck } from './frame';

/** 2-10V 标定验证（CC 12）应答。notPass：true 失败，false 成功。 */
export function set210VCalibrationStatus(context, responseMessage) {
  return parseAck(context, responseMessage, '2-10V验证标定（CC 12）', 0x12, '2-10V验证标定');
}
