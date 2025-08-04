const {Application} = require('ee-core');
const {nativeTheme, app: electronApp, dialog, BrowserWindow} = require("electron");
const Log = require('ee-core/log');
const fs = require('fs');

class Index extends Application {
    constructor() {
        super();
    }

    /**
     * core app have been loaded
     */
    async ready() {
        electronApp.commandLine.appendSwitch('enable-webgl');
        electronApp.commandLine.appendSwitch("disable-web-security");
    }

    /**
     * electron app ready
     */
    async electronAppReady() {
        // 在创建窗口时设置标题栏样式
        const winOpt = this.config.windowsOption;

    }

    /**
     * main window have been loaded
     */
    async windowReady() {
        const win = this.electron.mainWindow;
        win.openDevTools()
        if (this.config.windowsOption.show === false) {
            win.once('ready-to-show', () => {
                win.setResizable(true);
                win.show();
                win.focus();
            });
        }

        // 主进程第一个页面 IPC 监听窗口工具
        win.webContents.on('ipc-message', (event, channel, ...args) => {
            const currentWindow = win;
            if (channel === 'minimize-window') {
                currentWindow.minimize();
            } else if (channel === 'toggle-maximize') {
                if (currentWindow.isMaximized()) {
                    currentWindow.unmaximize();
                    currentWindow.webContents.send('window-is-maximized', true);
                } else {
                    currentWindow.maximize();
                    currentWindow.webContents.send('window-is-maximized', false);
                }
                win.webContents.send('maximize-change', currentWindow.isMaximized());
            } else if (channel === 'close-window') {
                currentWindow.close();
            }

        });


    }

    /**
     * before app close
     */
    async beforeClose() {
        electronApp.on('window-all-closed', function (event) {
            if (process.platform !== 'darwin') {
                electronApp.quit();
            }
        });
    }
}

Index.toString = () => '[class Index]';
module.exports = Index;