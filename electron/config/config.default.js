'use strict';

const path = require('path');

/**
 * 默认配置
 */
module.exports = (appInfo) => {

    const config = {};
    /**
     * @author 李柏毅
     * @date 2025年7月15日
     * 应用title 版本号显示 每次打包自己手动定义
     * 规则：
     *      有线：
     *          2.0.001 001累加
     *      无线：
     *          2.1.001 001累加    2.1起 包含VAC系列。
     * */
    config.version = '2.1.006'
    /**
     * 开发者工具
     */
    config.openDevTools = true;

    /**
     * 应用程序顶部菜单
     */
    config.openAppMenu = false;

    /**
     * 主窗口
     */
    config.windowsOption = {
        title: '登录',/*应用头部目前做隐藏,目前在任务栏体现*/
        width: 450,
        height: 460,
        webPreferences: {
            //webSecurity: false,
            contextIsolation: false, // false -> 可在渲染进程中使用electron的api，true->需要bridge.js(contextBridge)
            nodeIntegration: true,
            //preload: path.join(appInfo.baseDir, 'preload', 'bridge.js'),
        },
        frame: false,
        // transparent: true,// 透明窗口
        show: false,
        icon: path.join(appInfo.home, 'build','icons', 'title-759x220.png'),
        // titleBarStyle: 'hidden', // 隐藏默认标题栏

    };

    /**
     * ee框架日志
     */
    config.logger = {
        encoding: 'utf8',
        level: 'INFO',
        outputJSON: false,
        buffer: true,
        enablePerformanceTimer: false,
        rotator: 'day',
        appLogName: 'ee.log',
        coreLogName: 'ee-core.log',
        errorLogName: 'ee-error.log',
        dir: path.join(appInfo.execDir, 'logs'), // 日志目录
    }

    /**
     * 远程模式-web地址
     */
    config.remoteUrl = {
        enable: false,
        url: 'http://electron-egg.kaka996.com/'
    };

    /**
     * 内置socket服务
     */
    config.socketServer = {
        enable: false,
        port: 7070,
        path: "/socket.io/",
        connectTimeout: 45000,
        pingTimeout: 30000,
        pingInterval: 25000,
        maxHttpBufferSize: 1e8,
        transports: ["polling", "websocket"],
        cors: {
            origin: true,
        }
    };

    /**
     * 内置http服务
     */
    config.httpServer = {
        enable: false,
        https: {
            enable: false,
            key: '/public/ssl/localhost+1.key',
            cert: '/public/ssl/localhost+1.pem'
        },
        host: '127.0.0.1',
        port: 7071,
        cors: {
            origin: "*"
        },
        body: {
            multipart: true,
            formidable: {
                keepExtensions: true
            }
        },
        filterRequest: {
            uris: [
                'tray.ico'
            ],
            returnData: ''
        }
    };

    /**
     * 主进程
     */
    config.mainServer = {
        protocol: 'file://',
        indexPath: '/public/dist/index.html',
    };

    /**
     * Cross-language service
     * 跨语言服务
     * 例如：执行go的二进制程序，默认目录为 ./extraResources/
     */
    config.cross = {
        go: {
            enable: false,
            name: 'goapp',
            args: ['--port=7073'],
            appExit: true,
        },
        python: {
            enable: false,
            name: 'pyapp',
            cmd: './py/pyapp',
            directory: './py',
            args: ['--port=7074'],
            appExit: true,
        },
    };

    /**
     * 硬件加速
     */
    config.hardGpu = {
        enable: true
    };

    /**
     * 异常捕获
     */
    config.exception = {
        mainExit: false,
        childExit: true,
        rendererExit: true,
    };

    /**
     * jobs
     */
    config.jobs = {
        messageLog: true
    };

    /**
     * 插件功能
     */
    config.addons = {
        window: {
            enable: true,
        },
        tray: {
            enable: true,
            title: '海龙马生产软件',
            icon: '/build/icons/tray.ico'
        },
        security: {
            enable: true,
        },
        awaken: {
            enable: true,
            protocol: 'ee',
            args: []
        },
        autoUpdater: {
            enable: true,
            windows: false,
            macOS: false,
            linux: false,
            options: {
                provider: 'generic',
                url: 'http://kodo.qiniu.com/'
            },
            force: false,
        }
    };

    return {
        ...config
    };
}
