const express = require('express');
const router = express.Router();
const db = require('../db');

// simulate create QRIS invoice
router.post('/qris', async (req,res) => {
  const { order_id, amount } = req.body;
  // In production integrate with gateway to create QR
  const external_id = 'QR-'+Math.random().toString(36).slice(2,9);
  const q = await db.query(
    'INSERT INTO payments(order_id,amount,method,status,external_id,payload) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [order_id,amount,'qris','pending',external_id,{}]
  );
  res.json({invoice_id:q.rows[0].id,external_id});
});

// webhook endpoint for payment gateway
router.post('/webhook', async (req,res) => {
  // process gateway payload
  const { external_id, status } = req.body;
  const p = await db.query('UPDATE payments SET status=$1 WHERE external_id=$2 RETURNING *', [status, external_id]);
  res.json({ok:true, payment:p.rows[0]});
});

module.exports = router;
