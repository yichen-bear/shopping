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

router.post('/add-new', async (req, res) => {
  const { name, price, r, g, b } = req.body;
  // 這裡執行 INSERT INTO products ...
});

// 新增一個檢查顏色是否存在的 API
router.get('/check-color', async (req, res) => {
  const { r, g, b } = req.query; // 接收前端傳來的 r, g, b 參數
  try {
    // 查詢資料庫中是否有完全符合這三個 RGB 數值的商品
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE red_value = ? AND green_value = ? AND blue_value = ?',
      [parseInt(r), parseInt(g), parseInt(b)]
    );

    if (rows.length > 0) {
      // 如果有找到，回傳 exists: true 以及原本商品的資訊（包含價格）
      res.json({ exists: true, originalProduct: rows[0] });
    } else {
      // 如果沒找到，回傳 exists: false
      res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "資料庫比對失敗" });
  }
});

module.exports = router;