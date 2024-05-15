'use strict';

const {Controller} = require('ee-core');
const {dialog, electronApp} = require('electron');
const _ = require('lodash');
const CoreWindow = require('ee-core/electron/window');
const {BrowserWindow} = require('electron');
const Addon = require("ee-core/addon");
const path = require("path");
const binModule = require("../config/bin");
const Ps = require("ee-core/ps");
const Conf = require("ee-core/config");
const Log = require('ee-core/log');
// const windows = []; //保存窗口引用
/**
 * 特效 - 功能demo
 * @class
 */
class EffectController extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    /**
     * 选择文件
     */
    selectFile() {
        const filePaths = dialog.showOpenDialogSync({
            properties: ['openFile']
        });

        if (_.isEmpty(filePaths)) {
            return null
        }

        return filePaths[0];
    }

    /**
     * login window
     */
    loginWindow(args) {
        const {width, height} = args;
        const win = CoreWindow.getMainWindow();

        const size = {
            width: width || 400,
            height: height || 300
        }
        win.setSize(size.width, size.height);
        win.setResizable(true);
        win.center();
        win.show();
        win.focus();
    }

    /**
     * restore window
     */
    restoreWindow(args) {
        const {width, height} = args;
        const win = CoreWindow.getMainWindow();

        const size = {
            width: width || 980,
            height: height || 650
        }
        win.setSize(size.width, size.height);
        win.setResizable(true);
        win.center();
        win.show();

        win.focus();
        //返回子窗口的id
        return win.webContents.id
    }


    // 创建子窗口的函数
    loginRouter(args) {
        // 路由 并创建新的子窗口
        const {width, height, content, windowName, windowTitle, type, windowsId} = args;
        if (windowsId === null || windowsId === undefined) {
            Log.error('router windows id is null');
        }
        let contentUrl = null;
        if (type === 'html') {
            contentUrl = path.join('file://', electronApp.getAppPath(), content)
        } else if (type == 'web') {
            contentUrl = content;
        } else if (type == 'vue') {
            let addr = 'http://localhost:' + binModule.dev.frontend.port
            if (Ps.isProd()) {
                const mainServer = Conf.getValue('mainServer');
                if (Conf.isFileProtocol(mainServer)) {
                    addr = mainServer.protocol + path.join(Ps.getHomeDir(), mainServer.indexPath);
                } else {
                    addr = mainServer.protocol + mainServer.host + ':' + mainServer.port;
                }
            }

            contentUrl = addr + content;
        } else {
            // some
        }
        console.log('contentUrl: ', contentUrl);
        let opt = {
            title: windowTitle,
        }
        const win = Addon.get('window').create(windowName, opt);

        const winContentsId = win.webContents.id;
        win.setSize(width, height);
        win.setResizable(false);
        // load page
        win.loadURL(contentUrl);
        win.center();
        win.show();
        win.focus();
        // 将窗口引用保存到数组中
        // windows.push(win);
        win.webContents.openDevTools()   //控制台
        // 关闭当前主窗口
        // const mainWindow = CoreWindow.getMainWindow();
        // mainWindow.close();
        Log.info('windowsId',windowsId)
        // 关闭指定 ID 的窗口
        const allWindows = BrowserWindow.getAllWindows();
        Log.info('all windows id ：', allWindows.map(window => window.webContents.id));
        allWindows.forEach((window) => {
            if (window.webContents.id === windowsId) {
                Log.info('closed windows id:',window.webContents.id)
                setTimeout(() => {
                    window.close();
                }, 3500)
            }
        });
        // 关闭指定 ID 的窗口
        // const windowToClose = windows.find(window => window.webContents.id === windowsId);
        // if (windowToClose) {
        //     setTimeout(() => {
        //         windowToClose.close();
        //     }, 1500)
        // }

        return winContentsId;
    }

}

EffectController.toString = () => '[class EffectController]';
module.exports = EffectController;  