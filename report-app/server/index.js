const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'report_app_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.post('/signup', (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
  
    const query = 'INSERT INTO users (first_name, last_name, age, email, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [first_name, last_name, age, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: 'User registered successfully!' });
    });
  });
  
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err || results.length === 0) return res.status(401).send({ message: 'Invalid credentials' });
  
      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) return res.status(401).send({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
      res.send({ token, user: { first_name: user.first_name, last_name: user.last_name, age: user.age } });
    });
  });

  app.get('/history', (req, res) => {
    const userId = req.user.id; // Make sure user is authenticated
    const query = 'SELECT * FROM reports WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
  });
  
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

