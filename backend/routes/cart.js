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

// 從購物車移除
router.delete('/:productId', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "請先登入！" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // 從 URL 參數取得 productId，注意轉成 Number 才能跟資料比對
        const targetId = Number(req.params.productId);

        // 找到該使用者的這項商品，並只刪除一個 (避免一次刪掉所有同 ID 商品)
        const index = carts.findIndex(c => c.user === decoded.email && c.productId === productId);
        
        if (index !== -1) {
            carts.splice(index, 1); // 真正從陣列中移除
            res.json({ message: "已從購物車刪除！" });
        } else {
            res.status(404).json({ message: "購物車內找不到此商品" });
        }
    } catch (err) {
        res.status(403).json({ message: "證件無效" });
    }
});

module.exports = router;