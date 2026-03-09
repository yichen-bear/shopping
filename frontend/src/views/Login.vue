<template>
  <div v-if="!token" class="auth-container">
    <h2>{{ isLoginMode ? "帳號登入" : "註冊新帳號" }}</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email" required /><br />
      <input
        v-model="password"
        type="password"
        placeholder="密碼"
        required
      /><br />
      <button type="submit" class="auth-btn">
        {{ isLoginMode ? "登入" : "註冊" }}
      </button>
    </form>
    <p @click="isLoginMode = !isLoginMode" class="toggle-mode">
      {{ isLoginMode ? "還沒有帳號？按此註冊" : "已經有帳號？按此登入" }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

const email = ref("");
const password = ref("");
const isLoginMode = ref(true);
const emit = defineEmits(["update-token"]);

// 處理登入/註冊
const handleSubmit = async () => {
  try {
    const path = isLoginMode.value ? "login" : "register";
    const response = await fetch(`http://localhost:3000/api/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const result = await response.json();
    if (response.ok && isLoginMode.value) {
      // 成功登入，更新 token
      localStorage.setItem("myToken", result.token);
      emit("update-token", result.token); // 通知 App.vue 更新 token
      fetchProducts(); // 重新抓取商品
    }
  } catch (error) {
    console.error("連線失敗");
  }
};
</script>
<style>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.auth-container input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box; /* 確保 padding 不會撐開寬度 */
}

.auth-btn {
  background-color: #4a4a4a; /* 深灰按鈕 */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  width: 100%;
  cursor: pointer;
  font-weight: bold;
}

.toggle-mode {
  cursor: pointer;
  color: #b08914;
  font-size: 14px;
  margin-top: 15px;
}
</style>