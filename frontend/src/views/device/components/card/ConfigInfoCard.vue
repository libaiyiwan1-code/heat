<template>
  <a-card
    title="配置信息"
    class="hlm-card-configInfo"
    :head-style="headStyle"
    :body-style="bodyStyle"
  >
    <!-- 标题栏按钮 -->
    <template #extra>
      <div class="config-extra-btns">
        <a-button class="custom-button config-btn" @click="$emit('config-click')">
          参数配置
        </a-button>
        <a-button class="custom-button print-btn" @click="$emit('print-click')">
          打印设置
        </a-button>
      </div>
    </template>

    <!-- ==================== NB 设备 ==================== -->
    <div v-if="isNBDevice">
      <a-row class="nb-config-row">
        <!-- 左列 -->
        <a-col class="hlm-card-nb-configInfo-body-left-column">
          <div
            v-if="shouldShow.temperatureProbes"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">测温类型:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.temperatureProbe }}
            </span>
          </div>

          <div
            v-if="shouldShow.liquidLevelSensor"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">液位探头:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.selectLevelProbes }}
            </span>
          </div>

          <div
            v-if="shouldShow.pressureProbes"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">压力探头:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.pressureProbes }}
            </span>
          </div>

          <div
            v-if="shouldShow.screenDisplay"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">屏幕显示:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.screenDisplay }}
            </span>
          </div>

          <div
            v-if="shouldShow.torque"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">扭矩:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.torques }}
            </span>
          </div>

          <div
            v-if="shouldShow.temperatureDiff"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">温度误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.temperatureDiff }}
            </span>
          </div>

          <div
            v-if="shouldShow.csDeviceErrorAndCurrentSourceExist"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">源设误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.cs_device_err }} mA
            </span>
          </div>

          <div
            v-if="shouldShow.csDeviceErrorAndCurrentSourceExist"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">信源误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.sig_cs_err }} mA
            </span>
          </div>

          <div
            v-if="shouldShow.aec100CurrentError"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">电流误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.aec100_current_err }} mA
            </span>
          </div>

          <div
            v-if="shouldShow.csDeviceErrorAndCurrentSourceNotExist"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">信设误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.sig_device_err }} mA
            </span>
          </div>

          <div
            v-if="configDetail.printLabel === 'WAC710CD'"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">电流源:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.currentSource }}
            </span>
          </div>

          <div
            v-if="shouldShow.powerError"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">功率误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value" style="margin-left: 8px">
              {{ configDetail.power_error }}%
            </span>
          </div>
        </a-col>

        <!-- 右列 -->
        <a-col class="hlm-card-nb-configInfo-body-right-column">
          <div
            v-if="shouldShow.temperatureProbes"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">温度标定:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.temperature }}
            </span>
          </div>

          <div class="hlm-card-configInfo-body-info-line">
            <span class="label hlm-card-nb-configInfo-body-info-line-label">标签型号:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.printLabel }}
            </span>
          </div>

          <div class="hlm-card-configInfo-body-info-line">
            <span class="label hlm-card-nb-configInfo-body-info-line-label">打印型号:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.customizePrintLabel }}
            </span>
          </div>

          <div class="hlm-card-configInfo-body-info-line">
            <span class="label hlm-card-nb-configInfo-body-info-line-label">产品型号:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.printLabel }}
            </span>
          </div>

          <div class="hlm-card-configInfo-body-info-line">
            <span class="label hlm-card-nb-configInfo-body-info-line-label">程序版本:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.version }}
            </span>
          </div>

          <div
            v-if="shouldShow.communicationAndNominalDiameter"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">通信方式:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.communication }}
            </span>
          </div>

          <div
            v-if="shouldShow.communicationAndNominalDiameter"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">公称口径:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ configDetail.nominalCaliber }}
            </span>
          </div>
        </a-col>
      </a-row>

      <!-- 波特率 / 校验位 -->
      <div class="nb-port-line">
        <div class="hlm-card-configInfo-body-info-line" style="margin-left: 0.9vw">
          <span class="label hlm-card-nb-configInfo-body-info-line-label">波特率: </span>
          <span class="value hlm-card-configInfo-body-info-line-value">
            {{ portAttributes.selectedBadRate }}
          </span>
        </div>
        <div class="hlm-card-configInfo-body-info-line" style="margin-left: -9.8vw">
          <span class="label hlm-card-nb-configInfo-body-info-line-label">校验位: </span>
          <span class="value hlm-card-configInfo-body-info-line-value">
            {{ portAttributes.selectedCheckDigit }}
          </span>
        </div>
      </div>

      <!-- 工序重点 -->
      <div class="hlm-card-configInfo-body-info-line" style="margin-top: -1vh; margin-left: 0.9vw">
        <span class="label hlm-card-nb-configInfo-body-info-line-label">工序重点: </span>
        <span class="value hlm-card-configInfo-body-info-line-value">
          {{ configDetail.processFocus }}
        </span>
      </div>

      <!-- 打印机信息 -->
      <div class="print-info-line">
        <div class="info-line-span-printInfo" style="display: flex; align-items: center;">
          <span class="label">打印机名: </span>
          <span class="value" style="margin-left: 0.8vw">{{ configDetail.printerName }}</span>
        </div>
        <div class="info-line-span-printInfo" style="margin-left: 2vw">
          <span class="label">纸张大小: </span>
          <span class="value" style="margin-left: 0.8vw">{{ configDetail.paperSize }}</span>
        </div>
        <div class="info-line-span-printInfo" style="margin-left: 2vw">
          <span class="label">双排打印: </span>
          <span class="value" style="margin-left: 0.8vw">
            {{ configDetail.whetherDoubleRowPrinting }}
          </span>
        </div>
      </div>
    </div>

    <!-- ==================== 有线设备 ==================== -->
    <div v-else>
      <a-row class="wire-config-row">
        <!-- 左列 -->
        <a-col class="hlm-card-configInfo-body-left-column">
          <div
            v-show="wireShow.model"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">规格型号:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.model }}
            </span>
          </div>

          <div
            v-show="wireShow.operatorLine"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">运营商:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.operatorLine[wireForm.operatorLine] }}
            </span>
          </div>

          <div
            v-show="wireShow.temperatureProbe"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">温度探头:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.temperatureProbe[wireForm.temperatureProbe] }}
            </span>
          </div>

          <div
            v-show="wireShow.pressureProbes"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">压力探头:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.pressureProbe[wireForm.pressureProbes] }}
            </span>
          </div>

          <div
            v-show="wireShow.temperatureUpperLimit"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">温度上限:</span>
            <span class="value">{{ wireForm.temperatureUpperLimit }}</span>
          </div>

          <div
            v-show="wireShow.temperatureDownLimit"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">温度下限:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.temperatureDownLimit }}
            </span>
          </div>

          <div
            v-show="wireShow.cleaningCycle"
            class="hlm-card-configInfo-body-info-line"
            style="margin-top: 20px"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">清洗周期: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.cleaningCycle }}
            </span>
          </div>
        </a-col>

        <!-- 中列 -->
        <a-col class="hlm-card-configInfo-body-center-column">
          <div
            v-show="wireShow.openingUpperLimit"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">开度上限: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.openingUpperLimit }}
            </span>
          </div>

          <div
            v-show="wireShow.openingDownLimit"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">开度下限: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.openingDownLimit }}
            </span>
          </div>

          <div
            v-show="wireShow.heatingDate"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">供暖日期: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.heatingStartDate }} ~ {{ wireForm.heatingEndDate }}
            </span>
          </div>

          <div
            v-show="wireShow.powerState"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">断电状态:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.powerState[wireForm.powerState] }}
            </span>
          </div>

          <div
            v-show="wireShow.wirelessAnomaly"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">无线异常:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.wirelessAnomaly[wireForm.wirelessAnomaly] }}
            </span>
          </div>

          <div
            v-show="wireShow.screenDisplay"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">屏幕显示:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.screenDisplay[wireForm.screenDisplay] }}
            </span>
          </div>

          <div class="hlm-card-configInfo-body-info-line">
            <span class="label hlm-card-configInfo-body-info-line-label">程序版本: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.version }}
            </span>
          </div>
        </a-col>

        <!-- 右列 -->
        <a-col class="hlm-card-configInfo-body-right-column">
          <!-- VAC130 系列模拟量误差 -->
          <div
            v-show="isVac130Series"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-nb-configInfo-body-info-line-label">模拟量误差:</span>
            <span class="value hlm-card-configInfo-body-info-line-value" style="margin-left: 8px">
              {{ configDetail.analogError }}%
            </span>
          </div>

          <div
            v-show="wireShow.regulationMode"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">调节模式:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.regulationMode[wireForm.regulationMode] }}
            </span>
          </div>

          <div
            v-show="wireShow.regulationModeValue"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">调节目标 :</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.regulationModeValue }}
            </span>
          </div>

          <div
            v-show="wireShow.strongTemperatureSetting"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">强制设温: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.strongTemperatureSetting[wireForm.strongTemperatureSetting] }}
            </span>
          </div>

          <div
            v-show="wireShow.forcedTemperature"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">强制温度: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.forcedTemperature }}
            </span>
          </div>

          <div
            v-show="wireShow.selfRegulating"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">自调节:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.selfRegulating[wireForm.selfRegulating] }}
            </span>
          </div>

          <div
            v-show="wireShow.adjustmentCycle"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">调节周期: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.adjustmentCycle }}
            </span>
          </div>

          <div
            v-show="wireShow.proportionalAdjustment"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">调节比例:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.proportionalAdjustment }}
            </span>
          </div>

          <div
            v-show="wireShow.swipeCard"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">刷卡功能: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.swipeCard[wireForm.swipeCard] }}
            </span>
          </div>

          <div
            v-show="wireShow.mainAuxiliaryValve"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">副阀通讯:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.mainAuxiliaryValve[wireForm.mainAuxiliaryValve] }}
            </span>
          </div>

          <div
            v-show="wireShow.separateWarn"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">分离测试:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.separateWarn[wireForm.separateWarn] }}
            </span>
          </div>

          <div
            v-show="wireShow.factoryOpening"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">出厂状态:</span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ maps.factoryOpening[wireForm.factoryOpening] }}
            </span>
          </div>

          <div
            v-show="wireShow.adjustDeadZone"
            class="hlm-card-configInfo-body-info-line"
          >
            <span class="label hlm-card-configInfo-body-info-line-label">调节死区: </span>
            <span class="value hlm-card-configInfo-body-info-line-value">
              {{ wireForm.adjustDeadZone }}
            </span>
          </div>
        </a-col>
      </a-row>

      <!-- 工序重点 -->
      <div class="hlm-card-configInfo-body-info-line" style="margin-top: 2vh; margin-left: 0.9vw">
        <span class="label">工序重点: </span>
        <span class="value" style="margin-left: 0.9vw">{{ wireForm.processFocus }}</span>
      </div>

      <!-- 打印机信息 -->
      <div class="print-info-line" style="margin-top: 1vh">
        <div class="info-line-span-printInfo" style="display: flex; align-items: center;">
          <span class="label">打印机名: </span>
          <span class="value" style="margin-left: 0.8vw">{{ configDetail.printerName }}</span>
        </div>
        <div class="info-line-span-printInfo" style="margin-left: 2vw">
          <span class="label">纸张大小: </span>
          <span class="value" style="margin-left: 0.8vw">{{ configDetail.paperSize }}</span>
        </div>
        <div class="info-line-span-printInfo" style="margin-left: 2vw">
          <span class="label">双排打印: </span>
          <span class="value" style="margin-left: 0.8vw">
            {{ configDetail.whetherDoubleRowPrinting }}
          </span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'ConfigInfoCard',
  props: {
    // 是否 NB 设备
    isNBDevice: {
      type: Boolean,
      required: true
    },
    // NB / 通用配置详情
    configDetail: {
      type: Object,
      required: true,
      default: () => ({})
    },
    // 串口属性（波特率、校验位）
    portAttributes: {
      type: Object,
      default: () => ({})
    },
    // 有线设备表单数据
    wireForm: {
      type: Object,
      default: () => ({})
    },
    // 有线设备字段可见性
    wireShow: {
      type: Object,
      default: () => ({})
    },
    // NB 设备字段可见性（由父组件计算后传入）
    shouldShow: {
      type: Object,
      default: () => ({})
    },
    // 各种枚举映射
    maps: {
      type: Object,
      default: () => ({})
    },
    // 样式
    headStyle: {
      type: Object,
      default: () => ({})
    },
    bodyStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['config-click', 'print-click'],
  computed: {
    // VAC130 系列特殊判断（展示用，逻辑仍在父组件控制 isNBDevice）
    isVac130Series() {
      const label = this.configDetail?.printLabel || ''
      return [
        'VAC130-4/20mA',
        'VAC130-0/10V',
        'VAC130-1/10V',
        'VAC130H-4/20mA',
        'VAC130H-0/10V',
        'VAC130H-1/10V'
      ].includes(label)
    }
  }
}
</script>

<style scoped>
.hlm-card-configInfo {
  width: calc(640 / 1920 * 100vw);
  height: calc(360 / 1080 * 100vh);
  border: 1px solid grey;
}

.config-extra-btns {
  display: flex;
  gap: 4px;
}

.custom-button.config-btn,
.custom-button.print-btn {
  background-color: transparent;
  color: #3f3f3f;
  border: none;
}

.custom-button:hover {
  opacity: 0.8;
}

.nb-config-row,
.wire-config-row {
  width: calc(680 / 1920 * 100vw);
  height: calc(206 / 1080 * 100vh);
}

.hlm-card-nb-configInfo-body-left-column,
.hlm-card-nb-configInfo-body-right-column,
.hlm-card-configInfo-body-left-column,
.hlm-card-configInfo-body-center-column,
.hlm-card-configInfo-body-right-column {
  margin-top: calc(10 / 1080 * 100vh);
  margin-left: calc(10 / 1080 * 100vw);
}

.hlm-card-configInfo-body-info-line {
  text-align: left;
  display: flex;
  width: 105%;
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-configInfo-body-info-line-label {
  width: calc(85 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-nb-configInfo-body-info-line-label {
  width: calc(80 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
}

.hlm-card-configInfo-body-info-line-value {
  width: calc(100 / 1920 * 100vw);
  height: calc(30 / 1080 * 100vh);
}

.nb-port-line {
  white-space: nowrap;
  margin-top: 3.5vh;
  display: flex;
}

.print-info-line {
  margin-left: 0.9vw;
  white-space: nowrap;
  margin-top: -1vh;
  display: flex;
}

.info-line-span-printInfo {
  width: calc(650 / 1080 * 100vw);
}

.label {
  color: black;
  font-weight: bold;
  font-size: calc(15 / 1920 * 100vw);
}

.value {
  color: #FF770F;
  font-weight: bold;
  font-size: calc(15 / 1920 * 100vw);
}
</style>
