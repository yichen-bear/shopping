const express = require('express');
const router = express.Router();

// 模擬商品資料庫
const products = [
  { id: 1, name: "極簡風手錶", price: 1200, image: "https://picsum.photos/200/200?random=1" },
  { id: 2, name: "降噪藍牙耳機", price: 3500, image: "https://picsum.photos/200/200?random=2" },
  { id: 3, name: "機械鍵盤", price: 2800, image: "https://picsum.photos/200/200?random=3" }
];

// 取得所有商品的 API (路徑會變成 /api/products)
router.get('/', (req, res) => {
  res.json(products);
});

// 導出這份清單，讓 cart.js 也能查到商品名稱
module.exports = { router, products };