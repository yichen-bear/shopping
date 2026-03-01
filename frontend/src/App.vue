<template>
  <div class="container">
    <nav class="nav-bar">
      <router-link to="/">首頁商品</router-link> | 
      <router-link to="/cart">購物車</router-link>
      <button v-if="token" @click="handleLogout" class="logout-btn">登出</button>
    </nav>

    <h1>顏色購物站</h1>
    
    <router-view :token="token" @update-token="updateToken" />

    <p style="color: red;">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const token = ref(localStorage.getItem('myToken') || '')
const message = ref('')
const router = useRouter()

const updateToken = (newToken) => {
  token.value = newToken
}

const handleLogout = () => {
  token.value = ''
  localStorage.removeItem('myToken')
  message.value = "已登出"
  router.push('/') // 登出後跳回首頁
}
</script>

<style>
.nav-bar { 
  margin-bottom: 30px;
  padding: 10px; 
  background: #f4f4f4; 
}
.logout-btn { 
  background-color: #ff4d4d; 
  margin-left: 20px; 
  padding: 5px 10px; 
}
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