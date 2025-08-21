const {SerialPort} = require('serialport')

const Log = require('ee-core/log');


export const checkPort = (context, type) => {
  if (type === 'one') {
    if (context.portAttributes.selectedPortOne === null || context.portAttributes.selectedPortOne === undefined) {
      context.createLeftSpanMessage('请选择串口', 'grey');
      return false
    }
    if (context.portAttributes.portClosedOneStatus) {
      context.createLeftSpanMessage('串口未打开', 'grey');
      return false
    }
  } else if (type === 'two') {
    if (context.portAttributes.selectedPortTwo === null || context.portAttributes.selectedPortTwo === undefined) {
      context.createLeftSpanMessage('请选择串口', 'grey');
      return false
    }
    if (context.portAttributes.portClosedTwoStatus) {
      context.createLeftSpanMessage('串口未打开', 'grey');
      return false
    }
  } else if (type === 'three') {
    if (context.portAttributes.selectedPortSignalSource === null || context.portAttributes.selectedPortSignalSource === undefined) {
      context.createLeftSpanMessage('请选择信号源串口', 'grey');
      return false
    }
    if (context.portAttributes.portClosedSignalSourceStatus) {
      context.createLeftSpanMessage('信号源串口未打开', 'grey');
      return false
    }
  } else if (type === 'four') {
    if (context.portAttributes.selectedPortCurrentSource === null || context.portAttributes.selectedPortCurrentSource === undefined) {
      context.createLeftSpanMessage('请选择电流源串口', 'grey');
      return false
    }
    if (context.portAttributes.selectedPortCurrentSource) {
      context.createLeftSpanMessage('电流源串口未打开', 'grey');
      return false
    }
  } else if (type === 'meter') {
    if (context.portAttributes.selectedPortOne === null || context.portAttributes.selectedPortOne === undefined) {
      context.createLeftSpanMessage('请选择串口', 'grey');
      return false
    }
    if (context.portAttributes.portClosedOneStatus) {
      context.createLeftSpanMessage('串口未打开', 'grey');
      return false
    }
  }

  return true
}


export const doOpenPort = (context, portName, parity, dataBits, baudRate, stopBits, type) => {

  if (portName === null || portName === undefined) {
    return
  }
  if (type === 'one') {
    if (context.configForm.produceModel === 'WAC710CD') {
      parity = context.portAttributes.selectedCheckDigit
      baudRate = context.portAttributes.selectedBadRate
      console.log(parity)
      console.log(baudRate)
    }
    return new Promise((resolve, reject) => {
      doCreatePort(context.portAttributes.serialPortOne, portName, parity, dataBits, baudRate, stopBits, context, type);
      context.portAttributes.portClosedOneStatus = false
      context.portAttributes.serialPortOne.open((err) => {
        if (err) {
          // 串口打开失败
          context.createLeftSpanMessage('串口：' + portName + '打开失败', 'grey');
          context.portAttributes.serialPortOne = null;
          console.error('Failed to open port:', err.message);
          Log.error('Failed to open port:', err.message);
          reject(err);
        } else {
          // 串口打开成功
          console.log(context.portAttributes.serialPortOne.isPaused());
          Log.info(portName + ':串口暂停状态:', context.portAttributes.serialPortOne.isPaused());
          console.log(context.portAttributes.serialPortOne.isOpen);
          Log.info(portName + ':串口打开状态:', context.portAttributes.serialPortOne.isOpen);
          context.createLeftSpanMessage('串口：' + portName + '打开成功', 'grey');
          doPortListening(context, portName, type);
          resolve();
        }
      });

    });

  } else if (type === 'two') {
    return new Promise((resolve, reject) => {
      doCreatePort(context.portAttributes.serialPortTwo, portName, parity, dataBits, baudRate, stopBits, context, type);
      context.portAttributes.portClosedTwoStatus = false
      context.portAttributes.serialPortTwo.open((err) => {
        if (err) {
          // 串口打开失败
          context.createRightSpanMessage('串口：' + portName + '打开失败', 'grey');
          context.portAttributes.serialPortTwo = null;
          console.error('Failed to open port:', err.message);
          Log.error('Failed to open port:', err.message);
          reject(err);
        } else {
          // 串口打开成功
          console.log(context.portAttributes.serialPortTwo.isPaused());
          Log.info(portName + ':串口暂停状态:', context.portAttributes.serialPortTwo.isPaused());
          console.log(context.portAttributes.serialPortTwo.isOpen);
          Log.info(portName + ':串口打开状态:', context.portAttributes.serialPortTwo.isOpen);
          context.createRightSpanMessage('串口：' + portName + '打开成功', 'grey');
          doPortListening(context, portName, type);
          resolve();
        }
      });

    });

  } else if (type === 'three') {
    return new Promise((resolve, reject) => {
      doCreatePort(context.portAttributes.serialPortSignalSource, portName, parity, dataBits, baudRate, stopBits, context, type);
      context.portAttributes.portClosedSignalSourceStatus = false
      context.portAttributes.serialPortSignalSource.open((err) => {
        if (err) {
          // 串口打开失败
          context.createLeftSpanMessage('串口：' + portName + '打开失败', 'grey');
          context.portAttributes.serialPortSignalSource = null;
          console.error('Failed to open port:', err.message);
          Log.error('Failed to open port:', err.message);
          reject(err);
        } else {
          // 串口打开成功
          console.log(context.portAttributes.serialPortSignalSource.isPaused());
          Log.info(portName + ':串口暂停状态:', context.portAttributes.serialPortSignalSource.isPaused());
          console.log(context.portAttributes.serialPortSignalSource.isOpen);
          Log.info(portName + ':串口打开状态:', context.portAttributes.serialPortSignalSource.isOpen);
          context.createLeftSpanMessage('串口：' + portName + '打开成功', 'grey');
          doPortListening(context, portName, type);
          resolve();
        }
      });

    });

  } else if (type === 'four') {
    return new Promise((resolve, reject) => {
      doCreatePort(context.portAttributes.serialPortCurrentSource, portName, '无', dataBits, 9600, stopBits, context, type);
      context.portAttributes.portClosedCurrentSourceStatus = false
      context.portAttributes.serialPortCurrentSource.open((err) => {
        if (err) {
          // 串口打开失败
          context.createLeftSpanMessage('串口：' + portName + '打开失败', 'grey');
          context.portAttributes.serialPortCurrentSource = null;
          console.error('Failed to open port:', err.message);
          Log.error('Failed to open port:', err.message);
          reject(err);
        } else {
          console.log(context.portAttributes.serialPortCurrentSource)
          // 串口打开成功
          console.log(context.portAttributes.serialPortCurrentSource.isPaused());
          Log.info(portName + ':串口暂停状态:', context.portAttributes.serialPortCurrentSource.isPaused());
          console.log(context.portAttributes.serialPortCurrentSource.isOpen);
          Log.info(portName + ':串口打开状态:', context.portAttributes.serialPortCurrentSource.isOpen);
          context.createLeftSpanMessage('串口：' + portName + '打开成功', 'grey');
          doPortListening(context, portName, type);
          resolve();
        }
      });

    });

  }

};


export const doClosePort = (context, portName, type) => {
  if (portName === null || portName === undefined) {
    return
  }
  console.log(portName, type)
  if (type === 'one') {
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

  } else if (type === 'two') {
    if (context.portAttributes.serialPortTwo !== null) {
      context.portAttributes.portClosedTwoStatus = true
      context.portAttributes.serialPortTwo.close((err) => {
        if (err) {
          console.error('Failed to close serial port:', err.message);
          Log.error('Failed to close serial port:', err.message);
        } else {
          console.log('串口已暂停:' + portName, context.portAttributes.serialPortTwo.isPaused());
          Log.info('串口已暂停:' + portName, context.portAttributes.serialPortTwo.isPaused());
          console.log('串口已打开' + portName, context.portAttributes.serialPortTwo.isOpen);
          Log.info('串口已打开' + portName, context.portAttributes.serialPortTwo.isOpen);
          context.createRightSpanMessage('串口：' + portName + '已关闭', 'grey');
          context.portAttributes.serialPortTwo = null;
        }
      });
    }

  } else if (type === 'three') {
    if (context.portAttributes.serialPortSignalSource !== null) {
      context.portAttributes.portClosedSignalSourceStatus = true
      context.portAttributes.serialPortSignalSource.close((err) => {
        if (err) {
          console.error('Failed to close serial port:', err.message);
          Log.error('Failed to close serial port:', err.message);
        } else {
          console.log('串口已暂停:' + portName, context.portAttributes.serialPortSignalSource.isPaused());
          Log.info('串口已暂停:' + portName, context.portAttributes.serialPortSignalSource.isPaused());
          console.log('串口已打开' + portName, context.portAttributes.serialPortSignalSource.isOpen);
          Log.info('串口已打开' + portName, context.portAttributes.serialPortSignalSource.isOpen);
          context.createLeftSpanMessage('串口：' + portName + '已关闭', 'grey');
          context.portAttributes.serialPortSignalSource = null;
        }
      });
    }

  } else if (type === 'four') {
    if (context.portAttributes.serialPortCurrentSource !== null) {
      context.portAttributes.portClosedCurrentSourceStatus = true
      context.portAttributes.serialPortCurrentSource.close((err) => {
        if (err) {
          console.error('Failed to close serial port:', err.message);
          Log.error('Failed to close serial port:', err.message);
        } else {
          console.log('串口已暂停:' + portName, context.portAttributes.serialPortCurrentSource.isPaused());
          Log.info('串口已暂停:' + portName, context.portAttributes.serialPortCurrentSource.isPaused());
          console.log('串口已打开' + portName, context.portAttributes.serialPortCurrentSource.isOpen);
          Log.info('串口已打开' + portName, context.portAttributes.serialPortCurrentSource.isOpen);
          context.createLeftSpanMessage('串口：' + portName + '已关闭', 'grey');
          context.portAttributes.serialPortCurrentSource = null;
        }
      });
    }

  }

};

const doPortListening = (context, portName, type) => {
  if (type === 'one') {
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

  } else if (type === 'two') {
    if (context.portAttributes.serialPortTwo.listenerCount('data') === 0) {
      console.log('监听串口', portName);
      context.portAttributes.serialPortTwo.on('data', (data) => {
        // console.warn('监听的串口对象',context.serialPort[portName])
        // console.warn('监听的串口名称',portName)
        let hexString = data.toString('hex').toUpperCase();
        // console.warn('接收报文:', hexString);
        context.receivedData.globalReceivedTwoData += hexString;
      });

      context.portAttributes.serialPortTwo.on('error', (error) => {
        console.log('port Listening error: ' + error);
        Log.error('port Listening error: ' + error);
        context.portAttributes.serialPortTwo.close(); // 发生错误时关闭串口
        context.portAttributes.serialPortTwo = null;
      });
      console.log('监听串口成功', portName);
    } else {
      console.log('串口已经在监听中', portName);
    }

  } else if (type === 'three') {
    if (context.portAttributes.serialPortSignalSource.listenerCount('data') === 0) {
      console.log('监听串口', portName);
      context.portAttributes.serialPortSignalSource.on('data', (data) => {
        // console.warn('监听的串口对象',context.serialPort[portName])
        // console.warn('监听的串口名称',portName)
        let hexString = data.toString('hex').toUpperCase();
        // console.warn('接收报文:', hexString);
        context.receivedData.globalReceivedSignalSourceData += hexString;
      });

      context.portAttributes.serialPortSignalSource.on('error', (error) => {
        console.log('port Listening error: ' + error);
        Log.error('port Listening error: ' + error);
        context.portAttributes.serialPortSignalSource.close(); // 发生错误时关闭串口
        context.portAttributes.serialPortSignalSource = null;
      });
      console.log('监听串口成功', portName);
    } else {
      console.log('串口已经在监听中', portName);
    }
  } else if (type === 'four') {
    if (context.portAttributes.serialPortCurrentSource.listenerCount('data') === 0) {
      console.log('监听串口', portName);
      context.portAttributes.serialPortCurrentSource.on('data', (data) => {
        // console.warn('监听的串口对象',context.serialPort[portName])
        // console.warn('监听的串口名称',portName)
        let hexString = data.toString('hex').toUpperCase();
        // console.warn('接收报文:', hexString);
        context.receivedData.globalReceivedCurrentSourceData += hexString;
      });

      context.portAttributes.serialPortCurrentSource.on('error', (error) => {
        console.log('port Listening error: ' + error);
        Log.error('port Listening error: ' + error);
        context.portAttributes.serialPortCurrentSource.close(); // 发生错误时关闭串口
        context.portAttributes.serialPortCurrentSource = null;
      });
      console.log('监听串口成功', portName);
    } else {
      console.log('串口已经在监听中', portName);
    }
  }
}

export const doCreatePort = (serialPort, portName, parity, dataBits, baudRate, stopBits, context, type) => {
  if (type === 'one'||type==='meter') {
    if (serialPort === undefined || serialPort === null) {
      context.portAttributes.serialPortOne = new SerialPort({
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

  } else if (type === 'two') {
    if (serialPort === undefined || serialPort === null) {
      context.portAttributes.serialPortTwo = new SerialPort({
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
  } else if (type === 'three') {
    if (serialPort === undefined || serialPort === null) {
      context.portAttributes.serialPortSignalSource = new SerialPort({
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
  } else if (type === 'four') {
    if (serialPort === undefined || serialPort === null) {
      context.portAttributes.serialPortCurrentSource = new SerialPort({
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
  }
};


export function doWritePort(serialPort, arrayBuffer, type) {

  if (type === 'one'||type==='meter') {
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

  } else if (type === 'two') {
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

  } else if (type === 'three') {
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

  } else if (type === 'four') {
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
}


export function initializeAllSerialPorts(context, type) {
  return new Promise((resolve, reject) => {
    context.portAttributes.selectedPortOne = null
    context.portAttributes.selectedPortTwo = null
    context.portAttributes.selectedPortSignalSource = null
    context.portAttributes.selectedPortCurrentSource = null
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
      if (type === 'one') {
        context.createLeftSpanMessage('当前可用的串口列表:' + portPaths, 'grey');
      } else {
        // context.createRightSpanMessage('当前可用的串口列表:' + portPaths, 'grey');
      }
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
  });
}


export function doHandleSelectChange(context, type) {
  if (type === 'one') {
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

  } else if (type === 'two') {
    if (context.portAttributes.serialPortTwo && context.portAttributes.serialPortTwo.isOpen) {
      // 如果串口对象存在且是打开状态，则关闭串口
      context.portAttributes.serialPortTwo.close((err) => {
        if (err) {
          context.portAttributes.portClosedTwoStatus = false;
          context.portAttributes.selectedPortTwo = undefined
        } else {
          // 然后将串口对象置为 null
          context.portAttributes.portClosedTwoStatus = true;
          context.portAttributes.selectedPortTwo = undefined
        }
      });
    }

  } else if (type === 'three') {
    if (context.portAttributes.serialPortSignalSource && context.portAttributes.serialPortSignalSource.isOpen) {
      // 如果串口对象存在且是打开状态，则关闭串口
      context.portAttributes.serialPortSignalSource.close((err) => {
        if (err) {
          context.portAttributes.portClosedSignalSourceStatus = false;
          context.portAttributes.selectedPortSignalSource = undefined
        } else {
          // 然后将串口对象置为 null
          context.portAttributes.portClosedSignalSourceStatus = true;
          context.portAttributes.selectedPortSignalSource = undefined
        }
      });
    }
  } else if (type === 'four') {
    if (context.portAttributes.serialPortCurrentSource && context.portAttributes.serialPortCurrentSource.isOpen) {
      // 如果串口对象存在且是打开状态，则关闭串口
      context.portAttributes.serialPortCurrentSource.close((err) => {
        if (err) {
          context.portAttributes.portClosedCurrentSourceStatus = false;
          context.portAttributes.selectedPortCurrentSource = undefined
        } else {
          // 然后将串口对象置为 null
          context.portAttributes.portClosedCurrentSourceStatus = true;
          context.portAttributes.selectedPortCurrentSource = undefined
        }
      });
    }
  }

}

