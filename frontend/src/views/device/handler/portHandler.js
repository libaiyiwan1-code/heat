const {SerialPort} = require('serialport')

const Log = require('ee-core/log');


export const checkPort = (context) => {
  if (context.portAttributes.selectedPortOne === null || context.portAttributes.selectedPortOne === undefined) {
    context.createLeftSpanMessage('请选择串口', '#E67E22');
    return false
  }
  if (context.portAttributes.portClosedOneStatus) {
    context.createLeftSpanMessage('串口未打开', '#E67E22');
    return false
  }
  return true
}


export const doOpenPort = (context, portName) => {
  if (!portName) return

  const {
    selectedCheckDigit: parityLabel,   // '偶校验' / '无' / '奇校验'
    selectedBadRate:    baudRate,      // '2400' / '9600' / '115200'
    selectedDataBits:   dataBits,      // 5 / 6 / 7 / 8
    selectedStopBits:   stopBits,      // 1 / 1.5 / 2
  } = context.portAttributes

  const parityMap = {
    '无': 'none',
    '奇校验': 'odd',
    '偶校验': 'even',
    'Mark': 'mark',
    '空格校验': 'space',
  }
  const parity = parityMap[parityLabel] ?? 'none'

  return new Promise((resolve, reject) => {
    doCreatePort(portName, parity, dataBits, baudRate, stopBits, context)

    context.portAttributes.portClosedOneStatus = false

    context.portAttributes.serialPortOne.open((err) => {
      if (err) {
        // 打开失败：回滚状态，清空实例
        context.portAttributes.portClosedOneStatus = true
        context.portAttributes.serialPortOne = null
        context.createLeftSpanMessage('串口：' + portName + '打开失败', 'grey')
        console.error('Failed to open port:', err.message)
        Log.error('Failed to open port:', err.message)
        reject(err)
      } else {
        // 打开成功
        context.createLeftSpanMessage(
          `串口已打开 | 端口：${portName} | 波特率：${baudRate}bps | 数据位：${dataBits} | 校验位：${parityLabel} | 停止位：${stopBits}`,
          'grey'
        )
        Log.info(portName + ':串口暂停状态:', context.portAttributes.serialPortOne.isPaused())
        Log.info(portName + ':串口打开状态:', context.portAttributes.serialPortOne.isOpen)
        context.createLeftSpanMessage('串口：' + portName + '打开成功', 'grey')
        doPortListening(context, portName)
        resolve()
      }
    })
  })
}
export const doClosePort = (context, portName) => {
  if (portName === null || portName === undefined) {
    return
  }
  if (context.portAttributes.serialPortOne !== null) {
    context.portAttributes.portClosedOneStatus = true
    context.portAttributes.serialPortOne.close((err) => {
      if (err) {
        console.error('Failed to close serial port:', err.message);
        Log.error('Failed to close serial port:', err.message);
      } else {
        console.log('串口已暂停:' + portName, context.portAttributes.serialPortOne.isPaused());
        Log.info('串口已暂停:' + portName, context.portAttributes.serialPortOne.isPaused());
        console.log('串口已打开' + portName, context.portAttributes.serialPortOne.isOpen);
        Log.info('串口已打开' + portName, context.portAttributes.serialPortOne.isOpen);
        context.createLeftSpanMessage('串口：' + portName + '已关闭', 'grey');
        context.portAttributes.serialPortOne = null;
      }
    });
  }

};

const doPortListening = (context, portName) => {
  console.log("监听context对象:", context)
  context.portAttributes.serialPortOne.on('error', (error) => {
    console.log('port Listening error: ' + error);
    Log.error('port Listening error: ' + error);
    context.portAttributes.serialPortOne.close(); // 发生错误时关闭串口
    context.portAttributes.serialPortOne = null;
  });
  if (context.portAttributes.serialPortOne.listenerCount('data') === 0) {

    console.log('监听串口', portName);
    context.portAttributes.serialPortOne.on('data', (data) => {
      let hexString = data.toString('hex').toUpperCase();
      if (!context.receivedData.globalReceivedOneData) {
        // console.warn(`[${new Date().toISOString()}] globalReceivedOneData 初始化为空字符串`);
        context.receivedData.globalReceivedOneData = '';
      }
      context.receivedData.globalReceivedOneData += hexString;
      // console.warn(`[${new Date().toISOString()}] 串口工具接收报文: ${context.receivedData.globalReceivedOneData}`);
    });


    console.log('监听串口成功', portName);
  } else {
    console.log('串口已经在监听中', portName);
  }

}

export const doCreatePort = (portName, parity, dataBits, baudRate, stopBits, context) => {
  context.portAttributes.serialPortOne = new SerialPort({
    path: portName,
    baudRate: Number(baudRate),
    autoOpen: false,
    dataBits: Number(dataBits),
    stopBits: Number(stopBits),
    parity,
  }, (err) => {
    if (err) {
      console.error('create port fail : ', err.message)
      Log.error('create port fail : ', err.message)
    }
  })
}

export function doWritePort(serialPort, arrayBuffer) {

  return new Promise((resolve, reject) => {
    if (serialPort) {
      serialPort.write(arrayBuffer, (err) => {
        if (err) {
          console.error('写入串口时发生错误:', err.message);
          Log.error('写入串口时发生错误:', err.message);
          reject(err);
        } else {
          console.log('数据已成功写入串口');
          Log.info('数据已成功写入串口');
          resolve();
        }
      });
    } else {
      const error = new Error('串口未初始化: ' + serialPort);
      console.error(error.message);
      Log.error(error.message);
      reject(error);
    }
  })
}


export function initializeAllSerialPorts(context) {
  return new Promise((resolve, reject) => {
    context.portAttributes.selectedPortOne = null
    SerialPort.list().then(ports => {
      context.portAttributes.serialPortList = ports.map(port => port.path);
      context.portAttributes.serialPortList.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}));
      console.log('最新获取的串口', context.portAttributes.serialPortList);
      Log.info('最新获取的串口', context.portAttributes.serialPortList);
      const portPaths = context.portAttributes.serialPortList.map(port => port).join('、');
      context.createLeftSpanMessage('当前可用的串口列表:' + portPaths, 'grey');
      resolve(); //解决回调触发
    }).catch(error => {
      console.error('Error fetching serial ports:', error);
      Log.error('Error fetching serial ports:', error);
      reject(error);
    });
    context.portAttributes.portClosedOneStatus = true;
    context.portAttributes.portClosedTwoStatus = true;
    context.portAttributes.portClosedSignalSourceStatus = true;
    context.portAttributes.portClosedCurrentSourceStatus = true;
    context.portAttributes.portClosed485Status = true;
    context.portAttributes.portClosedVoltageSourceStatus = true;
  });
}


export function doHandleSelectChange(context) {
  if (context.portAttributes.serialPortOne && context.portAttributes.serialPortOne.isOpen) {
    // 如果串口对象存在且是打开状态，则关闭串口
    context.portAttributes.serialPortOne.close((err) => {
      if (err) {
        context.portAttributes.portClosedOneStatus = false;
        context.portAttributes.serialPortOne = undefined
      } else {
        // 然后将串口对象置为 null
        context.portAttributes.portClosedOneStatus = true;
        context.portAttributes.serialPortOne = undefined
      }
    });
  }
}

