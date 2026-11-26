<template>
  <div>
    <custom-title-bar :page="'device'"
                      :isDeviceView="true"
                      :productModel="'液冷执行器-测试软件'"
                      :isMaximized="isMaximized"
                      @toggle-maximize="handleToggleMaximize"
                      @minimize-window="handleMinimizeWindow"
                      @close-window="handleCloseWindow"
    />
    <a-layout style="height: 100vh; width: 100vw;overflow: hidden;">
      <a-layout-content style=" height: 100%; width: 100%;margin-top: -1.1vh">
        <div class="hlm-card-info-container">
          <a-card
            title="参数配置"
            class="hlm-card-configInfo"
            :headStyle="upperCardHeadStyle"
            :bodyStyle="upperCardBodyStyle"
          >
            <div>
              <a-form
                layout="horizontal"
                :label-col="{ style: { width: '4vw' } }"
                :wrapper-col="{ style: { width: '8vw' } }"
                style="width: 100%; height: 100%"
              >
                <a-form-item label="波特率" style="width: 30%">
                  <a-select v-model:value="portAttributes.selectedBadRate">
                    <a-select-option v-for="rate in baudRateList" :key="rate" :value="rate">
                      {{ rate }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="数据位" style="width: 30%">
                  <a-select v-model:value="portAttributes.selectedDataBits">
                    <a-select-option v-for="bits in dataBitsList" :key="bits" :value="bits">
                      {{ bits }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="校验位" style="width: 30%">
                  <a-select v-model:value="portAttributes.selectedCheckDigit">
                    <a-select-option v-for="digit in checkDigitList" :key="digit" :value="digit">
                      {{ digit }}
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="停止位" style="width: 30%">
                  <a-select v-model:value="portAttributes.selectedStopBits">
                    <a-select-option v-for="stop in stopBitsList" :key="stop" :value="stop">
                      {{ stop }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </div>
          </a-card>
        </div>


        <div class="hlm-frock-container">
          <a-card title="串口、测试按钮"
                  :headStyle="downCardHeadStyle"
                  :bodyStyle="downCardBodyStyle"
          >

            <a-form
              name="basic"
              layout="inline"
              class="hlm-form-port"
            >
              <a-form-item>
                <a-button class="hlm-operate-button-style" @click="getAllPorts('one')">刷新</a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button class="hlm-port-button-select-style static-btn ">设备串口</a-button>
              </a-form-item>
              <a-select v-model:value="portAttributes.selectedPortOne"
                        class="hlm-port-button-select-style form-item-spacing"
                        @change="handlePortChange(portAttributes.selectedPortOne,'one')">
                <a-select-option v-for="port in this.portAttributes.serialPortList" :value="port">{{
                    port
                  }}
                </a-select-option>
              </a-select>


              <a-form-item>
                <a-button
                  class="hlm-operate-button-style"
                  @click="openPort(portAttributes.selectedPortOne, 'one')"
                  :disabled="!portAttributes.portClosedOneStatus">打开
                </a-button>
              </a-form-item>
              <a-form-item class="form-item-spacing">
                <a-button
                  class="hlm-operate-button-style"
                  @click="closePort(portAttributes.selectedPortOne,'one')"
                  :disabled="portAttributes.portClosedOneStatus">关闭
                </a-button>
              </a-form-item>
            </a-form>


            <div style="display: inline-flex; margin-left:-41vw;   margin-top: calc(30/1080*100vh)">
              <a-button type="primary" block
                        @click="readData(protocolIDMap['ACTUATOR'].protocolId)"
                        :disabled="buttonDisabledStatus.readData"
                        class="hlm-nb-business-start-button-style">
                数据读取
              </a-button>

            </div>

          </a-card>
          <a-card title="日志信息"
                  :headStyle="downCardHeadStyle"
                  :bodyStyle="downCardBodyStyle">
            <div style="margin-top: -3vh;">
              <div style="position: relative; display: inline-flex; margin-left:-2vw;   "></div>
              <!-- 外层固定高度，不滚动 -->
              <div
                id="left_textarea_id"
                ref="receptionOneText"
                class="hlm-nb-log-container-style"
              >
                <!-- 内层高度60%，内容超出时滚动 -->
                <div
                  v-html="text.receptionOneText"
                  class="hlm-flow-log-info-style"
                ></div>
              </div>
            </div>
          </a-card>
        </div>
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
import {doReadData,} from "@/views/device/operations/deviceOperations";

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
        selectedBadRate: '2400',           // 波特率，绑定 <a-select v-model:value="portAttributes.selectedBadRate">
                                           // 可选值来自 baudRateList，默认 2400

        selectedCheckDigit: '偶校验',       // 校验位，绑定 <a-select v-model:value="portAttributes.selectedCheckDigit">
        // 可选值来自 checkDigitList，默认偶校验
        // 打开串口时需映射为 serialport 库要求的 'Even'/'None'/'Odd'

        selectedDataBits: 8,               // 数据位，绑定 <a-select v-model:value="portAttributes.selectedDataBits">
                                           // 可选值来自 dataBitsList，默认 8（最常用）

        selectedStopBits: 1,               // 停止位，绑定 <a-select v-model:value="portAttributes.selectedStopBits">
                                           // 可选值来自 stopBitsList，默认 1（最常用）
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
      // 计算视口宽度百分比
      const widthPercent = (1950 / 1920) * 100
      const heightPercent = (40 / 1080) * 100
      return {
        textAlign: 'center',
        width: `${widthPercent}vw`, // 动态计算vw值
        background: '#e6e8eb',
        color: '#F77F00',
        height: `${heightPercent}vh`, // 动态计算vh值
        fontWeight: 'bold',
        padding: '0.9px 16px'

      }
    }
    ,
    upperCardBodyStyle() {
      // 计算窗口宽度百分比
      const widthPercent = (640 / 1920) * 100
      const heightPercent = (320 / 1080) * 100
      return {
        width: `${widthPercent}vw`, // 动态计算vw值
        height: `${heightPercent}vh`, // 动态计算vh值
        padding: '0px',
        marginTop: '0.6vh'
      }
    }
    ,
    downCardHeadStyle() {
      // 计算窗口宽度百分比
      const widthPercent = (960 / 1920) * 100
      const heightPercent = (40 / 1080) * 100
      return {
        textAlign: 'center',
        width: `${widthPercent}vw`, // 动态计算vw值
        background: '#e6e8eb',
        color: '#F77F00',
        height: `${heightPercent}vh`, // 动态计算vh值
        fontWeight: 'bold',
        padding: '0.9px 16px'
      }
    },
    downCardBodyStyle() {
      // 计算视口宽度百分比
      const widthPercent = (960 / 1920) * 100
      const heightPercent = (660 / 1080) * 100
      return {
        width: `${widthPercent}vw`, // 动态计算vw值
        height: `${heightPercent}vh`, // 动态计算vh值
        padding: '0px',
        marginTop: '0.6vh'
      }
    }
  },

  watch: {
    "text.receptionOneText":
      {
        handler() {
          this.$nextTick(() => {
            // 操作的是内层滚动容器
            const contentDiv = this.$refs.receptionOneText.querySelector('.hlm-flow-log-info-style');
            if (contentDiv) {
              //当前滚动条距离容器顶部的垂直偏移量（单位：像素）。= 滚动条内可见高度
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
    wireDeviceButtonDisabled() {
      this.buttonDisabledStatus.readData = true
    },
    // 按钮启用
    wireDeviceButtonEnabled() {
      this.buttonDisabledStatus.readData = false
    },
    /**
     * 创建控制台日志
     * @param message 消息内容
     * @param color  字体颜色
     *
     * */
    createLeftSpanMessage(message, color) {
      const safeMessage = this.escapeHTML(message);
      const messageHTML = `<span style="color: ${color}; font-size: 15px;">${safeMessage}</span><br>`;
      this.text.receptionOneText += (messageHTML);
      this.$nextTick(() => {
        const element = this.$refs.receptionOneText;
        if (element) {
          element.scrollTop = element.scrollHeight;
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

  }
}
;
</script>

<style>
html, body {
  margin-top: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.a-card {
  background-color: #f0f2f5;
}

/* 彻底覆盖 Ant Design Card 头部样式 */
.ant-card-head {
  min-height: 10px !important;
}

.ant-card-head-title {
  font-size: calc(24 / 1920 * 100vw) !important;
  width: calc(640 / 1920 * 100vw) !important;
  height: calc(40 / 1080 * 100vh) !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ant-card-head-wrapper {
  height: calc(40 / 1080 * 100vh) !important;
}

/*上半部card样式*/
.hlm-card-info-container {
  margin-top: -20px;
  width: 100vw;
  height: calc(350 / 1080 * 100vh);
  display: inline-flex;
}

.hlm-card-configInfo {
  width: calc(1950 / 1920 * 100vw);
  height: calc(360 / 1080 * 100vh);
  border: 1px solid grey;
  left: 0;
}

/*工装样式*/
.hlm-frock-container {
  margin-top: calc(10 / 1080 * 100vh);
  width: 100vw;
  height: calc(660 / 1080 * 100vh);
  display: inline-flex;
  left: 0;
}

.hlm-form-port {
  display: flex;
  margin-top: calc(20 / 1080 * 100vh);
  height: calc(30 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  width: auto;
  min-width: max-content;
  flex-wrap: nowrap;
}

.hlm-operate-button-style {
  width: calc(60 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  min-width: 50px;
  min-height: 25px;
  color: grey;
  font-size: calc(14 / 1920 * 100vw);
}

.hlm-port-button-select-style {
  width: calc(120 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
  color: grey;
}

.hlm-nb-business-start-button-style {
  width: calc(115 / 1920 * 100vw);
  height: calc(50 / 1080 * 100vh);
  border-color: #666666;
  background-color: #FF770F;
  color: white !important;
  text-align: center;
  font-size: calc(18 / 1920 * 100vw);
  white-space: nowrap;
  margin-left: calc(40 / 1920 * 100vw);
}

.hlm-nb-log-container-style {
  width: calc(868 / 1930 * 100vw);
  height: calc(650 / 1080 * 100vh);
  margin-top: calc(20 / 1080 * 100vh);
  margin-left: calc(50 / 1920 * 100vw);
  border: 1px solid #d9d9d9;
  text-align: left;
  overflow: hidden;
}

.hlm-flow-log-info-style {
  font-size: calc(16 / 1920 * 100vw) !important;
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(30 / 1920 * 100vw);
  max-height: 60% !important;
  overflow-y: auto !important;
}

.static-btn {
  pointer-events: none;
  cursor: default;
  opacity: 1;
}

.form-item-spacing {
  margin-left: -0.9vw;
}

/* 强制覆盖 AntD 按钮禁用样式 */
.ant-btn[disabled],
.ant-btn-disabled {
  border-color: inherit !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
}</style>
