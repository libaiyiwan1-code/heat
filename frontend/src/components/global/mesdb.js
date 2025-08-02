const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池最大连接数
  host: '192.168.0.159',
  user: 'root',
  password: '1234.abcd',
  database: 'hmes',
  port: 3336
});



export function getWorkConfigParamByWorkNo(workNo) {
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
        `SELECT pwcp.id FROM pre_work_config_param pwcp inner join pre_work pw on pw.id=pwcp.work_id WHERE  pw.work_no = ? `,
        [workNo],
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


