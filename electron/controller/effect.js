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
const {screen} = require('electron');
const os = require('os');
const {exec} = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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
     *获取软件版本，渲染应用title使用。
     *
     * */
    getVersion() {
        Log.info('版本：：：',this.config.version)
        return this.config.version
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
        const {
            width, height, content, windowName, windowTitle, param, type,
            windowsId, setResizable = false, minWidth, minHeight, fullScreenIsAllowed = false
        } = args;
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
            Log.info(param);
            const queryString = new URLSearchParams(JSON.parse(param)).toString();
            contentUrl = `${addr + content}?${queryString}`;
            Log.info(contentUrl);
            Log.info(queryString);
        } else {
            // some
        }
        console.log('contentUrl: ', contentUrl);
        let opt = {
            title: windowTitle,
            minWidth,
            minHeight,
            frame: false,
            titleBarStyle: 'hidden',
        }
        const win = Addon.get('window').create(windowName, opt);
        const winContentsId = win.webContents.id;
        win.setSize(width, height);
        win.setResizable(setResizable);
        if (fullScreenIsAllowed) {
            const {bounds} = screen.getPrimaryDisplay();
            win.setBounds(bounds);
        } else {
            win.setSize(width, height);
        }
        // load page
        win.loadURL(contentUrl);
        win.center();
        win.show();
        win.focus();
        // win.openDevTools();
        win.webContents.on('ipc-message', (event, channel, ...args) => {
            const currentWindow = win;
            //channel 接收主进程的操作通知。
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
        win.on('resize', () => {
            const isMaximized = !win.isMaximized();
            win.webContents.send('window-is-maximized', isMaximized);
        });

        // 将窗口引用保存到数组中
        // windows.push(win);
        // win.webContents.openDevTools()   //控制台
        // 关闭当前主窗口
        // const mainWindow = CoreWindow.getMainWindow();
        // mainWindow.close();

        // 关闭指定 ID 的窗口
        const allWindows = BrowserWindow.getAllWindows();
        allWindows.forEach((window) => {
            if (window.webContents.id === windowsId) {
                window.close();
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

    getMacAddress() {
        const networkInterfaces = os.networkInterfaces();
        Log.info('networkInterfaces:', networkInterfaces)
        console.log(networkInterfaces)
        const ethAdapter = networkInterfaces['以太网'] || [];
        console.log(ethAdapter)
        Log.info(ethAdapter)
        let macAddr = ethAdapter.find(info => info.family === 'IPv4')?.mac;
        if (macAddr === undefined || macAddr === null) {
            macAddr = ethAdapter.find(info => info.family === 'IPv6')?.mac;

        }
        Log.info(macAddr)
        return macAddr || '';
    }

    async getCpuIdentifier() {
        try {
            //  获取 CPU 处理器 ID
            const {stdout} = await execPromise('wmic cpu get ProcessorId');
            const lines = stdout.trim().split('\n');
            let identifier = '';

            if (lines.length > 1) {
                identifier = lines[1].trim();
                if (identifier) {
                    Log.info(`当前 CPU 处理器 ID: ${identifier}`);
                    return identifier;
                }
            }

            //  获取 BIOS 序列号
            const {stdout: biosStdout} = await execPromise('wmic bios get serialnumber');
            identifier = biosStdout.trim().split('\n')[1].trim();
            if (identifier) {
                Log.info(`回退 BIOS 序列号: ${identifier}`);
                return identifier;
            }

            Log.error('未找到 CPU 或 BIOS 标识符');
            return null;
        } catch (err) {
            Log.error(`获取 CPU 标识符时出错: ${err.message}`);
            return null;
        }
    }


}

EffectController.toString = () => '[class EffectController]';
module.exports = EffectController;  