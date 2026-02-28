const express = require('express');
const router = express.Router();
const db = require('../mysql_db'); 

// 取得所有商品的 API 
router.get('/', async (req, res) => {
  try {
    // 從 MySQL 查詢商品
    const [rows] = await db.execute('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "抓取商品失敗" });
  }
});

module.exports = router;