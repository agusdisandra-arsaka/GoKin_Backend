const express = require('express');
const router = express.Router();
const db = require('../db');

// create order
router.post('/', async (req,res) => {
  const { customer_id, provider_id, items, total_amount, scheduled_at } = req.body;
  const q = await db.query(
    'INSERT INTO orders(customer_id,provider_id,items,total_amount,scheduled_at) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [customer_id,provider_id,items,total_amount,scheduled_at]
  );
  res.status(201).json(q.rows[0]);
});

// get order
router.get('/:id', async (req,res) => {
  const q = await db.query('SELECT * FROM orders WHERE id=$1', [req.params.id]);
  if(!q.rows.length) return res.status(404).json({error:'not found'});
  res.json(q.rows[0]);
});

module.exports = router;
