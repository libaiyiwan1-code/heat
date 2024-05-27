const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池最大连接数
  host: '124.70.93.122',
  user: 'admin',
  password: 'qdHLM88983168',
  database: 'hems',
  port: 3336
});
export function checkIMEIExist(imei) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }

      // 执行查询
      connection.query(
        `SELECT imei FROM arc_terminal WHERE  imei = ? and status>=0`,
        [imei],
        (error, results) => {
          // 释放连接
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  });
}
