const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 10, // 连接池最大连接数
  host: '114.115.179.61',
  // host: '10.255.255.1',
  user: 'valve_mbus',
  password: 'qdhlm',
  database: 'valve_produce',
  port: 3306,
  connectTimeout: 8000, // 8秒连接超时：获取连接超过5秒直接报错
  timeout: 10000        // 10秒查询超时：执行SQL超过10秒直接报错
});

export function getVacvalveproduceByMacAddr(macaddr) {
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
         FROM arc_vacvalveproduce
         WHERE address = ?`,
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
export function countVACProductQuantityCountByUserId(userId, date) {
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
        `SELECT SUBSTRING(address, - 3) AS quantity
         FROM arc_vacvalveproduce
         WHERE userid = ?
           AND DATE_FORMAT(produceDate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')
         ORDER BY address DESC LIMIT 1;`,
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
export function getIdByMacAddrVACProduce(macaddr) {
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
         FROM arc_vacvalveproduce
         WHERE address = ?`,
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

export function getIdByMacAddrLORAProduce(context, macaddr) {
  return new Promise((resolve) => {
    // 从连接池获取连接（若超过 8 秒未获取到连接，驱动会自动抛出 err）
    // 1. 临时创建一个错误的“沙盒连接池”来模拟网络不好
    // const mockBadPool = mysql.createPool({
    //   host: '10.255.255.1', //  模拟断网
    //   user: 'valve_mbus',
    //   password: 'qdhlm',
    //   database: 'valve_produce',
    //   connectTimeout: 9000 // 5秒超时
    // });
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('捕获到生产库连接错误：', err.message);
        context.createLeftSpanMessage('生产库网络连接超时 写地址流程失败', 'red')
        return resolve(false);
      }

      // 执行查询（若执行超过 10 秒，驱动会自动抛出 error）
      connection.query(
        `SELECT id
         FROM arc_loravalveproduce
         WHERE macaddr = ?`,
        [macaddr],
        (error, results) => {
          // 务必释放连接
          connection.release();

          if (error) {
            console.error('捕获到 SQL 执行错误：', error.message);
            context.createLeftSpanMessage('数据库响应超时 写地址流程失败', 'red');
            return resolve(false);
          }

          // 查询成功，返回结果
          resolve(results);
        }
      );
    });
  });
}


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

export function getPrintListByProductName(productName) {
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
        `SELECT ac.printtag
         FROM arc_valvetype av
                inner JOIN arc_customerproduce ac ON ac.hlmproductid = av.id
         where av.name = ?
         GROUP BY printtag`,
        [productName],
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
/**
 * 获取型号关联的最新版本 TODO REMOVE
 * */

export function getLatestVersionByModel(productModel) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      connection.query(
        `
        SELECT
          version_code AS versionCode,
          created_at AS createAt
        FROM prod_version
        WHERE is_latest = 1
          AND status = 1
        LIMIT 1
        `,
        (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            // 👉 这里帮你处理成单对象（不是数组）
            resolve(results[0] || null);
          }
        }
      );
    });
  });
}

export function findModelVersionSupport(productModel,currentVersion) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      connection.query(
        `
          SELECT pvm.is_supported AS isSupported,
                 pvm.has_risk     AS hasRisk
          FROM prod_version pv
                 LEFT JOIN prod_version_model pvm ON pvm.version_id = pv.id
                 LEFT JOIN prod_model pm ON pm.id = pvm.model_id
          WHERE pv.STATUS = 1
            AND pv.version_code = ?
            AND pm.model_code = ?
        `, [currentVersion, productModel],
        (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results[0] || null);
          }
        }
      );
    });
  });
}

/**
 *  根据型号判断是否有其他可替换的版本
 *
 * */
export function hasAlternativeVersionForModel(productModel) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      connection.query(
        `
          SELECT COUNT(0) AS count
          FROM prod_version pv
                 LEFT JOIN prod_version_model pvm ON pvm.version_id = pv.id
                 LEFT JOIN prod_model pm ON pm.id = pvm.model_id
          WHERE pv.STATUS = 1
            AND pvm.has_risk = 0
            AND pvm.is_supported = 0
            AND pm.model_code = ?
        `, [ productModel],
        (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results[0] || null);
          }
        }
      );
    });
  });
}




/**
 * 根据当前型号查询所有可用版本
 * */

export function getAllVersionList(model) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      connection.query(
        `
          SELECT
            pv.version_code AS versionCode,
            pv.created_at AS createAt,
            pv.release_note AS releaseNote,
            pvm.has_risk AS hasRisk,
            pvm.risk_desc AS rirskDesc
          FROM prod_version pv
                 LEFT JOIN prod_version_model pvm ON pvm.version_id = pv.id
                 LEFT JOIN prod_model pm ON pm.id = pvm.model_id
          WHERE pv.status = 1
            AND pvm.has_risk = 0
            AND pm.model_code = ?
          ORDER BY
            CAST(SUBSTRING_INDEX(pv.version_code, '.', 1) AS UNSIGNED) DESC,
            CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(pv.version_code, '.', 2), '.', -1) AS UNSIGNED) DESC,
            CAST(SUBSTRING_INDEX(pv.version_code, '.', -1) AS UNSIGNED) DESC;
        `,[model],
        (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            // 👉 这里帮你处理成单对象（不是数组）
            resolve(results || null);
          }
        }
      );
    });
  });
}


/**
 * 根据型号查询当前登录的版本
 *
 * */
export function getCurrentVersionByModelAndVersion(model, version) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      connection.query(
        `
        SELECT
          v.version_code AS versionCode,
          vm.is_supported AS supported,
          vm.has_risk AS hasRisk
        FROM prod_version v
        JOIN prod_version_model vm ON v.id = vm.version_id
        JOIN prod_model m ON m.id = vm.model_id
        WHERE
--           v.is_latest = 1
--           AND
          v.status = 1
          AND m.model_code = ?
          and v.version_code =?
                `,
        [model,version],
        (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results[0] || null);
          }
        }
      );
    });
  });
}




export function getListSupportedModels() {
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
        `SELECT spm.model, spm.supported
         FROM sys_produce_model spm
        `, (error, results) => {
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


export function getIdByMacAddrNB(macaddr) {
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

export function getIdByMacAddrCardValve(macaddr) {
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
         FROM arc_cardvalveproduce
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

export function checkIMEIExistByCollectorProductDB(imei) {
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
        `SELECT imei FROM arc_collectorproduce WHERE  imei = ? and status>=0`,
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

export function getIdByMacAddrCollector(macaddr) {
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
         FROM arc_collectorproduce
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
//TODO 增加重试前恢复
// export function insertNBValueProduce(context,data) {
//   return new Promise(async (resolve, reject) => {
//
//     // 1. 临时创建一个错误的“沙盒连接池”来模拟网络不好
//     // const mockBadPool = mysql.createPool({
//     //   host: '10.255.255.1', //  模拟断网
//     //   user: 'valve_mbus',
//     //   password: 'qdhlm',
//     //   database: 'valve_produce',
//     //   connectTimeout: 5000 // 5秒超时
//     // });
//
//     // 从连接池中获取连接
//     pool.getConnection((err, connection) => {
//
//       if (err) {
//         // 当 5 秒超时触发时，这里会准时打印错误提示！
//         console.log("捕获到连接错误：", err.message);
//         context.createLeftSpanMessage('生产库网络连接超时，请检查网络设置','red')
//         resolve(false);
//       }
//
//       // 执行插入
//       connection.query(
//         `INSERT INTO arc_nbvalveproduce (userid, customerid, valveModel, valveVersion, protocolid,
//                                          IMEI, netprovider, macaddr, produceDate, iccid, description, status,
//                                          customer, expireDate, TempProbeAddr, PressProbe, TorqueNM, valveDN)
//          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [data.userid, data.customerid, data.valveModel, data.valveVersion,
//           data.protocolid, data.IMEI, data.netprovider, data.macaddr,
//           data.produceDate, data.iccid, data.description, data.status,
//           data.customer, data.expireDate, data.TempProbeAddr, data.PressProbe, data.TorqueNM, data.valveDN],
//         (error, results) => {
//           // 释放连接
//           connection.release();
//           if (error) {
//             // 当 10 秒超时触发时，这里会准时捕获到错误
//             console.error("【测试提示】捕获到 SQL 执行错误:", error.message); // 错误信息通常包含 'PROTOCOL_SEQUENCE_TIMEOUT' 或 'timeout'
//             // 提示前端
//             context.createLeftSpanMessage('数据库响应超时，写入失败！', 'red');
//             resolve(false);
//           } else {
//             resolve(results);
//           }
//         }
//       );
//     });
//   });
// }



export function insertNBValueProduce(context, data) {
  // 定义最大重试次数为 1 次
  const maxRetries = 1;
    // 1. 临时创建一个错误的“沙盒连接池”来模拟网络不好
    // const mockBadPool = mysql.createPool({
    //   host: '10.255.255.1', //  模拟断网
    //   user: 'valve_mbus',
    //   password: 'qdhlm',
    //   database: 'valve_produce',
    //   connectTimeout: 9000 // 5秒超时
    // });
  // 抽离核心执行逻辑，便于递归或循环重试
  const executeInsert = (attempt) => {
    return new Promise((resolve) => {
      // 从连接池中获取连接
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(`[第 ${attempt} 次尝试] 捕获到连接错误：`, err.message);

          // 如果还可以重试，则进行重试
          if (attempt < maxRetries) {
            context.createLeftSpanMessage(`生产库连接超时，正在进行第 ${attempt + 1} 次重试...`, 'orange');
            return resolve(executeInsert(attempt + 1));
          }

          // 超过最大重试次数
          context.createLeftSpanMessage('生产库网络连接超时 写地址流程失败', 'red');
          return resolve(false);
        }

        // 执行插入 SQL
        connection.query(
          `INSERT INTO arc_nbvalveproduce (userid, customerid, valveModel, valveVersion, protocolid,
                                           IMEI, netprovider, macaddr, produceDate, iccid, description, status,
                                           customer, expireDate, TempProbeAddr, PressProbe, TorqueNM, valveDN)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [data.userid, data.customerid, data.valveModel, data.valveVersion,
            data.protocolid, data.IMEI, data.netprovider, data.macaddr,
            data.produceDate, data.iccid, data.description, data.status,
            data.customer, data.expireDate, data.TempProbeAddr, data.PressProbe, data.TorqueNM, data.valveDN],
          (error, results) => {
            // 务必释放连接
            connection.release();

            if (error) {
              console.error(`[第 ${attempt} 次尝试] 捕获到 SQL 执行错误:`, error.message);

              // SQL 执行超时或失败，且可以重试
              if (attempt < maxRetries) {
                context.createLeftSpanMessage(`数据库响应超时，正在进行第 ${attempt + 1} 次重试...`, 'orange');
                return resolve(executeInsert(attempt + 1));
              }

              // 超过最大重试次数
              context.createLeftSpanMessage('数据库响应超时 写地址流程失败', 'red');
              return resolve(false);
            }

            // 执行成功
            resolve(results);
          }
        );
      });
    });
  };

  // 从第 0 次尝试开始执行（0 代表首次执行，1 代表第 1 次重试）
  return executeInsert(0);
}
export function insertLORAValueProduce(context, data) {
  return new Promise((resolve) => {
    // 从连接池获取连接（若超过 8 秒未获取到连接，驱动会自动抛出 err）
    // 1. 临时创建一个错误的“沙盒连接池”来模拟网络不好
    // const mockBadPool = mysql.createPool({
    //   host: '10.255.255.1', //  模拟断网
    //   user: 'valve_mbus',
    //   password: 'qdhlm',
    //   database: 'valve_produce',
    //   connectTimeout: 9000 // 5秒超时
    // });
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('捕获到生产库连接错误：', err.message);
        context.createLeftSpanMessage('生产库网络连接超时 写地址流程失败', 'red');
        return resolve(false);
      }

      // 执行插入 SQL（若执行超过 10 秒，驱动会自动抛出 error）
      connection.query(
        `INSERT INTO arc_loravalveproduce (userid, customerid, valveModel, valveVersion, protocolid,
                                           netprovider, macaddr, produceDate, description, status,
                                           customer, expireDate, TempProbeAddr, PressProbe, TorqueNM, valveDN)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.userid, data.customerid, data.valveModel, data.valveVersion,
          data.protocolid, data.netprovider, data.macaddr,
          data.produceDate, data.description, data.status,
          data.customer, data.expireDate, data.TempProbeAddr, data.PressProbe, data.TorqueNM, data.valveDN],
        (error, results) => {
          // 务必释放连接
          connection.release();

          if (error) {
            console.error('捕获到 SQL 执行错误：', error.message);
            context.createLeftSpanMessage('数据库响应超时 写地址流程失败', 'red');
            return resolve(false);
          }

          // 执行成功，返回结果
          resolve(results);
        }
      );
    });
  });
}
export function insertCollectorProduce(data) {
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
        `INSERT INTO arc_collectorproduce (userid, customerid, collectorModel, collectorVersion, protocolid, IMEI,
                                           netprovider, macaddr, produceDate, description, status, iccid,
                                           customer)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.userid, data.customerid, data.collectorModel, data.collectorVersion,
          data.protocolid, data.IMEI, data.netprovider, data.macaddr,
          data.produceDate, data.description, data.status, data.iccid,
          data.customer],
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

export function countProductCollectorQuantityCountByUserId(userId, date) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      // 执行查询 对每条记录取出 macaddr 字段的 后3位字符，
      connection.query(
        `SELECT SUBSTRING(macaddr, - 3) AS quantity
         FROM arc_collectorproduce
         WHERE userid = ?
           and DATE_FORMAT(produceDate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')
         ORDER BY macaddr DESC LIMIT 1;
           `,
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
export function insertCardValueProduce(data) {
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
        `INSERT INTO arc_cardvalveproduce (userid, customerid, valveModel, valveVersion, protocolid,IMEI,
                                           netprovider, macaddr, produceDate, description, status,iccid,
                                           customer, expireDate, TempProbeAddr)
         VALUES (?, ?, ?, ?, ?,? ,?,?, ?, ?,?, ?, ?, ?, ?)`,
        [data.userid, data.customerid, data.valveModel, data.valveVersion,
          data.protocolid,data.IMEI, data.netprovider, data.macaddr,
          data.produceDate, data.description, data.status,data.iccid,
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


export function countProductCardValveDeviceQuantityCountByUserId(userId, date) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      // 执行查询 对每条记录取出 macaddr 字段的 后3位字符，
      connection.query(
        `SELECT SUBSTRING(macaddr, - 3) AS quantity
         FROM arc_cardvalveproduce
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


export function countProductNBDeviceQuantityCountByUserId(userId, date) {
  return new Promise((resolve, reject) => {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err)
        reject(err);
        return;
      }
      // 执行查询 对每条记录取出 macaddr 字段的 后3位字符，
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


export function countProductLORADeviceQuantityCountByUserId(context, userId, date) {
  return new Promise((resolve) => {
    // 从连接池获取连接（若超过 8 秒未获取到连接，驱动会自动抛出 err）
    // 1. 临时创建一个错误的“沙盒连接池”来模拟网络不好
    // const mockBadPool = mysql.createPool({
    //   host: '10.255.255.1', //  模拟断网
    //   user: 'valve_mbus',
    //   password: 'qdhlm',
    //   database: 'valve_produce',
    //   connectTimeout: 9000 // 5秒超时
    // });
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('捕获到生产库连接错误：', err.message);
        context.createLeftSpanMessage('生产库网络连接超时 请重新写地址', 'red');
        return resolve(false);
      }

      // 执行查询（若执行超过 10 秒，驱动会自动抛出 error）
      connection.query(
        `SELECT SUBSTRING(macaddr, - 3) AS quantity
         FROM arc_loravalveproduce
         WHERE userid = ?
           AND DATE_FORMAT(produceDate, '%Y-%m-%d') = DATE_FORMAT(?, '%Y-%m-%d')
         ORDER BY macaddr DESC LIMIT 1;`,
        [userId, date],
        (error, results) => {
          // 务必释放连接
          connection.release();

          if (error) {
            console.error('捕获到 SQL 执行错误：', error.message);
            context.createLeftSpanMessage('数据库响应超时 请重新写地址', 'red');
            return resolve(false);
          }

          // 将第一个结果的 quantity 转换为数字类型
          if (results.length > 0) {
            results[0].quantity = parseInt(results[0].quantity, 10);
          }

          // 查询成功，返回结果
          resolve(results);
        }
      );
    });
  });
}
