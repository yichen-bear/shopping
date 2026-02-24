const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // 引入加密工具
const jwt = require('jsonwebtoken'); // 引入標籤工具

const app = express();
app.use(cors());
app.use(express.json()); // 讓 Node.js 看得懂 JSON 格式的資料

const users = []; // 暫時當作資料庫
const JWT_SECRET = "my_super_secret_key"; // 這是你的簽名私鑰

// --- 註冊 API ---
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    // 1. 檢查使用者是否已存在
    const userExists = users.find(u => u.email === email);
    if (userExists) return res.status(400).send("使用者已存在");

    // 2. 加密密碼 (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 存入「資料庫」
    const newUser = { email, password: hashedPassword };
    users.push(newUser);

    res.status(201).send("註冊成功！");
    console.log("目前的使用者名單：", users);
});

// 啟動伺服器
app.listen(3000, () => console.log("伺服器跑在 http://localhost:3000"));