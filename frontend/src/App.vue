<template>
  <div class="app-wrapper">
    <header class="main-header">
      <div class="header-content">
        <router-link to="/" class="logo">🎨 顏色購物站</router-link>
        
        <div class="header-right">
          <router-link to="/cart" class="nav-link">🛒</router-link>
          <button v-if="token" @click="handleLogout" class="logout-btn">登出</button>
        </div>
      </div>
    </header>

    <main class="content-container">
      <router-view :token="token" @update-token="updateToken" />
    </main>

    <p style="color: red; text-align: center;">{{ message }}</p>
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
  router.push('/')
}
</script>

<style>
body {                
  margin: 0; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 更現代的字體 */
  background-color: #fdfaf6; /* 溫暖的淺米色背景 */
  color: #4a4a4a; /* 深灰文字，比純黑柔和 */
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
  padding-top: 80px; /* 這裡要大於 header 的高度 */
  padding-bottom: 20px;
}
</style>