const express = require('express');
const mysql = require('mysql2');

const PORT = 3000;

const getRandomName = async () => {
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  return `${data?.results?.at(0)?.name?.first} ${
    data?.results?.at(0)?.name?.last
  }`;
};

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 60000,
  queueLimit: 0,
});

pool.query(
  'CREATE TABLE people IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))'
);

const queryNames = pool.query('SELECT * FROM people', (err, rows, fields) => {
  console.log(err);
  console.log(rows);
  console.log(fields);
  return rows;
});

const insertName = async () => {
  try {
    const name = await getRandomName();
    pool.query('INSERT INTO people(name) VALUES (?)', [name]);
  } catch (err) {
    console.error(err);
  }
};

const app = express();

app.get('/', async (_req, res) => {
  await insertName();
  const names = queryNames();
  res.send(`
    <h1>Full Cycle Rocks!</h1>
    <ul>
      ${names.map((name) => `<li>${name}</li>`)}
    </ul>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
