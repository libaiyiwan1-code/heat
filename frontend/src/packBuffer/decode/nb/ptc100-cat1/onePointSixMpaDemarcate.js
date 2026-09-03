const Log = require('ee-core/log')

/**
 *  标定1.6MPa压力AD值
 *
 * */
export function onePointSixMpaDemarcate(context, responseMessage) {
  let pressureADStr = '';
  let notPass = false
  for (let i = 12; i < 20; i++) {
    pressureADStr += responseMessage.charAt(i);
  }

  if (pressureADStr === '00000000' || pressureADStr === undefined || pressureADStr === null || pressureADStr === '') {
    context.createLeftSpanMessage('标定"1.6MPa"压力AD值异常:' + pressureADStr, 'grey');
    console.warn('标定"1.6MPa"压力失败，AD值异常:', pressureADStr);
    Log.warn('标定"1.6MPa"压力失败，AD值异常:', pressureADStr);
    notPass = true
  } else {
    context.createLeftSpanMessage('标定"1.6MPa"压力AD值正常:' + pressureADStr, 'grey');
  }
  return notPass
}
