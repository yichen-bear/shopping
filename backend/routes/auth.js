const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 這邊要引用主檔案定義的資料（暫時做法，之後接資料庫就不用這樣傳）
// 假設我們會從 index.js 把 users 和 JWT_SECRET 傳進來，或是共用
const JWT_SECRET = "my_super_secret_key"; 
// 注意：因為現在 users 存在記憶體，分檔後會抓不到，
// 為了教學方便，我們先在 auth.js 裡定義一個內部的 users，或是維持在 index.js
// 這邊我們先假設 users 陣列暫時放在這，方便你測試
const users = []; 

// --- 註冊 API (現在路徑會變成 /api/auth/register) ---
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const userExists = users.find(u => u.email === email);
    if (userExists) return res.status(400).json({ message: "這個帳號已經被註冊過囉！" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    console.log("註冊成功，目前名單：", users);
    res.status(201).json({ message: "註冊成功！請切換到登入模式。" });
});

// --- 登入 API (現在路徑會變成 /api/auth/login) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: "找不到該使用者" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "密碼錯誤" });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "登入成功！", token });
});

module.exports = router;