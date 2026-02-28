const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();
app.use(cors());
app.use(express.json());

// 註冊所有路由
app.use('/api/auth', authRoutes);     // 處理 註冊、登入
app.use('/api/products', productRoutes); // 處理 商品清單
app.use('/api/cart', cartRoutes);     // 處理 購物車操作

app.listen(3000, () => console.log("伺服器跑在 http://localhost:3000"));