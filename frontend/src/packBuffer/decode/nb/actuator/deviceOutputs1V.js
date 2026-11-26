import { parseAck } from './frame';

/** 设备固定输出 1V（CC 11）应答。notPass：true 失败，false 成功。 */
export function deviceOutputs1V(context, responseMessage) {
  return parseAck(context, responseMessage, '设备固定输出1V（CC 11）', 0x11, '设备输出1V');
}
