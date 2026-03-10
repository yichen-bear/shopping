<template>
  <div class="app-wrapper">
    <header class="main-header">
      <div class="header-content">
        <router-link to="/" class="logo">🎨 顏色購物站</router-link>
        
        <div class="header-right">
          <router-link to="/cart" class="nav-link" @click="goToCart">🛒</router-link>
          <button v-if="token" @click="handleLogout" class="logout-btn">登出</button>
          <router-link v-else to="/login" class="nav-link login-text">登入</router-link>
        </div>
      </div>
    </header>

    <main class="content-container">
      <router-view :token="token" @update-token="updateToken" />
    </main>

    <!-- <p style="color: red; text-align: center;" v-if="!token && message">{{ message }}</p> -->
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'

const token = ref(localStorage.getItem('myToken') || '')
const message = ref('')
const router = useRouter()

const updateToken = (newToken) => {
  token.value = newToken
  message.value = "" // 登入成功時清除錯誤訊息
}

const handleLogout = () => {
  localStorage.removeItem('myToken')
  token.value = ''
  message.value = "登入已過期或已登出，請重新登入"
  
  // 3秒後自動隱藏已登出訊息
  setTimeout(() => {
    message.value = ""
  }, 3000)
  
  router.push('/')
}

const goToCart = (e) => {
  if (!token.value) {
    e.preventDefault(); // 阻止 router-link 跳轉
    alert("請先登入以查看購物車！");
    router.push('/login'); // 導向有登入框的首頁
  }
};

provide('globalLogout', handleLogout)

</script>

<style>
body {                
  margin: 0; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fdfaf6;
  color: #4a4a4a;
}
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.header-content {
  width: 90%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}
.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}
.logout-btn {
  background-color: #ff4d4d;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
}
.content-container {
  padding-top: 80px;
  padding-bottom: 20px;
}
.login-text {
  background-color: rgba(4, 151, 184, 0.742);
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
  text-decoration: none;
}
</style>