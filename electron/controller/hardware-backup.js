'use strict';
const {SerialPort} = require('serialport');
const {Controller} = require('ee-core');
const path = require('path');
const Ps = require('ee-core/ps');
const CoreWindow = require('ee-core/electron/window');
const Addon = require('ee-core/addon');
const fs = require("fs");
const JsBarcode = require('jsbarcode');
const bwipjs = require('bwip-js');
const {info} = require("ee-core/log");
const Log = require("ee-core/log");
const targetDPI = 300;
const baseScale = 1; // Base scale for 72 DPI
const {exec} = require("child_process");
const usb = require('usb');
const printer = require('@thiagoelg/node-printer');


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
        const model = args.selectPrintModel;
        // const date = args.date;
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 4,              // Scaling factor
                width: 11, // 宽度
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

                address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                const content = `
       <html>
<head>
        <style>
        .container {
            display: flex;
            width: 170mm;
            /*height: 12mm;*/
            margin-top: 75px;
            /*  margin-top: 67px;       !*放低*!*/
            margin-left:57px;
        }
        .label1 {
            width: 50mm;
            margin-top: -3px;
            /*margin-left: 80px;*/
        }
        .label2 {
          margin-top: -3px;
            width: 80mm;
  
        }
        .barcode-container1 {
            width: 30mm;
            margin-top: 1mm;
            margin-left: -1mm;
        }
           .info-container1{
           width: 43mm;
           margin-top: -3px;
            margin-left: -7mm;
        }
         .barcode-container2 {
           width: 34mm;
            margin-top:1mm;
             margin-left: -2.5mm;
        }
        .info-container2 {  
                 width: 43mm;
         margin-top: -3px;
                  margin-left: -7mm;
            /*margin-left:60px;*/
        }
               .info-container1, .info-container2 {
        font-family: 'Microsoft YaHei', sans-serif;
    }

    .png{
    width: 39mm;    /*调整标签整体大小*/
    height: 5.5mm;
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
                      <p  style="line-height:0.2mm ;margin-left: 24px; font-weight: bold;font-size: 3.4mm;">地址：    ${address}</p>
                 <p  style="line-height:0.4mm ;margin-left: 24px; font-weight: bold;font-size: 3.5mm;">型号：       ${model}</p>
            </div>
        </div>
        <div class="label2">
            <div class="barcode-container2">
                <img  class="png" src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container2">
       <p  style="line-height:0.2mm ;margin-left: 24px; font-weight: bold;font-size: 3.4mm;">地址：    ${address}</p>
                 <p  style="line-height:0.4mm ;margin-left: 24px; font-weight: bold;font-size: 3.5mm;">型号：       ${model}</p>
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
                    width: 30 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 12 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
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


    /*40mm * 20mm*/
    print4020(args, event) {
        const deviceName = args.deviceName;
        let address = args.address;
        const model = args.selectPrintModel;
        const date = args.date;
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 4, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 1.5, // 每个模块宽度高度

                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                const content = `
       <html>
<head>
          <style>
        .container {
            display: flex;
            width: 97mm;
            height: 20mm;
            margin-top: 33px;
        }
      .label1, .label2 {
             width: 42mm;
        }
        .label2 {
          padding-left: 16mm; /* 适当间距 */
}
        .barcode-container {
            width: 33mm;
            height: 6mm;
            margin-top: 1.5mm;
            padding-left: 0; /* 移除多余内边距 */
            
        }
        .info-container1{
            width: 42mm;
            font-family: 'Microsoft YaHei', sans-serif;
        }
               .info-container1, .info-container2 {
        font-family: 'Microsoft YaHei', sans-serif;
    }.png{
    width: 36mm;
    height: 21px;
    /*image-rendering: pixelated; !* 禁用浏览器抗锯齿 *!*/
    }
        
    </style>

</head>
<body >
    <div class="container">
        <div class="label1">
            <div class="barcode-container">
                <img class="png"  src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container1">
                <p  style="line-height:1mm ; font-size: 5mm;font-family: 'Microsoft YaHei', sans-serif; margin-top: 2.5mm;margin-left: 6mm">${address}</p>
                <p style="line-height:1mm ; font-size: 4mm;font-weight: 500;font-family: 'Microsoft YaHei', sans-serif;  margin-top: -1mm; ">型号 : ${model}</p>
                <p style="line-height:1mm ; font-size: 4mm;font-weight: 500;font-family: 'Microsoft YaHei', sans-serif ;  ">日期 : ${date}</p>
            </div>
            
        </div>
         <div class="label2">
            <div class="barcode-container">
                <img class="png"  src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container1">
                <p  style="line-height:1mm ; font-size: 5mm;font-family: 'Microsoft YaHei', sans-serif; margin-top: 2.5mm;margin-left: 6mm">${address}</p>
                <p style="line-height:1mm ; font-size: 4mm;font-weight: 500;font-family: 'Microsoft YaHei', sans-serif;  margin-top: -1mm; ">型号 : ${model}</p>
                <p style="line-height:1mm ; font-size: 4mm;font-weight: 500;font-family: 'Microsoft YaHei', sans-serif ;  ">日期 : ${date}</p>
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
                    // width: 86 * 1000, // 转换为微米
                    height: 20 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        copies: 1,
                        landscape: false
                        , pageSize: pageSize,
                        // show:true
                    }, (success, failureReason) => {
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }

    /**
     * 打印
     */


    /**
     * 4020 尺寸标签打印 双排
     *
     * */
    printDoubleRowLabel4020(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        const model = args.selectPrintModel;
        const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                address = address.split('').join(' ');
                let content;
                if (listDoubleRowLabels === '是') {
                    content = `
       <html>
<head>
          <style>
        .container {
            display: flex;
            width: ${width * 2}mm;
            height: ${height}mm;
        }
      .label1, .label2 {
             width: ${width}mm;
              margin-top:3.5mm;
        }
         .label2 {
              padding-left: 10mm; /* 适当间距 */
        }
        .png{
        width: ${width - 12}mm;
        height: ${height / 4}mm;
        }
        .info-container{
            width: ${width}mm;
            font-family: 'Microsoft YaHei', sans-serif;
        }
            
    @page {
    margin-left: 4mm;   /* 左边界偏移  将内容向右偏移，避开打印机左侧的不可打印区域。*/
    size: ${(width * 2) + 4}mm ${height + 2}mm;    /* 打印区域尺寸 实际内容宽度是 80mm（.container 的宽度），但打印机可能有物理边距，所以额外增加 4mm 缓冲,22mm = 标签高度（20mm） + 上下边距缓冲（2mm） */ 
    }
 
        
    </style>

</head>
<body >
    <div class="container">
        <div class="label1">
            <div >
                <img class="png"  src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container">
                <p  style="line-height:1mm ; font-size: 4mm;font-family: 'Microsoft YaHei', sans-serif; margin-top: 2mm;margin-left: 1mm">${address}</p>
                <p style="line-height:1mm ; font-size: 3.5mm; font-family: 'Microsoft YaHei', sans-serif;   ">型号 : ${model}</p>
                <p style="line-height:1mm ; font-size: 3.5mm; font-family: 'Microsoft YaHei', sans-serif ;  ">日期 : ${date}</p>
            </div>
            
        </div>
         <div class="label2">
            <div >
                <img class="png"  src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div class="info-container">
                <p  style="line-height:1mm ; font-size: 4mm;font-family: 'Microsoft YaHei', sans-serif;  margin-top: 2mm;margin-left: 1mm">${address}</p>
                <p style="line-height:1mm ; font-size: 3.5mm ;font-family: 'Microsoft YaHei', sans-serif;   ">型号 : ${model}</p>
                <p style="line-height:1mm ; font-size: 3.5mm; font-family: 'Microsoft YaHei', sans-serif ;  ">日期 : ${date}</p>
            </div>
            
        </div>
    </div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 86 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 22 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        copies: 1,
                        landscape: false,
                        pageSize: 'A4',
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }



    async doPrint(args) {
        const deviceName = args.defaultDeviceName;
        const modal = args.modal;
        let address = '12345678';
        const widthMM = args.width;   // 标签宽度
        const heightMM = args.height;  // 标签高度
        const marginMM = args.margin;   // 边距
        const marginLeftMM = args.marginLeft;   // 右移动距离
        const listDoubleRowLabels = args.isDouble; // 是否双排
        const secondColumnFontSize = args.secondColumnFontSize; // 字号

        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);

        // 页面内容
        let content = `
<html>
<head>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Microsoft YaHei', sans-serif;
        font-size: ${secondColumnFontSize}mm;
    }
    .container {
      
        display: flex;
        padding-left: ${marginLeftMM}mm; /* 整体右移 */
        gap: 6mm /* 双排标签间距 */
        width: fit-content;               /* 自适应总宽 */
        height: ${heightMM}mm;
       
    }
    .label {
     margin-top: ${marginMM}mm;
        width: ${widthMM}mm;
        height: ${heightMM}mm;
        line-height: ${heightMM}mm;
        text-align: center;
    }  
    .label+.label {
        margin-left: 3mm;
    }
  
</style>
</head>
<body>
    <div class="container">
        <div class="label">${address}</div>
        ${listDoubleRowLabels ? `<div class="label">${address}</div>` : ''}
    </div>
</body>
</html>
`;

        // 加载内容
        printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);

        // 将 mm 转换为微米（Electron pageSize 单位 µm）
        const pageSize = {
            width: widthMM * 1000 * (listDoubleRowLabels ? 2 + 0.1 : 1), // 双排 + 额外边距
            height: (heightMM) * 1000
        };

        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: true, // 静默打印
                printBackground: false,
                deviceName: deviceName,
                copies: 1,
                landscape: false,
                pageSize: pageSize,
                margins: { marginType: 'none' },
                scaleFactor: 100 // 原始大小打印
            }, (success, failureReason) => {
                console.log('打印状态:', success, failureReason);
                // printWindow.close();
            });
        });

        return true;
    }

    printDoubleRowLabel3012LPC230(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        const model = args.selectPrintModel;
        const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                // address = address.split('').join(' ');
                let content;
                if (listDoubleRowLabels === '是') {
                    content = `
       <html>
<head>
          <style>
        .container {
            margin-top:0.1mm;
            display: flex;
            width: 80mm;
        }
      .label1, .label2 {
             width: ${width}mm;
              margin-left: 1mm;
        }
        .label2{
        margin-left: 9mm;
        }
         .label2 {
              padding-left: 5mm; /* 适当间距 */
        }
   
        
 
 
        
    </style>

</head>
<body >
    <div class="container">
        <div class="label1">
         
        <p  style="line-height:1mm ; font-size: 5mm;font-family: 'Microsoft YaHei', sans-serif;  ">${address}</p>
            
        </div>
      <div class="label2">
         
         <p  style="line-height:1mm ; font-size: 5mm;font-family: 'Microsoft YaHei', sans-serif;  ">${address}</p>
            
        </div>
    </div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 66 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 14 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        copies: 1,
                        landscape: false,
                        pageSize: 'A4',
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }


    /**
     * VAC系列 地址标签打印 单排
     *
     * */
    printAddressSingleRowLabelVAC5012(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        // const model = args.selectPrintModel;
        // const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                // address=address  .split('').join(' ');
                let content;
                if (listDoubleRowLabels === '否') {
                    content = `
      <html>
<head>
    <style>
        .container {
            width: 50mm;
            height: 8mm;
            /*display: flex;*/
        }
        .barcode-container {
            width: 22mm;
            height: 6mm;
            margin-top: -1mm;
            margin-left: 1mm;
        }
        .barcode-container img {
            width: 20mm;
            height: 5mm;
        }
        .barcode-number {
            margin-top: 0.5mm;
            font-size: 3.5mm;
           margin-left: 1.6mm;
        }
        .text-container {
            position: absolute;
            top: 1mm;
            left: 25mm;
            display: flex;
            gap: 4mm;
            
        }
        .text-column {
            font-size: 3.3mm;
        }
        @page {
            size: 54mm 12mm;
       
        }
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-container">
        <img src="data:image/jpg;base64,${png.toString('base64')}" />
        <div class="barcode-number">${address}</div>
    </div>
    <div class="text-container">
        <div class="text-column">
            <div>红黑</div>
            <div>黄绿</div>
        </div>
        <div class="text-column">
            <div>电源</div>
            <div>M-BUS</div>
        </div>
    </div>
</div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 54 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 12 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        pageSize,
                        copies: 1,
                        landscape: false,
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }

    /**
     * WAC系列 地址标签打印 单排
     *
     * */
    printAddressSingleRowLabelWAC5012(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        // const model = args.selectPrintModel;
        // const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                // address=address  .split('').join(' ');
                let content;
                if (listDoubleRowLabels === '否') {
                    content = `
     <html>
<head>
    <style>
        .container {
            width: 54mm;
            height: 8mm;
        }
        .barcode-container {
            margin-top: -1mm;
            left: 2mm;
            width: 22mm;
            height: 10mm;
            text-align: center;
        }
        .barcode-container img {
            width: 20mm;
            height: 5mm;
        }
        .barcode-number {
            font-size: 3.5mm;
            margin-top: 0.5mm;
        }
        .text-model {
            margin-top: -10mm;
            margin-left: 23mm;
            font-size: 3.3mm;
        }
        .text-date {
            margin-left: 23mm;
            font-size: 3.5mm;
        }
        @page {
            size: 54mm 12mm;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-container">
        <img src="data:image/jpg;base64,${png.toString('base64')}" />
        <div class="barcode-number">${address}</div>
    </div>
    <div class="text-model">${args.model || 'WAC300N-QSEW'}</div>
    <div class="text-date">${args.date || new Date().toISOString().split('T')[0]}</div>
</div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 54 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 12 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        pageSize,
                        copies: 1,
                        landscape: false,
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }

    /**
     * WAC330HE 定制化标签打印50*12 单排
     *
     * */
    printAddressSingleRowLabelWAC330HE(args, event) {
        let deviceName = args.deviceName
        let address = args.address
        let date = args.date
        let craftsmanCaliber = args.craftsmanCaliber
        let commonTraffic = args.commonTraffic
        let flowRange = args.flowRange
        Log.info(args)
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }
                let content;
                content = `
     <html>
<head>
    <style>
        .container {
         
          height:7mm;
          display: flex;
        }
        .barcode-container {
            margin-top: -1mm;
            text-align: center;
          
        }
        .param-container{
            margin-top:-1.3mm ;
            margin-left: 2mm;
        }
        .barcode-container img {
            width: 20mm;
            height: 3mm;
        }
        .barcode-number {
            font-size: 2.8mm;
             font-family: "Microsoft YaHei UI", "Arial", sans-serif;
            font-weight: bold;
        }
        .text-date {
            font-size: 2.1mm;
            margin-top: 0.8mm;
              font-family: "Microsoft YaHei UI", "Arial", sans-serif;
            font-weight: bold;
            width: 20mm;
        }
        
        
        .label{
        font-size: 2.2mm;
        font-family: "Microsoft YaHei UI", "Arial", sans-serif;
        }.value{
        font-size: 2.2mm;
     font-family: "Microsoft YaHei UI", "Arial", sans-serif;
            font-weight: bold;
        
        }  .param-row {
            display: flex;
            align-items: center;
            margin-bottom: 1.2mm;
            width: 27mm;
        }

        @page {
            size: 50mm 12mm;
        }
   
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-container">
        <img src="data:image/jpg;base64,${png.toString('base64')}" />
        <div class="barcode-number">${address}</div>
        <div class="text-date">${date}</div>
       
    </div>
    
    <div class="param-container">       
        <div class="param-row">
             <span class="label">公称口径：</span>
             <span class="value">${craftsmanCaliber}</span> 
        </div>
        <div class="param-row">
             <span class="label">常用流量：</span>
             <span class="value">${commonTraffic}</span>
        </div>
        <div class="param-row">
            <span class="label">流量范围：</span>
            <span class="value">${flowRange}</span>
        </div>
 
    </div>

</div>
</body>
</html>

        `

                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.show()
                // printWindow.openDevTools();
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        copies: 1,
                        landscape: false,
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }

    /**
     *  成功检验标签打印 单排
     *
     * */
    printSuccessSingleRowInspectLabel5012(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        // const model = args.selectPrintModel;
        // const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let message = args.message
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                // address=address  .split('').join(' ');
                let content;
                if (listDoubleRowLabels === '否') {
                    content = `
     <html>
<head>
    <style>
        .container {
            width: 54mm;
            height: 8mm;
            display: flex;
        }
        .barcode-container {
            margin-top: -1mm;
            margin-left: 1mm;
            width: 22mm;
            height: 10mm;
            text-align: center;
        }
        .barcode-container img {
            width: 20mm;
            height: 5mm;
        }
        .barcode-number {
            font-size: 3.5mm;
            margin-top: 0.5mm;
        }
        @page {
            size: 54mm 12mm;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-container">
        <img src="data:image/jpg;base64,${png.toString('base64')}" />
        <div class="barcode-number">${address}</div>
    </div>
    <span  style="font-size:4mm; margin-left: 2mm  ">${message}</span>
</div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 54 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 12 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        pageSize,
                        copies: 1,
                        landscape: false,
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }

    /**
     *  失败检验标签打印 单排
     *
     * */
    printErrorSingleRowInspectLabel5012(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        // const model = args.selectPrintModel;
        // const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let message = args.message
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                // address=address  .split('').join(' ');
                let content;
                if (listDoubleRowLabels === '否') {
                    content = `
     <html>
<head>
    <style>
        .container {
            width: 54mm;
            height: 8mm;
            display: flex;
        }
        .barcode-number {
            font-size: 4mm;
            width: 25mm;
        }
        @page {
            size: 54mm 12mm;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-number">${address}</div>
    <p  style="font-size: 4mm;   margin-top: auto;margin-left: -4mm">${message}</p>
</div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 54 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 12 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        pageSize,
                        copies: 1,
                        landscape: false,
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }

    /**
     *  检验标签打印 单排
     *  TODO 待调试
     * */
    print3012(args, event) {
        const deviceName = args.deviceName;
        let address = args.address
        Log.info('address:' + address);
        // const model = args.selectPrintModel;
        // const date = args.date;
        let width = Number(args.width)
        let height = Number(args.height)
        let message = args.message
        let listDoubleRowLabels = args.listDoubleRowLabels
        Log.info('宽：' + width + '类型：', +typeof width + ' 高：' + height + '类型：' + typeof height);
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 400,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 1, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 4, // 每个模块宽度高度
                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }

                // address = address.replace(/(.)/g, '$1  ');
                // Write content to tempHtmlPath
                address = address.split('').join(' ');
                let content;
                if (listDoubleRowLabels === '是') {
                    content = `
     <html>
<head>
    <style>
        .container {
            width: 34mm;
            height: 8mm;
            display: flex;
        }
        .barcode-container {
            margin-top: -1mm;
            margin-left: 2mm;
            width: 22mm;
            height: 10mm;
            text-align: center;
            display: flex;
        }
        .barcode-container img {
            width: 20mm;
            height: 5mm;
        }
        .barcode-number {
            font-size: 3.5mm;
            margin-top: 0.5mm;
            width: 25mm;
            margin-left: 2mm;
        }
        @page {
            size: 34mm 12mm;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-container">
        <img src="data:image/jpg;base64,${png.toString('base64')}" />
        <div class="barcode-number">${address}</div>
    </div>
</div>
</body>
</html>

        `;

                }

                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // printWindow.loadURL(`file://${tempHtmlPath}`);
                /*控制纸张大小*/
                const pageSize = {
                    width: 54 * 1000, // 转换为微米
                    // width: 86 * 1000, // 转换为微米
                    height: 12 * 1000
                    // height: 22 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        pageSize,
                        copies: 1,
                        landscape: false,
                        scaleFactor: 100, // 强制100%缩放
                        margins: {
                            marginType: 'none' // 禁用默认边距
                        }
                        // show:true
                    }, (success, failureReason) => {
                        info(success)
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });

        return true;
    }


    printSuccessMessage(args, event) {
        const deviceName = args.deviceName;
        let address = args.address;
        const message = args.message;
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 800,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');
        bwipjs.toBuffer({
                bcid: 'code128',       // Barcode type
                text: address,         // Text to encode
                scale: 4, // 适配设备像素比率
                width: 2, // 每个模块宽度
                height: 1.5, // 每个模块宽度高度

                includetext: false,    // Show human-readable text
                textxalign: 'center',  // Text horizontal alignment
                // textfont: 'Arial',     // 设置文本字体
            },
            function (err, png) {
                if (err) {
                    console.error('Error generating barcode:', err);
                    return;
                }
                const content = `
       <html>
<head>
<style>
  .container {
    margin-top: 1mm;
    position: relative;
    padding: 0;
    width: 106mm;
    height: 12mm;
  }
  
  .label-group {
    position: absolute;
    left: 0;
    top: 0;
    height: 12mm;
    width: 50mm;
    display: flex;
  }
  
  .label-group2 {
    position: absolute;
    left: 60mm;
    top: 0;
    height: 12mm;
    width: 50mm;
    display: flex;
  }
  
  .left-content {
    display: flex;
    flex-direction: column;
    width: calc(100% - 23mm); /* 自动计算宽度，留出message空间 */
  }
  
  .logo {
    width: 25mm;
    height: 5mm;
    image-rendering: crisp-edges;
    object-fit: contain;
    margin-bottom: 1mm;
  }
  
  .address {
    font-weight: bold;
    font-size: 5mm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1;
  }
  
  .message-container {
    display: flex;
    align-items: center;
    justify-content: center;
    /*width: 20mm;*/
    /*margin-left: 3mm; !* 调整为3mm间距 *!*/
  }
  
  .message {
    font-size: 6mm;
    line-height: 1;
    text-align: center;
  }
  
  @media print {
    body {
      margin: 0;
      padding: 0;
    }
    .logo {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>


</head>
<body>
  <div class="container">
    <div class="label-group">
      <div class="left-content">
        <img class="logo" src="data:image/jpg;base64,${png.toString('base64')}" alt="条形码">
        <div class="address">${address}</div>
      </div>
      <div class="message-container">
        <span class="message">${message}</span>
      </div>
    </div>
    
    <div class="label-group2">
      <div class="left-content">
        <img class="logo" src="data:image/jpg;base64,${png.toString('base64')}" alt="条形码">
        <div class="address">${address}</div>
      </div>
      <div class="message-container">
        <span class="message">${message}</span>
      </div>
    </div>
  </div>
</body>
</html>

        `;
                // fs.writeFileSync(tempHtmlPath, content);
                printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
                // /*控制纸张大小*/
                const pageSize = {
                    width: 200 * 1000, // 转换为微米
                    height: 15 * 1000
                };
                // printWindow.openDevTools();
                // printWindow.show()
                printWindow.webContents.once('did-finish-load', () => {
                    printWindow.webContents.print({
                        silent: true, //展示windows打印对话框
                        printBackground: false,
                        deviceName: deviceName,
                        copies: 1,
                        landscape: false
                        , pageSize: pageSize,
                        margins: {
                            top: 0,
                            left: 0, // 改为0，避免负值影响
                            right: 0,
                            bottom: 0
                        },
                        scaleFactor: 130

                    }, (success, failureReason) => {
                        const channel = 'controller.hardware.printStatus';
                        event.reply(`${channel}`, {success, failureReason});
                        // printWindow.close();
                    });
                });
            });
        return true;
    }

    /*
    * 12mm*50mm
    * */
    printErrorMessage(args, event) {
        const deviceName = args.deviceName;
        let address = args.address;
        const message = args.message;
        const opt = {
            title: 'printer window',
            x: 10,
            y: 10,
            width: 800,
            height: 600,
            show: false
        };
        const name = 'window-printer';
        const printWindow = Addon.get('window').create(name, opt);
        const tempHtmlPath = path.join(Ps.getHomeDir(), '/public/html/view_example.html');

        const content = `
       <html>
<head>
   <style>
  
.container {
    width: 106mm;
    padding: 0;
    display: inline-flex;
}
.info-container1 {
    width: 50mm;
    margin-top: 3mm;
    font-family: 'Microsoft YaHei', sans-serif;
}
.info-container2 {
    width: 50mm;
     margin-top: 3mm;
     margin-left: 4mm;
    font-family: 'Microsoft YaHei', sans-serif;
}
@media print {
    body {
        margin: 0;
        padding: 0;
    }
}
</style>

</head>
<body >
            <div class="container">
                   <div class="info-container1">
                        <span style="font-weight: bold;  font-size: 5mm;">  
                        ${address}
                        </span>
                        <span style="  font-size: 3mm; padding:2px 1px 2px 1px "> 
                          ${message}
                        </span>
                     </div>
                      <div class="info-container2">
                        <span style=" font-weight: bold; font-size: 5mm;">  
                        ${address}
                        </span>
                        <span style=" font-size: 3mm; padding:2px 1px 2px 1px"> 
                          ${message}
                        </span>
                        </div>
                </div>
              
</body>
</html>

        `;
        // fs.writeFileSync(tempHtmlPath, content);
        printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
        // /*控制纸张大小*/
        const pageSize = {
            width: 200 * 1000, // 转换为微米
            height: 15 * 1000
        };
        // printWindow.openDevTools();
        // printWindow.show()
        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: true, //展示windows打印对话框
                printBackground: false,
                deviceName: deviceName,
                copies: 1,
                landscape: false
                , pageSize: pageSize,
                margins: {
                    top: 0,
                    left: 0, // 改为0，避免负值影响
                    right: 0,
                    bottom: 0
                },
                scaleFactor: 130

            }, (success, failureReason) => {
                const channel = 'controller.hardware.printStatus';
                event.reply(`${channel}`, {success, failureReason});
                // printWindow.close();
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
            width: 400,
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
           display: inline;
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
          display: inline;
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


}


HardwareController.toString = () => '[class HardwareController]';
module.exports = HardwareController;  