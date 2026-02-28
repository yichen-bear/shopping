const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../mysql_db'); 

const JWT_SECRET = "my_super_secret_key"; 

// 註冊 API
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: "帳號已存在" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        
        res.status(201).json({ message: "註冊成功！" });
    } catch (err) {
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 登入 API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 從資料庫查詢使用者
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) return res.status(400).json({ message: "找不到該使用者" });

        // 比對資料庫中的加密密碼
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "密碼錯誤" });

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "登入成功！", token });
    } catch (err) {
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

module.exports = router;