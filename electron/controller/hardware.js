'use strict';

const {Controller} = require('ee-core');
const path = require('path');
const Ps = require('ee-core/ps');
const CoreWindow = require('ee-core/electron/window');
const Addon = require('ee-core/addon');
const fs = require("fs");
const JsBarcode = require('jsbarcode');
const bwipjs = require('bwip-js');

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

    /*30mm * 12mm*/
    /**
     * 打印
     */
    print(args, event) {
        const deviceName = args.deviceName;
        let address = args.address;
        // const model = 'WAC300LH_LORA';
        // const date = args.date;
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width:400 ,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',
                text: address,
                scale: 4,
                width: 11, // 宽度
                height: 1.5, // 高度
                includetext: false,
                textxalign: 'center',
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                const content = `
       <html>
<head>
        <style>
        .container {
            display: flex;
            width: 200mm;
            /*height: 12mm;*/
            margin-top: 78px;
            /*  margin-top: 67px;       !*放低*!*/
            margin-left:70px;
        }
        .label1 {
            /*width: 50mm;*/
            margin-left: 106px;
        }
        .label2 {
            width: 80mm;
  
        }
        .barcode-container1 {
            /*width: 30mm;*/
            margin-top: 3mm;
            margin-left: 6px;
            height: 5mm;
        }
           .info-container1{
           width: 34mm;
            font-size: 3mm;  
            /*margin-left: 62px;*/
        }
         .barcode-container2 {
           width: 34mm;
            margin-top:1mm;
            margin-left: -5px;
        }
        .info-container2 {  
         width: 34mm;
            /*margin-left:60px;*/
        }
               .info-container1, .info-container2 {
        font-family: 'Microsoft YaHei', sans-serif;
    }

    .png{
    width: 27mm;    /*调整标签整体大小*/
    height: 6mm;
    }
        
    </style>

</head>
<body >
    <div class="container">
        <div class="label1">
            <div class="barcode-container1">
                <img class="png" src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container1">
                 <p  style="line-height:0.3mm ;margin-left: 9px; font-weight: bold;font-size: 3.4mm;">${address}</p>
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
                    width: 13 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 8 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
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
    printAddressAndModel(args, event) {
        const deviceName = args.deviceName;
        let address = args.address;
        const model = args.selectPrintModel;
        // const date = args.date;
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width:400 ,
            height: 600,
            includetext: false,
            show: false,
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',
                text: address,
                scale: 4,
                width: 11, // 宽度
                height: 1.5, // 高度
                includetext: false,
                textxalign: 'center',
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                const content = `
       <html>
<head>
        <style>
        .container {
            display: flex;
            width: 200mm;
            /*height: 12mm;*/
            margin-top: 78px;
            /*  margin-top: 67px;       !*放低*!*/
            margin-left:70px;
        }
        .label1 {
            /*width: 50mm;*/
            margin-top: 10px;
            margin-left: 106px;
        }
        .label2 {
            width: 80mm;
  
        }
        .barcode-container1 {
            /*width: 30mm;*/
            margin-top: 3mm;
            margin-left: 6px;
            height: 5mm;
        }
           .info-container1{
           width: 34mm;
            font-size: 3mm;  
            /*margin-left: 62px;*/
        }
         .barcode-container2 {
           width: 34mm;
            margin-top:1mm;
            margin-left: -5px;
        }
        .info-container2 {  
         width: 34mm;
            /*margin-left:60px;*/
        }
               .info-container1, .info-container2 {
        font-family: 'Microsoft YaHei', sans-serif;
    }
        
    </style>

</head>
<body >
    <div class="container">
        <div class="label1">
            <div class="info-container1">
                 <p  style="line-height:0.3mm ;margin-left: 7px; font-weight: 600;font-size: 3.7mm;">${address}</p>
                 <p  style="line-height:1mm ;margin-left: 12px;  font-weight: bold;font-size: 3.7mm;">${model}</p>
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
                    width: 13 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 8 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
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
                        // printWindow.close();
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