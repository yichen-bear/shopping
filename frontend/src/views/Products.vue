<template>
  <div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 接收從 App.vue 傳來的 token 和更新函數
const props = defineProps(['token'])
const emit = defineEmits(['update-token'])

const email = ref('')
const password = ref('')
const isLoginMode = ref(true)
const allProducts = ref([])

// 取得商品資料
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    allProducts.value = await response.json();
  } catch (error) { console.error("商品抓取失敗"); }
};

// 處理登入/註冊
const handleSubmit = async () => {
  try {
    const path = isLoginMode.value ? 'login' : 'register';
    const response = await fetch(`http://localhost:3000/api/auth/${path}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    });

    const result = await response.json();
    if (response.ok && isLoginMode.value) {
      // 成功登入，更新 token
      localStorage.setItem('myToken', result.token);
      emit('update-token', result.token); // 通知 App.vue 更新 token
      fetchProducts(); // 重新抓取商品
    }
  } catch (error) { console.error("連線失敗"); }
};

const addToCart = async (productId) => {
  if (!props.token) return;
  try {
    const response = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': props.token 
      },
      body: JSON.stringify({ productId })
    });
    const result = await response.json();
    alert(result.message);
  } catch (error) { alert("加入失敗"); }
};

onMounted(() => {
  if (props.token) fetchProducts();
});

// 當 token 變化時重新抓取商品
watch(() => props.token, (newToken) => {
  if (newToken) fetchProducts();
});
</script>

<style scoped>
.products-grid { 
    display: flex; 
    justify-content: center; 
    gap: 20px; 
    flex-wrap: wrap; 
}
.product-card { 
    border: 1px solid #ddd; 
    padding: 15px; 
    border-radius: 8px; 
    width: 200px; 
}
.color-box { 
    width: 100px; 
    height: 100px; 
    margin: 0 auto 10px auto; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
    }
</style>