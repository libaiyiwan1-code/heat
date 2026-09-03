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
const {date} = require("yarn/lib/cli");
const {getTemplate} = require("qr-image/lib/qr-base");


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


    getProductionWarehousingFailurePrintTemplate(config) {
        let htmlStr = ''
        let {
            configModel,
            listDoubleRowLabels,
            widthMM,
            heightMM,
            marginMM,
            marginLeftMM,
            secondColumnFontSize
        } = config;
        Log.info('config:', config)

  if (configModel === 'NTP100C' || configModel === 'WAC710CD' || configModel === 'WAC300CD'
            || configModel === 'WAC300NH' || configModel === 'ET01' || configModel === 'WAC730C' ||
            configModel === 'CAT400' || configModel === 'CAT400S' || configModel === 'WAC710C' || configModel === 'WAC300C'
            || configModel === 'WAC330N' || configModel === 'WAC400N' || configModel === 'VAC710' || configModel === 'WAC710N' ||
            configModel === 'WAC300NY' || configModel === 'WAC730N' || configModel === 'WAC300LH'||configModel==='PTC100-CAT1'
        ) {
            // 40*20 双排
            // 生成单个标签 HTML
            const generateLabel = () => `
       <div class="label">
    <div>
        <!-- 只显示生产入库失败，居中大号红色字体 -->
        <p style="font-size: 5mm; font-weight: 700; color: #ff0000; margin: 0; text-align: center;">生产入库失败</p>
    </div>
</div>
    `;
            // 双排标签
            const labelsHTML = listDoubleRowLabels
                ? generateLabel() + generateLabel()
                : generateLabel();

            // 返回完整 HTML
            htmlStr = `
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
        margin-left: ${marginLeftMM}mm;
        gap: 3mm;
        width: fit-content;
        height: ${heightMM}mm;
    }

    .label {
        width: ${widthMM}mm;
        flex-direction: row;
        box-sizing: border-box;
        text-align: center;
           margin-top: ${marginMM}mm;
    }
    .barcode-container{
  
    
    }
.info-group {
     margin-left: 7mm;
    text-align: left;      /* 关键：让容器内部的型号和日期左对齐，保证开头齐平 */
    margin-top: -2mm;    /* 微调与上方地址的间距 */
}
.info-item {
     
    line-height: 0.1;      /* 推荐使用正常的倍数行高，避免重叠 */
    font-weight: 500;
}
 
  
     
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;


        }
        return htmlStr;
    }




    getTemplate(config) {
        let htmlStr = ''
        let {
            model,
            configModel,
            commonTraffic,
            flowRange,
            craftsmanCaliber,
            date,
            address,
            listDoubleRowLabels,
            png,
            widthMM,
            heightMM,
            marginMM,
            marginLeftMM,
            secondColumnFontSize,
            netprovider
        } = config;
        Log.info('config:', config)
   if(configModel === 'WAC100N'){
       Log.info('打印')
       if (netprovider===1){
           model='型号: '+model+' 电信'
       }else if (netprovider===2){
           model='型号: '+model+' 移动'
       }else{
           model='型号: '+model+' 电信'
       }
       const date = `${'日期: '+new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;
       //date 格式：2026-08-14
       //50*12 双排
       // 生成单个标签 HTML
       const generateLabel = () => `
        <div class="label">
            <div class="barcode-container">
                <img style="height:5mm;width:19mm" src="data:image/png;base64,${png.toString('base64')}" />
                <div style="font-size: 2.8mm;font-weight: bold;">${address}</div>
             
            </div>
            <div class="param-container">       
                <div class="param-row">
                    
                    <span style="margin-top: 2mm" class="label-value">${model}</span> 
                </div>
                
                <div class="param-row">
                 
                    <span class="label-value">${date}</span>
                </div>
            </div>
        </div>
    `;

       // 双排标签
       const labelsHTML = listDoubleRowLabels
           ? generateLabel() + generateLabel()
           : generateLabel();

       // 返回完整 HTML
       htmlStr = `
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
        padding-left: ${marginLeftMM}mm;
        gap: 3mm;
        width: fit-content;
        height: ${heightMM}mm;
    }

    .label {
        width: ${widthMM}mm;
        height: ${heightMM}mm;
        margin-top: ${marginMM}mm;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        text-align: center;
    }

    .barcode-container {
        text-align: center;
        margin-right: 2mm;
        margin-top: -1.5mm;
    }
    .barcode-container  {
        width: 20mm;
        height: 3mm;
        object-fit: contain;
    }
  
    .text-date {
        font-size: 2.2mm;
        font-weight: bold;
        margin-top: 0.5mm;
    }

    .param-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 1mm;
    }

    .param-row {
        display: flex;
        align-items: center;
        margin-bottom: 1mm;
    }
 
    .label-value {
        font-size: 2.6mm;
        font-weight: bold;
    }
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;

   }

    else if (configModel === 'WAC330HE'||configModel === 'WAC330CE') {
            //50*12 单排
            // 生成单个标签 HTML
            const generateLabel = () => `
        <div class="label">
            <div class="barcode-container">
                <img src="data:image/png;base64,${png.toString('base64')}" />
                <div style="font-size: 2.8mm;font-weight: bold;">${address}</div>
                <div class="text-date">${date}</div>
            </div>
            <div class="param-container">       
                <div class="param-row">
                    <span class="label-title">公称口径：</span>
                    <span class="label-value">${craftsmanCaliber}</span> 
                </div>
                <div class="param-row">
                    <span class="label-title">常用流量：</span>
                    <span class="label-value">${commonTraffic}</span>
                </div>
                <div class="param-row">
                    <span class="label-title">流量范围：</span>
                    <span class="label-value">${flowRange}</span>
                </div>
            </div>
        </div>
    `;

            // 双排标签
            const labelsHTML = listDoubleRowLabels
                ? generateLabel() + generateLabel()
                : generateLabel();

            // 返回完整 HTML
            htmlStr = `
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
        padding-left: ${marginLeftMM}mm;
        gap: 3mm;
        width: fit-content;
        height: ${heightMM}mm;
    }

    .label {
        width: ${widthMM}mm;
        height: ${heightMM}mm;
        margin-top: ${marginMM}mm;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        text-align: center;
    }

    .barcode-container {
        text-align: center;
        margin-right: 2mm;
        margin-top: -7mm;
    }
    .barcode-container  {
        width: 20mm;
        height: 3mm;
        object-fit: contain;
    }
  
    .text-date {
        font-size: 2.2mm;
        font-weight: bold;
        margin-top: 0.5mm;
    }

    .param-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .param-row {
        display: flex;
        align-items: center;
        margin-bottom: 1mm;
    }
    .label-title {
        font-size: 2.3mm;
        font-weight: bold;
    }
    .label-value {
        font-size: 2.3mm;
        font-weight: bold;
    }
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;

        } else if (configModel === 'VAC005C') {

            // --- 生成单个标签 HTML ---
            const generateLabel = () => `
<div class="label">

    <div class="left">
        <div class="barcode-container">
            <img class="png" src="data:image/jpg;base64,${png.toString('base64')}">
        </div>
        <p class="address">${address}</p>
    </div>

    <div class="right">
        <div class="row">
            <span>红黑</span>
            <span>电源</span>
        </div>
        <div class="row">
            <span>绿黄</span>
            <span>M-Bus</span>
        </div>
    </div>

</div>
`;
            // 双排标签
            const labelsHTML = `
<div class="container">
    ${listDoubleRowLabels ? generateLabel() + generateLabel() : generateLabel()}
</div>
`;
            // --- 生成完整 HTML ---
            htmlStr = `
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
        gap: 6mm; /*控制左右标签间距*/
        margin-top: ${marginMM}mm;
        margin-left: ${marginLeftMM}mm;
        width: ${widthMM}mm;
        height: ${heightMM}mm;
        display: flex;
    }
   .label {
    display: flex;
    align-items: center;
    
}

.left {
    display: flex;
    flex-direction: column;
 
}

.right {
    display: flex;
    flex-direction: column;
    margin-left: 3.5mm; /* 控制左右间距 */
    margin-top: -4.4mm;
}

.row {
    display: flex;
    justify-content: space-between;
    width: 20mm; /* 控制两列间距 */
}
.row span:first-child {
    width: 10mm;   /* 左列统一宽度 */
    display: inline-block;
}

.row span:last-child {
    width: 12mm;   /* 右列统一宽度 */
    display: inline-block;
}
.png {
    width: 23mm;
}

.address {
    margin-left: 1.8mm;
    margin-top: 0.1mm;
}
   
     
</style>
</head>
<body>
    ${labelsHTML}
</body>
</html>
`;
        } else if (
            configModel === 'LPC230' || configModel === 'LPC230E' || configModel === 'VPT100' || configModel === 'AEC100' || configModel === 'CTW100'
            || configModel === 'WAC300NS' || configModel === 'WAC400NS' || configModel === 'VAC710S' || configModel === 'RFT200-CAT1' || configModel === 'RFT200' ||
            configModel === 'NBT400' || configModel === 'NTR300' || configModel === 'CPT100' || configModel === 'CPT100-10A' || configModel === 'BDC100&C17'
        ) {
            //30*12 双排
            let generateLabel = () => `
            <div class="label-parent">
                <div class="barcode-container">
                    <img style="width: 20mm;height: 3.5mm;" src="data:image/jpg;base64,${png.toString('base64')}" >
                </div>
          
                <div class="label">
                     ${address}
                </div>
           </div> 
        
    `;

            Log.info('listDoubleRowLabels:', listDoubleRowLabels)
            // 双排标签
            let labelsHTML = listDoubleRowLabels
                ? generateLabel() + generateLabel()
                : generateLabel();
            Log.info(labelsHTML)
            // 返回完整 HTML
            htmlStr = `
<html>
<head>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Microsoft YaHei', sans-serif;
        font-size: ${secondColumnFontSize}mm;
    }
     .barcode-container {
            width: 16mm;
            height: 4mm;
            margin-left: 1mm;
                 margin-top: ${marginMM}mm;
        }
        .label-parent{
          width: ${Number(widthMM) + 2}mm;
        }
    .container {
        display: flex;
        padding-left: ${marginLeftMM}mm;
        width: fit-content;
        height: ${heightMM}mm;
      
    }

    .label {
        margin-top: 0.5mm;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        text-align: center;
        margin-left: 1.5mm;
    }

     
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;


        } else if (configModel === 'NTP100C' || configModel === 'WAC710CD' || configModel === 'WAC300CD'
            || configModel === 'WAC300NH' || configModel === 'ET01' || configModel === 'WAC730C' ||
            configModel === 'CAT400' || configModel === 'CAT400S' || configModel === 'WAC710C' || configModel === 'WAC300C'
            || configModel === 'WAC330N' || configModel === 'WAC400N' || configModel === 'VAC710' || configModel === 'WAC710N' ||
            configModel === 'WAC300NY' || configModel === 'WAC730N' || configModel === 'WAC300LH'||configModel==='WAC300N'
        ) {
            // 40*20 双排
            // 生成单个标签 HTML
            const generateLabel = () => `
       <div class="label">
    <div class="barcode-container">
        <img style="width: 26mm; height: 3.5mm;" src="data:image/jpg;base64,${png.toString('base64')}">
    </div>
    <div>
        <!-- 地址保持原来的居中和样式 -->
        <p style="line-height: 1.2; font-weight: 500; margin-top: 0.8mm;">${address}</p>
        
        <!-- 新增包裹容器，用于让型号和日期在内部左对齐，但整体在页面中居中 -->
        <div class="info-group">
            <p class="info-item">型号: ${model}</p>
            <p class="info-item">${date}</p>
        </div>
    </div>
</div>
    `;

            // 双排标签
            const labelsHTML = listDoubleRowLabels
                ? generateLabel() + generateLabel()
                : generateLabel();

            // 返回完整 HTML
            htmlStr = `
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
        margin-left: ${marginLeftMM}mm;
        gap: 3mm;
        width: fit-content;
        height: ${heightMM}mm;
    }

    .label {
        width: ${widthMM}mm;
        height: ${heightMM}mm;
        flex-direction: row;
        box-sizing: border-box;
        text-align: center;
    }
    .barcode-container{
     margin-top: ${marginMM}mm;
    
    }
.info-group {
     margin-left: 7mm;
    text-align: left;      /* 关键：让容器内部的型号和日期左对齐，保证开头齐平 */
    margin-top: -2mm;    /* 微调与上方地址的间距 */
}
.info-item {
     
    line-height: 0.1;      /* 推荐使用正常的倍数行高，避免重叠 */
    font-weight: 500;
}
 
  
     
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;


        } else if (configModel === 'LPC210' || configModel === 'LPC210E') {
            // 40*20 双排
            // 生成单个标签 HTML
            const generateLabel = () => `
        <div class="label">
         <div class="barcode-container">
                <img style="width: 34mm;height: 17px;" src="data:image/jpg;base64,${png.toString('base64')}" >
            </div>
            <div >
                 <p  style="line-height:1mm ; font-weight: 500;margin-top: 2.5mm;" >${address}</p>
                <p style="line-height:1mm ;  font-weight: 500; margin-top: -0.3mm">型号:  HDC024/7 </p>
            </div>
        </div>
    `;

            // 双排标签
            const labelsHTML = listDoubleRowLabels
                ? generateLabel() + generateLabel()
                : generateLabel();

            // 返回完整 HTML
            htmlStr = `
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
        margin-left: ${marginLeftMM}mm;
        gap: 3mm;
        width: fit-content;
        height: ${heightMM}mm;
    }

    .label {
        width: ${widthMM}mm;
        height: ${heightMM}mm;
        margin-top: ${marginMM}mm;
        flex-direction: row;
        box-sizing: border-box;
        text-align: center;
    }

 
  
     
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;


        } else if (
            configModel === 'CAT200'
        ) {
            //28*15 单排
            let generateLabel = () => `
            <div class="label-parent">
                <div class="barcode-container">
                    <img style="width: 23mm;height: 3.5mm;" src="data:image/jpg;base64,${png.toString('base64')}" >
                </div>
          
                <div class="label">
                     ${address}
                </div>
           </div> 
        
    `;

            Log.info('listDoubleRowLabels:', listDoubleRowLabels)
            // 双排标签
            let labelsHTML = listDoubleRowLabels
                ? generateLabel() + generateLabel()
                : generateLabel();
            Log.info(labelsHTML)
            // 返回完整 HTML
            htmlStr = `
<html>
<head>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Microsoft YaHei', sans-serif;
        font-size: ${secondColumnFontSize}mm;
    }
     .barcode-container {
            width: 16mm;
            height: 4mm;
            margin-left: 2.5mm;
                 margin-top: ${marginMM}mm;
        }
        .label-parent{
          width: ${Number(widthMM) + 2}mm;
        }
    .container {
        display: flex;
        padding-left: ${marginLeftMM}mm;
        width: fit-content;
        height: ${heightMM}mm;
      
    }

    .label {
        margin-top: 0.5mm;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        text-align: center;
        margin-left: 1.5mm;
    }

     
</style>
</head>
<body>
    <div class="container">
        ${labelsHTML}
    </div>
</body>
</html>
`;


        }else if (configModel==='WAC230CF'){

            // --- 生成单个标签 HTML ---
            const generateLabel = () => `
<div class="label">

    <div class="left">
        <div class="barcode-container">
            <img class="png" src="data:image/jpg;base64,${png.toString('base64')}">
        </div>
        <p class="address">${address}</p>
    </div>

    <div class="right">
        <div class="row">
            <span>红白</span>
             <span>电源</span>
        </div>
       
    </div>

</div>
`;
            // 双排标签
            const labelsHTML = `
<div class="container">
    ${listDoubleRowLabels ? generateLabel() + generateLabel() : generateLabel()}
</div>
`;
            // --- 生成完整 HTML ---
            htmlStr = `
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
        gap: 6mm; /*控制左右标签间距*/
        margin-top: ${marginMM}mm;
        margin-left: ${marginLeftMM}mm;
        width: ${widthMM}mm;
        display: flex;
    }
   .label {
    display: flex;
    align-items: center;
    
}

.left {
    display: flex;
    flex-direction: column;
 
}

.right {
    display: flex;
    flex-direction: column;
    margin-left: 3.5mm; /* 控制左右间距 */
    margin-top: -4.4mm;
}

.row {
    display: flex;
    justify-content: space-between;
    width: 20mm; /* 控制两列间距 */
}
.row span:first-child {
    width: 10mm;   /* 左列统一宽度 */
    display: inline-block;
}

.row span:last-child {
    width: 12mm;   /* 右列统一宽度 */
    display: inline-block;
}
.png {
    width: 23mm;
}

.address {
    margin-left: 1.8mm;
    margin-top: 0.1mm;
}
   
     
</style>
</head>
<body>
    ${labelsHTML}
</body>
</html>
`;
        }

        return htmlStr;
    }

    async productionWarehousingFailurePrint(args) {
        const deviceName = args.defaultDeviceName;
        const widthMM = args.width;   // 标签宽度
        const heightMM = args.height;  // 标签高度
        const marginMM = args.margin;   // 边距
        const marginLeftMM = args.marginLeft;   // 右移动距离
        const listDoubleRowLabels = args.isDouble; // 是否双排
        const secondColumnFontSize = args.secondColumnFontSize; // 字号
        Log.info('args:', args)
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
        let config = {
            widthMM: widthMM,
            heightMM: heightMM,
            marginMM: marginMM,
            marginLeftMM: marginLeftMM,
            listDoubleRowLabels: listDoubleRowLabels,
            secondColumnFontSize: secondColumnFontSize,
            configModel: args.configModel,
        }
        let content = this.getProductionWarehousingFailurePrintTemplate(config)

        // 加载内容
        printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);

        // 将 mm 转换为微米（Electron pageSize 单位 µm）
        const pageSize = {
            width: widthMM * 990 * (listDoubleRowLabels ? 2 : 1), // 双排 + 额外边距
            height: (heightMM) * 1000
        };

        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: true, // 静默打印
                printBackground: false,
                deviceName: deviceName,
                copies: 1,
                landscape: false,
                pageSize,
                scaleFactor: 100, // 原始大小打印
                margins: {
                    marginType: 'none' // 禁用默认边距
                }
            }, (success, failureReason) => {
                console.log('打印状态:', success, failureReason);
                // printWindow.openDevTools()
                // printWindow.close();
            });
        });

        return true;
    }



    /**
     * Electron 中动态生成标签 HTML → 加载隐藏窗口 → 调用系统打印机静默打印
     * 生产软件统一打印标签
     * webContents.print()只能覆盖部分打印参数，通常不能直接改写打印机驱动里那套首选项
     * Electron 可以发出“这次按这个打印尺寸”的请求，但最终还是可能被打印机驱动按它自己的模板再处理一次
     *
     * */
    async doPrintTest(args) {
        const deviceName = args.defaultDeviceName;
        let address = args.address;
        const widthMM = args.width;   // 标签宽度
        const heightMM = args.height;  // 标签高度
        const marginMM = args.margin;   // 边距
        const marginLeftMM = args.marginLeft;   // 右移动距离
        const listDoubleRowLabels = args.isDouble; // 是否双排
        const secondColumnFontSize = args.secondColumnFontSize; // 字号
        Log.info('args:', args)
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
        Log.info(address)

        const png = await bwipjs.toBuffer({
            bcid: 'code128',
            text: address,
            scale: 1,
            width: 2,
            height: 4,
            includetext: false,
            textxalign: 'center',
        });


        // 页面内容
        let config = {
            date: `日期：${new Date().getFullYear()}.${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
            address: address,
            widthMM: widthMM,
            heightMM: heightMM,
            marginMM: marginMM,
            marginLeftMM: marginLeftMM,
            listDoubleRowLabels: listDoubleRowLabels,
            secondColumnFontSize: secondColumnFontSize,
            model: args.model,
            configModel: args.configModel,
            commonTraffic: args.commonTraffic,
            flowRange: args.flowRange,
            craftsmanCaliber: args.craftsmanCaliber,
            png: png,
            netprovider:args.netprovider,
        }
        let content = this.getTemplate(config)

        // 加载内容
        printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);

        // 将 mm 转换为微米（Electron pageSize 单位 µm）
        const pageSize = {
            width: widthMM * 990 * (listDoubleRowLabels ? 2 : 1), // 双排 + 额外边距
            height: (heightMM) * 1000
        };

        printWindow.webContents.once('did-finish-load', () => {
            printWindow.webContents.print({
                silent: true, // 静默打印
                printBackground: false,
                deviceName: deviceName,
                copies: 1,
                landscape: false,
                pageSize,
                scaleFactor: 100, // 原始大小打印
                margins: {
                    marginType: 'none' // 禁用默认边距
                }
            }, (success, failureReason) => {
                console.log('打印状态:', success, failureReason);
                // printWindow.openDevTools()
                // printWindow.close();
            });
        });

        return true;
    }


    /**
     * 打印测试函数
     *
     * */
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
                margins: {marginType: 'none'},
                scaleFactor: 100 // 原始大小打印
            }, (success, failureReason) => {
                console.log('打印状态:', success, failureReason);
                // printWindow.close();
            });
        });

        return true;
    }



    /**
     *  有线设备成功检验标签打印 单排
     *
     * */
    async printSuccessSingleRowInspectLabel5012(args, event) {
        let message = args.message
        const deviceName = args.defaultDeviceName;
        let address = args.address;
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

        const png = await bwipjs.toBuffer({
            bcid: 'code128',
            text: address,
            scale: 1,
            width: 2,
            height: 4,
            includetext: false,
            textxalign: 'center',
        });


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
            padding-left: ${marginLeftMM}mm;
            gap: 3mm;
            width: ${widthMM}mm;
            height: ${heightMM}mm;
             margin-top: ${marginMM}mm;
        }
        .barcode-container {
            margin-top: -1mm;
            margin-left: 1mm;
            width: 22mm;
            height: 10mm;
            text-align: center;
        }
        .barcode-number {
            margin-top: -0.5mm;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-container">
        <img style="width: 25mm;height: 5mm;" src="data:image/jpg;base64,${png.toString('base64')}" />
        <div class="barcode-number">${address}</div>
    </div>
    <span  style=" margin-left: 6mm ">${message}</span>
</div>
</body>
</html>

        `;


        printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
        /*控制纸张大小*/
        const pageSize = {
            width: widthMM * 990 * (listDoubleRowLabels ? 2 : 1), // 双排 + 额外边距
            height: (heightMM) * 990
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


        return true;
    }

    /**
     *  有线设备失败检验标签打印 单排
     *
     * */
    printErrorSingleRowInspectLabel5012(args, event) {
        let message = args.message
        const deviceName = args.defaultDeviceName;
        let address = args.address;
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
              padding-left: ${marginLeftMM}mm;
            width: ${widthMM}mm;
            height: ${heightMM}mm;
             margin-top: ${marginMM}mm;
            display: flex;
        }
        .barcode-number {
            width: 22mm;
        }
 
    </style>
</head>
<body>
<div class="container">
    <div class="barcode-number">${address}</div>
    <p  style="    margin-top: -0.2mm;margin-left: -2mm">${message}</p>
</div>
</body>
</html>

        `;


        printWindow.loadURL(`data:text/html;charset=UTF-8,${encodeURIComponent(content)}`);
        /*控制纸张大小*/
        const pageSize = {
            width: widthMM * 990 * (listDoubleRowLabels ? 2 : 1), // 双排 + 额外边距
            height: (heightMM) * 990
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
                // printWindow.close();
            });
        });

        return true;
    }

}


HardwareController.toString = () => '[class HardwareController]';
module.exports = HardwareController;  