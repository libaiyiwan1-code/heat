<template>
  <a-table :columns="column" :data-source="data" style="width: 100%">
    <template #operation="{record}">
      <a-button type="primary" size="small" style="width: 100px; margin-right: 10px; background-color: greenyellow"
                @click="handleSave('save')">新增用户
      </a-button>
      <a-button type="primary" size="small" style="width: 100px; margin-right: 10px; background-color: blue "
                @click="edit(record)">修改状态
      </a-button>
      <a-button type="primary" size="small" style="width: 100px; margin-right: 10px; background-color: darksalmon "
                @click="editUser(record)">修改数据
      </a-button>
      <a-button type="primary" danger="true" size="small" style="width: 100px; margin-right: 10px"
                @click="deleteUser(record)">删除数据
      </a-button>
      <a-button type="primary" danger="true" size="small"
                style="width: 90px; margin-right: 100px;background-color: chocolate"
                @click="newWindow(0)">打开新窗口
      </a-button>

      <a-button type="primary" danger="true" size="small"
                style="width: 150px; margin-right: 300px;background-color: darkkhaki"
                @click="sendMessageToTwoWindow(record)">向子窗口发消息
      </a-button>
    </template>
  </a-table>
  <div>
    <a-modal
      v-model:visible="modeVisible"
      :title='title' @ok="updateUserCommit" @cancel="modalCancel">
      <a-form :model="formData" ref="form">
        <a-form-item label="名称">
          <a-input v-model:value="formData.name"/>
        </a-form-item>
        <a-form-item label="年龄">
          <a-input v-model:value="formData.age"/>
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="formData.phone"/>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="formData.status" placeholder="请选择用户状态">
            <a-select-option v-for="status in statusList" :key="status" :value="status">{{ status }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script>
import axios from 'axios';
import {message} from "ant-design-vue";
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute, specialIpcRoute} from "@/api/main";
import {toRaw} from "vue";


export default {
  name: 'User',
  data() {
    return {
      column: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: "年龄",
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '手机',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '操作列',
          key: 'operation',
          slots: {customRender: 'operation'},
        },
      ],
      data: [],
      formData: {},
      modeVisible: false,
      statusList: ['G了', '活着'],
      title: "",
      // 打开子窗口的路由
      views: [
        {
          type: 'vue',
          content: '#/special/userIpcRenderer',
          windowName: 'window-user-ipc-1',
          windowTitle: 'ipc user window new'
        },
      ],
      newWcId: 0,
    }
  },
  mounted() {
    this.initTable();
    this.initMainIpc();
  },
  methods: {
    initMainIpc() {
      // 渲染进程步入初始化
      // 移除之前可能已经添加的针对 ipcSendMsg 事件的监听器先移除旧的监听器 避免重复监听
      ipc.removeAllListeners(ipcApiRoute.ipcSendMsg)
      //添加一个针对 ipcSendMsg 事件的监听器。 ipc.on:监听 channel, 当新消息到达，将通过 listener(event, args...) 调用 listener。
      // 当主进程接收到来自渲染进程的 ipcSendMsg 事件时,这个监听器中的回调函数将被执行。在这个回调函数中，
      // 会输出 result,并将其赋值给 this.messageString。然后,它通过 event.sender.send(ipcApiRoute.hello, 'electron-egg');
      // 向渲染进程发送一个名为 hello 的 IPC 消息。
      ipc.on(ipcApiRoute.ipcSendMsg, (event, result) => {
        console.log('[userIpcRennpmderer] [ipcMessageStart] result:', result);
        this.messageString = result;
        // 测试  渲染进程像渲染进程 发送hello.
        event.sender.send(ipcApiRoute.hello, 'electron-egg');
      })

      // 监听 user 窗口2 发来的消息  监听之前先删除
      ipc.removeAllListeners(specialIpcRoute.userWindow2ToWindow1);
      ipc.on(specialIpcRoute.userWindow2ToWindow1, (event, arg) => {
        //消息提示 监听 其它渲染进程sendTo方法
        this.$message.info(arg);
      })

    },
    initTable() {
      // 从 API 获取数据
      axios.get("http://192.168.0.49:8082/user/list")
        .then(result => {
            this.data = result.data.map(item => ({
              key: item.id,
              name: item.name,
              age: item.age,
              phone: item.phone,
              status: item.status
            }));
            alert('加载成功')
          }
        )

        .catch(err => {
          console.log(err);
        });

    },
    edit(record) {
      console.log(record)
      axios.put("http://192.168.0.49:8082/user/status/update?status=" + record.status + "&id=" + record.key)
        .then(res => {
          // 处理响应
          message.info('修改成功');
          this.initTable();
        })
        .catch(err => {
          // 处理错误
          console.error(err);
        });
    },
    deleteUser(record) {
      axios.delete("http://192.168.0.49:8082/user/delete?id=" + record.key)
        .then(res => {
          // 处理响应
          message.info('删除成功');
          this.initTable();
        })
        .catch(err => {
          // 处理错误
          console.error(err);
        });
    },
    editUser(record) {
      this.modeVisible = true
      this.formData = Object.assign({}, record)
      // this.formData= record
    },
    updateUserCommit() {
      axios.put("http://192.168.0.49:8082/user/update", {
        id: this.formData.key,
        name: this.formData.name,
        age: this.formData.age,
        phone: this.formData.phone,
        status: this.formData.status
      })
        .then(res => {
          // 处理响应
          message.info("更新成功");
          this.initTable();
        })
        .catch(err => {
          // 处理错误
          console.error(err);
        });


      this.modeVisible = false
    },
    modalCancel() {
      this.formData = {};
      this.title = "修改用户"
      this.modeVisible = false
    },

    handleSave() {
      this.formData = {};
      this.title = "新增用户"
      this.modeVisible = true
    },
    newWindow(index) {
      //渲染进程像主进程发送消息,通道是新创建的窗口 ,参数是创建的新的页面路由
      ipc.invoke(ipcApiRoute.createWindow, toRaw(this.views[index]))
        .then(id => {
          console.log('[createUserWindowNew] id:', id);
        }).catch(err => {
        console.log('createUserWindowNew error=>', err)
      });
    },

    //异步发送消息
    async sendMessageToTwoWindow(row) {
      // 新窗口id
      //解析  获取其它渲染窗口的id
      this.newWcId = await ipc.invoke(ipcApiRoute.getWCid, this.views[0].windowName);
      ipc.sendTo(this.newWcId, specialIpcRoute.userWindow1ToWindow2, '主窗口发送消息: ' +
        '{  用户名称:' + row.name +
        '\n用户年龄: ' + row.age +
        '\n用户状态:' + row.status +
        '\n用户手机号:' + row.phone +
        '\n}');
    },

  }
}
</script>
