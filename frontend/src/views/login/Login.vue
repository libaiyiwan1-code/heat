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
        <a-button class="login-button" type="primary" @click="login">登录</a-button>
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

const path = require('path');
const Log = require('ee-core/log');

export default {
  mounted() {
    this.init();
    this.getMessage();
  },
  data() {
    return {
      dataForm: {
        username: undefined,
        password: undefined,
        selectType: undefined,
      },
      routerSettingParams: {
        selectDeviceMode: undefined,
        selectOperator: undefined,
        selectPrintModel: undefined,
        selectTemperatureProbes: undefined,
        protocolId: undefined,
        userId: undefined,
        selectPressureProbes: undefined,
      },
      typeList: ['生产'],
      // typeList: ['生产', '管理员', '测试专用'],
      messageString: '',
      viewChildren: [
        {
          type: 'vue',
          windowName: 'serialPort',
          windowTitle: '生产软件',
          content: '#/special/serialPort',
        },
      ],
      viewCurrent: [
        {
          windowsName: 'login',
          currentWindowsId: undefined,
        }
      ]
    };
  },
  methods: {
    async init() {
      this.viewCurrent[0].currentWindowsId = await ipc.invoke(ipcApiRoute.getWCid, this.viewCurrent[0].windowsName);
    },
    getMessage() {
      try {
        console.log('登录页面-监听开始')
        Log.info('登录页面-监听开始')
        ipc.removeAllListeners(specialIpcRoute.paramSettingsWindowToLoginWindow);
        //监听 主窗口通信信息.
        ipc.on(specialIpcRoute.paramSettingsWindowToLoginWindow, (event, args) => {
          console.log('登录页面-监听触发',args)
          Log.info('登录页面-监听触发',args)
          const formData = JSON.parse(args);
          this.routerSettingParams.selectDeviceMode = formData.selectDeviceMode;
          this.routerSettingParams.selectOperator = formData.selectOperator;
          this.routerSettingParams.selectPrintModel = formData.selectPrintModel;
          this.routerSettingParams.selectTemperatureProbes = formData.selectTemperatureProbes;
          this.routerSettingParams.selectPressureProbes = formData.selectPressureProbes;
          // this.$message.success(args);
          // console.log(formData)
        });
      } catch (error) {
        console.error('login page Error occurred while handling IPC message:', error);
        Log.error('login page Error occurred while handling IPC message:', error)
      }
    },
    async login() {
      // this.$message.info(JSON.stringify(this.routerSettingParams));
      const formRef = this.$refs.formRef;
      if (formRef) {
        formRef.validate().then(async () => {
          // 通过 this.dataForm 访问表单数据属性
          const {username, password} = this.dataForm;
          const res = await getUserByUserNameAndPassWork(username, password);
          //登录成功 需要创建新的view 窗口 并提示登录成功 关闭当前窗口
          if (res.length === 0 || res === '' || res === undefined) {
            message.error('账户或密码错误!');
            console.error('账户或密码错误!')
            Log.error('账号密码错误')
          } else {
            message.success('登录成功');
            this.routerSettingParams.userId = await getIdByUsername(username); // 使用 await 等待结果
            console.log('查询当前登录用户id', this.routerSettingParams.userId)
            Log.info('查询当前登录用户id',this.routerSettingParams.userId)
            const formDataString = JSON.stringify(this.routerSettingParams);
            console.log('登录页面路由参数:', formDataString)
            Log.info('登录页面路由参数:', formDataString)
            ipc.invoke(ipcApiRoute.loginRouter, {
              width: 870, height: 900, content: this.viewChildren[0].content,
              windowName: this.viewChildren[0].windowName,
              windowTitle: this.viewChildren[0].windowTitle,
              type: this.viewChildren[0].type,
              windowsId: this.viewCurrent[0].currentWindowsId
            }).then(id => {
              this.newWcId = id;
              console.log('创建WAC710C子窗口成功 子窗口id:', id)
              Log.info('创建WAC710C子窗口成功  子窗口id:', id);
              // 这里设置延迟 1s 消息延迟 因为ipc 消息通信是异步 ,要给子窗口创建时间
              setTimeout(() => {
                this.sendMessageToTwoWindow(this.newWcId, formDataString);
              }, 2000);
            }).catch((error) => {
              console.error('创建WAC710C子窗口失败', error)
              Log.error('创建WAC710C子窗口失败', error);
            });
          }
        }).catch((error) => {
          console.error('login Error form :', error);
          Log.error('login Error form :', error)
        });
      } else {
        console.error('login Error form validate');
        Log.error('login Error form validate')
      }
    }
    ,
    async sendMessageToTwoWindow(newWcId, formDataString) {
      console.log('登录页面路由参数发送-->', formDataString)
      Log.info('登录页面路由参数发送', formDataString)
      ipc.sendTo(newWcId, specialIpcRoute.loginWindowToSerialPortWindow, formDataString);
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
