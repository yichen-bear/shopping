const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bcrypt = require('bcryptjs'); // 引入加密工具
const jwt = require('jsonwebtoken'); // 引入標籤工具

const app = express();
app.use(cors());
app.use(express.json()); // 讓 Node.js 看得懂 JSON 格式的資料

const users = []; // 暫時當作資料庫
const JWT_SECRET = "my_super_secret_key"; // 這是你的簽名私鑰


// 細節在 auth.js
app.use('/api/auth', authRoutes);

// 模擬商品資料庫
const products = [
  { id: 1, name: "極簡風手錶", price: 1200, image: "https://picsum.photos/200/200?random=1" },
  { id: 2, name: "降噪藍牙耳機", price: 3500, image: "https://picsum.photos/200/200?random=2" },
  { id: 3, name: "機械鍵盤", price: 2800, image: "https://picsum.photos/200/200?random=3" }
];

// 取得所有商品的 API
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 模擬購物車資料庫
let carts = []; 

app.post('/api/cart', (req, res) => {
    // 1. 從 Header 拿出身分證 (Token)
    const token = req.headers['authorization'];
    
    if (!token) return res.status(401).json({ message: "請先登入！" });

    try {
        // 2. 驗證證件對不對
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. 證件對了，把商品加進購物車
        const { productId } = req.body;
        carts.push({ user: decoded.email, productId });
        
        console.log("目前購物車狀態：", carts);
        res.json({ message: "已加入購物車！", cartCount: carts.length });
    } catch (err) {
        res.status(403).json({ message: "證件無效或已過期" });
    }
});

app.get('/api/get-cart', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("未登入");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // 只找回屬於這個使用者的購物車項目
        const userCart = carts.filter(c => c.user === decoded.email);
        
        // 進階：把商品 ID 換成完整的商品資訊
        const cartDetails = userCart.map(item => {
            return products.find(p => p.id === item.productId);
        });

        res.json(cartDetails);
    } catch (err) {
        res.status(403).send("無效 Token");
    }
});

// 啟動伺服器
app.listen(3000, () => console.log("伺服器跑在 http://localhost:3000"));
