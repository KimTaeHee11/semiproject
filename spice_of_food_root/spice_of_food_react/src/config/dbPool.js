const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '12345678', //1234
    database: 'edudb',
    connectionLimit: 10,
    waitForConnections: true,
});
module.exports = pool;
