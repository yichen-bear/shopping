const mysql = require('mysql2');

// 建立連線池 (Pool)，效率比單一連線更好
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',         // MySQL 帳號
    password: 'Sophie4321$@', // MySQL 密碼
    database: 'my_shop',
    waitForConnections: true,
    connectionLimit: 10
});

// 使用 Promise 版本，方便配合 async/await
module.exports = pool.promise();