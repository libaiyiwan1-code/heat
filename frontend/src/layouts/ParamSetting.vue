<template>
  <h1>写地址-参数设置</h1>
  <div style="margin-top: 30px">
    <a-form
      :model="formData"
      name="basic"
      ref="formRef"
      layout="horizontal"
      style="padding-left: 10px"
    >

      <a-form-item
        label="型号选择：："
        name="selectDeviceMode"
        :rules="[{ required: true, message: '请选择型号' }]"
      >
        <a-select v-model:value="formData.selectDeviceMode" placeholder="请选择型号" style="width: 200px;">
          <a-select-option v-for="deviceModel in Enum.deviceModelList" :value="Enum.deviceModelList[0]">
            {{ deviceModel }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="打印型号：："
        name="selectPrintModel"
        :rules="[{ required: true, message: '请选择打印型号' }]"
      >
        <a-select v-model:value="formData.selectPrintModel" placeholder="请选择型号" style="width: 200px;">
          <a-select-option v-for="printMode in Enum.printModelList" :value="printMode">
            {{ printMode }}
          </a-select-option>
        </a-select>
      </a-form-item>

<!--      <a-form-item-->
<!--        label="运营商选择："-->
<!--        name="selectOperator"-->
<!--        :rules="[{ required: true, message: '请选择运营商' }]"-->
<!--      >-->
<!--        <a-select v-model:value="formData.selectOperator" placeholder="请选择运营商" style="width: 200px;">-->
<!--          <a-select-option v-for="operator in Enum.operators" :value="operator">-->
<!--            {{ operator }}-->
<!--          </a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->

      <a-form-item
        label="温度探头："
        name="selectTemperatureProbes"
        :rules="[{ required: true, message: '请选择温度探头' }]"
      >
        <a-select v-model:value="formData.selectTemperatureProbes" placeholder="请选择温度探头" style="width: 200px;">
          <a-select-option v-for="temperatureProbes in Enum.temperatureProbesList" :value="temperatureProbes">
            {{ temperatureProbes }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="温度探头："
        name="selectTemperatureProbes"
        :rules="[{ required: true, message: '请选择温度探头' }]"
      >
        <a-select v-model:value="formData.selectPressureProbes" placeholder="请选压力度探头" style="width: 200px;">
          <a-select-option v-for="pressureProbes in Enum.pressureProbesList" :value="pressureProbes">
            {{ pressureProbes }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="密码"
                   name="selectPassword"
                   :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input placeholder="请输入密码" style="width: 200px;" v-model:value="formData.selectPassword" type="password"
                 :maxlength="-1"/>
      </a-form-item>

      <a-form-item :wrapper-col="{  span: 16 }">
        <a-button class="param-setting-button" type="primary" html-type="submit" @click="confirming">确定</a-button>
      </a-form-item>
      <!--      <a-form-item :wrapper-col="{  span: 16 }">-->
      <!--        <a-button class="param-setting-button" type="primary" html-type="submit" @click="sendMessage">发送消息-->
      <!--        </a-button>-->
      <!--      </a-form-item>-->

    </a-form>
  </div>

</template>

<script>
import {message} from 'ant-design-vue';
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute, specialIpcRoute} from "@/api/main";

const Log = require('ee-core/log');
const path = require('path');
export default {
  name: 'LoginPage',
  mounted() {
    this.init();
  },
  data() {
    return {
      formData: {
        password: undefined,
        selectDeviceMode: 'VAC710S',
        selectOperator: '移动',
        selectPrintModel: 'VAC710S',
        selectTemperatureProbes: '无探头',
        selectPressureProbes: '无探头',
        selectPassword: undefined,
      },
      Enum: {
        deviceModelList: ['VAC710S'],
        operators: ['移动', '电信'],
        printModelList: ['VAC710S'],
        temperatureProbesList: ['无探头', '蓝色-回温探头', '红色-进温探头', '红蓝-双探头'],
        pressureProbesList: ['无探头'],
      },
      defaultPassword: "cqq",
      newWcId: undefined,
      currentWindowName:'main',
      routerInfo:{
        type: 'vue',
        windowName: 'login',
        windowTitle: '登录',
        content: '#/login',
        childrenWindowId: undefined,
      },
      currentWindowsId: undefined,
    };
  },
  methods: {
    async init() {
      this.currentWindowsId = await ipc.invoke(ipcApiRoute.getWCid,this.currentWindowName);
    },
    async confirming() {
      const formRef = this.$refs.formRef;
      if (formRef) {
        formRef.validate().then(async () => {
          if (this.formData.selectPassword !== this.defaultPassword) {
            message.error('密码错误');
            Log.error('密码输入错误', this.formData.selectPassword);
            return;
          }
          //密码输入成功
          let param={
            selectDeviceMode: this.formData.selectDeviceMode,
            selectPrintModel: this.formData.selectPrintModel,
            selectOperator: this.formData.selectOperator,
            selectTemperatureProbes: this.formData.selectTemperatureProbes,
            selectPressureProbes: this.formData.selectPressureProbes,
          }
          await ipc.invoke(ipcApiRoute.loginRouter,
            {
              width: 450, height: 500,
              content: this.routerInfo.content,
              windowName: this.routerInfo.windowName,
              windowTitle: this.routerInfo.windowTitle,
              type: this.routerInfo.type,
              windowsId: this.currentWindowsId,
              param:JSON.stringify(param),
            },
          ).then( id => {
            this.routerInfo.childrenWindowId = id
            console.log('paramPage children window id:',id)
          }).catch((error) => {
            console.error('paramPage error', error)
            Log.error('paramPage error', error);
          });

        });
      } else {
        console.error('Form reference not found.');
        Log.error('Form reference not found.');
      }
    },
  }
};
</script>

<style lang="less">

/*深度修改   原ant-degin-vue样式  原生最大宽度限制导致表单变形 指定百分比*/
@media (max-width: 575px) {
  .ant-form .ant-form-item .ant-form-item-label, .ant-form .ant-form-item .ant-form-item-control {
    max-width: calc(100% - 300px);
  }
}

.param-setting-button {
  width: 150%;
  background-color: #007bff;
  color: #fff;
  border-radius: 10px; /*盒子圆角*/
  cursor: pointer; /**/
  margin-left: 130px; /*左移130px*/
  top: -5px; /*上移10px*/
}

</style>
