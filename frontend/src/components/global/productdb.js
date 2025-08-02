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
        `SELECT id,pwd
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


export function getDefaultPassword(type) {
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
        `SELECT pass_word as passWord
         FROM arc_produce_password
         WHERE type = ?`,
        [type],
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

export function findMacAddr() {
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
        `SELECT mac_addr as macAddr,machine_number as machineNumber,produce_machine as produceMachine
         FROM arc_computer_mac
        `,
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
                                         customer, expireDate, TempProbeAddr,PressProbe,TorqueNM)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
        [data.userid, data.customerid, data.valveModel, data.valveVersion,
          data.protocolid, data.IMEI, data.netprovider, data.macaddr,
          data.produceDate, data.iccid, data.description, data.status,
          data.customer, data.expireDate, data.TempProbeAddr,data.PressProbe,data.TorqueNM],
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
        `SELECT SUBSTRING(macaddr, - 3) AS quantity
         FROM arc_nbvalveproduce
         WHERE userid = ?
           AND DATE_FORMAT(produceDate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')
         ORDER BY macaddr DESC LIMIT 1;`,
        [userId, date],
        (error, results) => {
          // 释放连接
          connection.release();
          if (error) {
            reject(error);
          } else {
            // 将第一个结果的quantity转换为数字类型
            if (results.length > 0) {
              results[0].quantity = parseInt(results[0].quantity, 10);
            }
            resolve(results);
          }
        }
      );
    });
  });
}


