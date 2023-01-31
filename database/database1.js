const sql = require('mysql2');

const connection=sql.createConnection({
    host:'127.0.0.1',
    port: '3306',
    user:'root',
    password:'mydatabase',
    database:'blog'
    
  });

module.exports=connection;