'use strict'

const { autoUpdater } = require('electron-updater')
const { ipcMain } = require('electron')
const log = require('electron-log')
const Log = require('ee-core/log')
const { BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')

/**
 * 初始化更新模块
 * @param {BrowserWindow} win 当前窗口
 */
function initUpdater(win) {
    let isCancelDownload = false
    let currentDownloadTask = null  // 存储当前下载任务

    // ========================
    // 日志
    // ========================
    autoUpdater.logger = log
    log.transports.file.level = 'info'

    // ========================
    // 核心配置
    // ========================
    autoUpdater.autoDownload = false
    autoUpdater.forceDevUpdateConfig = true
    autoUpdater.disableDifferentialDownload = true
    autoUpdater.allowDowngrade = true
    autoUpdater.autoInstallOnAppQuit = false

    // ========================
    // IPC：选择版本更新（核心）
    // ========================
    ipcMain.handle('select_version_update', async (e, version) => {
        try {
            // 替换前删除缓存
            clearUpdateCache()
            const url = `http://192.168.0.158:876/updates/${version}/`
            log.info('切换更新地址:', url)
            Log.info('切换更新地址:', url)
            autoUpdater.setFeedURL({
                provider: 'generic',
                url
            })
            await autoUpdater.checkForUpdates()
            return true
        } catch (err) {
            log.error('切换版本失败:', err)
            Log.info('切换版本失败:', err)
            return false
        }
    })

    // ========================
    // IPC：开始下载
    // ========================
    ipcMain.on('start_download', async () => {
        try {
            isCancelDownload = false
            log.info('开始下载更新')
            Log.info('开始下载更新')

            // 启动下载任务
            currentDownloadTask = autoUpdater.downloadUpdate()
            await currentDownloadTask
            currentDownloadTask = null
        } catch (err) {
            log.error('下载过程出错:', err)
            Log.info('下载过程出错:', err)

            // 如果不是用户主动取消导致的错误，通知渲染进程
            if (!isCancelDownload) {
                sendToRenderer('update_message', {
                    type: 'error',
                    message: err.message
                })
            } else {
                log.info('下载已被用户取消')
                Log.info('下载已被用户取消')
            }

            currentDownloadTask = null
            isCancelDownload = false
        }
    })

    // ========================
    // IPC：取消下载 - 增强版
    // ========================
    ipcMain.on('cancel_download', () => {
        log.info('用户取消下载')
        Log.info('用户取消下载')

        // 设置取消标志
        isCancelDownload = true

        // 如果有正在运行的下载任务
        if (currentDownloadTask) {
            // 尝试取消 Promise（虽然不能真正中止，但可以标记）
            try {
                // 有些版本的 electron-updater 支持 cancelDownload
                if (autoUpdater.cancelDownload) {
                    autoUpdater.cancelDownload()
                }
            } catch (err) {
                log.warn('调用 cancelDownload 失败:', err)
            }
        }

        // 立即清理所有缓存文件
        clearAllCache()

        // 重置下载任务引用
        currentDownloadTask = null

        // 通知渲染进程
        sendToRenderer('update_message', { type: 'cancelled' })
    })

    // ========================
    // IPC：安装更新
    // ========================
    ipcMain.on('install_update', () => {
        log.info('安装更新并重启')
        Log.info('安装更新并重启')
        autoUpdater.quitAndInstall(false, true)
    })

    // ========================
    // 状态监听（核心UI驱动）
    // ========================

    // 检查中
    autoUpdater.on('checking-for-update', () => {
        sendToRenderer('update_message', {
            type: 'checking'
        })
    })

    // 有新版本
    autoUpdater.on('update-available', (info) => {
        log.info('发现新版本:', info)
        Log.info('发现新版本:', info)
        sendToRenderer('update_message', {
            type: 'available',
            info
        })
    })

    // 下载进度
    autoUpdater.on('download-progress', (progress) => {
        if (isCancelDownload) return
        const percent = progress.percent.toFixed(2)
        sendToRenderer('update_message', {
            type: 'progress',
            percent,
            speed: progress.bytesPerSecond,
            transferred: progress.transferred,
            total: progress.total
        })
    })

    // 下载完成
    autoUpdater.on('update-downloaded', (info) => {
        if (isCancelDownload) {
            log.info('下载已被取消，忽略安装')
            Log.info('下载已被取消，忽略安装')
            isCancelDownload = false
            currentDownloadTask = null
            return
        }
        log.info('下载完成:', info)
        Log.info('下载完成:', info)
        currentDownloadTask = null
        sendToRenderer('update_message', {
            type: 'downloaded',
            info
        })
    })

    // 错误处理
    autoUpdater.on('error', (err) => {
        log.error('更新错误:', err)
        Log.info('更新错误:', err)

        // 如果是取消导致的错误，不发送错误消息
        if (isCancelDownload) {
            log.info('忽略取消导致的错误')
            Log.info('忽略取消导致的错误')
            isCancelDownload = false
            currentDownloadTask = null
            return
        }

        sendToRenderer('update_message', {
            type: 'error',
            message: err.message
        })

        currentDownloadTask = null
        isCancelDownload = false
    })
}

function sendToRenderer(channel, data) {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
        win.webContents.send(channel, data)
    }
}

/**
 * 清理所有相关缓存文件（增强版）
 */
function clearAllCache() {
    try {
        const appDataPath = path.join(os.homedir(), 'AppData/Local/hlm-production-tool-setup')

        // 清理 pending 目录
        const pendingDir = path.join(appDataPath, 'pending')
        if (fs.existsSync(pendingDir)) {
            const files = fs.readdirSync(pendingDir)
            files.forEach(file => {
                try {
                    const filePath = path.join(pendingDir, file)
                    fs.unlinkSync(filePath)
                    Log.info('删除pending文件成功:', file)
                } catch (e) {
                    Log.warn('删除pending文件失败:', file, e.message)
                }
            })
        }

        // 清理 updates 目录中的临时文件
        const updatesDir = path.join(appDataPath, 'updates')
        if (fs.existsSync(updatesDir)) {
            const files = fs.readdirSync(updatesDir)
            files.forEach(file => {
                if (file.endsWith('.tmp') || file.endsWith('.download') || file.includes('temp-')) {
                    try {
                        const filePath = path.join(updatesDir, file)
                        fs.unlinkSync(filePath)
                        Log.info('删除临时文件成功:', file)
                    } catch (e) {
                        Log.warn('删除临时文件失败:', file, e.message)
                    }
                }
            })
        }

        Log.info('所有缓存清理完成')
    } catch (err) {
        Log.error('清理缓存时出错:', err)
    }
}

/**
 * 清理pending更新目录（保留原函数兼容）
 */
function clearUpdateCache() {
    clearAllCache()
}

module.exports = {
    initUpdater
}