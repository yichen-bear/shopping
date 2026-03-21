# 🎨 顏色購物站

這是一個全端的練習專案，以「色彩」為主題，模擬從瀏覽商品、加入購物車到下單結帳的完整電商流程。使用者可以進行會員註冊與登入，並管理自己的購物清單與查看歷史訂單。



## 技術架構

### 前端 (Frontend)
- Vue 3 
- Vue Router 

### 後端 (Backend)
- Node.js
- Express
- Bcrypt
- MySQL



## 如何運行

### 1. 複製專案
```
git clone https://github.com/yichen-bear/shopping
```

### 2. 前端設定
```
cd frontend
npm install
npm run dev
```
### 3. 後端設定
在 backend 目錄建立 `.env` 檔案
```
DB_HOST=turntable.proxy.rlwy.net
DB_PORT=50024
DB_USER=root
DB_PASS=uBocPNmfTAsnoIWVIUAgwAdwxCwULTAJ
DB_NAME=railway
JWT_SECRET=my_super_secret_key
```
```
cd backend
npm install
node index.js
```

## 資料庫筆記
```
USE railway;
```
```
SELECT * FROM users;
DELETE FROM users WHERE email = 'user@example.com';
SELECT COUNT(*) FROM users;
```
```
SELECT * FROM carts;
```
```
SELECT * FROM products;
INSERT INTO products (name, price, image) 
VALUES ('商品名稱', 價格, '圖片網址');
UPDATE products SET price = 850 WHERE id = 4;
DELETE FROM products WHERE id = 4;
```