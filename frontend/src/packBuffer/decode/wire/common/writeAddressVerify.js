import {addressCover, arrayBuffer2Hex, hex2arrayBuffer} from "@/packBuffer/common/comUtil";

export function writeAddressVerify(type, responseMessage, context, isInfraredDevice) {
  let valveAddress = type === 'one' ? context.leftGenerateAddress : context.rightGenerateAddress
  let coverAddress = arrayBuffer2Hex(addressCover(valveAddress))
  let messageBuffer = hex2arrayBuffer(responseMessage);
  let dataView = new DataView(messageBuffer);
  let splicingAddress = ''
  let writeAddressNotPass = false;
  if (!isInfraredDevice) {
    for (let i = 5; i <= 8; i++) {
      const byteValue = dataView.getUint8(i);
      const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
      splicingAddress += hexString;
    }
  } else {
    for (let i = 31; i <= 34; i++) {
      const byteValue = dataView.getUint8(i);
      const hexString = byteValue < 16 ? '0' + byteValue.toString(16) : byteValue.toString(16);
      splicingAddress += hexString;
    }
  }
  console.log(splicingAddress)
  console.log(coverAddress)
  if (splicingAddress !== coverAddress) {
    writeAddressNotPass = true;
    console.log('Address check failed.');
    return writeAddressNotPass
  }

  return writeAddressNotPass;
}
