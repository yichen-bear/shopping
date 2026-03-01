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
      <div v-if="userCart.length > 0" class="cart-grid">
        <div v-for="(item, index) in userCart" :key="index" class="cart-item-card">
          <div
            class="small-color-box"
            :style="{
              backgroundColor: `rgb(${item.red_value}, ${item.green_value}, ${item.blue_value})`,
            }"
          ></div>
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">${{ item.price }}</p>
            <button @click="removeFromCart(item.id)" class="delete-btn">
              刪除
            </button>
          </div>
        </div>
      </div>
      <p v-else style="text-align: center;">購物車目前是空的</p>
      
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

/* --- 新增/修改的樣式 --- */
.cart-grid {
  display: grid;
  /* 這裡設定一行顯示 2 個商品，如果想一行 3 個可以改成 repeat(3, 1fr) */
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.cart-item-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: #fff;
  transition: box-shadow 0.2s;
}
.cart-item-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.small-color-box {
  width: 60px; /* 稍微放大一點點，看起來更顯眼 */
  height: 60px;
  border-radius: 8px;
  border: 1px solid #ddd;
  flex-shrink: 0; /* 防止盒子被壓縮 */
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-grow: 1;
}

.item-name {
  font-weight: bold;
  margin: 0;
  font-size: 16px;
}
.item-price {
  margin: 0;
  color: #b08914;
  font-weight: bold;
}

.delete-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 12px; /* 縮小按鈕 */
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  width: 100%; /* 按鈕佔滿資訊區域寬度 */
  transition: background-color 0.3s;
}
.delete-btn:hover {
  background-color: #ff4d4d;
}
/* ------------------- */

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