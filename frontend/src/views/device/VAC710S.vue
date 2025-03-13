<template>
  <div>
    <a-layout>
      <a-layout-content style="height: 40px">
        <div style="margin-top: 3px ;margin-left: -5px">
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

            <a-form-item label="校验位">
              <a-select v-model:value="selectCheckDigit" style="width: 10vw">
                <a-select-option v-for="item in this.checkDigitList"
                                 :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="波特率">
              <a-select v-model:value="this.selectBaudRate" style="width: 10vw">
                <a-select-option v-for="item in this.baudRates"
                                 :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-button @click="getPrinter()"> 打印机设置</a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-layout-content>
    </a-layout>

    <div style="margin-top: 45px ;width: 100%">

      <div style=" width: 90%;display: inline-block;margin-left: -53px">
        <div style="display: inline-block; ">
          <div>
            <p style="display: inline-block;  ">型号：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerParam.selectDeviceMode }}</p>
          </div>
        </div>
        <div style="display: inline-block; margin-left: 35px">
          <div>
            <p style="display: inline-block; ">打印型号：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerParam.selectPrintModel }}</p>

          </div>


        </div>
        <div style="display: inline-block; margin-left: 35px">
          <div>
            <p style="display: inline-block; ">温度探头：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerParam.selectTemperatureProbes }}</p>

          </div>


        </div>
        <div style="display: inline-block; margin-left: 35px">
          <div>
            <p style="display: inline-block; ">压力探头：</p>
            <p style="display: inline-block; width: 100px;  color: #0080FF; font-weight: bold;"
               contenteditable="false">{{ this.routerParam.selectPressureProbes }}</p>

          </div>


        </div>

      </div>

      <a-form
        name="basic"
        layout="inline"
        style=" display: flex; align-items: center;margin-left: 10px"
      >
        <a-form-item label="扫码地址验证温度">
          <a-input v-model:value="scanAddress" style="width: 140px" @input="handleScanAddressInput"
                    />
        </a-form-item>
        <a-form-item label="误差限额50℃±" :colon="false" style="margin-left: 100px;">
          <a-input v-model:value="diffTemperatureValue" style="width: 140px"/>
        </a-form-item>

      </a-form>
      <a-form
        name="basic"
        layout="inline"
        style=" display: flex; align-items: center;">
        <a-form-item label="设备进温" :colon="true" style="margin-left: 66px;">
          <a-input v-model:value="deviceInTemperature" style="width: 140px" :readonly="true"/>
        </a-form-item>
        <a-form-item label="设备回温" :colon="true" style="margin-left: 134px;">
          <a-input v-model:value="deviceOutTemperature" style="width: 140px" :readonly="true"/>
        </a-form-item>
      </a-form>

      <a-form
        name="basic"
        layout="inline"
        style="padding-left: 10px; display: flex; align-items: center;margin-top: 15px"
      >
        <a-form-item label="阀门地址">
          <a-input v-model:value="valveAddress" style="width: 100%"/>
        </a-form-item>


        <a-form-item style="margin-left: 50px">
          <a-button :disabled="false" @click="selfTest()">自检</a-button>
        </a-form-item>


        <a-form-item style="margin-left: 50px">
          <a-button :disabled="false" @click="writeAddress()">地址写入</a-button>
        </a-form-item>

        <a-form-item style="margin-left: 50px">
          <a-button :disabled="false" @click="printLabel(false)">地址打印</a-button>
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
                    style="width: 815px; height: 350px; margin-right: 300px ;margin-top: 1px; overflow-y: auto;resize: none;"
                    spellcheck="false"
                    :readonly="true"
                    id="textarea_id"
                    ref="receptionTextArea"
        />
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
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {
  checkPort,
  doClosePort,
  doHandleSelectChange,
  doOpenPort,
  initializeAllSerialPorts
} from "@/views/device/handler/portHandler";
import {useRoute} from "vue-router";
import {doPrintLabel, doSelfTest, doWriteAddress} from "@/views/device/handler/deviceHandler";
import {readData} from "@/views/device/action/deviceAction";

const Log = require('ee-core/log');
export default {
  name: 'SerialPort',
  mounted() {
    //初始化串口列表
    this.getAllPorts();
    const route = useRoute();
    this.routerParam.selectDeviceMode = route.query.selectDeviceMode
    this.routerParam.selectPrintModel = route.query.selectPrintModel
    this.routerParam.selectTemperatureProbes = route.query.selectTemperatureProbes
    this.routerParam.selectPressureProbes = route.query.selectPressureProbes
    this.routerParam.selectOperator = route.query.selectOperator
    this.routerParam.userId = route.query.userId
    console.log(this.routerParam)
  },


  data() {
    return {
      defaultDeviceName: undefined,
      printerList: [],
      modalShow: false,
      valveAddress: undefined,
      ports: [],
      baudRates: [
        // '110', '300', '600', '1200',
        '2400',
        // '4800',
        '9600',
        // '14400', '19200', '38400', '56000', '57600', '115200', '128000', '230400', '256000'
      ],
      selectBaudRate: '9600',
      dataBitsList: [
        '6', '7', '8'
      ],
      checkDigitList: [
        '无', '奇校验', '偶校验', 'Mark', '空格校验'
      ],
      selectCheckDigit: '无',
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
      routerParam: {
        selectDeviceMode: undefined,
        selectPrintModel: undefined,
        selectTemperatureProbes: undefined,
        selectPressureProbes: undefined,
        selectOperator: undefined,
        userId: undefined,
      },
      receptionText: '',
      isSuccess: false,
      isFailure: false,
      globalReceivedData: '',
      ICCID: '',
      IMEI: '',
      operationMessage: '',
      diffTemperatureValue: 0.1,
      deviceOutTemperature: undefined,
      deviceInTemperature: undefined,
      scanAddress: '',
      isScanning: false,
      scanTimeout: null,
      readDataAddress: '',


    }
  },
  watch: {
    receptionText() {
      //$nextTick:更新DOM后再操作DOM
      this.$nextTick(() => {
        // const textarea = document.getElementById('textarea_id');
        // const currentScrollTop = textarea.scrollTop; // 当前滑块的位置
        // const scrollDifference = currentScrollTop - this.previousScrollTop; // 当前滑块位置与上一次位置的差值
        //
        // // console.log('当前滑块位置:', currentScrollTop);
        // // console.log('上一次滑块位置:', this.previousScrollTop);
        // // console.log('滑块移动差值:', scrollDifference);
        // // console.log('可见区域高度(不包含滑块长度):', textarea.clientHeight);
        // // console.log('内容总高度(包含滑块):', textarea.scrollHeight);
        // // 如果当前滑块位置加上差值等于滚动条的高度，说明需要滚动到最底部
        // if (textarea.scrollHeight - (currentScrollTop + scrollDifference) <= textarea.clientHeight) {
        //   // 设置滑块到最新内容
        //   setTimeout(() => {
        //     textarea.scrollTop = textarea.scrollHeight;
        //   }, 1);
        // }
        // // 更新上一次滑块位置
        // this.previousScrollTop = currentScrollTop;
        setTimeout(() => {
          const textarea = document.getElementById('textarea_id')
          textarea.scrollTop = textarea.scrollHeight;
        }, 20);
      });
    }
  },
  methods: {
    updateOperationMessage(message, color) {
      this.operationMessage = `<span style="color: ${color};">${message}</span>`;
    },
    getAllPorts() {
      initializeAllSerialPorts(this)
    },
    handlePortChange(selectedPort) {
      doHandleSelectChange(this, selectedPort)
    },
    openPort(portName) {
      doOpenPort(this, portName, this.selectCheckDigit, 8, this.selectBaudRate, 1)
    },
    // 关闭串口方法
    closePort(portName) {
      doClosePort(this, portName)
    },
    printLabel(flag) {
      doPrintLabel(this,flag)
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


    async selfTest() {
      await doSelfTest(this)

    },

    async writeAddress() {
      await doWriteAddress(this)
    },
    async handleScanAddressInput() {
      if (!checkPort(this)) {
        this.scanAddress = ''
      }
      this.receptionText = ''
      this.operationMessage = ''
      clearTimeout(this.scanTimeout);
      if (this.scanAddress.length !== 8) {
        this.scanTimeout = setTimeout(() => {
          this.scanAddress = ''
          // this.isScanning = false;
        }, 100);
      }


      if (this.scanAddress.length === 8) {
        // 扫码成功
        // 读温度
        let notPass = await readData(this)
        if (notPass) {
          this.scanAddress = ''
          return
        }
        let baseTemperature = 50

        //鉴定温度是否合格 、是否选错探头的情况
        if (this.routerParam.selectTemperatureProbes === '蓝色-回温探头') {
          if (Math.abs(baseTemperature - this.deviceOutTemperature) > this.diffTemperatureValue) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '温度不合格' + '\n'
            this.scanAddress = ''
            return
          }
          //判断进温探头是否选错
          if (Number(this.deviceInTemperature) !== 99.99) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '配置信息与实物不匹配(进温探头错误)' + '\n'
            this.scanAddress = ''
            return
          }

        } else if (this.routerParam.selectTemperatureProbes === '红色-进温探头') {
          if (Math.abs(baseTemperature - this.deviceInTemperature) > this.diffTemperatureValue) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '温度不合格' + '\n'
            this.scanAddress = ''
            return
          }
          //判断进温探头是否选错
          if (Number(this.deviceOutTemperature) !== 99.99) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '配置信息与实物不匹配(回温探头错误)' + '\n'
            this.scanAddress = ''
            return
          }

        } else if (this.routerParam.selectTemperatureProbes === '红蓝-双探头') {
          if (Math.abs(baseTemperature - this.deviceOutTemperature) > this.diffTemperatureValue) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '温度不合格' + '\n'
            this.scanAddress = ''
            return
          }
          if (Math.abs(baseTemperature - this.deviceInTemperature) > this.diffTemperatureValue) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '温度不合格' + '\n'
            this.scanAddress = ''
            return
          }
        } else if (this.routerParam.selectTemperatureProbes === '无探头') {
          if (Number(this.deviceOutTemperature) !== 99.99) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '配置信息与实物不匹配(回温探头错误)' + '\n'
            this.scanAddress = ''
            return
          }
          if (Number(this.deviceInTemperature) !== 99.99) {
            this.updateOperationMessage('验证温度失败', 'red');
            this.receptionText += '配置信息与实物不匹配(进温探头错误)' + '\n'
            this.scanAddress = ''
            return
          }
        }
        console.log('解析的地址', this.readDataAddress)
        if (this.readDataAddress !== this.scanAddress) {
          this.updateOperationMessage('验证温度失败', 'red');
          this.receptionText += '扫码地址与设备地址不匹配' + '\n'
          this.scanAddress = ''
          return
        }

        //打印地址和型号标签。
        this.printAddressAndModelLabel()

      }
    },
    printAddressAndModelLabel() {
      console.log('触发打印 , 当前打印机:', this.defaultDeviceName)
      Log.info('触发打印 , 当前打印机:', this.defaultDeviceName)
      const params = {
        deviceName: this.defaultDeviceName,
        address: this.readDataAddress,
        selectPrintModel: 'HDC-K256A',
        // date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
      };
      ipc.send(ipcApiRoute.printAddressAndModel, params)
      this.scanAddress = ''
    }
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

