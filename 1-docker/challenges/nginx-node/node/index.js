const express = require('express');
const mysql = require('mysql2');
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');

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
  'CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, PRIMARY KEY (id))'
);

const insertName = async () => {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });
  await pool
    .promise()
    .query('INSERT INTO people(name) VALUES (?)', [randomName]);
};

const app = express();

app.get('/', async (_req, res) => {
  await insertName();
  const [rows] = await pool.promise().query('SELECT * FROM people');
  res.setHeader('Content-type', 'text/html');
  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Full Cycle</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    </head>
    <body class="container">
      </br>
      <h1>Full Cycle Rocks!</h1>
      </br>
      <div class="container-fluid">
        <button onclick="location.reload()" type="button" class="btn btn-primary">Click here to add names</button>
        <p>...Or just reload the page to add them</p>
      <div>
      </br>
      <div class="container-fluid">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
          </tr>
          </thead>
          <tbody>
          ${rows
            .map(
              (user) =>
                `
                  <tr>
                    <th scope="row">${user.id}</th>
                    <td>${user.name}</td>
                  </tr>
                
                `
            )
            .join(' ')}
          </tbody>
        </table>
      <div>
    </body>
  </html>
  `);
});

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
