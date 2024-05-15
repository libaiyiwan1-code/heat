'use strict';

const {Controller} = require('ee-core');
const path = require('path');
const Ps = require('ee-core/ps');
const CoreWindow = require('ee-core/electron/window');
const Addon = require('ee-core/addon');
const fs = require("fs");
const JsBarcode = require('jsbarcode');
const bwipjs = require('bwip-js');
const Log = require('ee-core/log');
/**
 * 硬件设备 - 功能demo
 * @class
 */
class HardwareController extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    /**
     * 获取打印机列表
     */
    async getPrinterList() {

        //主线程获取打印机列表
        const win = CoreWindow.getMainWindow();
        const list = await win.webContents.getPrintersAsync();

        return list;
    }

    /**
     * 打印
     */
    print(args, event) {
        const deviceName = args.deviceName;
        const address = args.address;
        const model = 'WAC710C调节阀';
        const date = args.date;
        Log.info('args' + JSON.stringify(args));
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width:400 ,
            height: 600
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);

        // const tempHtmlPath = path.join(Ps.getHomeDir(), '/electron/view_print.html');
        // Log.info('homedir=',Ps.getHomeDir())
        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scaleX: 4,              // Scaling factor
                width: 10, // 宽度
                height: 1.5, // 高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // Write content to tempHtmlPath
                const content = `
       <html>
<head>
    <style>
        .container {
            display: flex;
            width: 30mm;
            height: 3mm;
            margin-top: 24px;
        }
        .label1 {
            width: 44mm;
            height: 18mm;
        }
        .label2 {
            width: 44mm;
            height: 18mm;
            margin-left: 3mm;
        }
        .barcode-container {
            width: 35mm;
            height: 5mm;
            margin-top: 1mm;
            padding-left: 32px;
        }
        .info-container1{
            /*font-size: 3mm;*/
            height: 5mm; 
            width: 44mm;
            margin-left:1mm
        }
        .info-container2 {
            /*font-size: 3mm;*/
            height: 5mm; 
             width: 43mm;
             margin-right: 3mm;
        }
               .info-container1, .info-container2 {
        font-family: 'Microsoft YaHei', sans-serif;
    }.png{
    width: 23mm;
    }
        
    </style>
</head>
<body >
    <div class="container">
        <div class="label1">
            <div class="barcode-container">
                <img class="png" src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container1">
                 <p  style="line-height:1mm ; font-size: 3mm;font-family: 'Microsoft YaHei', sans-serif;margin-left: 11mm;font-weight: bold;">${address}</p>
                <p style="line-height:1mm ; font-size: 3mm;font-family: 'Microsoft YaHei', sans-serif; font-weight: bold; margin-left: 4mm;">型号:${model}</p>
                <p style="line-height:1mm ; font-size: 3mm;font-family: 'Microsoft YaHei', sans-serif;font-weight: bold; margin-left: 4mm; ">日期:${date}</p>
            </div>
        </div>
        <div class="label2">
            <div class="barcode-container">
                <img  class="png" src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container2">
          <p  style="line-height:1mm;margin-left: 12mm; font-size: 3mm;font-family: 'Microsoft YaHei', sans-serif; font-weight: bold;">${address}</p>
                <p style="line-height:1mm ; font-size: 3mm; font-family: 'Microsoft YaHei', sans-serif;font-weight: bold; margin-left: 4mm; ">型号:${model}</p>
                <p style="line-height:1mm ;  font-size: 3mm; font-family: 'Microsoft YaHei', sans-serif;font-weight: bold; margin-left: 4mm;">日期:${date}</p>
            </div>
        </div>
    </div>
</body>
</html>

        `;
                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 86 * 1000, // 转换为微米
                    height: 22 * 1000
                };

                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true,
                        printBackground: false,
                        deviceName: deviceName,
                        copies: 1,
                        landscape: false
                        , pageSize: pageSize
                    }, (success, failureReason) => {
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        printWindow.close();
                    });
                });
            });

        return true;
    }

    // generateBarcode(address, callback) {
    //   bwipjs.toBuffer({
    //     bcid: 'code128',       // Barcode type
    //     text: address,         // Text to encode
    //     scale: 3,              // Scaling factor
    //     height: 30,            // Bar height, in millimeters
    //     includetext: false,    // Show human-readable text
    //     textxalign: 'center',  // Text horizontal alignment
    //   }, function (err, png) {
    //     if (err) {
    //       callback(err, null);
    //     } else {
    //       callback(null, png.toString('base64'));
    //     }
    //   });
    // }


}


HardwareController.toString = () => '[class HardwareController]';
module.exports = HardwareController;  