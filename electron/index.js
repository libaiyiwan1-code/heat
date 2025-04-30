const { Application } = require('ee-core');
const { app: electronApp ,dialog } = require("electron");
const Log = require('ee-core/log');
const fs = require('fs');
class Index extends Application {

  constructor() {
    super();
    // electronApp.on('before-quit', () => {
    //   console.log("监听")
    //   this.beforeClose()
    // });
    // this === eeApp;
  }

  /**
   * core app have been loaded
   */
  async ready () {
    // 执行杀毒检查
    // this.performVirusCheck();
    // do some things
    electronApp.commandLine.appendSwitch('enable-webgl');
    electronApp.commandLine.appendSwitch("disable-web-security");
  }
  /**
   * 执行杀毒检查
   */
  // performVirusCheck() {
  //   const binaryFileCheckList = this.getBinaryFileCheckList();
  //   for (let i = 0; i < binaryFileCheckList.length; i++) {
  //     const filePath = binaryFileCheckList[i];
  //     if (!fs.existsSync(filePath)) {
  //       dialog.showErrorBox("启动失败", "应用文件损坏，可能是杀毒软件导致，请关闭杀毒软件在尝试");
  //       // 直接退出应用程序
  //       electronApp.exit(1);
  //       return; // 结束循环
  //     }
  //   }
  // }
  /**
   * 获取二进制文件检查列表
   */
  // getBinaryFileCheckList() {
  //   const dir = [];
  //   // 比如 network-interface 这个包是必须的。
  //   const core = require.resolve("ee-core");
  //   dir.push(core);
  //   return dir;
  // }
  /**
   * electron app ready
   */
  async electronAppReady () {
    // 配置update 服务器


    // do some things
  }

  /**
   * main window have been loaded
   */
  async windowReady () {
    //electron 初始加载的方法.
    // 延迟加载，无白屏
    const winOpt = this.config.windowsOption;
    if (winOpt.show === false) {
      const win = this.electron.mainWindow;
      win.once('ready-to-show', () => {
        win.setResizable(false); // 禁止窗口调整大小
        win.show();
        win.focus();
      })
    }
  }

  /**
   * before app close
   */
  async beforeClose () {

    electronApp.on('window-all-closed', function (event) {
      //...
      if (process.platform !== 'darwin') {
        electronApp.quit()
      }
    })
    // Log.info('退出程序')
    // // do some things
    // electronApp.quit();
  }
}

Index.toString = () => '[class Index]';
module.exports = Index;