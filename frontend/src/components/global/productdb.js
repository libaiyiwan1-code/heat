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

export function getIdByUsername(username) {
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
        `SELECT id
         FROM sys_user
         WHERE name = ?
           and status = 1`,
        [username],
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

export function getIdByMacAddr(macaddr) {
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
        `SELECT id
         FROM arc_nbvalveproduce
         WHERE macaddr = ?`,
        [macaddr],
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


export function insertNBValueProduce(data) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      // 执行插入
      connection.query(
        `INSERT INTO arc_nbvalveproduce (userid, customerid, valveModel, valveVersion, protocolid,
                                         IMEI, netprovider, macaddr, produceDate, iccid, description, status,
                                         customer, expireDate, TempProbeAddr)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.userid, data.customerid, data.valveModel, data.valveVersion,
          data.protocolid, data.IMEI, data.netprovider, data.macaddr,
          data.produceDate, data.iccid, data.description, data.status,
          data.customer, data.expireDate, data.TempProbeAddr],
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


export function countProductQuantityCountByUserId(userId, date) {
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
        `SELECT count(1) as quantity
         FROM arc_nbvalveproduce
         WHERE userid = ?
           and DATE_FORMAT(produceDate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')`,
        [userId, date],
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


