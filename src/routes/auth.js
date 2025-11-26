const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// simple register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const hash = await bcrypt.hash(password || Math.random().toString(36).slice(-8), 10);
  const result = await db.query(
    'INSERT INTO users(name,email,phone,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role',
    [name,email,phone,hash,role||'customer']
  );
  res.json(result.rows[0]);
});

// login (password or simple)
router.post('/login', async (req,res) => {
  const { email, password } = req.body;
  const userQ = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = userQ.rows[0];
  if(!user) return res.status(401).json({error:'invalid'});
  const match = await bcrypt.compare(password, user.password_hash);
  if(!match) return res.status(401).json({error:'invalid'});
  const token = jwt.sign({id:user.id,role:user.role}, process.env.JWT_SECRET || 'shh', {expiresIn:'7d'});
  res.json({token});
});

module.exports = router;
