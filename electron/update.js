import { autoUpdater } from 'electron-updater'
import { app, ipcMain } from 'electron'
const log = require('electron-log');

let mainWindow = null;
let u_status = null;    // 软件版本号和检测更新之间的状态值


export function updateHandle(window, feedUrl) {
    mainWindow = window;
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };

    // 设置是否自动下载，默认是true,当点击检测到新版本时，会自动下载安装包，所以设置为false
    autoUpdater.autoDownload = false;

    //设置更新包的地址
    autoUpdater.setFeedURL({
        provider: 'generic',
        url: feedUrl
    });

    // log.info("服务器地址：：", autoUpdater);

    //监听升级失败事件
    autoUpdater.on('error', (error) => {
        if (u_status === false){
            sendUpdateMessage({
                cmd: 'error',
                message: error
            })
        }else if (u_status === true){
            log.info("获取版本号-------------------->");
        }
    });

    //监听开始检测更新事件
    autoUpdater.on('checking-for-update', (info) => {
        // 获取当前版本号
        const currentVersion = autoUpdater.currentVersion.version;

        if (u_status === false){
            sendUpdateMessage({
                cmd: 'checking-for-update',
                // message: message
                // message: `当前版本：${currentVersion}`,
                message: `Current version：${currentVersion}`,
            })
        }else if (u_status === true){
            sendUpdateMessage({
                cmd: 'setVersionNumber',
                // message: message
                message: `${currentVersion}`,
            })
        }
    });

    //监听发现可用更新事件
    autoUpdater.on("update-available", (info) => {
        if (u_status === false){
            sendUpdateMessage({
                cmd: 'update-available',
                // message: message,
                // message: `新版本：${info.version}`,
                message: `New version：${info.version}`,
            })
        }else if (u_status === true){
            log.info("获取版本号-------------------->");
        }
    });

    //监听没有可用更新事件
    autoUpdater.on('update-not-available', (info) => {
        if (u_status === false){
            sendUpdateMessage({
                cmd: 'update-not-available',
                // message: messagefupdate-available
                // message: `当前为最新版本：${info.version}`,
                message: `This is the latest version：${info.version}`,
            })
        }else if (u_status === true){
            log.info("获取版本号-------------------->");
        }
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj) => {
        if (u_status === false){
            sendUpdateMessage({
                cmd: 'download-progress',
                message: progressObj
            })
        }else if (u_status === true){
            log.info("获取版本号-------------------->");
        }

    });

    //监听下载完成事件
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl) => {
        if (u_status === false){
            sendUpdateMessage({
                cmd: 'update-downloaded',
                message: {
                    releaseNotes,
                    releaseName,
                    releaseDate,
                    updateUrl
                }
            })
        }
    });


    //接收渲染进程消息，开始检查更新
    ipcMain.on("checkForUpdate", () => {
        u_status = false;  // 执行检查更新后将状态值赋值为true;
        log.info("检查版本升级状态001 ---------------->", u_status);
        if (u_status === false){
            log.info("检查版本升级状态002 ---------------->", u_status);
            //执行自动更新检查
            autoUpdater.checkForUpdates();

        }else {
            console.log("未升级当前系统");
        }
    });

    // 获取当前系统版本号
    ipcMain.on('getVersionNumber', () =>{
        u_status = true;  // 执行检查更新后将状态值赋值为true;
        log.info("获取当前系统版本号001 ---------------->", u_status);
        if (u_status === true){
            log.info("获取当前系统版本号002 ---------------->", u_status);
            //执行自动更新检查
            autoUpdater.checkForUpdates();

        }else {
            console.log("未获取当前系统版本号");
        }
    });

    // 渲染进程事件处理
    ipcMain.on("update-action", (event, action) => {
        if (action === "confirm-update") {
            // 用户确认更新，开始下载更新包
            autoUpdater.downloadUpdate();

        } else if (action === "cancel-update") {
            // 用户取消更新，发送消息通知渲染进程
            sendUpdateMessage({
                cmd: "update-cancelled",
                // message: "用户取消了更新。",
                message: 'User canceled the update',
            });
        }
    });

    // 下载完成，退出且重现安装
    ipcMain.on('updateSuccess', () =>{
        if (u_status === false){
            // 加载更新程序
            autoUpdater.quitAndInstall();
            // 关闭当前electron
            app.quit();
        }else if (u_status === true){
            log.info("获取版本号-------------------->");
        }
    });
}
//给渲染进程发送消息
function sendUpdateMessage(text) {
    log.info("给渲染进程发送消息：：", text);
    mainWindow.webContents.send('message', text)
}
