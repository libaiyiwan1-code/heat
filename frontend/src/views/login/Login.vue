<template>
  <div style="height: 100vh; overflow: hidden;">
    <!-- 自定义标题栏 -->
    <custom-title-bar
      :page="'login'"
      :isMaximized="true"
      @minimize-window="handleMinimizeWindow"
      @close-window="handleCloseWindow"
    />
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
                     @input="handleUsernameChange()"

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
          <a-input v-model:value="dataForm.macAddr"
                   style="width: 200px;margin-left: 15px" spellcheck="false" :readonly="true"></a-input>
        </a-form-item>
        <a-form-item
          v-show="this.routerParam.produceMachine === 0&&!this.startsWithJ"
          :label="`工单号: (${this.ip==='158'?'演示':'正式'})`"
          :rules="[{
          required: this.routerParam.produceMachine === 0 &&!this.startsWithJ,
          message: '请录入工单号'
        }]"
          name="selectWorkNumber"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 20 }"
        >
          <div style="display: inline-flex; align-items: center;">
            <a-select
              placeholder="请选择或输入工单号"
              style="width: 45vw; margin-left: 15px; text-align: left;"
              v-model:value="dataForm.selectWorkNumber"
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

        <a-form-item style="margin-top: 10px">
          <a-button class="login-button" type="primary" @click="login" html-type="submit">登录</a-button>
        </a-form-item>
        <!--      <a-form-item style="margin-top: 10px">-->
        <!--        <a-button class="login-button" type="primary" @click="printTest" html-type="submit">打印测试</a-button>-->
        <!--      </a-form-item>-->

      </a-form>
    </div>
  </div>
</template>

<script>
import {getUserByUserNameAndPassWork} from '@/components/global/mysqldb.js';
import {message} from 'ant-design-vue';
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";
import {
  findMacAddr,
  getIdByUsername,
  getLatestVersionByModel,
  getCurrentVersionByModelAndVersion,
  getListSupportedModels, findModelVersionSupport, hasAlternativeVersionForModel
} from "@/components/global/productdb";
import {getWorkConfigParam, getWorkDetail, login, queryWorkNosWithUnfinished} from "@/api/remote";
import {sm2} from 'sm-crypto';

const {logger} = require('ee-core/log');
import CustomTitleBar from '../device/CustomTitleBar.vue';
import ip from '@/api/remote';

const Log = require('ee-core/log');
import { Modal } from 'ant-design-vue';
import { h } from 'vue';
import {CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons-vue";

export default {
  components: {
    CustomTitleBar
  },
  data() {
    return {
      ip: ip,
      layout: 'horizontal',
      dataForm: {
        username: 'YP-0',
        password: '0',
        macAddr: undefined,
        // selectWorkNumber:'SJ250516003/JG002',
        selectWorkNumber: undefined,
      },
      messageString: '',
      routerParam: {
        userId: undefined,
        macAddr: undefined,
        machineNumber: undefined,
        token: 'Bearer',
        produceMachine: undefined,
        workNumber: undefined,
        pwd: undefined,
        startsWithJ: false,
        userName: undefined, // 用户名
        currentVersion: undefined, // 当前版本
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
      filteredWorkNumberList: [],   // 过滤后的工单号列表
      workNumberList: [],
      startsWithJ: false,
    };
  },
  computed: {
    workNumberRules() {
      return [{
        required: true,
        message: '请录入工单号'
      }];
    }
  },
  async created() {
    await this.init();
    this.macList = await findMacAddr()
    console.log(this.macList)
    await ipc.invoke(ipcApiRoute.getMacAddress).then(res => {
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
    handleMinimizeWindow() {
      ipc.send('minimize-window');
    },
    handleCloseWindow() {
      ipc.send('close-window');
    },
    handleUsernameChange() {
      this.startsWithJ = this.dataForm.username && this.dataForm.username.trim().toUpperCase().startsWith('J');
    },
    handleRefreshWorkNumber() {
      this.dataForm.selectWorkNumber = undefined
      this.handleQueryWorkNumberList()
    },
    handleQueryWorkNumberList() {
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
      }).catch((error) => {
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
    async printTest() {
      let param = {
        deviceName: 'Argox CP-3140L PPLB',
        address: '12345678',
        date: '生产日期：2025.08',
        craftsmanCaliber: 'DN25',
        commonTraffic: '3.5m³/h',
        flowRange: '(0.07-7)m³/h',
        listDoubleRowLabels: '否',
      }
      await ipc.invoke(ipcApiRoute.printAddressSingleRowLabelWAC330HE, param);
    },
    async login() {
      try {
        const {username, password, selectWorkNumber, macAddr} = this.dataForm;
        const startsWithJ = username?.trim().toUpperCase().startsWith('J');

        let productModel = '';

        // ===== 1. 工单校验 =====
        if (this.routerParam.produceMachine === 0 && !startsWithJ) {
          productModel = await this.validateWorkOrder(selectWorkNumber);
          if (!productModel) return;
        }

        // ===== 2. mac校验 =====
        const mac = await ipc.invoke(ipcApiRoute.getMacAddress);
        if (mac !== macAddr) {
          message.error('MAC地址不匹配,请联系管理员');
          return;
        }

        // ===== 3. 表单校验 =====
        await this.$refs.formRef.validate();

        // ===== 4. 登录校验 =====
        const userRes = await getUserByUserNameAndPassWork(username, password);
        if (!userRes || userRes.length === 0) {
          message.error('账户或密码错误!');
          return;
        }
        let routePath
        // ===== 5. 版本校验 =====
        // productModel = 'WAC300NY' //TODO 测试用 待删除
        if (this.routerParam.produceMachine===0){
           routePath = await this.handleVersionCheck(productModel);
          if (routePath !== null) {
            message.success('登录成功');
          }
        }else{
          routePath = '#/device';
           message.success('登录成功');
        }
        // ===== 6. 路由跳转 =====
        await this.openNewWindow(routePath, username, productModel);

      } catch (err) {
        console.error('login error:', err);
        this.$refs.formRef?.clearValidate();
      }
    },
    async validateWorkOrder(workNumber) {
      if (!workNumber) {
        message.error('请选择工单号');
        return null;
      }

      const res = await getWorkDetail(this.routerParam.token, workNumber);
      const data = res.data;

      if (data.code !== 200) {
        message.error('网络错误请联系管理员');
        return null;
      }

      const model = data.data.productModel;
      if (!model) {
        message.error('产品型号错误，请联系管理员');
        return null;
      }

      const productModel = model.split('-')[0];

      // const list = await getListSupportedModels();
      // const item = list.find(r => model.includes(r.model));

      // if (!item || item.supported !== 0) {
      //   message.error(`型号 ${productModel} 生产软件不支持使用，请联系管理员`);
      //   return null;
      // }

      if (productModel === 'VAC200') {
        const res = await getWorkConfigParam(this.routerParam.token, workNumber);
        if (!res.data.data) {
          message.error('该工单未进行开工配置,请在MES先开工');
          return null;
        }
      }

      return productModel;
    },
    async handleVersionCheck(productModel) {
      //获取当前使用的版本
      const currentVersion = await ipc.invoke(ipcApiRoute.getVersion);
      this.routerParam.currentVersion = currentVersion

      //当前版本支持生产
      const currentVersionInfo = await findModelVersionSupport(productModel,currentVersion);
      console.log('当前版本信息', currentVersionInfo)
      if (!currentVersionInfo) {
        //️ 没有查到当前版本的信息
        message.error(`当前版本:${currentVersion} 无维护信息，请联系管理员`);
        return null;
      }

      //当前版本是否支持生产
      let isSupported = currentVersionInfo.isSupported
      let hasRisk = currentVersionInfo.hasRisk
      //查询是否有可替换的版本
      let hasAlternative = await hasAlternativeVersionForModel(productModel)
      if (!hasAlternative) {
        hasAlternative = 0
      }else{
        hasAlternative = hasAlternative.count
      }
      console.log('是否有可替代版本数量', hasAlternative)
      const supported = isSupported === 0;
      const risk = hasRisk === 1;
      const hasAlt = hasAlternative > 0;
     //  1. 支持 + 无风险 → 直接生产
      if (supported && !risk) {
        // const ok = await this.confirmDialog(
        //   `当前版本:${currentVersion} 支持型号:${productModel}生产`,
        //   'success'
        // );
        return   '#/device'
      }

      //  2. 支持 + 有风险
      if (supported && risk) {
        if (hasAlt) {
          const ok = await this.confirmDialog(
            `当前版本:${currentVersion} ，${productModel}型号存在安全隐患，请替换版本`,
            'warning'
          );
          return ok ? '#/version' : null;
        } else {
          await this.confirmDialog(
            `当前版本:${currentVersion} ，${productModel}存在安全隐患，暂无可替换版本，请联系管理员`,
            'error'
          );
          return null;
        }
      }

     //  3. 不支持
      if (!supported) {
        if (hasAlt) {
          const ok = await this.confirmDialog(
            `当前版本:${currentVersion} 不支持:${productModel}生产，请升级版本`,
            'warning'
          );
          return ok ? '#/version' : null;
        } else {
          await this.confirmDialog(
            `当前版本:${currentVersion} 不支持:${productModel}生产，暂无可替换版本，请联系管理员`,
            'error'
          );
          return null;
        }
      }



      //支持生产
      // if (isSupported === 0) {
      //   //无隐患直接跳转生产页面
      //   if (hasRisk === 0) {
      //     const ok = await this.confirmDialog(
      //       `当前版本:${currentVersion} 支持型号:${productModel}生产`,
      //     'success'
      //     );
      //     if (!ok) return null;
      //
      //     return '#/device';
      //   } else {
      //     if (hasAlternative > 0) {
      //       const ok = await this.confirmDialog(
      //         `当前版本:${currentVersion} ，${productModel}型号存在安全隐患，请替换版本`,
      //         'warning'
      //       );
      //       if (!ok) return null;
      //
      //       return '#/version';
      //     } else {
      //       //无可替换的版本
      //       //️ 没有查到当前版本的信息
      //       const ok = await this.confirmDialog(
      //         `当前版本:${currentVersion} ，${productModel}存在安全隐患，暂无可替换版本，请联系管理员`,
      //         'error'
      //       );
      //       return null;
      //     }
      //   }
      // } else {
      //   //不支持生产
      //   if (hasAlternative > 0) {
      //     const ok = await this.confirmDialog(
      //       `当前版本:${currentVersion} 不支持:${productModel}生产，请升级版本`,
      //       'warning'
      //     );
      //     if (!ok) return null;
      //
      //     return '#/version';
      //   } else {
      //     await this.confirmDialog(
      //       `当前版本:${currentVersion} 不支持:${productModel}生产，暂无可替换版本，请联系管理员`,
      //       'error'
      //     );
      //     return null;
      //   }
      // }

    },
    confirmDialog(content, type = 'info') {
      return new Promise((resolve) => {
        let icon = null;
        let okType = 'primary';
        let title = '提示';

        // 👉 不同类型区分（重点）
        switch (type) {
          case 'success':
            icon = h(CheckCircleOutlined, { style: { color: '#52c41a' } });
            title = '验证成功';
            break;
          case 'warning':
            icon = h(ExclamationCircleOutlined, { style: { color: '#faad14' } });
            title = '风险提示';
            okType = 'primary';
            break;
          case 'error':
            icon = h(CloseCircleOutlined, { style: { color: '#ff4d4f' } });
            title = '禁止操作';
            okType = 'danger';
            break;
          default:
            icon = h(ExclamationCircleOutlined);
        }

        Modal.confirm({
          title,
          icon,
          content: h('div', {
            style: {
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#333'
            }
          }, content),

          okText: '确定',
          cancelText: '取消',
          okType,
          centered: true,
          width: 420,

          okButtonProps: {
            style: {
              borderRadius: '6px',
              height: '36px',
              padding: '0 20px'
            }
          },
          cancelButtonProps: {
            style: {
              borderRadius: '6px',
              height: '36px',
              padding: '0 20px'
            }
          },

          onOk() {
            resolve(true);
          },
          onCancel() {
            resolve(false);
          },
        });
      });
    },
    async openNewWindow(routePath, username, productModel) {
      if (!routePath) return;

      const userInfo = (await getIdByUsername(username))[0];

      // 保留你原来的 routerParam 结构
      this.routerParam.userId = userInfo.id;
      this.routerParam.pwd = userInfo.pwd;
      this.routerParam.userName = username;
      this.routerParam.workNumber = this.dataForm.selectWorkNumber;
      this.routerParam.model = productModel;

      const param = this.routerParam;


      const windowConfig = {
        width: 1800,
        height: 1500,
        setResizable: true,
        minWidth: 1300,
        minHeight: 1100,
        content: routePath,
        windowName: this.routerInfo.windowName,
        windowTitle: this.routerInfo.windowTitle,
        type: this.routerInfo.type,
        windowsId: this.currentWindowsId,
        fullScreenIsAllowed: true,
        param: JSON.stringify(param),
      };

      const id = await ipc.invoke(ipcApiRoute.loginRouter, windowConfig);

      // 保留子窗口ID
      this.routerInfo.childrenWindowId = id;
    }
    ,
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


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
