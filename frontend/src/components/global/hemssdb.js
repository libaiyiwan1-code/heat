const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池最大连接数
  host: '124.70.93.122',
  user: 'admin',
  password: 'qdHLM88983168',
  database: 'hems',
  port: 3336

  // host: '124.70.68.52',
  // user: 'admin',
  // password: '1234.abcd',
  // database: 'hems',
  // port: 3336
});
export function checkTerminalIMEIExist(imei) {
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
export function checkCollectorIMEIExist(imei) {
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
        `SELECT imei FROM arc_collector WHERE  imei = ? and status>=0`,
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

export function checkRecentlyUploadedData(address, tableName) {
  return new Promise((resolve, reject) => {
    const allowedTables = ['col_terminal_data_meter_valve', 'col_terminal_data_valve','col_terminal_data_measure_point','col_terminal_data_card_valve'];
    if (!allowedTables.includes(tableName)) {
      reject(new Error('Invalid table name'));
      return;
    }

    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      // Use backticks to escape the table name
      const query = `
        SELECT atdv.collect_time as collectTime
        FROM arc_terminal AT
        INNER JOIN \`${tableName}\` atdv
        ON atdv.terminal_id = AT.id AND AT.status >= 0
        WHERE AT.mac_addr = ? AND atdv.collect_time >= NOW() - INTERVAL 1 HOUR
      `;

      connection.query(query, [address], (error, results) => {
        // 释放连接
        connection.release();
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}
