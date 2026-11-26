import { parseAck } from './frame';

/** 4-20mA 标定验证（CC 0E）应答。notPass：true 失败，false 成功。 */
export function set420mACalibrationStatus(context, responseMessage) {
  return parseAck(context, responseMessage, '4-20mA验证标定（CC 0E）', 0x0E, '4-20mA验证标定');
}
