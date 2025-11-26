const express = require('express');
const router = express.Router();
const db = require('../db');

// list providers (basic)
router.get('/', async (req,res) => {
  const q = await db.query('SELECT id,name,category,address,active FROM providers LIMIT 100');
  res.json({providers:q.rows});
});

// provider detail
router.get('/:id', async (req,res) => {
  const q = await db.query('SELECT * FROM providers WHERE id=$1', [req.params.id]);
  if(!q.rows.length) return res.status(404).json({error:'not found'});
  res.json(q.rows[0]);
});

module.exports = router;
