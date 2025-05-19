<template>
  <div style="margin-top: 35px;margin-left: 40px; ">
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
      <a-form-item label="CPU_ID:"
                   name="macAddr"
                   :rules="[{ required: true, message: '请输入MAC地址' }]"
                   :label-col="{ span: 6 }"
                   :wrapper-col="{ span: 20 }"
      >
        <a-input v-model:value="dataForm.macAddr"
                 style="width: 200px;margin-left: 15px" spellcheck="false" :readonly="true"></a-input>
      </a-form-item>
      <a-form-item
        v-show="this.routerParam.produceMachine === 0"
        label="工单号:"
        name="macAddr"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 20 }"
      >
        <div style="display: inline-flex; align-items: center;">
          <a-select
            placeholder="请选择或输入工单号"
            style="width: 45vw; margin-left: 15px; text-align: left;"
            v-model:value="selectWorkNumber"
            show-search
            allow-clear
            :filter-option="filterWorkNumber"
            :getPopupContainer="trigger => trigger.parentNode"
            :dropdownStyle="{ marginTop: '35px' }"
          >
            <a-select-option v-for="item in this.filteredWorkNumberList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>

          <!-- 刷新按钮 -->
          <a-button
            type="primary"
            @click="handleRefreshWorkNumber"
            style="margin-left: 10px"
          >
            刷新
          </a-button>
        </div>
      </a-form-item>

      <a-form-item style="margin-top: 50px">
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
import {login, queryWorkNosWithUnfinished} from "@/api/remote";
import {sm2} from 'sm-crypto';
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
        token: 'Bearer',
        produceMachine: undefined,
        workNumber:undefined,
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
      selectWorkNumber: undefined,
      filteredWorkNumberList: [],   // 过滤后的工单号列表
      workNumberList: [],
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
    //登录
    const publicKey = '04298364ec840088475eae92a591e01284d1abefcda348b47eb324bb521bb03b0b2a5bc393f6b71dabb8f15c99a0050818b56b23f31743b93df9cf8948f15ddb54'
    const password = sm2.doEncrypt('libaiyiwan1', publicKey, 1)
    login({account: 'libaiyi', password: password}).then((res) => {
      console.log(res)
      if (res.data.code === 200) {
        console.log('登录成功')
        this.routerParam.token = this.routerParam.token + " " + res.data.data
        //获取全部工单号
        this.handleQueryWorkNumberList()
      }

    }).catch((error) => {
      this.$message.error('网络错误,请联系管理员')
      console.log('网络错误,请联系管理员')
    });

  },
  watch: {
    workNumberList: {
      immediate: true,
      handler(val) {
        this.filteredWorkNumberList = val;
      }
    }
  },
  methods: {
    handleRefreshWorkNumber(){
      this.selectWorkNumber=undefined
      this.handleQueryWorkNumberList()
    },
    handleQueryWorkNumberList(){
      queryWorkNosWithUnfinished(this.routerParam.token).then((res) => {
        console.log(res)
        console.log(res.data.data)
        this.workNumberList = res.data.data
          .filter(item => item.workNo !== undefined)
          .map(item => item.workNo);
        if (this.workNumberList.length === 0) {
          this.$message.error('工单获取失败,请联系管理员')
          console.log('工单获取失败,请联系管理员')
        }
      }).catch((error)=>{
        this.$message.error('网络错误,请联系管理员')
        console.log('网络错误,请联系管理员')
      })
    },
    handleSearchInput(value) {
      // 记录当前输入值
      this.tempInput = value;
    },
    filterWorkNumber(input, option) {
      return option.value.toLowerCase().includes(input.toLowerCase());
    },
    async init() {
      this.currentWindowsId = await ipc.invoke(ipcApiRoute.getWCid, this.currentWindowName);
    },
    async login() {
      if (this.routerParam.produceMachine===0){
        if (this.selectWorkNumber===null||this.selectWorkNumber===undefined){
          this.$message.error('请选择工单号')
          return
        }

        //生产验证 工单号是否正确是否为空
      }
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
                this.routerParam.workNumber=this.selectWorkNumber
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
.ant-select-dropdown {
  top: auto !important;
  bottom: auto !important;
  text-align: left !important;
}
</style>
