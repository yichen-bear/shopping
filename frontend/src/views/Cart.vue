<template>
  <div class="cart-section">
    <h2 style="text-align: center">我的購物車 ({{ userCart.length }} 件)</h2>

    <div
      style="text-align: center; margin-top: 40px; margin-bottom: 20px"
      v-if="!token"
    >
      請先登入以查看購物車
    </div>

    <div v-else>
      <ul v-if="userCart.length > 0">
        <li v-for="(item, index) in userCart" :key="index" class="cart-item">
          <div
            class="small-color-box"
            :style="{
              backgroundColor: `rgb(${item.red_value}, ${item.green_value}, ${item.blue_value})`,
            }"
          ></div>
          {{ item.name }} - ${{ item.price }}
          <button @click="removeFromCart(item.id)" class="delete-btn">
            刪除
          </button>
        </li>
      </ul>
      <p v-else>購物車目前是空的</p>
      <div class="back-btn-container">
        <router-link to="/" class="back-btn">回到商品頁</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["token"]);
const userCart = ref([]);

const fetchCart = async () => {
  if (!props.token) return;
  try {
    const response = await fetch("http://localhost:3000/api/cart/get-cart", {
      headers: { Authorization: props.token },
    });
    if (response.ok) {
      userCart.value = await response.json();
    }
  } catch (error) {
    console.error("購物車抓取失敗");
  }
};

const removeFromCart = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/cart/${productId}`,
      {
        method: "DELETE",
        headers: { Authorization: props.token },
      },
    );
    if (response.ok) {
      fetchCart();
    }
  } catch (error) {
    alert("刪除失敗");
  }
};

onMounted(fetchCart);
</script>

<style scoped>
.cart-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右分開 */
  gap: 15px;
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.small-color-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.delete-btn {
  background-color: #ff6b6b; /* 珊瑚紅 */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.delete-btn:hover {
  background-color: #ff4d4d;
}
.back-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 20px;
  transition: background-color 0.3s;
}
.back-btn:hover {
  background-color: #e0e0e0;
}
.back-btn-container {
  display: flex;
  justify-content: center; 
  margin-top: 20px;
}
</style>
