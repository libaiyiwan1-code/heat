<template>
  <div class="titlebar">
    <div class="titlebar-left">
      <img class="logo" src="@/assets/title-170x40.png" alt="Logo">
      <span class="version">{{ this.productModel}}</span>
    </div>
    <div class="window-controls">
      <button class="min-btn" @click="minimizeWindow"><span class="min-icon">-</span></button>
      <button class="max-btn" @click="toggleMaximize">
        <svg width="36" height="36" viewBox="0 0 24 24">
          <g v-if="!isMaximized">
            <!-- 前层完整方块 -->
            <rect x="6" y="10" width="8" height="8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2" />

            <!-- 后层方块，显示上边、右边，并补齐角落 -->
            <!-- 拆成两段：上边框+右边框，避免隐藏过多 -->
            <path d="M10 6h8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2" />
            <path d="M18 6v8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.2" />
          </g>

          <!-- 普通状态（单个方块） -->
          <rect v-else x="6" y="6" width="12" height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"/>
        </svg>
      </button>



      <button class="close-btn" @click="closeWindow">x</button>
    </div>
  </div>
</template>

<script>
import {ipc} from "@/utils/ipcRenderer";
import {ipcApiRoute} from "@/api/main";

export default {
  name: 'CustomTitleBar',
  props: {
    productModel: {
      type: String,
      default: ''
    },
    isDeviceView: {
      type: Boolean,
      default: false
    },
    page:{
      type:String,
      default :''
    },
    userAccount: {
      type: String,
      default: ''
    },
    isMaximized:{
      type:Boolean,
      default: false
    }
  },
  data() {
    return {
      version: '0.0.0',
    };
  },
  async mounted() {
    this.version = await ipc.invoke(ipcApiRoute.getVersion);
    // 初始检查窗口是否最大化
    // this.isMaximized = await ipc.invoke(ipcApiRoute.isMaximized);


  },
  methods: {
    minimizeWindow() {
      this.$emit('minimize-window');
    },
    toggleMaximize() {
      if (this.page!=='login'){
        this.$emit('toggle-maximize');  // 通知父组件
      }
    },
    closeWindow() {
      this.$emit('close-window');
    },

  }
};
</script>

<style>
.titlebar {
  -webkit-app-region: drag;
  height: 60px;
  background-color: #FF770F;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.titlebar-left {
  display: flex;
  align-items: center;
  -webkit-app-region: drag;
}

.window-controls {

  display: flex;
  align-items: center;
  height: 100%;
}

.min-btn, .max-btn, .close-btn {
  -webkit-app-region: no-drag;
  background: none;
  border: none;
  color: #FFFFFF;
  cursor: pointer;
  width: 30px;
  height: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;/*过度动画*/
  border-radius: 6px; /* 悬浮后轻微圆角  */
}

.min-btn:hover, .max-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background-color: #E81123;
}

.min-icon {
  display: inline-block;
  transform: scale(1.8, 1);
}

.title {
  font-size: 17px;
}

.userID {
  display: inline-block;
  font-size: 15px;
  margin-top: 15px;
}
.user-account {
  margin-right: 40px;
  margin-top: -8px;
}
.logo {
  margin-left: -16px;
}.front {
   left: 0;
   top: 0;
 }

.back {
  left: 5px;
  top: 5px;
  opacity: 0;
}

/* 最大化状态 */
.max-btn.maximized .front {
  left: 5px;
  top: 5px;
}

.max-btn.maximized .back {
  left: 0;
  top: 0;
  opacity: 1;
}
</style>
