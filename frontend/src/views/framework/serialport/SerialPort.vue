<template>
  <div class="flex-container">
    <a-form class="offset-form" ref="form">
      <div class="form-content">
        <a-form-item label="端口">
          <a-select v-model:value="selectedPort">
            <a-select-option v-for="port in this.ports"
                             :value="port">
              {{ port }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="波特率">
          <a-select v-model:value="selectedBaudRate">
            <a-select-option v-for="baudRate in this.baudRates"
                             :value="baudRate">
              {{ baudRate }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="数据位">
          <a-select v-model:value="selectedDataBits">
            <a-select-option v-for="dataBits in this.dataBitsList"
                             :value="dataBits">
              {{ dataBits }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="校验位">
          <a-select v-model:value="selectedCheckDigit">
            <a-select-option v-for="checkDigit in this.checkDigitList"
                             :value="checkDigit">
              {{ checkDigit }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="停止位">
          <a-select v-model:value="selectedStopPosition">
            <a-select-option v-for="stopPosition in this.StopPositionList"
                             :value="stopPosition">
              {{ stopPosition }}
            </a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="状态">
          <CheckCircleTwoTone twoToneColor="#52c41a"/>
          <a-button type="primary" class="a-form-item">
            {{ this.serialPortStatus }}
          </a-button>
        </a-form-item>
        <a-form-item label="发送区" class="inline-items">
          <div class="inline-item">
            <a-button type="ghost" @click="sendTextMessage">手动发送</a-button>
            <a-input v-model:value="sendText1" type="textarea" :maxlength="-1"/>
          </div>
        </a-form-item>
      </div>


      <!-- 接收区 -->
      <div class="receive-container">
        <a-form-item label="接收区" class="receive-item">
          <a-textarea v-model:value="receptionText1" :rows="-1"/>
        </a-form-item>
      </div>

    </a-form>
  </div>

</template>


<script>
const {SerialPort} = require('serialport')

import {getUserByUserNameAndPassWork} from '@/components/global/mysqldb.js';

export default {
  name: 'SerialPort',
  data() {
    return {
      ports: [
        'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'COM10',
        'COM11', 'COM12', 'COM13', 'COM14', 'COM15', 'COM16', 'COM17', 'COM18', 'COM19', 'COM20',
      ],
      baudRates: [
        '110', '300', '600', '1200', '2400', '4800', '9600', '14400', '19200', '38400', '56000', '57600', '115200', '128000', '230400', '256000'
      ],
      dataBitsList: [
        '6', '7', '8'
      ],
      checkDigitList: [
        '无', '奇校验', '偶校验', 'Mark', '空格校验'
      ],
      StopPositionList: [
        '1', '1.5', '2',
      ],
      selectedPort: 'COM1',
      selectedBaudRate: '2400',
      selectedDataBits: '8',
      selectedCheckDigit: '偶校验',
      selectedStopPosition: '1',
      serialPortStatus: '打开串口',
      // sendText1: "68 46 AA AA AA AA AA AA AA 01 03 90 1F 01 08 16",
      // sendText1: "6846AAAAAAAAAAAAAA0103901F010816",
      sendText1: undefined,
      receptionText1: undefined
    }
  },
  methods: {
    sendTextMessage: function () {

      getUserByUserNameAndPassWork().then(result=>{
        console.log(result)
      })

      // //波特率
      // this.selectedBaudRate = '2400'
      // //数据位
      // this.selectedDataBits = '8'
      // //校验位
      // this.selectedCheckDigit = '偶校验'
      // //停止位
      // this.selectedStopPosition = '1'
      // //path
      // this.selectedPort   = 'COM3'
      //none 无校验位
      //odd 奇校验
      //even 偶校验
      let checkDigitCover = '';
      if (this.selectedCheckDigit === '无') {
        checkDigitCover = 'none'
      } else if (this.selectedCheckDigit === '奇校验') {
        checkDigitCover = 'odd'
      } else if (this.selectedCheckDigit === '偶校验') {
        checkDigitCover = 'even'
      }
      const port = new SerialPort({
        path: this.selectedPort,
        baudRate: Number(this.selectedBaudRate),
        autoOpen: false,
        dataBits: Number(this.selectedDataBits),
        stopBits: Number(this.selectedStopPosition),
        parity: checkDigitCover
      });
      this.openSerialPort(port);

    },
    openSerialPort(port) {
      // 打开串口
      port.open((err) => {
        if (err) {
          console.error('无法打开串口:', err.message);
        } else {
          console.log('串口已打开');
          // 监听串口数据
          // port.on('data', (data) => {
          //   console.log('接收到的原始数据:', data); // 打印接收到的原始数据
          // });
          // 要写入的十六进制字符串
          // const hexString = "6846AAAAAAAAAAAAAA0103901F010816";
          const buffer = Buffer.from(this.sendText1, 'hex');
          // 向串口写入数据
          port.write(buffer, (err) => {
            if (err) {
              console.error('写入串口时发生错误:', err.message);
            } else {
              console.log('数据已成功写入串口');
            }
          });
        }
      });


      // 错误监听
      // port.on('error', (error) => {
      //   console.log('error: ' + error)
      // })

      // 监听串口数据
      let receivedData = ''; // 保存接收到的数据
      port.on('data', function (data) {
        // 将接收到的数据转换为十六进制字符串，并添加空格分隔
        let hexString = data.toString('hex').toUpperCase();
        receivedData = receivedData + " " + hexString;
      });

      //异步执行
      // 保存Vue实例的引用
      let vm = this;

      setTimeout(() => {
        console.log('Received Data (Hex with spaces):', receivedData);
        port.close(); // 关闭串口连接

        // 使用Vue实例的引用来调用$nextTick方法
        vm.$nextTick(() => {
          vm.receptionText1 = receivedData;
        });
      }, 1000); // 假设5秒后停止接收数据

    }

  }
}
</script>

<style scoped>
.offset-form {
  margin-right: 20px;
}

.flex-container {
  display: flex;
  align-items: flex-start; /* 顶部对齐 */
}

.a-form-item a-button {
  margin-right: 100px;
}

.inline-items {
  display: flex;
  align-items: center;
}

.inline-item {
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust as needed */
}

.form-content {
  flex-grow: 1; /* 表单内容部分占满剩余空间 */
}

.receive-container {
  position: fixed; /*固定位置*/
  top: 0;
  right: 50%;
}

.receive-item {
  width: 600%; /* 接收区宽度填满 */
  height: 300px
}
</style>
