const {SerialPort} = require('serialport')

const Log = require('ee-core/log');


export const checkPort = (context) => {
  console.warn('串口校验')
  if (context.portAttributes.selectedPort === null || context.portAttributes.selectedPort === undefined) {
    context.createLeftSpanMessage('请选择串口', 'red');
    return false
  }
  if (context.portAttributes.portClosedStatus) {
    context.createLeftSpanMessage('串口未打开', 'red');
    return false
  }
  return true
}


export const doOpenPort = (context, portName, parity, dataBits, baudRate, stopBits) => {

  return new Promise((resolve, reject) => {
    doCreatePort(context.portAttributes.serialPort, portName, parity, dataBits, baudRate, stopBits, context);
    context.portAttributes.portClosedStatus = false
    context.portAttributes.serialPort.open((err) => {
      if (err) {
        // 串口打开失败
        context.createLeftSpanMessage('串口：'+portName+'打开失败', 'red');
        context.portAttributes.serialPort = null;
        console.error('Failed to open port:', err.message);
        Log.error('Failed to open port:', err.message);
        reject(err);
      } else {
        // 串口打开成功
        console.log(context.portAttributes.serialPort.isPaused());
        Log.info(portName + ':串口暂停状态:', context.portAttributes.serialPort.isPaused());
        console.log(context.portAttributes.serialPort.isOpen);
        Log.info(portName + ':串口打开状态:', context.portAttributes.serialPort.isOpen);
        context.createLeftSpanMessage('串口：'+portName+'打开成功', 'green');
        doPortListening(context, portName);
        resolve();
      }
    });

  });
};


export const doClosePort = (context, portName) => {
  if (context.portAttributes.serialPort !== null) {
    context.portAttributes.portClosedStatus = true
    context.portAttributes.serialPort.close((err) => {
      if (err) {
        console.error('Failed to close serial port:', err.message);
        Log.error('Failed to close serial port:', err.message);
      } else {
        console.log('串口已暂停:' + portName, context.portAttributes.serialPort.isPaused());
        Log.info('串口已暂停:' + portName, context.portAttributes.serialPort.isPaused());
        console.log('串口已打开' + portName, context.portAttributes.serialPort.isOpen);
        Log.info('串口已打开' + portName, context.portAttributes.serialPort.isOpen);
        context.createLeftSpanMessage('串口：'+portName+'已关闭', 'green');
        context.portAttributes.serialPort = null;
      }
    });
  }
};

const doPortListening = (context, portName) => {
  if (context.portAttributes.serialPort.listenerCount('data') === 0) {
    console.log('监听串口', portName);
    context.portAttributes.serialPort.on('data', (data) => {
      // console.warn('监听的串口对象',context.serialPort[portName])
      // console.warn('监听的串口名称',portName)
      let hexString = data.toString('hex').toUpperCase();
      // console.warn('接收报文:', hexString);
      context.globalReceivedData += hexString;
    });

    context.portAttributes.serialPort.on('error', (error) => {
      console.log('port Listening error: ' + error);
      Log.error('port Listening error: ' + error);
      context.portAttributes.serialPort.close(); // 发生错误时关闭串口
      context.portAttributes.serialPort = null;
    });
    console.log('监听串口成功', portName);
  } else {
    console.log('串口已经在监听中', portName);
  }
};

export const doCreatePort = (serialPort, portName, parity, dataBits, baudRate, stopBits, context) => {
  if (serialPort === undefined || serialPort === null) {
    context.portAttributes.serialPort = new SerialPort({
      path: portName,
      baudRate: Number(baudRate),
      autoOpen: false,
      dataBits: Number(dataBits),
      stopBits: Number(stopBits),
      parity: parity === '无' ? 'none'
        : parity === '奇校验' ? 'odd'
          : parity === '偶校验' ? 'even'
            : parity === 'Mark' ? 'mark'
              : parity === '空格校验' ? 'space' : 'none'
    }, (err) => {
      if (err) {
        console.error('create port fail : ', err.message);
        Log.error('create port fail : ', err.message);
      }
    });
  }
  console.log(context.portAttributes.serialPort)
};


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
    SerialPort.list().then(ports => {
      // context.ports = ports.map(port => ({path: port.path, available: true}));
      context.portAttributes.serialPortList = ports.map(port => port.path);
      // 自然排序
      // const naturalSort = (a, b) => {
      //   const regex = /(\D+)(\d+)/;
      //   const [, textA, numA] = a.path.match(regex);
      //   const [, textB, numB] = b.path.match(regex);
      //
      //   if (textA === textB) {
      //     return parseInt(numA, 10) - parseInt(numB, 10);
      //   }
      //   return textA.localeCompare(textB);
      // };
      //对 context.ports 进行排序
      // context.ports.sort(naturalSort);
      context.portAttributes.serialPortList.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}));
      console.log('最新获取的串口', context.portAttributes.serialPortList);
      Log.info('最新获取的串口', context.portAttributes.serialPortList);
      const portPaths = context.portAttributes.serialPortList.map(port => port).join('、');
      context.createLeftSpanMessage('获取可用的串口列表:' + portPaths, 'green');
      resolve(); //解决回调触发
    }).catch(error => {
      console.error('Error fetching serial ports:', error);
      Log.error('Error fetching serial ports:', error);
      reject(error);
    });
    context.portAttributes.portClosedStatus = true;
  });
}


export function doHandleSelectChange(context, selectSerialPort) {
  if (context.portAttributes.serialPort && context.portAttributes.serialPort.isOpen) {
    // 如果串口对象存在且是打开状态，则关闭串口
    context.portAttributes.serialPort.close((err) => {
      if (err) {
        context.portAttributes.portClosedStatus = false;
        context.portAttributes.serialPort = undefined
      } else {
        // 然后将串口对象置为 null
        context.portAttributes.portClosedStatus = true;
        context.portAttributes.serialPort = undefined
      }
    });
  }

}

