const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { products } = require('./products'); // 引入商品清單來比對資料

const JWT_SECRET = "my_super_secret_key";
let carts = []; 

// 加入購物車
router.post('/', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "請先登入！" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { productId } = req.body;
        carts.push({ user: decoded.email, productId });
        res.json({ message: "已加入購物車！" });
    } catch (err) {
        res.status(403).json({ message: "證件無效" });
    }
});

// 獲取個人購物車
router.get('/get-cart', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("未登入");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userCart = carts.filter(c => c.user === decoded.email);
        const cartDetails = userCart.map(item => products.find(p => p.id === item.productId));
        res.json(cartDetails);
    } catch (err) {
        res.status(403).send("無效 Token");
    }
});

module.exports = router;