const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

// 版本号
const version = packageJson.version;

// NSIS 脚本路径
const nsisPath = path.join(__dirname, 'build', 'installer.nsh');

// 读取 NSIS 脚本
let nsisScript = fs.readFileSync(nsisPath, 'utf8');

// 替换版本号
nsisScript = nsisScript.replace(/!define VERSION ".*"/, `!define VERSION "${version}"`);

// 写回 NSIS 脚本
fs.writeFileSync(nsisPath, nsisScript);

console.log(`update script version to ${version}`);
