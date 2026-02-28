<template>
  <div class="container">
    <h1>我的購物站 - {{ isLoginMode ? '登入' : '註冊' }}</h1>

    <form v-if="!token" @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required /><br />
      <input v-model="password" type="password" placeholder="密碼" required /><br />
      <button type="submit">{{ isLoginMode ? '登入' : '註冊' }}</button>
      <p @click="isLoginMode = !isLoginMode" style="cursor: pointer; color: blue;">
        {{ isLoginMode ? '還沒有帳號？按此註冊' : '已經有帳號？按此登入' }}
      </p>
    </form>

    <div v-if="token">
      <h2>精選商品</h2>
      <div class="products-grid">
        <div v-for="p in allProducts" :key="p.id" class="product-card">
          <div 
            class="color-box"
            :style="{ backgroundColor: `rgb(${p.red_value}, ${p.green_value}, ${p.blue_value})` }"
          ></div>          
          <h3>{{ p.name }}</h3>
          <p>價格：${{ p.price }}</p>
          <button @click="addToCart(p.id)">加入購物車</button>
        </div>
      </div>

      <hr />

      <div class="cart-section">
        <h2>我的購物車 ({{ userCart.length }} 件)</h2>
        <ul v-if="userCart.length > 0">
          <li v-for="(item, index) in userCart" :key="index">
            {{ item.name }} - ${{ item.price }}
            <button @click="removeFromCart(item.id)" style="background-color: #ff9800;">刪除</button>
          </li>
        </ul>
        <p v-else>購物車空空的喔！</p>
      </div>

      <div class="token-box">
        <button @click="handleLogout" style="background-color: #ff4d4d;">登出</button>
      </div>
    </div>

    <p style="color: red;">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// --- 狀態定義 ---
const email = ref('')
const password = ref('')
const message = ref('')
const isLoginMode = ref(true)
const token = ref(localStorage.getItem('myToken') || '')

const allProducts = ref([]) // 商店裡的商品
const userCart = ref([])    // 購物車裡的商品

// --- 取得資料函數 ---
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    allProducts.value = await response.json();
  } catch (error) { console.error("商品抓取失敗"); }
};

const fetchCart = async () => {
  if (!token.value) return;
  try {
    const response = await fetch('http://localhost:3000/api/cart/get-cart', {
      headers: { 'Authorization': token.value }
    });
    if (response.ok) {
      userCart.value = await response.json();
    }
  } catch (error) { console.error("購物車抓取失敗"); }
};

// --- 操作函數 ---
const handleSubmit = async () => {
  message.value = "處理中...";
  try {
    const path = isLoginMode.value ? 'login' : 'register';
    const response = await fetch(`http://localhost:3000/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const result = await response.json();
    message.value = result.message;

    if (response.ok && isLoginMode.value) {
      token.value = result.token;
      localStorage.setItem('myToken', result.token);
      initSite(); // 登入成功後初始化資料
    }
  } catch (error) { message.value = "連線失敗"; }
};

const addToCart = async (productId) => {
  try {
    const response = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token.value 
      },
      body: JSON.stringify({ productId })
    });
    const result = await response.json();
    if (response.ok) {
      await fetchCart(); // 加完立刻刷清單
    }
    alert(result.message);
  } catch (error) { alert("加入失敗"); }
};

const removeFromCart = async (productId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': token.value 
      }
    });
    const result = await response.json();
    if (response.ok) {
      await fetchCart(); // 刪除立刻刷清單
    }
    alert(result.message);
  } catch (error) { 
    alert("刪除失敗"); 
  }
};

const handleLogout = () => {
  token.value = '';
  localStorage.removeItem('myToken');
  userCart.value = [];
  message.value = "已登出";
}

const initSite = () => {
  fetchProducts();
  fetchCart();
}

onMounted(() => {
  if (token.value) initSite();
});
</script>

<style>
.container { 
  padding: 50px; 
  text-align: center; 
  font-family: sans-serif; 
}
input { 
  margin: 10px; 
  padding: 10px; 
  width: 250px; 
}
button { 
  padding: 10px 20px; 
  background-color: #42b983; 
  color: white; 
  border: none; 
  cursor: pointer; 
}
.token-box { 
  margin-top: 30px; 
  padding: 10px; 
  border: 1px solid #ccc; 
  background: #f9f9f9; 
  word-break: break-all; 
}
.products-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}
.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  width: 200px;
}
.product-card img {
  width: 100%;
  border-radius: 4px;
}
.color-box {
  width: 100px;
  height: 100px;
  margin: 0 auto 10px auto; /* 居中並與下方文字保持距離 */
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>