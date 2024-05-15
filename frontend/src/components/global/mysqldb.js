const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池最大连接数
  host: '114.115.179.61',
  user: 'valve_mbus',
  password: 'qdhlm',
  database: 'valve_produce',
  port: 3306
});

// 执行查询的函数
export function getUserByUserNameAndPassWork(userName, password) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      // 执行查询
      connection.query(
        `SELECT name, pwd FROM sys_user WHERE name = ? AND pwd = ?`,
        [userName, password],
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
