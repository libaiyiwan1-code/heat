<template>
  <div class="device-page">
    <custom-title-bar
      :page="'device'"
      :isDeviceView="true"
      :productModel="'液冷执行器-测试软件'"
      :isMaximized="isMaximized"
      @toggle-maximize="handleToggleMaximize"
      @minimize-window="handleMinimizeWindow"
      @close-window="handleCloseWindow"
    />

    <a-layout class="device-layout">
      <a-layout-content class="device-content">
        <!-- ============ 主区域：左列（配置+串口） / 右列（日志） ============ -->
        <!-- ============ 主区域：左（参数配置） / 中（串口按钮） / 右（日志） ============ -->
        <a-row :gutter="[16, 12]" class="frock-row">

          <!-- ==================== 左列：参数配置 ==================== -->
          <a-col :xs="24" :sm="24" :md="6" :lg="5" :xl="4" class="frock-col">
            <a-card
              title="参数配置"
              :headStyle="downCardHeadStyle"
              :bodyStyle="downCardBodyStyle"
              class="frock-card"
            >
              <a-form
                layout="horizontal"
                :label-col="{ style: { width: '5em', textAlign: 'right' } }"
                class="config-form"
              >
                <a-form-item label="波特率">
                  <a-select v-model:value="portAttributes.selectedBadRate">
                    <a-select-option v-for="rate in baudRateList" :key="rate" :value="rate">
                      {{ rate }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="数据位">
                  <a-select v-model:value="portAttributes.selectedDataBits">
                    <a-select-option v-for="bits in dataBitsList" :key="bits" :value="bits">
                      {{ bits }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="校验位">
                  <a-select v-model:value="portAttributes.selectedCheckDigit">
                    <a-select-option v-for="digit in checkDigitList" :key="digit" :value="digit">
                      {{ digit }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="停止位">
                  <a-select v-model:value="portAttributes.selectedStopBits">
                    <a-select-option v-for="stop in stopBitsList" :key="stop" :value="stop">
                      {{ stop }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="角度偏移量">
                  <a-input-number
                    v-model:value="settingConfig.angleOffset"
                    :min="0"
                    :max="360"
                    :step="0.1"
                    :precision="1"
                    style="width: 100%"
                    placeholder="0.0"
                  />
                </a-form-item>

                <a-form-item label="偏移方向">
                  <a-select v-model:value="settingConfig.offsetDirection">
                    <a-select-option :value="0">正转</a-select-option>
                    <a-select-option :value="1">反转</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="写入 SN">
                  <a-input-number
                    style="width: 180px"
                    v-model:value="settingConfig.snCode"
                    placeholder="请输入SN(最大32字节)"
                    :maxlength="32"
                  />
                </a-form-item>
                <a-form-item label="模拟量通道">
                  <a-select v-model:value="settingConfig.analogChannel">
                    <a-select-option :value="0">电流通道</a-select-option>
                    <a-select-option :value="1">电压通道</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>

          <!-- ==================== 中列：串口、测试按钮 ==================== -->
          <a-col :xs="24" :sm="24" :md="8" :lg="7" :xl="6" class="frock-col">
            <a-card
              title="串口、测试按钮"
              :headStyle="downCardHeadStyle"
              :bodyStyle="downCardBodyStyle"
              class="frock-card"
            >
              <!-- 串口操作面板 -->
              <a-form name="basic" layout="inline" class="hlm-form-port">
                <a-form-item>
                  <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
                </a-form-item>
                <a-form-item class="form-item-spacing">
                  <a-button class="hlm-port-button-select-style static-btn">设备串口</a-button>
                </a-form-item>
                <a-select
                  v-model:value="portAttributes.selectedPortOne"
                  class="hlm-port-button-select-style form-item-spacing"
                  @change="handlePortChange(portAttributes.selectedPortOne,'one')"
                  style="width: 100px;"
                >
                  <a-select-option v-for="port in portAttributes.serialPortList" :key="port" :value="port">
                    {{ port }}
                  </a-select-option>
                </a-select>

                <a-form-item>
                  <a-button
                    class="hlm-operate-button-style"
                    @click="openPort(portAttributes.selectedPortOne, 'one')"
                    :disabled="!portAttributes.portClosedOneStatus"
                  >打开
                  </a-button>
                </a-form-item>
                <a-form-item class="form-item-spacing">
                  <a-button
                    class="hlm-operate-button-style"
                    @click="closePort(portAttributes.selectedPortOne,'one')"
                    :disabled="portAttributes.portClosedOneStatus"
                  >关闭
                  </a-button>
                </a-form-item>
              </a-form>

              <!-- ==================== 测试操作按钮分组 ==================== -->
              <div class="button-group-container">
                <!-- 1. 基础信息与系统 -->
                <div class="group-title">基础信息</div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="readData(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.readData" class="hlm-nb-business-start-button-style">数据读取
                  </a-button>
                  <a-button type="primary" @click="readSN(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.readSN" class="hlm-nb-business-start-button-style">查询SN
                  </a-button>
                  <a-button type="primary" @click="writeSN(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.writeSN" class="hlm-nb-business-start-button-style">写入SN
                  </a-button>
                  <a-button type="primary" @click="softReboot(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.softReboot" class="hlm-nb-business-start-button-style">软重启
                  </a-button>
                </div>

                <a-divider style="margin: 12px 0;"/>

                <!-- 2. 测试控制与信息 -->
                <div class="group-title">测试控制</div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="selfTest(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.selfTest" class="hlm-nb-business-start-button-style">自检
                  </a-button>
                  <a-button type="primary" @click="exitSelfTest(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.exitSelfTest" class="hlm-nb-business-start-button-style">
                    退出自检
                  </a-button>
                  <a-button type="primary" @click="triggerAdaptive(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.triggerAdaptive" class="hlm-nb-business-start-button-style">
                    触发自适应
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="readSwitchLifespanTestData(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.readSwitchLifespanTestData"
                            class="hlm-nb-business-start-button-style">读开关寿命
                  </a-button>
                  <a-button type="primary" @click="cleanSwitchLifespanTestData(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.cleanSwitchLifespanTestData"
                            class="hlm-nb-business-start-button-style">清开关寿命
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="readProductionInformation(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.readProductionInformation"
                            class="hlm-nb-business-start-button-style">读生产信息
                  </a-button>
                  <a-button type="primary" @click="readAdaptiveInfo(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.readAdaptiveInfo"
                            class="hlm-nb-business-start-button-style">读自适应信息
                  </a-button>
                </div>

                <a-divider style="margin: 12px 0;"/>

                <!-- 3. 参数标定 -->
                <div class="group-title">参数标定</div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="setElectricalAngleOffset(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.setElectricalAngleOffset"
                            class="hlm-nb-business-start-button-style">设置电角度偏移
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="write4MAInputCurrent(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.write4MAInputCurrent"
                            class="hlm-nb-business-start-button-style">写 4mA输入
                  </a-button>
                  <a-button type="primary" @click="write20MAInputCurrent(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.write20MAInputCurrent"
                            class="hlm-nb-business-start-button-style">写 20mA输入
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="write2VInputVoltage(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.write2VInputVoltage"
                            class="hlm-nb-business-start-button-style">写 2V输入
                  </a-button>
                  <a-button type="primary" @click="write10VInputVoltage(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.write10VInputVoltage"
                            class="hlm-nb-business-start-button-style">写 10V输入
                  </a-button>
                </div>

                <a-divider style="margin: 12px 0;"/>

                <!-- 4. 输出与校准 -->
                <div class="group-title">固定输出与校准</div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="deviceOutputs4mA(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.deviceOutputs4mA"
                            class="hlm-nb-business-start-button-style">设备固定输出 4mA
                  </a-button>
                  <a-button type="primary" @click="deviceOutputs20mA(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.deviceOutputs20mA"
                            class="hlm-nb-business-start-button-style">设备固定输出 20mA
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="deviceOutputs1V(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.deviceOutputs1V" class="hlm-nb-business-start-button-style">
                    设备固定输出 1V
                  </a-button>
                  <a-button type="primary" @click="deviceOutputs2V(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.deviceOutputs2V" class="hlm-nb-business-start-button-style">
                    设备固定输出 2V
                  </a-button>
                  <a-button type="primary" @click="deviceOutputs10V(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.deviceOutputs10V"
                            class="hlm-nb-business-start-button-style">设备固定输出 10V
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="outputs4mACurrentCalibration(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.outputs4mACurrentCalibration"
                            class="hlm-nb-business-start-button-style">标定 4mA输出
                  </a-button>
                  <a-button type="primary" @click="outputs20mACurrentCalibration(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.outputs20mACurrentCalibration"
                            class="hlm-nb-business-start-button-style">标定 20mA输出
                  </a-button>
                </div>
                <div class="read-btn-row">
                  <a-button type="primary" @click="outputs2VVoltageCalibration(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.outputs2VVoltageCalibration"
                            class="hlm-nb-business-start-button-style">标定 2V输出
                  </a-button>
                  <a-button type="primary" @click="outputs10VVoltageCalibration(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.outputs10VVoltageCalibration"
                            class="hlm-nb-business-start-button-style">标定 10V输出
                  </a-button>
                </div>

                <a-divider style="margin: 12px 0;"/>

                <!-- 5. 采集验证 -->
                <div class="group-title">模拟量验证</div>
                <div class="read-btn-row">
                  <a-button type="primary"
                            @click="readDeviceAnalogAcquisitionValue(protocolIDMap['ACTUATOR'].protocolId)"
                            :disabled="buttonDisabledStatus.readDeviceAnalogAcquisitionValue"
                            class="hlm-nb-business-start-button-style">读模拟量采集
                  </a-button>
                  <a-button type="primary" @click="set420mACalibrationStatus(protocolIDMap['ACTUATOR'].protocolId, 1)"
                            :disabled="buttonDisabledStatus.set420mACalibrationStatus"
                            class="hlm-nb-business-start-button-style">4-20mA 验证通过
                  </a-button>
                  <a-button type="primary" @click="set210VCalibrationStatus(protocolIDMap['ACTUATOR'].protocolId, 1)"
                            :disabled="buttonDisabledStatus.set210VCalibrationStatus"
                            class="hlm-nb-business-start-button-style">2-10V 验证通过
                  </a-button>
                </div>
              </div>


            </a-card>
          </a-col>

          <!-- ==================== 右列：日志信息 ==================== -->
          <a-col :xs="24" :sm="24" :md="10" :lg="12" :xl="14" class="frock-col">
            <a-card
              title="日志信息"
              :headStyle="downCardHeadStyle"
              :bodyStyle="downCardBodyStyle"
              class="frock-card log-card"
            >
              <div
                id="left_textarea_id"
                ref="receptionOneText"
                class="hlm-nb-log-container-style"
              >
                <div
                  v-html="text.receptionOneText"
                  class="hlm-flow-log-info-style"
                ></div>
              </div>
            </a-card>
          </a-col>

        </a-row>
        <!-- ============ 上半区：参数配置 ============ -->


        <!-- ============ 下半区：串口 + 日志 ============ -->


      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import {
  doClosePort,
  doHandleSelectChange,
  doOpenPort,
  initializeAllSerialPorts
} from "@/views/device/handler/portHandler";
import {ipc} from "@/utils/ipcRenderer";

import button from "@/views/device/button";
import {protocolIDMap} from "@/views/device/enum/enum";
import {
  doCleanSwitchLifespanTestData,
  doDeviceOutputs10V,
  doDeviceOutputs1V,
  doDeviceOutputs20mA,
  doDeviceOutputs2V,
  doDeviceOutputs4mA,
  doExitSelfTest,
  doOutputs10VVoltageCalibration,
  doOutputs20mACurrentCalibration,
  doOutputs2VVoltageCalibration,
  doOutputs4mACurrentCalibration,
  doReadAdaptiveInfo,
  doReadData,
  doReadDeviceAnalogAcquisitionValue,
  doReadProductionInformation,
  doReadSN,
  doReadSwitchLifespanTestData,
  doSelfTest,
  doSet210VCalibrationStatus,
  doSet420mACalibrationStatus,
  doSetElectricalAngleOffset,
  doSoftReboot,
  doTriggerAdaptive,
  doWrite10VInputVoltage,
  doWrite20MAInputCurrent,
  doWrite2VInputVoltage,
  doWrite4MAInputCurrent,
  doWriteSN,
} from "@/views/device/operations/deviceOperations";

import CustomTitleBar from "@/views/device/CustomTitleBar.vue";
import WorkOrderCard from "@/views/device/components/card/WorkOrderCard.vue";
import ImagePreviewModal from "@/views/device/components/modal/ImagePreviewModal.vue";
import PrintSettingsModal from "@/views/device/components/modal/PrintSettingsModal.vue";
import AssignmentTipBar from "@/views/device/components/panel/AssignmentTipBar.vue";
import ProductImageCard from "@/views/device/components/card/ProductImageCard.vue";

const Log = require("ee-core/log");

export default {
  components: {
    ProductImageCard,
    AssignmentTipBar,
    PrintSettingsModal,
    ImagePreviewModal,
    WorkOrderCard,
    CustomTitleBar
  },
  data() {
    return {
      // ==================== 工装接收数据 ====================
      // 保存各串口收到的原始数据（当前页面只用到了 one 串口）
      receivedData: {
        globalReceivedOneData: '',   // 设备串口(one)接收到的全局数据缓存
      },

      // ==================== 串口属性配置 ====================
      // 集中管理串口相关的状态、已选串口名、以及串口通信参数
      portAttributes: {
        // 串口开关状态：true 表示串口当前处于「已关闭」状态
        // 用于「打开」按钮(:disabled="!portClosedOneStatus")和「关闭」按钮(:disabled="portClosedOneStatus")的互斥控制
        portClosedOneStatus: true,

        serialPortOne: undefined,          // 设备串口(one)对应的底层串口实例/句柄（打开后由 portHandler 赋值）

        selectedPortOne: undefined,        // 用户在下拉框中选择的设备串口名，如 'COM1'
                                           // 绑定到 <a-select v-model:value="portAttributes.selectedPortOne">

        addressOne: '',                    // 设备串口(one)相关的地址（预留字段，当前页面未使用）

        serialPortList: [],                // 系统可用串口列表，由 mounted() -> getAllPorts() -> initializeAllSerialPorts 异步填充
                                           // 初始为 [] 而非 undefined，避免模板中 v-for 报 "Cannot read properties of undefined"

        // ---------- 串口通信参数（对应「参数配置」卡片里的四个下拉框）----------
        selectedBadRate: '9600',           // 波特率，绑定 <a-select v-model:value="portAttributes.selectedBadRate">
                                           // 可选值来自 baudRateList，默认 2400

        selectedCheckDigit: '无校验',       // 校验位，绑定 <a-select v-model:value="portAttributes.selectedCheckDigit">
        // 可选值来自 checkDigitList，默认偶校验
        // 打开串口时需映射为 serialport 库要求的 'Even'/'None'/'Odd'

        selectedDataBits: 8,               // 数据位，绑定 <a-select v-model:value="portAttributes.selectedDataBits">
                                           // 可选值来自 dataBitsList，默认 8（最常用）

        selectedStopBits: 1,               // 停止位，绑定 <a-select v-model:value="portAttributes.selectedStopBits">
                                           // 可选值来自 stopBitsList，默认 1（最常用）
      },

      settingConfig: {
        angleOffset: null,
        offsetDirection: null,   // 0=正转，1=反转，默认正转
        snCode: null,              //要写的SN码
        analogChannel: 0,              //读模拟量通道(电流或电压)
      },

      // ==================== 串口参数下拉选项 ====================
      baudRateList: ['2400', '9600', '115200'],   // 波特率可选值列表
      checkDigitList: ['偶校验', '无', '奇校验'],  // 校验位可选值列表（中文展示，打开串口时需转成英文枚举）
      dataBitsList: [5, 6, 7, 8],                 // 数据位可选值列表，常用 8
      stopBitsList: [1, 1.5, 2],                  // 停止位可选值列表，常用 1

      // ==================== 日志文本 ====================
      // 通过 v-html 渲染到日志区域，watch 中监听其变化自动滚动到底部
      text: {
        receptionOneText: '',   // 左侧/主日志区的 HTML 文本内容
      },

      // ==================== 按钮状态 ====================
      buttonDisabledStatus: button.disabledStatus,

      // ==================== 通信/超时参数 ====================
      maxRetries: 3,     // 串口通信最大重试次数（预留）
      timeout: 3000,     // 串口通信超时时间，单位 ms（预留）

      // ==================== 窗口状态 ====================
      // 由主进程通过 ipc 'window-is-maximized' 事件同步，控制标题栏最大化/还原图标
      isMaximized: true,
    };
  },
  /*移除监听器 */
  beforeDestroy() {
    ipc.removeAllListeners('window-is-maximized');
  },
  async created() {
    // 监听主进程的通知改变：maximized
    ipc.on('window-is-maximized', (event, maximized) => {
      console.log('maximized=>', maximized);
      this.isMaximized = maximized;
    });
  },
  async mounted() {
    await this.getAllPorts()
  },
  computed: {

    // 动态刷新协议map.
    protocolIDMap() {
      return protocolIDMap
    },

    upperCardHeadStyle() {
      return {
        textAlign: 'center',
        background: '#e6e8eb',
        color: '#F77F00',
        fontWeight: 'bold',
        padding: '0 12px',
      }
    },
    upperCardBodyStyle() {
      return {padding: '12px'}
    },
    downCardHeadStyle() {
      return {
        textAlign: 'center',
        background: '#e6e8eb',
        color: '#F77F00',
        fontWeight: 'bold',
        padding: '0 12px',
      }
    },
    downCardBodyStyle() {
      return {padding: '12px'}
    },
  },

  watch: {
    "text.receptionOneText": {
      handler() {
        this.$nextTick(() => {
          const container = this.$refs.receptionOneText;
          if (!container) return;
          const contentDiv = container.querySelector('.hlm-flow-log-info-style');
          if (contentDiv) {
            contentDiv.scrollTop = contentDiv.scrollHeight;
          }
        });
      },
    }
  },

  methods: {
    handleToggleMaximize() {
      ipc.send('toggle-maximize');
    },
    handleMinimizeWindow() {
      ipc.send('minimize-window');
    },
    handleCloseWindow() {
      ipc.send('close-window');
    },
    // 按钮禁用
    buttonDisabled() {
      this.buttonDisabledStatus.readData = true
      this.buttonDisabledStatus.readSwitchLifespanTestData = true
      this.buttonDisabledStatus.setElectricalAngleOffset = true
      this.buttonDisabledStatus.cleanSwitchLifespanTestData = true
      this.buttonDisabledStatus.selfTest = true
      this.buttonDisabledStatus.exitSelfTest = true
      this.buttonDisabledStatus.readProductionInformation = true
      this.buttonDisabledStatus.triggerAdaptive = true
      this.buttonDisabledStatus.readAdaptiveInfo = true
      this.buttonDisabledStatus.readSN = true
      this.buttonDisabledStatus.writeSN = true
      this.buttonDisabledStatus.softReboot = true
      this.buttonDisabledStatus.write4MAInputCurrent = true
      this.buttonDisabledStatus.write20MAInputCurrent = true
      this.buttonDisabledStatus.write2VInputVoltage = true
      this.buttonDisabledStatus.write10VInputVoltage = true
      this.buttonDisabledStatus.deviceOutputs4mA = true
      this.buttonDisabledStatus.deviceOutputs20mA = true
      this.buttonDisabledStatus.deviceOutputs1V = true
      this.buttonDisabledStatus.deviceOutputs2V = true
      this.buttonDisabledStatus.deviceOutputs10V = true
      this.buttonDisabledStatus.outputs4mACurrentCalibration = true
      this.buttonDisabledStatus.outputs20mACurrentCalibration = true
      this.buttonDisabledStatus.outputs2VVoltageCalibration = true
      this.buttonDisabledStatus.outputs10VVoltageCalibration = true
      this.buttonDisabledStatus.readDeviceAnalogAcquisitionValue = true
      this.buttonDisabledStatus.set420mACalibrationStatus = true
      this.buttonDisabledStatus.set210VCalibrationStatus = true
    },
    // 按钮启用
    buttonEnabled() {
      this.buttonDisabledStatus.readData = false
      this.buttonDisabledStatus.readSwitchLifespanTestData = false
      this.buttonDisabledStatus.setElectricalAngleOffset = false
      this.buttonDisabledStatus.cleanSwitchLifespanTestData = false
      this.buttonDisabledStatus.selfTest = false
      this.buttonDisabledStatus.exitSelfTest = false
      this.buttonDisabledStatus.triggerAdaptive = false
      this.buttonDisabledStatus.readProductionInformation = false
      this.buttonDisabledStatus.readAdaptiveInfo = false
      this.buttonDisabledStatus.readSN = false
      this.buttonDisabledStatus.writeSN = false
      this.buttonDisabledStatus.softReboot = false
      this.buttonDisabledStatus.write4MAInputCurrent = false
      this.buttonDisabledStatus.write20MAInputCurrent = false
      this.buttonDisabledStatus.write2VInputVoltage = false
      this.buttonDisabledStatus.write10VInputVoltage = false
      this.buttonDisabledStatus.deviceOutputs4mA = false
      this.buttonDisabledStatus.deviceOutputs20mA = false
      this.buttonDisabledStatus.deviceOutputs1V = false
      this.buttonDisabledStatus.deviceOutputs2V = false
      this.buttonDisabledStatus.deviceOutputs10V = false
      this.buttonDisabledStatus.outputs4mACurrentCalibration = false
      this.buttonDisabledStatus.outputs20mACurrentCalibration = false
      this.buttonDisabledStatus.outputs2VVoltageCalibration = false
      this.buttonDisabledStatus.outputs10VVoltageCalibration = false
      this.buttonDisabledStatus.readDeviceAnalogAcquisitionValue = false
      this.buttonDisabledStatus.set420mACalibrationStatus = false
      this.buttonDisabledStatus.set210VCalibrationStatus = false
    },

    logRaw(raw, label, value, unit = '', color = '#333') {
      const html =
        `<div style="display:flex; align-items:baseline; line-height:1.6;">` +
        `<div style="flex:0 0 250px; white-space:nowrap; color:#909399;">原始报文：${raw}</div>` +
        `<div style="flex:1; white-space:nowrap;">解析：${label}：${value}${unit}</div>` +
        `</div>`;
      this.createLeftSpanMessage(html, color, true);   // 输出log
    },
    /**
     * 创建控制台日志
     * @param message 消息内容
     * @param color  字体颜色
     *
     * */
    createLeftSpanMessage(message, color, rawHtml = false) {
      const safeMessage = rawHtml ? message : this.escapeHTML(message);   // ← 只加这一句
      const messageHTML = `<span style="color: ${color};">${safeMessage}</span><br>`;
      this.text.receptionOneText += messageHTML;

      this.$nextTick(() => {
        const container = this.$refs.receptionOneText;
        if (!container) return;
        // 关键：找内层滚动容器
        const contentDiv = container.querySelector('.hlm-flow-log-info-style');
        if (contentDiv) {
          contentDiv.scrollTop = contentDiv.scrollHeight;
        }
      });

      return this.text.receptionOneText;
    },
    escapeHTML(str) {
      return str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "").replace(/'/g, "'");
    },
    async getAllPorts() {
      await initializeAllSerialPorts(this)
    },

    handlePortChange() {
      doHandleSelectChange(this)
    },
    async openPort(portName) {
      await doOpenPort(this, portName)
    },
    async closePort(portName) {
      await doClosePort(this, portName)
    },
    //按钮功能
    async readData(protocolId) {
      await doReadData(this, protocolId)
    },
    async readSwitchLifespanTestData(protocolId) {
      await doReadSwitchLifespanTestData(this, protocolId)
    },

    async readProductionInformation(protocolId) {
      await doReadProductionInformation(this, protocolId)
    },
    async softReboot(protocolId) {
      await doSoftReboot(this, protocolId)
    },
    async setElectricalAngleOffset(protocolId) {
      if (this.settingConfig.angleOffset === null || this.settingConfig.angleOffset === undefined) {
        this.$message.warn('请设置角度偏移量值');
        return;
      }
      if (this.settingConfig.offsetDirection === null || this.settingConfig.offsetDirection === undefined) {
        this.$message.warn('请选择偏移方向（正转/反转）');
        return;
      }
      console.log('angleOffset =', this.settingConfig.angleOffset,
        'direction =', this.settingConfig.offsetDirection);
      await doSetElectricalAngleOffset(this, protocolId);
    },
    async cleanSwitchLifespanTestData(protocolId) {
      await doCleanSwitchLifespanTestData(this, protocolId);
    },
    async selfTest(protocolId) {
      await doSelfTest(this, protocolId);
    },
    async readAdaptiveInfo(protocolId) {
      await doReadAdaptiveInfo(this, protocolId);
    },
    async readSN(protocolId) {
      await doReadSN(this, protocolId);
    },
    async write4MAInputCurrent(protocolId) {
      await doWrite4MAInputCurrent(this, protocolId);
    },
    async write20MAInputCurrent(protocolId) {
      await doWrite20MAInputCurrent(this, protocolId);
    },

    async write2VInputVoltage(protocolId) {
      await doWrite2VInputVoltage(this, protocolId);
    },
    async write10VInputVoltage(protocolId) {
      await doWrite10VInputVoltage(this, protocolId);
    },
    async deviceOutputs4mA(protocolId) {
      await doDeviceOutputs4mA(this, protocolId);
    },
    async deviceOutputs20mA(protocolId) {
      await doDeviceOutputs20mA(this, protocolId);
    },
    async deviceOutputs1V(protocolId) {
      await doDeviceOutputs1V(this, protocolId);
    },
    async deviceOutputs2V(protocolId) {
      await doDeviceOutputs2V(this, protocolId);
    },
    async deviceOutputs10V(protocolId) {
      await doDeviceOutputs10V(this, protocolId);
    },
    async outputs4mACurrentCalibration(protocolId) {
      await doOutputs4mACurrentCalibration(this, protocolId);
    },
    async outputs20mACurrentCalibration(protocolId) {
      await doOutputs20mACurrentCalibration(this, protocolId);
    },
    async outputs2VVoltageCalibration(protocolId) {
      await doOutputs2VVoltageCalibration(this, protocolId);
    },
    async outputs10VVoltageCalibration(protocolId) {
      await doOutputs10VVoltageCalibration(this, protocolId);
    },
    async readDeviceAnalogAcquisitionValue(protocolId) {
      await doReadDeviceAnalogAcquisitionValue(this, protocolId);
    },
    async set420mACalibrationStatus(protocolId) {
      await doSet420mACalibrationStatus(this, protocolId);
    },
    async set210VCalibrationStatus(protocolId) {
      await doSet210VCalibrationStatus(this, protocolId);
    },
    async writeSN(protocolId) {
      // 0. 去除前后空格
      const sn = this.settingConfig.snCode ? this.settingConfig.snCode.trim() : '';
      console.log('当前要写入的SN:', sn, '长度:', sn.length);

      // 1. 非空验证
      if (!sn) {
        this.$message.warn('请输入要写入的 SN 序列号');
        return;
      }

      // 2. ASCII 字符验证（禁止输入中文等非 ASCII 字符，否则转 HEX 会出问题）
      if (/[^\x00-\x7F]/.test(sn)) {
        this.$message.warn('SN 序列号只能包含英文字母、数字及标准符号，不能包含中文');
        return;
      }

      // 3. 字节长度验证（因为是纯 ASCII，1 字符 = 1 字节，最大 32 字节）
      if (sn.length > 32) {
        this.$message.warn('SN 序列号长度不能超过 32 个字符（32 字节）');
        return;
      }

      // 4. 校验通过
      await doWriteSN(this, protocolId);
    },
    async exitSelfTest(protocolId) {
      await doExitSelfTest(this, protocolId);
    },
    async triggerAdaptive(protocolId) {
      await doTriggerAdaptive(this, protocolId);
    },

  }
}
;
</script>

<style>
/* ==================== 全局 ==================== */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

/* ==================== 页面骨架 ==================== */
.device-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.device-layout {
  flex: 1;
  min-height: 0;
  background: #f0f2f5;
}

/* ==================== 页面骨架 ==================== */
.device-content {
  height: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ==================== 主区域栅格（左中右三列） ==================== */
.frock-row {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

.frock-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

/* 卡片：撑满所在列 */
.frock-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  border: 1px solid grey;
  box-sizing: border-box;
}

/* 卡片 body：参与 flex 分配 */
.frock-card .ant-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 14px 16px;
  box-sizing: border-box;
}

/* ==================== 卡片头部 ==================== */
.ant-card-head {
  min-height: 36px !important;
  padding: 0 12px !important;
}

.ant-card-head-title {
  font-size: clamp(14px, 1.1vw, 20px) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

.ant-card-head-wrapper {
  min-height: 36px !important;
}

/* ==================== 参数配置卡片 ==================== */
.hlm-card-configInfo {
  width: 100%;
  border: 1px solid grey;
  box-sizing: border-box;
}

.hlm-card-configInfo .ant-card-body {
  padding: 12px 16px;
}

/* ==================== 参数配置表单 ==================== */
.config-form {
  width: 100%;
  display: block; /* ← 块级，一行一个 */
}

.config-form .ant-form-item {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-bottom: 12px; /* ← 行距 */
}

/* label 固定宽，右对齐 */
.config-form .ant-form-item-label {
  width: 8em !important;
  flex: 0 0 6em;
  text-align: left; /* 或 right，看你想要 */
}

/* 控件区域固定宽 */
.config-form .ant-form-item-control {
  width: 13em !important;
  flex: 0 0 13em;
}

/* select 撑满控件区 */
.config-form .ant-select {
  width: 100% !important;
}

/* 中屏：每个表单项占半行 */
@media (max-width: 768px) {
  .config-form .ant-form-item {
    flex: 1 1 calc(50% - 24px);
  }
}

/* 窄屏：每个表单项占整行，label 与控件上下排 */
@media (max-width: 576px) {
  .config-form .ant-form-item {
    flex: 1 1 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .config-form .ant-form-item-label {
    width: 100% !important;
    flex: 0 0 auto;
    text-align: left !important;
  }

  .config-form .ant-form-item-control {
    width: 100% !important;
    flex: 0 0 auto;
  }
}

/* ==================== 串口表单 ==================== */
.hlm-form-port {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 1px; /* 新加的间距 */
}

.hlm-form-port .ant-form-item {
  margin: 0;
}

.hlm-operate-button-style {
  min-width: 3.5em;
  height: 32px;
  color: grey;
  font-size: clamp(12px, 0.8vw, 15px);
  padding: 0 0.6em;
}

.hlm-port-button-select-style {
  min-width: 6em;
  height: 32px;
  color: grey;
  font-size: clamp(12px, 0.8vw, 15px);
}

/* 「数据读取」按钮行 */
.read-btn-row {
  margin-top: 12px;
  gap: 12px;
  display: flex;
  justify-content: flex-start;

}

.hlm-nb-business-start-button-style {
  /* 不设 flex: 1，不设 width: 100%，按内容宽度 */
  height: 40px;
  min-height: 32px;
  padding: 0 16px; /* 内边距控制按钮宽度 */
  border-color: #666666;
  background-color: #FF770F;
  color: white !important;
  text-align: center;
  font-size: clamp(12px, 0.85vw, 16px);
  white-space: nowrap;
}

/* ==================== 日志区 ==================== */
/* 外层：固定高度，只裁剪，不滚动 */
.hlm-nb-log-container-style {
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fafafa;
  overflow: hidden;
  box-sizing: border-box;
}

/* 内层：撑满外层，滚动在这里 */
.hlm-flow-log-info-style {
  height: 85%;
  overflow-y: auto;
  font-size: clamp(13px, 1vw, 18px); /* ← 随窗口缩放，限制在 13~18px */
  line-height: 1.6;
  padding: 10px 14px;
  margin: 0;
  box-sizing: border-box;
  text-align: left !important;
}

.hlm-flow-log-info-style span {
  font-size: inherit !important;
}

/* ==================== 辅助 ==================== */
.static-btn {
  pointer-events: none;
  cursor: default;
  opacity: 1;
}

.form-item-spacing {
  margin-left: 0;
}

/* ==================== 参数配置卡片 ==================== */
.config-card-col {
  display: flex;
  width: 100%;
}

.config-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid grey;
  box-sizing: border-box;
}

.config-card .ant-card-body {
  padding: 14px 16px;
  box-sizing: border-box;
}

/* 强制覆盖 AntD 按钮禁用样式 */
.ant-btn[disabled],
.ant-btn-disabled {
  border-color: inherit !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}

/* ==================== 测试按钮分组 ==================== */
.button-group-container {
  flex: 1;
  overflow-y: auto;
  margin-top: 12px;
  padding-right: 4px;
}

/* 标题居左，加粗，前面加个橙色小竖线 */
.group-title {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  text-align: left;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid #FF770F;
  line-height: 1.2;
}

/* 分割线变浅，间距变小 */
.ant-divider-horizontal {
  margin: 12px 0 !important;
  min-width: 100% !important;
  border-top-color: #f0f0f0 !important;
}

/* 按钮行：间距缩小到 6px，左对齐 */
.read-btn-row {
  margin-top: 6px;
  gap: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* 按钮样式微调：去掉固定高度，让内边距控制 */
.hlm-nb-business-start-button-style {
  height: 45px; /* 从 40px 改小一点，没那么笨重 */
  min-height: 10px;
  padding: 0 20px;
  font-size: 13px;
  border-radius: 14px;
  box-shadow: none;
}

/* 专门给“读取/查询”类按钮加一个默认样式（可选） */
.btn-read {
  background-color: #fff !important;
  color: #FF770F !important;
  border-color: #FF770F !important;
}

.btn-read:hover {
  background-color: #fff3e8 !important;
}
</style>
