<template>
  <div id="app-base-subwindow-ipc">
    <div class="one-block-1">
      <span>
        1. 发送异步消息
      </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="handleInvoke">发送 - 回调</a-button>
        结果：{{ message1 }}
      </a-space>
      <p></p>
      <a-space>
        <a-button @click="handleInvoke2">发送 - async/await</a-button>
        结果：{{ message2 }}
      </a-space>
    </div>
    <div class="one-block-1">
      <span>
        <!-- 尽量不要使用，任何错误都容易引起卡死 -->
        2. 同步消息（不推荐，阻塞执行）
      </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="handleSendSync">同步消息</a-button>
        结果：{{ message3 }}
      </a-space>
    </div>
    <div class="one-block-1">
      <span>
        3. 长消息： 服务端持续向前端页面发消息
      </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="sendMsgStart">开始</a-button>
        <a-button @click="sendMsgStop">结束</a-button>
        结果：{{ messageString }}
      </a-space>
    </div>
    <div class="one-block-1">
      <span>
        4. 多窗口通信：窗口之间互相通信
      </span>
    </div>
    <div class="one-block-2">
      <a-space>
        <a-button @click="sendMessageToOneWindow()">向主窗口发消息</a-button>
      </a-space>
    </div>
  </div>
</template>
<script>
import { ipcApiRoute, specialIpcRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';

export default {
  data() {
    return {
      messageString: '',
      message1: '',
      message2: '',
      message3: '',
      mainWCid: 0,
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      // 渲染进程步入初始化
      // 移除之前可能已经添加的针对 ipcSendMsg 事件的监听器先移除旧的监听器 避免重复监听
      ipc.removeAllListeners(ipcApiRoute.ipcSendMsg);
      ipc.on(ipcApiRoute.ipcSendMsg, (event, result) => {
        console.log('[userIpcRenderer] [ipcMessageStart] result:', result);
        this.messageString = result;
        // 监听 ipcSendMsg 管道 发送来消息 进而做其它功能
        //     this.$message.info(arg);
        event.sender.send(ipcApiRoute.hello, 'electron-egg');
      })

      // 监听 user 窗口1 发来的消息  监听之前先删除
      ipc.removeAllListeners(specialIpcRoute.userWindow1ToWindow2);
      ipc.on(specialIpcRoute.userWindow1ToWindow2, (event, arg) => {
        //消息提示 监听 其它渲染进程sendTo方法
        this.$message.info(arg);
      })
    },
    sendMsgStart() {
      const params = {
        type: 'start',
        content: '开始'
      }
      ipc.send(ipcApiRoute.ipcSendMsg, params)
    },
    sendMsgStop() {
      const params = {
        type: 'end',
        content: ''
      }
      ipc.send(ipcApiRoute.ipcSendMsg, params)
    },
    handleInvoke () {
      ipc.invoke(ipcApiRoute.ipcInvokeMsg, '异步-回调').then(r => {
        console.log('r:', r);
        this.message1 = r;
      });
    },
    async handleInvoke2 () {
      const msg = await ipc.invoke(ipcApiRoute.ipcInvokeMsg, '异步');
      console.log('msg:', msg);
      this.message2 = msg;
    },
    handleSendSync () {
      const msg = ipc.sendSync(ipcApiRoute.ipcSendSyncMsg, '同步');
      this.message3 = msg;
    },
    sendMessageToOneWindow () {
      // 获取主窗口id  electron 默认是main 参数
      ipc.invoke(ipcApiRoute.getWCid, 'main').then(id => {
        this.mainWCid = id;
        ipc.invoke(ipcApiRoute.getWCid, 'window-user-ipc-1').then(currentId => {
          ipc.sendTo(this.mainWCid, specialIpcRoute.userWindow2ToWindow1, `子窗口: ${currentId} 向主窗口 发送消息^^~~`);
        });
      });
    },
  }
}
</script>
<style lang="less" scoped>
#app-base-subwindow-ipc {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
