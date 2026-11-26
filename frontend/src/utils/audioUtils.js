import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
const path = window.require("path");
const fs = window.require('fs');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;


async function playSuccessAudio(context) {
  context.buttonEnabled();
  const res = await ipc.invoke(ipcApiRoute.getAppPath);
  console.warn('appPath:', res);
  // const audioPath = res + '/frontend/src/utils/audio/success.mp3';
  const audioPath = path.join(res, "audio", "success.mp3");
  console.log('成功音频文件路径:', audioPath);
  await playAudio(audioPath);
}


async function playErrorAudio(context) {
  context.buttonEnabled();
  const res = await ipc.invoke(ipcApiRoute.getAppPath);
  console.warn('appPath:', res);
  const audioPath = path.join(res, "audio", "error.mp3");
  console.log('失败音频文件路径:', audioPath);
  await playAudio(audioPath);
}

async function playAudio(audioPath) {
  const fileBuffer = fs.readFileSync(audioPath);
  if (!fileBuffer) {
    throw new Error('无法读取音频文件');
  }
  const arrayBuffer = fileBuffer.buffer.slice(
    fileBuffer.byteOffset,
    fileBuffer.byteOffset + fileBuffer.byteLength
  );
  console.log('音频文件加载成功，ArrayBuffer 大小:', arrayBuffer.byteLength);
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  console.log('音频解码成功');
  if (currentSource) {
    currentSource.stop();
    currentSource.disconnect();
  }
  currentSource = audioContext.createBufferSource();
  currentSource.buffer = audioBuffer;
  currentSource.connect(audioContext.destination);
  currentSource.start(0);
}

export { playSuccessAudio, playErrorAudio };
