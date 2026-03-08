<template>
  <div>
    <div v-if="!token" class="auth-container">
      <h2>{{ isLoginMode ? "帳號登入" : "註冊新帳號" }}</h2>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
        /><br />
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

    <div
      v-if="token"
      class="floating-mixer"
      :class="{ 'is-collapsed': isCollapsed }"
    >
      <div class="mixer-header" @click="isCollapsed = !isCollapsed">
        <span>混合預覽</span>
        <button class="toggle-icon">{{ isCollapsed ? "▲" : "▼" }}</button>
      </div>

      <div v-show="!isCollapsed" class="mixer-content">
        <div
          class="mixed-circle-small"
          :style="{ backgroundColor: mixedColor }"
        ></div>
        <p class="mixer-text">目前購物車色彩</p>
        <router-link to="/cart" class="go-cart-link">查看詳細</router-link>
      </div>
    </div>

    <div v-if="token">
      <h2>精選商品</h2>
      <div class="products-grid">
        <div v-for="p in allProducts" :key="p.id" class="product-card">
          <div
            class="color-box"
            :style="{
              backgroundColor: `rgb(${p.red_value}, ${p.green_value}, ${p.blue_value})`,
            }"
          ></div>
          <h3>{{ p.name }}</h3>
          <p>價格：${{ p.price }}</p>
          <button class="add-btn" @click="addToCart(p.id)">加入購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

// 接收從 App.vue 傳來的 token 和更新函數
const props = defineProps(["token"]);
const emit = defineEmits(["update-token"]);

const email = ref("");
const password = ref("");
const isLoginMode = ref(true);
const allProducts = ref([]);
const userCart = ref([]); // 新增：存儲購物車資料以便計算顏色
const isCollapsed = ref(false); // 新增：控制收合狀態

// 取得商品資料
const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    allProducts.value = await response.json();
  } catch (error) {
    console.error("商品抓取失敗");
  }
};

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

const addToCart = async (productId) => {
  if (!props.token) return;
  try {
    const response = await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token,
      },
      body: JSON.stringify({ productId }),
    });
    const result = await response.json();
    if (response.ok) {
      fetchCartForMixer(); // 加入後立即更新混合色
    }
    alert(result.message);
  } catch (error) {
    alert("加入失敗");
  }
};

// 抓取購物車資料的函式
const fetchCartForMixer = async () => {
  if (!props.token) return;
  try {
    const response = await fetch("http://localhost:3000/api/cart/get-cart", {
      headers: { Authorization: props.token },
    });
    if (response.ok) {
      userCart.value = await response.json();
    }
  } catch (error) {
    console.error("小視窗資料更新失敗");
  }
};

// 計算混合色
const mixedColor = computed(() => {
  if (userCart.value.length === 0) return "#eee";
  const totals = userCart.value.reduce(
    (acc, item) => {
      acc.r += item.red_value;
      acc.g += item.green_value;
      acc.b += item.blue_value;
      return acc;
    },
    { r: 0, g: 0, b: 0 },
  );

  const n = userCart.value.length;
  return `rgb(${Math.round(totals.r / n)}, ${Math.round(totals.g / n)}, ${Math.round(totals.b / n)})`;
});

onMounted(() => {
  if (props.token) {
    fetchProducts();
    fetchCartForMixer(); // 初始抓取
  }
});

// 當 token 變化時重新抓取商品
watch(
  () => props.token,
  (newToken) => {
    if (newToken) fetchProducts();
  },
);
</script>

<style scoped>
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

.products-grid {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  padding: 50px;
}

.product-card {
  background-color: white;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 12px;
  width: 220px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.color-box {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px auto;
  border: none;
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 10px 0;
  color: #333;
}

p {
  margin: 5px 0;
  color: #666;
}

h2 {
  text-align: center;
  font-size: 30px;
}

.add-btn {
  background-color: #b08914;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  transition: background-color 0.3s;
  margin-top: 15px;
}

.add-btn:hover {
  background-color: #86680e;
}

.floating-mixer {
  position: fixed;
  top: 80px; /* 避開 header 的 60px */
  right: 20px;
  width: 150px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 999;
  overflow: hidden;
  transition: all 0.3s ease;
}

.floating-mixer.is-collapsed {
  width: 120px;
}

.mixer-header {
  background-color: #4a4a4a; /* 使用與 App.vue 一致的色調 */
  color: white;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}

.mixer-content {
  padding: 15px;
  text-align: center;
}

.mixed-circle-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto 10px auto;
  border: 2px solid #eee;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.5s ease;
}

.mixer-text {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
}

.go-cart-link {
  font-size: 12px;
  color: #b08914;
  text-decoration: none;
  font-weight: bold;
}

.go-cart-link:hover {
  text-decoration: underline;
}

.toggle-icon {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
}
</style>
