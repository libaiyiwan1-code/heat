<template>
  <div style="margin-top: 50px;margin-left: 40px; ">
    <a-form
      :model="dataForm"
      ref="formRef"
      name="basic"
      layout="horizontal"
    >
      <a-form-item label="用户名:"
                   name="username"
                   :rules="[{ required: true, message: '请输入用户名' }]"
                   :label-col="{ span: 6 }"
                   :wrapper-col="{ span: 20 }"

      >
        <a-input v-model:value="dataForm.username" placeholder="请输入用户名"
                 style="width: 200px;margin-left: 15px" spellcheck="false"></a-input>
      </a-form-item>
      <a-form-item label="密码:"
                   name="password"
                   :rules="[{ required: true, message: '请输入密码' }]"
                   :label-col="{ span: 6 }"
                   :wrapper-col="{ span: 20 }"
      >
        <a-input type="password" v-model:value="dataForm.password" placeholder="请输入密码"
                 style="width: 200px;margin-left: 15px"></a-input>
      </a-form-item>
      <a-form-item label="MAC地址:"
                   name="macAddr"
                   :rules="[{ required: true, message: '请输入MAC地址' }]"
                   :label-col="{ span: 6 }"
                   :wrapper-col="{ span: 20 }"
      >
        <a-input v-model:value="dataForm.macAddr" placeholder="请输入MAC地址"
                 style="width: 200px;margin-left: 15px" spellcheck="false" :readonly="true"></a-input>
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
import {ipcApiRoute} from "@/api/main";
import {findMacAddr, getIdByUsername} from "@/components/global/productdb";
/*todo 研发mac地址不需要上传MES ， 不需要录工单 。*/
const {logger} = require('ee-core/log');
export default {
  data() {
    return {
      layout: 'horizontal',
      dataForm: {
        username: undefined,
        password: undefined,
        macAddr: undefined,

      },
      messageString: '',
      routerParam: {
        userId: undefined,
        macAddr: undefined,
        machineNumber: undefined,
        produceMachine: undefined,
      },
      routerInfo: {
        type: 'vue',
        windowTitle: '海龙马生产软件',
        content: '#/device',
        childrenWindowId: undefined,
      },
      currentWindowName: 'main',
      currentWindowsId: undefined,
      macList: [],
    };
  },
  async created() {
    await this.init();
    this.macList = await findMacAddr()
    console.log(this.macList)
    await ipc.invoke(ipcApiRoute.getCpuIdentifier).then(res => {
      let result = this.macList.find(x => x.macAddr === res)
      console.log(result)
      this.routerParam.machineNumber = result.machineNumber
      this.routerParam.produceMachine = result.produceMachine
      if (result) {
        this.dataForm.macAddr = result.macAddr
      }
    })

  },

  methods: {
    async init() {
      this.currentWindowsId = await ipc.invoke(ipcApiRoute.getWCid, this.currentWindowName);
    },
    async login() {
      // cmd get cpuID: wmic cpu get ProcessorId
      // cmd get bios :wmic bios get serialnumber
      await ipc.invoke(ipcApiRoute.getCpuIdentifier).then(async res => {
        console.log(res)
        console.log(this.dataForm.macAddr)
          if (res === this.dataForm.macAddr) {
            const formRef = this.$refs.formRef;
            try {
              await formRef.validate(); // 验证表单
              const {username, password} = this.dataForm;
              const res = await getUserByUserNameAndPassWork(username, password);

              if (!res || res.length === 0) {
                message.error('账户或密码错误!');
                logger.error('账号密码错误');
              } else {
                message.success('登录成功');
                this.routerParam.userId = (await getIdByUsername(username))[0].id;
                console.log('登录人员ID', this.routerParam.userId);
                let param = this.routerParam;
                console.log(param)
                ipc.invoke(ipcApiRoute.loginRouter, {
                  width: 1800, height: 1500, setResizable: true,
                  minWidth: 1300, minHeight: 1100,
                  content: this.routerInfo.content,
                  windowName: this.routerInfo.windowName,
                  windowTitle: this.routerInfo.windowTitle,
                  type: this.routerInfo.type,
                  windowsId: this.currentWindowsId,
                  fullScreenIsAllowed: true,
                  param: JSON.stringify(param),
                }).then(id => {
                  this.routerInfo.childrenWindowId = id;
                });
              }
            } catch (error) {
              console.log('验证失败:', error);
              setTimeout(() => {
                formRef.clearValidate(); // 延迟清除验证错误
              }, 1500); // 3秒后清除
            }
          } else {
            message.error('MAC地址不匹配,请联系管理员');
          }
        }
      )

    },

  }
};
</script>

<style>
.login-container {
  top: 40%;
  left: 80%;
}

@media (max-width: 575px) {
  .ant-form .ant-form-item .ant-form-item-label, .ant-form .ant-form-item .ant-form-item-control {
    max-width: calc(100% - 300px);
  }

}

/* 自定义验证提示样式 */
.ant-form-item-explain {
  width: 400px; /* 固定提示框宽度 */
  white-space: nowrap; /* 防止换行 */
  margin-left: -100px;
}

.login-container {
  /* 固定容器尺寸 */
  width: 400px; /* 表单宽度 */
  height: 300px; /* 表单高度 */
  margin: 20px 0 0 40px; /* 原有外边距 */
  padding: 20px;
  background: #fff; /* 背景色，可选 */
  border-radius: 8px; /* 可选圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 可选阴影 */

  /* 禁用滚动条并防止溢出 */
  overflow: hidden;

  /* 居中表单 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 200px;
  background-color: #007bff;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
  margin-left: 78px;
  margin-top: 5px;
  height: 40px;

}

</style>
