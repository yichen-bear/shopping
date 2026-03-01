<template>
  <div class="cart-section">
    <h2>我的購物車 ({{ userCart.length }} 件)</h2>
    
    <div v-if="!token">請先登入以查看購物車</div>
    
    <div v-else>
      <ul v-if="userCart.length > 0">
        <li v-for="(item, index) in userCart" :key="index" class="cart-item">
          <div class="small-color-box" :style="{ backgroundColor: `rgb(${item.red_value}, ${item.green_value}, ${item.blue_value})` }"></div>
          {{ item.name }} - ${{ item.price }}
          <button @click="removeFromCart(item.id)" class="delete-btn">刪除</button>
        </li>
      </ul>
      <p v-else>購物車目前是空的</p>
      <router-link to="/">回到商品頁</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['token'])
const userCart = ref([])

const fetchCart = async () => {
  if (!props.token) return;
  try {
    const response = await fetch('http://localhost:3000/api/cart/get-cart', {
      headers: { 'Authorization': props.token }
    });
    if (response.ok) {
      userCart.value = await response.json();
    }
  } catch (error) { console.error("購物車抓取失敗"); }
};

const removeFromCart = async (productId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': props.token }
    });
    if (response.ok) {
      fetchCart();
    }
  } catch (error) { alert("刪除失敗"); }
};

onMounted(fetchCart);
</script>

<style scoped>
.cart-item { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px; }
.small-color-box { width: 30px; height: 30px; border-radius: 4px; }
.delete-btn { background-color: #ff9800; padding: 5px 10px; }
</style>