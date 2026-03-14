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

// 新增商品到清單的 API
router.post('/add-new', async (req, res) => {
    const { name, price, r, g, b } = req.body;

    // 基本檢查，確保資料都有傳過來
    if (!name || price === undefined) {
        return res.status(400).json({ message: "資料不完整" });
    }

    try {
        // 將新顏色寫入 products 資料表
        // 注意：這裡使用的欄位名稱要對應你的資料庫 (red_value, green_value, blue_value)
        await db.execute(
            'INSERT INTO products (name, price, red_value, green_value, blue_value) VALUES (?, ?, ?, ?, ?)',
            [name, price, r, g, b]
        );

        res.json({ message: "新顏色已成功上架！" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "上架失敗，可能名稱重複或資料庫錯誤" });
    }
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

// 根據 ID 取得特定商品的詳細資訊
router.get('/:id', async (req, res) => {
  const productId = req.params.id; // 取得 URL 中的 ID 參數
  try {
    // 從 MySQL 查詢該 ID 的商品
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (rows.length > 0) {
      res.json(rows[0]); // 回傳找到的單一商品物件
    } else {
      res.status(404).json({ message: "找不到該商品" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "抓取詳細資訊失敗" });
  }
});

module.exports = router;