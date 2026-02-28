# 購物網站練習

這是一個使用 **Vue.js** 作為前端、**Node.js (Express)** 作為後端的全棧購物網站練習專案。

## 使用技術棧

- **前端:** Vue 3 (Vite), Vue Router
- **後端:** Node.js, Express
- **資料庫:** MySQL
- **版本控制:** Git / GitHub

## 專案結構說明

- `/frontend`: Vue 3 前端專案
- `/backend`: Node.js Express 後端 API 伺服器

## 啟動步驟

- **後端啟動**

  ```
  cd backend
  npm install
  node index.js
  ```
- **前端啟動**
  ```
  cd frontend
  npm install
  npm run dev
  ```
  - **資料庫資料操作**
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

## 筆記
- **async** => 代表非同步函數         \ 通常一起使用
- **await** => 先做別的事，好了再回來  /
- **JSON.stringify()** => 把東西變字串(string)
- **SQL JOIN** => 
INNER JOIN: 左右皆符合回傳
LEFT JOIN: 左表全回傳，右表符合才顯示
RIGHT JOIN: 右表全回傳，左表符合才顯示
