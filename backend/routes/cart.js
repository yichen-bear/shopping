const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../mysql_db'); // 引入資料庫

const JWT_SECRET = "my_super_secret_key";

// 加入購物車 API
router.post('/', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "請先登入！" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { productId } = req.body;
        
        // 寫入 SQL 資料庫
        await db.execute(
            'INSERT INTO carts (user_email, product_id) VALUES (?, ?)',
            [decoded.email, productId]
        );
        
        res.json({ message: "已加入購物車！" });
    } catch (err) {
        res.status(403).json({ message: "證件無效" });
    }
});

// 獲取個人購物車 API
router.get('/get-cart', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send("未登入");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 使用 SQL JOIN 語句一次抓出購物車資料與商品詳細資訊
        const sql = `
            SELECT p.id, p.name, p.price, p.red_value, p.green_value, p.blue_value
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_email = ?
        `;
        const [rows] = await db.execute(sql, [decoded.email]);
        
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("伺服器錯誤");
    }
});

// 從購物車移除 API
router.delete('/:productId', async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: "請先登入！" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const targetId = Number(req.params.productId);

        // 執行 SQL DELETE 語句，並限制為該使用者的商品
        const [result] = await db.execute(
            'DELETE FROM carts WHERE user_email = ? AND product_id = ? LIMIT 1',
            [decoded.email, targetId]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: "已從購物車刪除！" });
        } else {
            res.status(404).json({ message: "購物車內找不到此商品" });
        }
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "證件無效" });
    }
});

module.exports = router;