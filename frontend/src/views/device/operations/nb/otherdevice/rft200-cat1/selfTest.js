import {protocolIDMap} from "@/views/device/enum/enum";
import {playErrorAudio} from "@/utils/audioUtils";
import {serialPortOperation} from "@/views/device/action/deviceAction";
import {hexToAscii} from "@/packBuffer/common/comUtil";
import {doWritePort} from "@/views/device/handler/portHandler";

const Log = require('ee-core/log');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitReceive485 = async (context, successStr, maxTimes = 30) => {
  let i = 0;

  while (i < maxTimes) {
    i++;
    await wait(700);

    const recvStr = hexToAscii(context.receivedData.globalReceived485Data);
    context.createLeftSpanMessage(
      `第 ${i} 次接收485串口发送数据: ${recvStr}`
    );

    if (recvStr.includes(successStr)) {
      context.createLeftSpanMessage(
        `485串口接收到正确数据: ${recvStr}\n`
      );
      return true;
    }
  }

  return false;
};

const success485sendStr = async (context, str) => {
  Log.info('[请求报文] 上位机向 485 发送成功标识=> ', str);

  try {
    await doWritePort(context.portAttributes.serialPort485, str, '485');
  } catch {
    Log.error('上位机向 485 发送成功标识-写入串口失败');
    context.createLeftSpanMessage('上位机向 485 发送成功标识-写入串口失败', 'red');
    context.receivedData.globalReceived485Data = '';
    return false;
  }

  await wait(2000);
  context.createLeftSpanMessage('上位机向 485 发送成功标识  成功', 'green');
  context.receivedData.globalReceived485Data = '';
  return true;
};
export const selfTest = async (context, protocolId, type) => {
  const model = context.configForm.produceModel;
  const protocol = protocolIDMap[model];
  let inquireFail = await serialPortOperation(context, {
    actionType: 'inquireSelfTest',
    operationName: '自检询问',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '01',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength.inquireSelfTest,
    expectedLength2: protocol.deviceActionResponseMessageLength2.inquireSelfTest,
    timeout: context.timeout,
    validateResponse: () =>
      protocol.validateResponse.inquireSelfTest(context.receivedData.globalReceivedOneData),
    preprocess: () => {
    },
    isInfraredDevice: protocolIDMap[context.configForm.produceModel].isInfraredDevice,
    isTransparentTransmissionProtocol: protocol.isDeviceActionTransparentTransmissionProtocol.inquireSelfTest,
  }, type)
  if (inquireFail) {
    await playErrorAudio(context)
    return true
  }
  await serialPortOperation(context, {
    actionType: 'selfTest',
    operationName: '自检开启',
    cmdType: 'f0',                         // afn 的命令类型
    cmdCode: '02',                         // fn 的命令码
    protocolId: protocolId,
    maxRetries: context.maxRetries,
    expectedLength: protocol.deviceActionResponseMessageLength.selfTest,
    expectedLength2: protocol.deviceActionResponseMessageLength2.selfTest,
    timeout: context.timeout,
    validateResponse: () => false,
    isInfraredDevice: protocol.isInfraredDevice,
    isTransparentTransmissionProtocol:
    protocol.isDeviceActionTransparentTransmissionProtocol.selfTest,
  }, type)
  // 3️⃣ 监听 485 串口是否接收到指定字符串
  const successReception = await waitReceive485(context, 'hlmtest');
  if (!successReception) {
    await playErrorAudio(context);
    return true;
  }

  // 4️⃣ 发送 485 成功标识
  const sendOk = await success485sendStr(context, '12345678');
  if (!sendOk) {
    await playErrorAudio(context);
    return true;
  }
  return false
}

