
<template>
  <div>
    <a-layout>
      <a-layout-content>
        <div style="margin-top: 45px">
          <a-form
            name="basic"
            layout="inline"
            style="padding-left: 10px; display: flex; align-items: center;"
          >
            <a-form-item>
              <a-button @click=" this.getAllPorts()">刷新</a-button>
            </a-form-item>
            <a-form-item label="串口列表">
              <a-select v-model:value="this.selectedPort" style="width: 90px;"
                        @change="handlePortChange(this.selectedPort)">
                <a-select-option v-for="port in this.ports" :value="port">{{ port }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button @click="openPort(this.selectedPort)" :disabled="!this.buttonStatus.portClosedStatus">打开
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button @click="closePort(this.selectedPort)" :disabled="this.buttonStatus.portClosedStatus">关闭
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button @click="getPrinter()" style="margin-left: 250px"> 打印机设置</a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-layout-content>
    </a-layout>

    <div style="margin-top: 45px">

      <div style="margin-right: 400px; width: 90%;">
        <div style="display: inline-block; margin-right: 20px;">
          <div>
            <p style="display: inline-block; margin-right: 20px;">型号：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerSettingParams.selectDeviceMode }}</p>
          </div>
        </div>
        <div style="display: inline-block;">
          <div>
            <p style="display: inline-block; margin-left: 50px;">运营商：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerSettingParams.selectOperator }}</p>
          </div>
        </div>
        <div style="display: inline-block; margin-left: 20px;">
          <div>
            <p style="display: inline-block; margin-left: 50px;">打印型号：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerSettingParams.selectPrintModel }}</p>
          </div>
        </div>
      </div>


      <a-form
        name="basic"
        layout="inline"
        style="padding-left: 10px; display: flex; align-items: center;"
      >
        <a-form-item label="阀门地址">
          <a-input v-model:value="valveAddress" style="width: 100%"/>
        </a-form-item>
        <a-form-item
          label="IMEI"
        >
          <a-input v-model:value="imei"/>
        </a-form-item>

        <a-form-item>
          <a-button :disabled="false" @click="selfTest()">自检</a-button>
        </a-form-item>


        <a-form-item>
          <a-button :disabled="false" @click="writeAddress()">地址写入</a-button>
        </a-form-item>

        <a-form-item>
          <a-button :disabled="false" @click="printLabel()">地址打印</a-button>
        </a-form-item>
      </a-form>

      <!-- 自定义的带颜色文本框 -->
      <div
        style="  margin-left: 10px ;margin-top: 17px; width: 810px; height: 60px; border: 2px solid #ccc; overflow: auto; position: relative;"
      >
        <div ref="colorfulTextarea" contenteditable="false"
             style="width: 100%; height: 100%; padding: 10px; user-select: none;">
          <p v-html="operationMessage" style="font-size: 30px;"></p>
        </div>
      </div>
      <a-button :disabled="false" @click="clean()">清空流程文本</a-button>

      <div style="margin-top: 100px; padding-left: 10px; width: 1000px">
        <a-textarea v-model:value="this.receptionText"
                    style="width: 800px; height: 430px; margin-right: 300px ;margin-top: 1px; overflow-y: auto;"/>
      </div>
    </div>

    <div>
      <a-modal v-model:visible="modalShow" title="打印机列表" @ok="modalHandleOk">
        <div class="one-block-2">
          <a-list size="small" bordered :data-source="printerList">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-checkbox v-model:checked="item.isSelected"
                            @change="togglePrinterSelection(item)">
                  {{ item.displayName }}
                </a-checkbox>
              </a-list-item>
            </template>
            <template #header>
              <div>设备列表</div>
            </template>
          </a-list>
        </div>
      </a-modal>
    </div>
  </div>
</template>


<!-- 接收区 -->
<!--      <div class="receive-container">-->
<!--        <a-form-item label="接收区" class="receive-item">-->
<!--          <a-textarea v-model:value="receptionText1" :rows="-1"/>-->
<!--        </a-form-item>-->
<!--      </div>-->


<script>
import {countProductQuantityCountByUserId, getIdByMacAddr, insertNBValueProduce} from "@/components/global/productdb";
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute, specialIpcRoute} from "@/api/main";
import {arrayBuffer2Hex} from '@/utils/util'
import {
  packWAC710CReadICCID,
  packWAC710CReadIMEI,
  packWAC710CReadSelfTestStatus,
  packWAC710CSelfInquireTest,
  packWAC710CSelfTest,
  packWAC710CWriteAddress,
  packWAC710CWritePressureProbe,
  packWAC710CWriteTemperatureProbe
} from '@/utils/wac710c/encode/wac710c'
import {
  decodeAddressMessage,
  decodeCheckAFNAndFN,
  decodeCheckAgreementID,
  decodeCheckControlCode,
  decodeCheckFrame,
  decodeCheckInquireSelfTest, decodeCheckSelfTest,
  decodeCheckSumLength,
  decodeCheckWriteTemperatureProbe, decodeICCID, decodeIMEI, decodeProtocolId, decodeValveVersion,
} from '@/utils/wac710c/decode/wac710c'
import axios from 'axios';
import {checkIMEIExist} from "@/components/global/hemssdb";
const {SerialPort} = require('serialport')
// import {getTerminalWhereByMacAddr} from '@/components/global/hemssdb.js';
const Log = require('ee-core/log');
export default {
  name: 'SerialPort',
  mounted() {
    console.log('监听开始')
    Log.info('监听开始')
    // Log.info('监听开始')
    ipc.removeAllListeners(specialIpcRoute.loginWindowToSerialPortWindow);
    // 监听登录组件发送的消息
    try {
      ipc.on(specialIpcRoute.loginWindowToSerialPortWindow, (event, args) => {
        console.log('监听触发')
        Log.info('监听触发')
        const formData = JSON.parse(args);
        this.routerSettingParams.selectDeviceMode = formData.selectDeviceMode;
        this.routerSettingParams.selectOperator = formData.selectOperator;
        this.routerSettingParams.selectPrintModel = formData.selectPrintModel;
        this.routerSettingParams.selectTemperatureProbes = formData.selectTemperatureProbes;
        this.routerSettingParams.selectPressureProbes = formData.selectPressureProbes;
        this.routerSettingParams.userId = formData.userId[0].id;
        this.defaultParam.defaultBaudRate = '2400';
        this.defaultParam.defaultDataBits = '8';
        this.defaultParam.defaultCheckDigit = 'even';
        this.defaultParam.defaultStopPosition = '1';
        console.log(this.routerSettingParams);
      })
    } catch (error) {
      console.error('WAC710C page Error occurred while handling IPC message:', error);
      Log.error('WAC710C page Error occurred while handling IPC message:', error)
    }
    //串口初始化
    this.getAllPorts();
  },


  data() {
    return {
      printViews: [
        {
          type: 'image',
          content: '/public/html/Picture.bmp',
          pagesPerSheet: 1,  //默认 打一组
        },
      ],
      defaultDeviceName: undefined,
      printerList: [],
      modalShow: false,
      valveAddress: undefined,
      ports: [],
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
      buttonStatus: {
        portClosedStatus: true,
      },
      serialPort: null,
      selectedPort: undefined,
      defaultParam: {
        defaultBaudRate: undefined,
        defaultDataBits: undefined,
        defaultCheckDigit: undefined,
        defaultStopPosition: undefined,
      },
      routerSettingParams: {
        selectDeviceMode: undefined,
        selectOperator: undefined,
        selectPrintModel: undefined,
        selectTemperatureProbes: undefined,
        selectPressureProbes: undefined,
        windowsName: undefined,
        userId: undefined,
      },
      receptionText: '',
      isSuccess: false,
      isFailure: false,
      globalReceivedData: '',
      iccId: '',
      imei: '',
      operationMessage: '',

    }
  },
  methods: {

    updateOperationMessage(message, color) {
      this.operationMessage = `<span style="color: ${color};">${message}</span>`;
    },
    getAllPorts() {
      SerialPort.list().then(ports => {
        // 从获取到的串口列表中提取串口名称，并赋值给 this.ports
        this.ports = ports.map(port => port.path);
        this.ports.sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'}));
        //打印最新获取的串口
        console.log('最新获取的串口', this.ports)
        Log.info('最新获取的串口', this.ports)
        // 确保串口列表不为空
        if (this.ports.length > 0) {
          // 设置 selectedPort 为串口列表中的第一个串口
          this.selectedPort = this.ports[0];
        } else {
          // 如果串口列表为空，可能需要进行错误处理或者给出提示
          this.$message.error('没有找到串口');
          console.error('没有找到串口')
          Log.error('没有找到串口')
        }
      }).catch(error => {
        console.error('Error fetching serial ports:', error);
        Log.error('Error fetching serial ports:', error)
      });
      this.buttonStatus.portClosedStatus = true;
    },


    handlePortChange(selectSerialPort) {
      console.log('选择的串口:', selectSerialPort)
      Log.info('选择的串口', selectSerialPort)
      console.log('全局串口对象', this.serialPort)
      Log.info('全局串口对象', this.serialPort)
      if (this.serialPort && this.serialPort.isOpen) {
        // 如果串口对象存在且是打开状态，则关闭串口
        this.serialPort.close((err) => {
          if (err) {
            this.serialPort = null;
            this.buttonStatus.portClosedStatus = false;
            this.serialPort = undefined
            console.error('Failed to close serial port:', err.message);
            Log.error('Failed to close serial port:', err.message)
          } else {
            // 将串口对象置为 null
            this.serialPort = null;
            this.buttonStatus.portClosedStatus = true;
            this.serialPort = undefined
            console.log('Serial port closed successfully');
            Log.info('Serial port closed successfully')
          }
        });
      }

    },
    openPort(portName) {
      this.createPort(portName)
      this.serialPort.open((err) => {
        if (err) {
          //串口拿不到
          this.$message.error("串口：" + portName + "打开失败");
          this.buttonStatus.portClosedStatus = true
          this.serialPort = null
          console.error('Failed to open un :', err.message);
          Log.error('Failed to open un :', err.message)
        } else {
          this.buttonStatus.portClosedStatus = false
          console.log(this.serialPort.isPaused())
          Log.info(portName + ':串口暂停状态:', this.serialPort.isPaused())
          console.log(this.serialPort.isOpen)
          Log.info(portName + ':串口打开状态:', this.serialPort.isOpen)
          this.$message.success("串口：" + portName + "已打开");
        }
      });
      this.portListening(portName)
    },
    // 关闭串口方法
    closePort(portName) {
      this.buttonStatus.portClosedStatus = true
      if (this.serialPort !== null) {
        this.serialPort.close((err) => {
          if (err) {
            console.error('Failed to close serial port:', err.message);
            Log.error('Failed to close serial port:', err.message)
          } else {
            console.log('串口已暂停:' + portName, this.serialPort.isPaused())
            Log.info('串口已暂停:' + portName, this.serialPort.isPaused())
            console.log('串口已打开' + portName, this.serialPort.isOpen)
            Log.info('串口已打开' + portName, this.serialPort.isOpen)
            this.serialPort = null; // 将串口对象设置为 null
            this.$message.success("串口：" + portName + "已关闭");
          }
        });
      }

    },
    createPort(portName) {
      if (this.serialPort == null) {
        this.serialPort =
          new SerialPort({
            path: portName,
            // baudRate: Number(this.defaultParam.defaultBaudRate),
            baudRate: 2400,
            // 串口默认关闭
            autoOpen: false,
            // dataBits: Number(this.defaultParam.defaultDataBits),
            dataBits: 8,
            // stopBits: Number(this.defaultParam.defaultStopPosition),
            stopBits: 1,
            // parity: this.defaultParam.defaultCheckDigit
            parity: 'even'
          }, (err) => {
            if (err) {
              console.error('creat port fail : ', err.message);
              Log.error('creat port fail : ', err.message)
            }
          });
      }
    },
    printLabel() {
      if (this.valveAddress === null || this.valveAddress === undefined || this.valveAddress === '') {
        this.$message.error("请填写打印地址");
        return
      }
      if (this.valveAddress.length !== 8) {
        this.$message.error("请填写8位地址");
        return;
      }
      console.log('触发打印 , 当前打印机:', this.defaultDeviceName)
      Log.info('触发打印 , 当前打印机:', this.defaultDeviceName)
      const params = {
        // view: toRaw(this.printViews[index]),
        deviceName: this.defaultDeviceName,
        address: this.valveAddress,
        date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
      };
      ipc.send(ipcApiRoute.print, params)
    },
    getPrinter() {
      ipc.invoke(ipcApiRoute.getPrinterList, {}).then(res => {
        this.printerList = res;
      })
      this.modalShow = true
    },

    modalHandleOk() {
      this.modalShow = false
    },
    clean() {
      this.receptionText = ''
    },
    togglePrinterSelection(printer) {
      // 取消其他打印机的选择状态
      this.printerList.forEach(item => {
        if (item !== printer) {
          item.isSelected = false;
        }
      });
      // 设置当前打印机的选择状态
      printer.isSelected = true;
      // 将选中的打印机名称赋值给 defaultDeviceName
      this.defaultDeviceName = printer.name
      this.modalShow = false
      console.log(this.defaultDeviceName)
    },

    checkPort() {
      if (this.selectedPort === null || this.selectedPort === undefined) {
        this.$message.error("请选择串口");
        return false
      }
      if (this.buttonStatus.portClosedStatus) {
        this.$message.error("串口未打开");
        return false
      }
      return true
    },


    writePort: function (arrayBuffer) {
      return new Promise((resolve, reject) => {
        this.serialPort.write(arrayBuffer, (err) => {
          if (err) {
            console.error('写入串口时发生错误:', err.message);
            Log.error('写入串口时发生错误:', err.message)
            reject(err);
          } else {
            console.log('数据已成功写入串口');
            Log.info('数据已成功写入串口')
            resolve();
          }
        });
      });
    },
    /*打开串口时才调用此方法.*/
    portListening: function (portName) {
      console.log('监听串口', portName)
      this.serialPort.on('data', (data) => {
        let hexString = data.toString('hex').toUpperCase();
        this.globalReceivedData = this.globalReceivedData + " " + hexString;
      });
      this.serialPort.on('error', (error) => {
        console.error('port Listening error: ' + error)
        Log.error('port Listening error: ' + error)
      })
      console.log('监听串口成功', portName)
      Log.info('监听串口成功', portName)
    },


    async selfTest() {
      this.checkPort();
      this.operationMessage = ''
      this.receptionText = ''; //初始化 文本框.receptionText
      this.globalReceivedData = ''
      let wac710cSelfTestInquiryBuffer = packWAC710CSelfInquireTest();
      console.log('[请求报文]   wac710c询问自检=>  ', arrayBuffer2Hex(wac710cSelfTestInquiryBuffer));
      Log.info('[请求报文]   wac710c询问自检=>  ', arrayBuffer2Hex(wac710cSelfTestInquiryBuffer));
      try {
        await this.writePort(wac710cSelfTestInquiryBuffer);
      } catch {
        this.$message.error('wac710c询问自检-写入串口失败');
        this.updateOperationMessage('线路检测失败', 'red');
        this.receptionText = this.receptionText + 'wac710c询问自检-写入串口失败' + '\n';
        Log.error('wac710c询问自检-写入串口失败');
        console.error('wac710c询问自检-写入串口失败');
        this.globalReceivedData = '';
        return
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c询问自检=>  ', this.globalReceivedData);
      Log.info('[响应报文]   wac710c询问自检=>  ', this.globalReceivedData);

      if (decodeCheckInquireSelfTest(this.globalReceivedData) || this.globalReceivedData === '' || this.globalReceivedData === undefined) {
        this.updateOperationMessage('线路检测失败', 'red');
        this.$message.error('wac710c询问自检-线路检测失败');
        this.receptionText = this.receptionText + 'wac710c询问自检-线路检测失败' + '\n';
        console.error('wac710c询问自检-线路检测失败');
        Log.error('wac710c询问自检-线路检测失败');
        this.globalReceivedData = '';
        return
      }
      this.$message.success('线路检测成功,开始自检');
      this.receptionText = this.receptionText + 'wac710c自检-线路检测成功 待写温度探头、写压力探头、开启自检' + '\n';
      this.globalReceivedData = '';
      console.log('wac710c自检-线路检测成功 待写温度探头、写压力探头、开启自检')
      Log.info('wac710c自检-线路检测成功 待写温度探头、写压力探头、开启自检')

      //写温度探头
      let writeTemperatureProbe = packWAC710CWriteTemperatureProbe(this.routerSettingParams.selectTemperatureProbes);
      console.log('[请求报文]   wac710c写温度探头=>  ', arrayBuffer2Hex(writeTemperatureProbe));
      Log.info('[请求报文]   wac710c写温度探头=>  ', arrayBuffer2Hex(writeTemperatureProbe));
      try {
        await this.writePort(writeTemperatureProbe);
      } catch (e) {
        this.$message.error('wac710c写温度探头-写入串口失败');
        this.updateOperationMessage('线路检测失败', 'red');
        this.receptionText = this.receptionText + 'wac710c写温度探头-写入串口失败' + '\n';
        Log.error('wac710c写温度探头-写入串口失败');
        console.error('wac710c写温度探头-写入串口失败');
        this.globalReceivedData = '';
        return
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c写温度探头=>  ', this.globalReceivedData);
      Log.info('[响应报文]   wac710c写温度探头=>  ', this.globalReceivedData);
      if (decodeCheckWriteTemperatureProbe(this.globalReceivedData) || this.globalReceivedData === '' || this.globalReceivedData === undefined) {
        this.updateOperationMessage('线路检测失败', 'red');
        this.$message.error('wac710c写温度探头-写温度探头失败');
        this.receptionText = this.receptionText + 'wac710c写温度探头-写温度探头失败' + '\n';
        console.error('wac710c写温度探头-写温度探头失败');
        Log.error('wac710c写温度探头-写温度探头失败');
        this.globalReceivedData = '';
        return
      }

      this.globalReceivedData = '';
      this.$message.success('wac710c写温度探头成功');
      this.receptionText = this.receptionText + 'wac710c写温度探头成功 待写压力探头、开启自检' + '\n';
      console.log('wac710c写温度探头成功 待写压力探头、开启自检')
      Log.info('wac710c写温度探头成功 待写压力探头、开启自检')
      //写压力探头
      let writePressureProbe = packWAC710CWritePressureProbe(this.routerSettingParams.selectPressureProbes);
      console.log('[请求报文]   wac710c写压力探头=>  ', arrayBuffer2Hex(writePressureProbe));
      Log.info('[请求报文]   wac710c写压力探头=>  ', arrayBuffer2Hex(writePressureProbe));
      try {
        await this.writePort(writePressureProbe);
      } catch (e) {
        this.$message.error('wac710c写入压力探头-写入串口失败');
        this.updateOperationMessage('线路检测失败', 'red');
        this.receptionText = this.receptionText + 'wac710c写入压力探头-写入串口失败' + '\n';
        Log.error('wac710c写入压力探头-写入串口失败');
        console.error('wac710c写入压力探头-写入串口失败');
        this.globalReceivedData = '';
        return
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c写入压力探头=>  ', this.globalReceivedData);
      Log.info('[响应报文]   wac710c写入压力探头=>  ', this.globalReceivedData);


      this.globalReceivedData = '';
      this.$message.success('wac710c写压力探头成功');
      this.receptionText = this.receptionText + 'wac710c写压力探头成功 待开启自检' + '\n';
      console.log('wac710c写压力探头成功 待开启自检')
      Log.info('wac710c写压力探头成功 待开启自检')
      //开启自检
      let selfTestBuffer = packWAC710CSelfTest(this.routerSettingParams.selectTemperatureProbes, this.routerSettingParams.selectPressureProbes);
      console.log('[请求报文]   wac710c开启自检=>  ', arrayBuffer2Hex(selfTestBuffer));
      Log.info('[请求报文]   wac710c开启自检=>  ', arrayBuffer2Hex(selfTestBuffer));
      try {
        await this.writePort(selfTestBuffer);
      } catch (e) {
        this.$message.error('wac710c开启自检-写入串口失败');
        this.updateOperationMessage('线路检测失败', 'red');
        this.receptionText = this.receptionText + 'wac710c开启自检-写入串口失败' + '\n';
        Log.error('wac710c开启自检-写入串口失败');
        console.error('wac710c开启自检-写入串口失败');
        this.globalReceivedData = '';
        return
      }
      this.globalReceivedData = '';
      this.$message.success('wac710c自检成功');
      this.receptionText = this.receptionText + 'wac710c自检成功' + '\n';
      this.updateOperationMessage('自检成功', 'green');
      console.log('wac710c自检成功')
      Log.info('wac710c自检成功')

    },
    /*
      *
      *  规则ABCDEXXX
      * 2024 4.12
        //A: 如果是当前是1-9 月 天的十位+1 ,如果当前是10-12月 天的十位+5
        //B: 当前年个位
        //C: 当前月个位
        //D: 当前日个位
        //E: 生产员工ID(0-9) 根据登录成功传入的id
        //XXX:当前登录员工每天生产序列(001-999) 最多生产999个 否则生成地址的时候提示失败
      * */
    //34420000
    // 00 00 42 34
    generateAddress(employeeId, dailyProductionSequence) {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      let ruleA = 0;
      if (month >= 1 && month <= 9) {
        ruleA = Math.floor(day / 10) + 1;
      } else if (month >= 10 && month <= 12) {
        ruleA = Math.floor(day / 10) + 5;
      }

      const ruleB = currentDate.getFullYear() % 10;
      const ruleC = month % 10;
      const ruleD = day % 10;

      if (dailyProductionSequence < 10) {
        dailyProductionSequence = '00' + `${dailyProductionSequence}`;
      } else if (dailyProductionSequence < 100) {
        dailyProductionSequence = '0' + `${dailyProductionSequence}`;
      }

      const address = `${ruleA}${ruleB}${ruleC}${ruleD}${employeeId}${dailyProductionSequence}`;
      console.log(address)
      console.log('ruleA:', ruleA);
      console.log('ruleA:', ruleB);
      console.log('ruleA:', ruleC);
      console.log('ruleA:', ruleD);
      console.log('dailyProductionSequence:', dailyProductionSequence);
      return address;
    },
    async writeAddress() {
      this.checkPort();
      this.operationMessage = ''
      this.globalReceivedData = ''
      this.receptionText = ''; //初始化 文本框.receptionText
      const currentDate = new Date(); // 获取当前日期
      const year = currentDate.getFullYear(); // 获取当前年份
      const month = currentDate.getMonth() + 1; // 获取当前月份（加1，因为月份是从0开始计数的）
      const day = currentDate.getDate(); // 获取当前日期
      //生成地址
      let productQuantity = await countProductQuantityCountByUserId(this.routerSettingParams.userId, `${year}-${month}-${day}`);
      if (productQuantity[0].quantity === undefined || productQuantity[0].quantity === null) {
        productQuantity[0].quantity = 0
      }
      //当前地址+1
      productQuantity[0].quantity = productQuantity[0].quantity + 1
      console.log('员工每日生产的地址序列号', productQuantity[0].quantity)
      Log.info('员工每日生产的地址序列号', productQuantity[0].quantity)
      if (productQuantity[0].quantity > 999) {
        console.error('当前登录用户:' + this.routerSettingParams.userId + '每日生产的地址数量超过999', productQuantity[0].quantity)
        Log.error('当前登录用户:' + this.routerSettingParams.userId + '每日生产的地址数量超过999', productQuantity[0].quantity)
        this.receptionText = this.receptionText + '当前登录用户:' + this.routerSettingParams.userId + '每日生产的地址数量超过999 当前生产:' + productQuantity[0].quantity + '\n';
        this.updateOperationMessage('写地址失败', 'red');
        this.$message.error('当前登录用户超额生产');
        return
      }
      let address = this.generateAddress(this.routerSettingParams.userId, productQuantity[0].quantity)
      console.log('生成的设备地址', address)
      Log.info('生成的设备地址', address)
      this.valveAddress = address
      this.receptionText = this.receptionText + '生成的地址:' + address + '\n';
      this.valveAddress = address
      if ((this.valveAddress === undefined || this.valveAddress === null)) {
        this.$message.error("生成地址不合格");
        console.error('生成地址不合格', address)
        Log.error('生成地址不合格', address)
        return
      }
      if (this.valveAddress.length !== 8) {
        console.error('生成地址非8位', address)
        Log.error('生成地址非8位', address)
        this.$message.error("生成地址非8位");
        return;
      }
      //设备写地址成功=>入库
      let response = await getIdByMacAddr(this.valveAddress);
      if (response.length > 0) {
        Log.error('设备地址已在生产库:' + this.valveAddress);
        console.error('设备地址已在生产库:' + this.valveAddress);
        this.$message.error('设备地址已存在生产库 ,请重新写地址 :' + this.valveAddress);
        this.receptionText = this.receptionText + '设备地址已存在生产库 ,请重新写地址 ' + this.valveAddress + '\n';
        this.globalReceivedData = ''
        return;
      }

      let bodyBuffer = packWAC710CReadSelfTestStatus();
      console.log('[请求报文]   wac710c自检状态读取', arrayBuffer2Hex(bodyBuffer));
      Log.info('[请求报文]   wac710c自检状态读取', arrayBuffer2Hex(bodyBuffer));
      try {
        await this.writePort(bodyBuffer);
      } catch {
        this.updateOperationMessage('写地址失败', 'red');
        this.$message.error('wac710c自检状态读取-写入串口失败');
        Log.error('wac710c自检状态读取-写入串口失败');
        console.error('wac710c自检状态读取-写入串口失败');
        this.globalReceivedData = '';
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c自检状态读取=>', this.globalReceivedData);
      Log.info('[响应报文]   wac710c自检状态读取=>', this.globalReceivedData);
      if (this.globalReceivedData === '' || this.globalReceivedData === undefined) {
        this.updateOperationMessage('自检失败', 'red');
        this.$message.error('wac710c自检失败-设备未返回报文');
        this.receptionText = this.receptionText + 'wac710c自检失败-设备未返回报文' + '\n';
        console.error('wac710c自检失败-设备未返回报文');
        Log.error('wac710c自检失败-设备未返回报文');
        this.globalReceivedData = '';
        return
      }
      //基础报文校验
      // 自检数据读取 ->校验
      let checkSumLengthNotPass = decodeCheckSumLength(this.globalReceivedData);
      let checkStartFrameNotPass = decodeCheckFrame(this.globalReceivedData);
      let checkControlCodeNotPass = decodeCheckControlCode(this.globalReceivedData);
      let checkAgreementIDNotPass = decodeCheckAgreementID(this.globalReceivedData);
      let checkAFNAndFNNotPass = decodeCheckAFNAndFN(this.globalReceivedData);

      if (checkSumLengthNotPass || checkStartFrameNotPass || checkControlCodeNotPass || checkAgreementIDNotPass || checkAFNAndFNNotPass) {
        this.$message.error('wac710c 自检失败');
        this.receptionText = this.receptionText + '自检-报文验证不通过 ' + '\n';
        console.error('自检 报文验证不通过 ' +
          'checkSumLengthNotPass:' + checkSumLengthNotPass
          + 'checkStartFrameNotPass:' + checkStartFrameNotPass
          + 'checkControlCodeNotPass:' + checkControlCodeNotPass
          + 'checkAgreementIDNotPass:' + checkAgreementIDNotPass
          + 'checkAFNAndFNNotPass:' + checkAFNAndFNNotPass);
        Log.error('自检 报文验证不通过 ' +
          'checkSumLengthNotPass:' + checkSumLengthNotPass
          + 'checkStartFrameNotPass:' + checkStartFrameNotPass
          + 'checkControlCodeNotPass:' + checkControlCodeNotPass
          + 'checkAgreementIDNotPass:' + checkAgreementIDNotPass
          + 'checkAFNAndFNNotPass:' + checkAFNAndFNNotPass);
        this.updateOperationMessage('写地址失败', 'red');
        this.globalReceivedData = '';
        return
      }
      //自检判断
      let {selfTestState, msg} = decodeCheckSelfTest(this.globalReceivedData);
      if (selfTestState) {
        this.globalReceivedData = '';
        this.receptionText = this.receptionText + '自检未通过 : ' + msg + '' + '\n';
        this.$message.error('自检未通过');
        Log.error('自检未通过 : ' + msg);
        console.error('自检未通过 : ' + msg);
        this.updateOperationMessage('写地址失败', 'red');
        return;
      }
      let protocolId = decodeProtocolId(this.globalReceivedData);
      let valveVersion= decodeValveVersion(this.globalReceivedData);
      this.globalReceivedData = '';
      this.receptionText = this.receptionText + 'wac710c 自检通过 稍后获取iccid、 imei、写地址、注册平台、生成入库' + '\n';
      this.$message.success('wac710c 自检通过 稍后获取iccid、 imei、写地址、注册平台、生成入库');
      Log.info('wac710c 自检通过 稍后获取iccid、 imei、写地址、注册平台、生成入库');
      console.log('wac710c自检通过 稍后获取iccid、 imei、写地址、注册平台、生成入库');


      let iccidBuffer = packWAC710CReadICCID();
      console.log('[请求报文]   wac710c读取iccId', arrayBuffer2Hex(iccidBuffer));
      Log.info('[请求报文]   wac710c读取iccId', arrayBuffer2Hex(iccidBuffer));
      try {
        await this.writePort(iccidBuffer);
      } catch {
        this.$message.error('wac710c读取iccId-写入串口失败');
        this.receptionText = this.receptionText + 'wac710c读取iccId-写入串口失败' + '\n';
        Log.error('wac710c读取iccId-写入串口失败');
        console.error('wac710c读取iccId-写入串口失败');
        this.updateOperationMessage('写地址失败', 'red');
        this.globalReceivedData = '';
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c读取iccId', this.globalReceivedData);
      Log.info('[响应报文]  wac710c读取iccId', this.globalReceivedData);

      let iccid = decodeICCID(this.globalReceivedData);
      if (iccid === '' || iccid === undefined) {
        this.receptionText = this.receptionText + 'iccid 读取失败 ' + '\n';
        this.$message.error('iccid 读取失败 ');
        this.updateOperationMessage('写地址失败', 'red');
        Log.error('iccid 读取失败 ' + this.globalReceivedData);
        console.error('iccid 读取失败 ' + this.globalReceivedData);
        this.globalReceivedData = '';
        return;
      }
      this.iccId = iccid;
      this.receptionText = this.receptionText + 'wac710c 读取 iccId: ' + this.iccId + ' 稍后获取 imei、写地址、注册平台、生产入库' + '\n';
      this.$message.success('wac710c 读取 iccId: ' + this.iccId + ' 稍后获取 imei、写地址、注册平台、生产入库');
      this.globalReceivedData = '';
      Log.info('wac710c 读取 iccId: ' + this.iccId + ' 稍后获取 imei、写地址、注册平台、生产入库');
      console.log('wac710c 读取 iccId: ' + this.iccId + ' 稍后获取 imei、写地址、注册平台、生产入库');

      let imeiBuffer = packWAC710CReadIMEI();
      console.log('[请求报文]   wac710c读取imei', arrayBuffer2Hex(imeiBuffer));
      Log.info('[请求报文]   wac710c读取imei', arrayBuffer2Hex(imeiBuffer));
      try {
        await this.writePort(imeiBuffer);
      } catch {
        this.updateOperationMessage('写地址失败', 'red');
        this.$message.error('wac710c读取imei-写入串口失败');
        this.receptionText = this.receptionText + 'wac710c读取imei-写入串口失败' + '\n';
        Log.error('wac710c读取imei-写入串口失败');
        console.error('wac710c读取imei-写入串口失败');
        this.globalReceivedData = '';
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c读取imei', this.globalReceivedData);
      Log.info('[响应报文]   wac710c读取imei', this.globalReceivedData);

      let imei = decodeIMEI(this.globalReceivedData);
      if (imei === '' || imei === undefined) {
        this.receptionText = this.receptionText + 'imei读取失败 ' + '\n';
        this.updateOperationMessage('写地址失败', 'red');
        this.$message.error('imei读取失败');
        Log.error('imei读取失败');
        console.log('imei读取失败');
        this.globalReceivedData = '';
        return;
      }
      this.imei = imei;
      let imeiExist = await checkIMEIExist(this.imei);
      console.log(imeiExist)
      if(imeiExist.length>0){
        if (imeiExist[0].imei!==''||imeiExist[0].imei!==undefined){
          this.$message.error('写地址失败hems平台 IMEI已存在: '+this.imei);
          this.receptionText = this.receptionText + '写地址失败hems平台 IMEI已存在: '+this.imei + '\n';
          this.updateOperationMessage('写地址失败', 'red');
          Log.error('写地址失败hems平台 IMEI已存在: '+this.imei);
          console.error('写地址失败hems平台 IMEI已存在: ');
          return;
        }
      }


      this.receptionText = this.receptionText + 'wac710c 读取imei成功:' + this.imei + ' 稍后写地址、注册平台、生产入库' + '\n';
      this.$message.success('wac710c 读取imei成功:' + this.imei + ' 稍后写地址、注册平台、生产入库');
      this.globalReceivedData = '';
      console.log('wac710c 读取imei成功:' + this.imei + ' 稍后写地址、注册平台、生产入库');
      Log.info('wac710c 读取imei成功:' + this.imei + ' 稍后写地址、注册平台、生产入库');

      let writeAddressBuffer = packWAC710CWriteAddress(this.valveAddress);
      console.log('[请求报文]   wac710c写地址', arrayBuffer2Hex(writeAddressBuffer));
      Log.info('[请求报文]   wac710c写地址', arrayBuffer2Hex(writeAddressBuffer));
      try {
        await this.writePort(writeAddressBuffer);
      } catch {
        this.$message.error('wac710c写地址-写入串口失败');
        this.receptionText = this.receptionText + 'wac710c写地址-写入串口失败' + '\n';
        Log.error('wac710c写地址-写入串口失败');
        console.error('wac710c写地址-写入串口失败');
        this.updateOperationMessage('写地址失败', 'red');
        this.globalReceivedData = '';
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      console.log('[响应报文]   wac710c写地址', this.globalReceivedData);
      Log.info('[响应报文]   wac710c写地址', this.globalReceivedData);

      let checkWriteAddressNotPass = decodeAddressMessage(this.globalReceivedData, this.valveAddress);
      if (checkWriteAddressNotPass) {
        this.updateOperationMessage('写地址失败', 'red');
        Log.error('PTC100写地址失败 ' + this.globalReceivedData);
        console.error('PTC100写地址失败 ' + this.globalReceivedData);
        this.receptionText = this.receptionText + 'ptc100写地址失败 ' + '\n';
        this.$message.error('ptc100写地址失败');
        this.globalReceivedData = '';
        return;
      }
      this.receptionText = this.receptionText + 'wac710c写地址成功 ' + '\n';
      this.$message.success('wac710c写地址成功');
      this.globalReceivedData = '';
      Log.info('wac710c写地址成功 ');
      console.log('wac710c写地址成功');

      //model :hems 字典中 terminal_model
      //join_model :接入模式 MQTT_IOT_NB      value=2
      let protocolCode = 'EN1434_0146'
      // 注册设备
      //TODO : 改hems正式平台
      // let registerResponse = await axios.post(`http://124.70.68.52:20206/produce/imei/${this.valveAddress}?joinMode=2&model=62&imei=${this.imei}&protocolCode=${protocolCode}&simNumber=${this.iccId}`, null, {
      let registerResponse = await axios.post(`http://hems.chaobiao.qdhlm.cn:20206/produce/imei/${this.valveAddress}?joinMode=2&model=62&imei=${this.imei}&protocolCode=${protocolCode}&simNumber=${this.iccId}`, null, {
        headers: {
          Authorization: '9e4a2b76d03f7b5eac2927f16441df75' //正式
          // Authorization: '2dbd98f85cc2cb26f3a0d3ddf7821d46' //dev

        }
      });
      if (registerResponse.data.s === 0 && registerResponse.status === 200) {
        this.$message.success('hems: 注册平台成功');
        Log.info('hems: 注册平台成功');
        console.log('hems: 注册平台成功');
        this.receptionText = this.receptionText + 'hems: 注册平台成功' + '\n';
        let netprovider
        if (this.routerSettingParams.selectOperator === '电信') {
          netprovider = 1
        } else if (this.routerSettingParams.selectOperator === '移动') {
          netprovider = 2
        }
        //生产入库
        const productionData = {
          userid: this.routerSettingParams.userId, // 生产账号id
          customerid: null, // 出厂客户id
          valveModel: this.routerSettingParams.selectDeviceMode, // 阀门型号
          valveVersion: valveVersion, // 阀门版本号
          protocolid: protocolId, // 协议ID号
          IMEI: this.imei, // 设备IMEI
          netprovider: netprovider, // 运营商（01：电信，02：移动）
          macaddr: this.valveAddress, // 阀门14位地址
          produceDate: new Date(), // 生产日期
          deliverDate: null, // 出库日期
          description: null, // 描述
          status: 0, // 状态
          iccid: this.iccId, // SIM卡iccid
          customer: null, // 定制厂家
          expireDate: null, // SIM卡到期时间
          TempProbeAddr: this.routerSettingParams.selectTemperatureProbes // 温度探头地址
        };

        let insertResult = await insertNBValueProduce(productionData);
        if (insertResult) {
          this.$message.success('生产入库成功');
          this.receptionText = this.receptionText + '生产入库成功' + '\n';
          Log.info('生产入库成功');
          console.log('生产入库成功');
        } else {
          this.$message.success('生产入库失败');
          this.receptionText = this.receptionText + '生产入库失败' + '\n';
          Log.error('生产入库失败');
          console.error('生产入库失败');
          return;
        }
        //最后执行标签打印
        this.printLabel()
        this.updateOperationMessage('写地址成功', 'green');
        Log.info('写地址成功');
        console.log('写地址成功');
      } else {
        this.$message.error('hems平台: ' + registerResponse.data.msg);
        this.receptionText = this.receptionText + 'hems平台: ' + registerResponse.data.msg + '\n';
        this.updateOperationMessage('写地址失败', 'red');
        Log.error('写地址失败 end');
        console.error('写地址失败 end');
      }

    },

  }
}
</script>

<style>

@media (max-width: 575px) {
  .ant-form .ant-form-item .ant-form-item-label, .ant-form .ant-form-item .ant-form-item-control {
    max-width: calc(100% - 100px);
  }

  a-textarea::-webkit-scrollbar-thumb {
    background-color: blue; /* Change scrollbar thumb color to blue */
    border-radius: 6px;
  }

}

</style>

