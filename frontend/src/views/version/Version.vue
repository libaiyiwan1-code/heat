 <template>
  <div class="page">
    <!-- 标题栏 -->
    <custom-title-bar
      :page="'version'"
      :isMaximized="true"
      @minimize-window="handleMinimizeWindow"
      @close-window="handleCloseWindow"
      @toggle-maximize="handleToggleMaximize"
    />

    <a-modal
      :visible="updateState.visible"
      :footer="null"
      width="420px"
      centered
      class="update-modal"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
    >
      <div class="update-box">

        <!-- 标题 -->
        <div class="title">
          版本更新
        </div>

        <!-- 状态区 -->
        <div class="status">

          <!-- checking -->
          <template v-if="updateState.status === 'checking'">
            <a-spin size="large"/>
            <div class="text">正在检查版本...</div>
          </template>

          <!-- available -->
          <template v-else-if="updateState.status === 'available'">
            <div class="icon download">⬇</div>
            <div class="text">
              发现新版本
            </div>
            <div class="sub">
              V{{ updateState.targetVersion }}
            </div>

            <a-button type="primary" block @click="startDownload">
              立即下载
            </a-button>
          </template>

          <!-- progress -->
          <template v-else-if="updateState.status === 'progress'">
            <div class="icon loading">⏳</div>
            <div class="text">
              下载中 {{ updateState.percent }}%
            </div>

            <!-- 可以加取消按钮 -->
            <a-button type="default" block @click="handleCancelUpdate">
              取消下载
            </a-button>

            <a-progress
              :percent="Number(updateState.percent)"
              status="active"
            />
          </template>

          <!-- downloaded -->
          <template v-else-if="updateState.status === 'downloaded'">
            <div class="icon success">✔</div>
            <div class="text">下载完成</div>

            <a-button type="primary" block @click="installUpdate">
              立即安装
            </a-button>
          </template>

          <!-- error -->
          <template v-else-if="updateState.status === 'error'">
            <div class="icon error">✖</div>
            <div class="text error-text">更新失败</div>
          </template>

        </div>

      </div>
    </a-modal>


    <div class="version-container">
      <!-- 标题 -->
      <a-typography-title :level="4">
        版本记录信息
      </a-typography-title>

      <!-- 列表 -->
      <a-list
        :data-source="versionList"
        :grid="{ gutter: 16, column: 1 }"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card
              :bordered="false"
              class="version-card"
              :class="{ latest: item.is_latest }"
            >
              <!-- 头部 -->
              <div class="header">
                <div class="left">
                  <!-- 版本 + 日期 -->
                  <div class="version-wrap">
                    <span class="version">
                      V{{ item.versionCode }}
                    </span>

                    <div class="date">
                      {{ formatDate(item.createAt) }}
                    </div>
                  </div>

                  <a-tag style="margin-top: -20px;margin-left: 20px" v-if="item.is_latest"
                         color="blue">
                    最新版本
                  </a-tag>
                  <a-tag style="margin-top: -20px;margin-left: 20px" v-if="currentVersion === item.versionCode"
                         color="green">
                    当前版本
                  </a-tag>
                  <!--                  <a-tag v-if="item.hasRisk" color="red">-->
                  <!--                    有隐患-->
                  <!--                  </a-tag>-->
                </div>

                <a-button
                  type="default"
                  size="small"
                  :disabled="isReplaceDisabled(item)"
                  @click="handleReplace(item)"
                >
                  替换版本
                </a-button>
              </div>

              <!-- 更新内容 -->
              <div class="block">
                <div class="label" style="font-size: 20px; font-weight: 1200; color: #222;">更新内容</div>

                <div class="text-box">
                  {{ formatMultiline(item.releaseNote) }}
                </div>
              </div>

              <!-- 隐患 -->
              <!--              <div-->
              <!--                class="block"-->
              <!--                :class="{ danger: item.hasRisk }"-->
              <!--              >-->
              <!--                <div class="label">隐患</div>-->

              <!--                <div-->
              <!--                  v-if="item.hasRisk === 0"-->
              <!--                  class="empty-text"-->
              <!--                >-->
              <!--                  无隐患-->
              <!--                </div>-->

              <!--                <div-->
              <!--                  v-else-->
              <!--                  class="text-box danger-text"-->
              <!--                >-->
              <!--                  {{ formatMultiline(item.riskDesc) }}-->
              <!--                </div>-->
              <!--              </div>-->
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script>
import {message, Modal} from "ant-design-vue";
import CustomTitleBar from "@/views/device/CustomTitleBar.vue";
import {ipc} from "@/utils/ipcRenderer";
import {useRoute} from "vue-router";
import {getAllVersionList} from "@/components/global/productdb";
import moment from "moment";

const Log = require("ee-core/log");


export default {
  name: "Version",
  components: {CustomTitleBar},

  data() {
    return {
      versionList: [],
      modelCode: null,
      ignoreProgress: false, // 是否忽略下载进度（用户取消后可能会有残留进度消息）
      isWaitingForCleanup: false,  //  等待清理标志
      cleanupTimer: null,           //定时器
      currentVersion: undefined,
      updateState: {
        visible: false,
        status: '', // checking | available | progress | downloaded | error
        percent: 0,
        targetVersion: ''

      }
    };
  },

  created() {
    this.modelCode = this.$route.query.modelCode;
    this.currentVersion = this.$route.query.currentVersion;
    console.log("当前版本：", this.$route.query.currentVersion)
    this.initMockData();
    console.log(this.versionList)
  },
  mounted() {
    // 监听主进程的更新交互消息 检查版本--》发现版本--》下载进度--》下载完成
    ipc.on('update_message', (event, data) => {
      this.handleUpdateMessage(data)
    })
  },

  beforeUnmount() {
    ipc.removeListener('update_message', this.handleUpdateMessage);
    //  清理定时器
    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
    }
  },

  methods: {
    handleMinimizeWindow() {
      ipc.send("minimize-window");
    },
    handleCloseWindow() {
      ipc.send("close-window");
    },
    handleToggleMaximize() {
      ipc.send("toggle-maximize");
    },
    startDownload() {
      // 重置忽略标志，确保能接收新的进度消息
      this.ignoreProgress = false;
      // 可选：重置更新状态，避免残留
      this.updateState.percent = 0;
      ipc.send('start_download');
    },

    installUpdate() {
      ipc.send('install_update')
    },
    async initMockData() {

      const route = useRoute();
      let result = await getAllVersionList(route.query.model)
      console.log(result)
      let list = result.map((item, index) => ({
        id: index + 1,
        versionCode: item.versionCode,
        createAt: item.createAt,
        releaseNote: item.releaseNote || "",
        hasRisk: item.hasRisk,
        riskDesc: item.riskDesc || "",
      }));
      this.versionList=list
      if (this.versionList){
        this.versionList[0].is_latest = true
      }
    },

    // 文本处理（保留换行）
    formatMultiline(text) {
      if (!text) return "";
      return text
        .split(",")          // 👉 按逗号切
        .map(i => i.trim()) // 去空格
        .filter(i => i)     // 去空项
        .join("\n");        // 👉 换行
    },

    // 日期格式化
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = moment(dateStr, 'YYYY-MM-DD HH:mm:ss',true);
      return date.format('YYYY-MM-DD HH:mm:ss');
    },

    // 判断替换按钮是否禁用
    isReplaceDisabled(item) {


      // 如果当前软件版本与列表中的版本一致，禁用
      if (this.currentVersion && item.versionCode === this.currentVersion) {
        return true;
      }

      // // 3. 等待清理期间禁用
      // if (this.isWaitingForCleanup) {
      //   return true;
      // }

      return false;
    },


    //取消下载
    handleCancelUpdate() {
      if (this.updateState.status === 'progress') {
        ipc.send('cancel_download');
        message.warning('已取消下载');
        this.ignoreProgress = true;
        // 关闭弹窗
        this.updateState.visible = false;
        // 重置状态
        this.updateState.status = '';
        this.updateState.percent = 0;
        this.updateState.targetVersion = '';
        // ⭐ 进入等待状态，15秒内不能点击替换版本
        this.isWaitingForCleanup = true;

        // 清除之前的定时器
        if (this.cleanupTimer) {
          clearTimeout(this.cleanupTimer);
        }

        // 设置15秒定时器
        this.cleanupTimer = setTimeout(() => {
          this.isWaitingForCleanup = false;
          this.cleanupTimer = null;
          // message.info('可以重新切换版本了');
        }, 15000);
      } else {
        this.updateState.visible = false;
      }
    },
    // 替换版本
    handleReplace(item) {
      if (this.isWaitingForCleanup) {
        message.warning('上次下载任务取消中，请稍后再试');
        return;
      }
      Modal.confirm({
        title: `确认切换到版本 V${item.versionCode}？`,
        content: "切换后将进入更新界面",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.doReplace(item);
        },
      });
    },

    async doReplace(item) {
      console.log("切换版本：", item.versionCode);
      this.updateState.visible = true
      this.updateState.status = 'checking'
      this.updateState.targetVersion = item.versionCode
      const success = await ipc.invoke(
        'select_version_update',
        item.versionCode
      )
      if (!success) {
        message.error('切换更新源失败')
        this.updateState.visible = false
      }

    },

    /**
     * 处理主进程更新周期的消息
     1. checking: 正在检查版本
     2. available: 发现新版本
     3. downloading: 下载中，包含下载进度
     4. downloaded: 下载完成
     5. error: 更新过程中发生错误
     * */
    handleUpdateMessage(data) {
      console.log('收到主进程更新消息:', data)
      if (data.type === 'available') {
        Modal.confirm({
          title: '发现替换版本，是否下载？',
          okText: '立即下载',

          cancelButtonProps: {style: {display: 'none'}}, // ❗隐藏取消按钮
          closable: false,        // ❗去掉右上角 X
          maskClosable: false,    // ❗点遮罩不能关闭
          keyboard: false,        // ❗禁用 ESC

          onOk: () => ipc.send('start_download')
        })
      }
      if (data.type === 'cancelled') {
        // 回退 UI
        Log.info('用户取消了下载')

        this.$nextTick(() => {
          // 重置所有状态
          this.updateState.percent = 0;
          this.updateState.targetVersion = '';
          this.updateState.status = '';
          this.updateState.visible = false;  // ⭐ 关键：关闭弹窗
          this.ignoreProgress = false;       // ⭐ 关键：重置忽略标志
        });
      }
      if (data.type === 'checking') {
        this.updateState.status = 'checking'
      }
      if (data.type === 'progress' && !this.ignoreProgress) {
        this.updateState.status = 'progress'
        this.updateState.percent = data.percent
      }
      if (data.type === 'downloaded') {
        this.updateState.status = 'downloaded'
        Modal.confirm({
          title: '下载完成，是否安装？',
          okText: '立即安装',
          cancelButtonProps: {style: {display: 'none'}}, // ✅ 隐藏取消按钮
          closable: false, // ❗右上角X也去掉
          maskClosable: false, // ❗点击遮罩也不能关
          onOk: () => ipc.send('install_update')
        })
      }

      if (data.type === 'error') {
        // 发生错误时，立即解除按钮限制
        this.isWaitingForCleanup = false;

        // 清理定时器
        if (this.cleanupTimer) {
          clearTimeout(this.cleanupTimer);
          this.cleanupTimer = null;
        }

        console.log('更新错误:', data.message);

        // 如果弹窗还在显示，关闭它
        if (this.updateState.status === 'progress') {
          this.updateState.visible = false;
          this.updateState.status = '';
          this.updateState.percent = 0;
        }
      }
    }

  },
};
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.version-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f2f3f5;
}

/* 卡片 */
.version-card {
  border-radius: 12px;
  padding: 16px 18px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.version-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* 当前版本 */
.version-card.latest {
  border: 1px solid #1677ff;
}

/* 头部 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
}

/* 版本+日期 */
.version-wrap {
  display: flex;
  flex-direction: column;
  margin-right: 12px;
}

.version {
  font-size: 18px;
  font-weight: 600;
  color: #1677ff;
}

.date {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

/* 标签 */
.header .ant-tag {
  margin-right: 6px;
}

/* 内容块 */
.block {
  margin-top: 16px;
}

/* 标题 */
.label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

/* 文本框（核心） */
.text-box {
  background: #f7f8fa;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-line;
  max-height: 120px;
  overflow-y: auto;
}

/* 风险块 */
.block.danger .text-box {
  background: #fff2f0;
  color: #cf1322;
  border: 1px solid #ffccc7;
}

/* 无隐患 */
.empty-text {
  font-size: 12px;
  color: #999;
}

.update-modal .ant-modal-content {
  border-radius: 12px;
  padding: 0;
}

/* 整体容器 */
.update-box {
  padding: 24px 20px;
  text-align: center;
  min-height: 260px; /* 👉 关键：统一高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 标题 */
.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 状态区 */
.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* 主文本 */
.text {
  font-size: 14px;
  color: #333;
}

/* 次文本 */
.sub {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

/* 图标（简单但有效） */
.icon {
  font-size: 28px;
}

/* 状态颜色 */
.icon.success {
  color: #52c41a;
}

.icon.error {
  color: #ff4d4f;
}

.icon.download {
  color: #1677ff;
}

.icon.loading {
  color: #faad14;
}

/* 错误文字 */
.error-text {
  color: #ff4d4f;
}

.ant-progress-inner {
  border-radius: 6px;
}

.icon.loading {
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}
</style>
