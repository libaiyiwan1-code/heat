const {SerialPort} = require('serialport')

const Log = require('ee-core/log');


export const checkPort = (context,type) => {
  if (type==='one'){
    if (context.portAttributes.selectedPortOne === null || context.portAttributes.selectedPortOne === undefined) {
      context.createLeftSpanMessage('请选择串口', 'red');
      return false
    }
    if (context.portAttributes.portClosedOneStatus) {
      context.createLeftSpanMessage('串口未打开', 'red');
      return false
    }
  }else{
    if (context.portAttributes.selectedPortTwo === null || context.portAttributes.selectedPortTwo === undefined) {
      context.createLeftSpanMessage('请选择串口', 'red');
      return false
    }
    if (context.portAttributes.portClosedTwoStatus) {
      context.createLeftSpanMessage('串口未打开', 'red');
      return false
    }
  }

  return true
}


export const doOpenPort = (context, portName, parity, dataBits, baudRate, stopBits,type) => {

  if (type==='one'){
    return new Promise((resolve, reject) => {
      doCreatePort(context.portAttributes.serialPortOne, portName, parity, dataBits, baudRate, stopBits, context,type);
      context.portAttributes.portClosedOneStatus = false
      context.portAttributes.serialPortOne.open((err) => {
        if (err) {
          // 串口打开失败
          context.createLeftSpanMessage('串口：'+portName+'打开失败', 'red');
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
          context.createLeftSpanMessage('串口：'+portName+'打开成功', 'green');
          doPortListening(context, portName,type);
          resolve();
        }
      });

    });

  }else{
    return new Promise((resolve, reject) => {
      doCreatePort(context.portAttributes.serialPortTwo, portName, parity, dataBits, baudRate, stopBits, context,type);
      context.portAttributes.portClosedTwoStatus = false
      context.portAttributes.serialPortTwo.open((err) => {
        if (err) {
          // 串口打开失败
          context.createLeftSpanMessage('串口：'+portName+'打开失败', 'red');
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
          context.createLeftSpanMessage('串口：'+portName+'打开成功', 'green');
          doPortListening(context, portName,type);
          resolve();
        }
      });

    });

  }
};


export const doClosePort = (context, portName,type) => {
 if (type==='one'){
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
         context.createLeftSpanMessage('串口：'+portName+'已关闭', 'green');
         context.portAttributes.serialPortOne = null;
       }
     });
   }

 }else{
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
         context.createLeftSpanMessage('串口：'+portName+'已关闭', 'green');
         context.portAttributes.serialPortTwo = null;
       }
     });
   }

 }

};

const doPortListening = (context, portName,type) => {
 if (type==='one'){
   if (context.portAttributes.serialPortOne.listenerCount('data') === 0) {
     console.log('监听串口', portName);
     context.portAttributes.serialPortOne.on('data', (data) => {
       // console.warn('监听的串口对象',context.serialPort[portName])
       // console.warn('监听的串口名称',portName)
       let hexString = data.toString('hex').toUpperCase();
       // console.warn('接收报文:', hexString);
       context.receivedData.globalReceivedOneData += hexString;
     });

     context.portAttributes.serialPortOne.on('error', (error) => {
       console.log('port Listening error: ' + error);
       Log.error('port Listening error: ' + error);
       context.portAttributes.serialPortOne.close(); // 发生错误时关闭串口
       context.portAttributes.serialPortOne = null;
     });
     console.log('监听串口成功', portName);
   } else {
     console.log('串口已经在监听中', portName);
   }

 }else{
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

 }
};

export const doCreatePort = (serialPort, portName, parity, dataBits, baudRate, stopBits, context,type) => {
if (type==='one'){
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

}else{
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
}
};


export function doWritePort(serialPort, arrayBuffer,type) {
  if (type==='one'){
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

  }else{
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
      context.createLeftSpanMessage('当前可用的串口列表:' + portPaths, 'green');
      resolve(); //解决回调触发
    }).catch(error => {
      console.error('Error fetching serial ports:', error);
      Log.error('Error fetching serial ports:', error);
      reject(error);
    });
    context.portAttributes.portClosedOneStatus = true;
    context.portAttributes.portClosedTwoStatus = true;
  });
}


export function doHandleSelectChange(context,type) {
  if (type==='one'){
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

  }else{
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

  }

}

