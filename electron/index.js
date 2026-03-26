const {Application} = require('ee-core');
const {nativeTheme,  dialog, BrowserWindow, app, crashReporter} = require("electron");
const Log = require('ee-core/log');
const fs = require('fs');
const {join} = require("path");
const path = require('path');
const {initUpdater} = require("./update/update");
// const { initUpdater } = require('./update/update')

/**
 * electron 生命周期
 * electron-egg 启动顺序：
 * constructor -> ready() -> electronAppReady() -> windowReady()
 *
 * */
class Index extends Application {
    constructor() {
        super();
        // 7.8GB JS堆
        app.commandLine.appendSwitch('js-flags', '--max-old-space-size=8048');
        // 禁用渲染器辅助功能 禁用 Windows UI 自动化/ 无障碍****************** 解决 UIAutomationCore.dll 插件干扰的关键
        app.commandLine.appendSwitch('disable-renderer-accessibility');
        app.commandLine.appendSwitch('no-sandbox');
        // 禁用硬件加速
        app.disableHardwareAcceleration();
        // -----------------------------
        // Chromium 内置功能 / 插件
        // -----------------------------'
        app.commandLine.appendSwitch('force-color-profile', 'srgb'); // 强制使用 sRGB 色彩配置文件
        app.commandLine.appendSwitch('disable-plugins'); // 禁用所有插件
        app.commandLine.appendSwitch('disable-extensions'); // 禁用所有扩展
        app.commandLine.appendSwitch('disable-translate'); // 禁用翻译功能
        app.commandLine.appendSwitch('disable-sync'); // 禁用同步服务
        app.commandLine.appendSwitch('disable-background-networking'); // 禁用后台网络请求
        app.commandLine.appendSwitch('disable-renderer-backgrounding'); // 禁用后台渲染限制
        app.commandLine.appendSwitch('disable-client-side-phishing-detection'); // 禁用钓鱼检测
        app.commandLine.appendSwitch('disable-component-update'); // 禁用组件更新
        app.commandLine.appendSwitch('disable-breakpad'); // 禁用崩溃上报
        app.commandLine.appendSwitch('no-default-browser-check'); // 禁止默认浏览器检查
        app.commandLine.appendSwitch('no-first-run'); // 禁止首次运行提示
        app.commandLine.appendSwitch('disable-background-timer-throttling'); // 禁止后台计时器限制
        app.commandLine.appendSwitch('disable-renderer-backgrounding'); // 禁止渲染器后台限制
        app.commandLine.appendSwitch('disable-features', 'Translate,BackForwardCache,MediaSessionService'); // 禁用特定特性
        app.commandLine.appendSwitch('disable-gpu'); // 禁用 GPU 渲染
        app.commandLine.appendSwitch('disable-speech-api'); // 禁用语音识别 API
        app.commandLine.appendSwitch('disable-device-orientation'); // 禁用设备方向 API
        app.commandLine.appendSwitch('disable-geolocation'); // 禁用地理位置服务
        app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
        app.commandLine.appendSwitch('disable-canvas-aa'); // 禁用 Canvas 抗锯齿
        app.commandLine.appendSwitch('disable-2d-canvas-clip-aa'); // 禁用 2D Canvas 剪裁抗锯齿
        app.commandLine.appendSwitch('disable-site-isolation-trials'); // 禁用站点隔离
        app.commandLine.appendSwitch('disable-features', 'AccessibilityObjectModel'); // 禁用无障碍对象模型
        // -----------------------------
        // 网络 / 多媒体
        // -----------------------------
        app.commandLine.appendSwitch('disable-web-security'); // 可选，禁用 CORS 等
        app.commandLine.appendSwitch('disable-notifications'); // 禁用通知
        app.commandLine.appendSwitch('disable-media-session-service'); // 禁用多媒体会话
        app.commandLine.appendSwitch('disable-features', 'HardwareMediaKeyHandling');
        app.commandLine.appendSwitch('disable-features', 'MediaSessionService');
        app.commandLine.appendSwitch('disable-features', 'AudioServiceOutOfProcess');
        app.commandLine.appendSwitch('disable-background-timer-throttling');
        app.commandLine.appendSwitch('disable-ipc-flooding-protection');
        // 禁用 Electron 的辅助功能支持
        // ready 后禁用辅助功能支持
        app.once('ready', () => {
            app.accessibilitySupportEnabled = false;
        });
        // 定义崩溃日志目录
        app.on('child-process-gone', (event, details) => {
            Log.error('[child-process-gone]', details);
        });
        // GPU 进程崩溃监听
        app.on('gpu-process-crashed', (event, kill) => {
            Log.error('[gpu-process-crashed]', kill);
            this.logCrash('gpu-process-crashed', `kill: ${kill}`);
        });
        // 主进程异常监听
        process.on('uncaughtException', (err) => {
            Log.error('Uncaught Exception:', err);
            this.logCrash('uncaughtException', err.stack || err);
        });

        // 未处理 Promise 异常监听
        process.on('unhandledRejection', (reason) => {
            Log.error('Unhandled Rejection:', reason);
            this.logCrash('unhandledRejection', reason?.stack || reason);
        });

        // 应用退出监听
        process.on('exit', (code) => {
            Log.warn(`Process exit with code: ${code}`);
            this.logCrash('processExit', `exit code: ${code}`);
        });

        // 信号监听
        ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(sig => {
            Log.warn(`Listening for signal: ${sig}`);
            process.on(sig, () => this.logCrash('signal', sig));
        });

        // 模拟崩溃测试
        app.whenReady().then(() => {
            // this.createWindow();
            const crashesDir = 'D:\\crashes';
            try {
                if (!fs.existsSync(crashesDir)) {
                    fs.mkdirSync(crashesDir, {recursive: true});
                    Log.warn(`创建崩溃日志目录：${crashesDir}`);
                }
                fs.accessSync(crashesDir, fs.constants.W_OK);
                Log.warn(`确认写入权限：${crashesDir}`);
                app.setPath('crashDumps', crashesDir); // 设置崩溃日志路径
            } catch (err) {
                console.error(`无法访问/创建崩溃日志目录：${err}`);
                const fallbackDir = join(app.getPath('userData'), 'crashes');
                if (!fs.existsSync(fallbackDir)) {
                    fs.mkdirSync(fallbackDir, {recursive: true});
                }
                Log.warn(`使用备用崩溃日志目录：${fallbackDir}`);
                app.setPath('crashDumps', fallbackDir);
            }

            crashReporter.start({
                productName: 'cegongji-productName',
                companyName: 'cegongji-companyName',
                uploadToServer: false,
                compress: true,
            });

            Log.warn(`crash path：${app.getPath('crashDumps')}`);
            // setTimeout(() => {
            //     Log.warn('模拟process.crash()');
            //     process.crash();
            // }, 6000);
        });
    }

    /**
     * core app have been loaded
     */
    async ready() {
        app.commandLine.appendSwitch('enable-webgl');
        app.commandLine.appendSwitch("disable-web-security");
    }

    /**
     * electron app ready
     */
    async electronAppReady() {
        console.log('electronAppReady');
        try {
            const pkgPath = path.join(app.getAppPath(), 'package.json');
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

            this.config.version = pkg.version;

            console.log('read package.json version and set app version:', this.config.version);
        } catch (err) {
            console.error('读取 package.json 失败:', err);

            this.config.version = app.getVersion();
        }

        // 在创建窗口时设置标题栏样式
        const winOpt = this.config.windowsOption;

    }

    /**
     * main window have been loaded
     */
    async windowReady() {
        const win = this.electron.mainWindow;
        // 初始化自动更新
        initUpdater(win);
        // win.openDevTools()
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
    logCrash(type, data) {
        // const logPath = join(__dirname, '../logs/crash.log');
        // const content = `[${new Date().toISOString()}] [${type}] ${data}\n`;
        // fs.appendFileSync(logPath, content, 'utf8');
    }

    /**
     * before app close
     */
    async beforeClose() {
        app.on('window-all-closed', function (event) {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
    }
}

Index.toString = () => '[class Index]';
module.exports = Index;