const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池最大连接数
  host: '124.70.68.52',
  user: 'admin',
  password: '1234.abcd',
  database: 'hems',
  port: 3336
});



