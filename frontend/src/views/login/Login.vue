<template>
  <h1>登录</h1>
  <div style="margin-top: 30px">
    <a-form
      :model="dataForm"
      ref="formRef"
      name="basic"
      layout="horizontal"
      style="padding-left: 10px"
    >
      <a-form-item label="类型:"
                   style="padding-left: 12px"
                   name="selectType"
                   :rules="[{ required: true, message: '请选择类型' }]"
      >
        <a-select v-model:value="dataForm.selectType" placeholder="请选择类型" style="width: 200px;">
          <a-select-option v-for="type in typeList" :value="type">{{ type }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="用户名:"
                   name="username"
                   :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="dataForm.username" placeholder="请输入用户名" style="width: 200px;"></a-input>
      </a-form-item>
      <a-form-item label="密码:"
                   name="password"
                   :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input type="password" v-model:value="dataForm.password" placeholder="请输入密码"
                 style="width: 200px;"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button class="login-button" type="primary" @click="login" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import {getUserByUserNameAndPassWork} from '@/components/global/mysqldb.js';
import {message} from 'ant-design-vue';
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute, specialIpcRoute} from "@/api/main";
import {getIdByUsername} from "@/components/global/productdb";
import {useRoute} from "vue-router";

const path = require('path');
const Log = require('ee-core/log');

export default {
  mounted() {
    this.init();
    // this.getMessage();
    const route = useRoute();
    this.routerParam.selectDeviceMode = route.query.selectDeviceMode
    this.routerParam.selectPrintModel = route.query.selectPrintModel
    this.routerParam.selectTemperatureProbes = route.query.selectTemperatureProbes
    this.routerParam.selectOperator = route.query.selectOperator
    this.routerParam.selectPressureProbes = route.query.selectPressureProbes
    console.warn(this.routerParam)
  },
  data() {
    return {
      dataForm: {
        username: undefined,
        password: undefined,
        selectType: undefined,
      },
      typeList: ['生产'],
      // typeList: ['生产', '管理员', '测试专用'],
      messageString: '',
      routerParam: {
        selectDeviceMode: undefined,
        selectPrintModel: undefined,
        selectTemperatureProbes: undefined,
        selectOperator: undefined,
        selectPressureProbes: undefined,
        userId: undefined,
      },
      routerInfo: {
        type: 'vue',
        windowTitle: 'VAC710S',
        content: '#/device',
        childrenWindowId: undefined,
      },
      currentWindowName: 'login',
    };
  },
  methods: {
    async init() {
      this.currentWindowsId = await ipc.invoke(ipcApiRoute.getWCid, this.currentWindowName);
    },
    async login() {
      const formRef = this.$refs.formRef;
      if (formRef) {
        formRef.validate().then(async () => {
          // 通过 this.dataForm 访问表单数据属性
          const {username, password} = this.dataForm;
          const res = await getUserByUserNameAndPassWork(username, password);
          //登录成功 需要创建新的view 窗口 并提示登录成功 关闭当前窗口
          if (res.length === 0 || res === '' || res === undefined) {
            message.error('账户或密码错误!');
            Log.error('账号密码错误')
          } else {
            message.success('登录成功');
            this.routerParam.userId =( await getIdByUsername(username))[0].id;
            console.log(this.routerParam.userId)
            let param = this.routerParam
            ipc.invoke(ipcApiRoute.loginRouter, {
              width: 870, height: 900,
              content: this.routerInfo.content,
              windowName: this.routerInfo.windowName,
              windowTitle: this.routerInfo.windowTitle,
              type: this.routerInfo.type,
              windowsId: this.currentWindowsId,
              param: JSON.stringify(param),
            }).then(id => {
              this.routerInfo.childrenWindowId = id
            })
          }
        })
      }
    },
  }
};
</script>

<style>

@media (max-width: 575px) {
  .ant-form .ant-form-item .ant-form-item-label, .ant-form .ant-form-item .ant-form-item-control {
    max-width: calc(100% - 300px);
  }
}


.login-button {
  width: 100%;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 130px;
  margin-top: 50px;

}

</style>
