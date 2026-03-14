<template>
  <div class="detail-page">
    <div v-if="product" class="detail-box">
      <div class="header-actions">
        <button @click="$router.back()" class="back-link">← 返回列表</button>
      </div>

      <div class="color-display">
        <div
          class="color-preview-large"
          :style="{ backgroundColor: `rgb(${product.red_value}, ${product.green_value}, ${product.blue_value})` }"
        ></div>
        <p class="rgb-tag">RGB({{ product.red_value }}, {{ product.green_value }}, {{ product.blue_value }})</p>
      </div>

      <hr />

      <div class="info-section">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="price-tag">售價：<span class="amount">${{ product.price }}</span></p>
        
        <div class="description">
          <p>這款色彩具有獨特的視覺魅力，適合用於各種設計場景。</p>
        </div>

        <button @click="handleAddToCart" class="add-cart-btn">
          加入購物車
        </button>
      </div>
    </div>
    <div v-else class="loading">
      載入中...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const token = localStorage.getItem("myToken"); // 根據你的 Login.vue 命名

onMounted(async () => {
  const id = route.params.id;
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    if (response.ok) {
      product.value = await response.json();
    }
  } catch (error) {
    console.error("抓取失敗:", error);
  }
});

const handleAddToCart = async () => {
  if (!token) {
    alert("請先登入！");
    return;
  }
  try {
    const response = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token // 根據你的 cart.js 邏輯
      },
      body: JSON.stringify({ productId: product.value.id })
    });
    const result = await response.json();
    alert(result.message);
  } catch (error) {
    alert("操作失敗");
  }
};
</script>

<style scoped>
.detail-page {
  padding-top: 10px;
  display: flex;
  justify-content: center;
  min-height: 80vh;
  background-color: #fdfaf6;
}

.detail-box {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* 參考你的卡片風格 */
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.header-actions {
  text-align: left;
  margin-bottom: 20px;
}

.back-link {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}

.color-preview-large {
  width: 180px;
  height: 180px;
  margin: 0 auto 20px auto;
  border-radius: 50%; /* 統一使用圓形預覽 */
  border: 5px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rgb-tag {
  color: #888;
  font-family: monospace;
  font-size: 15px;
}

hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 25px 0;
}

.product-name {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.price-tag {
  font-size: 20px;
  color: #4a4a4a;
}

.amount {
  font-size: 26px;
  font-weight: bold;
  color: #d35400; /* 參考你 Checkout.vue 的價格顏色 */
}

.description {
  margin: 20px 0;
  color: #777;
  line-height: 1.6;
}

.add-cart-btn {
  width: 100%;
  padding: 12px;
  background-color: #4a4a4a; /* 與你的 mixer-header 色調一致 */
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.add-cart-btn:hover {
  transform: translateY(-2px);
  background-color: #333;
}
</style>