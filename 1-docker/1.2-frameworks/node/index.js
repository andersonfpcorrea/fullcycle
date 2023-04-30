const express = require('express');
const app = express();
const mysql = require('mysql');

const PORT = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
};

const connection = mysql.createConnection(config);

const sql = `INSERT INTO people(name) values('Anderson')`;

connection.query(sql);
connection.end();

app.get('/', (req, res) => {
  res.send('<h1>Full cycle</h1>');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
