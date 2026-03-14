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

      <div>
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="price-tag">售價：<span class="amount">${{ product.price }}</span></p>
        <p v-if="token" class="cart-status">
            購物車內已有：<strong>{{ cartQuantity }}</strong> 件
        </p>
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const userCart = ref([]);
const token = localStorage.getItem("myToken");

const cartQuantity = computed(() => {
  if (!product.value || userCart.value.length === 0) return 0;
  // 篩選出 ID 相同的項目並回傳長度
  return userCart.value.filter(item => item.id === product.value.id).length;
});

const fetchCart = async () => {
  if (!token) return;
  try {
    const response = await fetch("http://localhost:3000/api/cart/get-cart", {
      headers: { Authorization: token },
    });
    if (response.ok) {
      userCart.value = await response.json(); // 取得原始陣列
    }
  } catch (error) {
    console.error("購物車抓取失敗");
  }
};

onMounted(async () => {
  const id = route.params.id;
  // 同時抓取商品資訊與購物車狀態
  fetchCart(); 
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
        'Authorization': token 
      },
      body: JSON.stringify({ productId: product.value.id })
    });
    const result = await response.json();
    if (response.ok) {
      fetchCart(); // 加入成功後，重新整理數量顯示
    }
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
  margin-bottom: 5px;
  font-size: 20px;
  color: #4a4a4a;
}

.amount {
  font-size: 26px;
  font-weight: bold;
  color: #d35400; /* 參考你 Checkout.vue 的價格顏色 */
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

.cart-status {
  background-color: #fcf8e3;
  color: #8a6d3b;
  padding: 8px;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 20px;
  font-size: 14px;
}

.cart-status strong {
  font-size: 18px;
  color: #b08914;
}
</style>