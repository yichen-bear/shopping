<template>
  <div class="cart-section">
    <h2 style="text-align: center">我的購物車</h2>

    <div v-if="!token" style="text-align: center; margin-top: 40px;">
      請先登入以查看購物車
    </div>

    <div v-else>
      <div v-if="mergedCart.length > 0" class="cart-grid">
        <div v-for="item in mergedCart" :key="item.id" class="cart-item-card">
          <button @click="removeFromCart(item.id)" class="delete-x-btn" title="刪除全部">×</button>

          <div
            class="small-color-box"
            :style="{ backgroundColor: `rgb(${item.red_value}, ${item.green_value}, ${item.blue_value})` }"
          ></div>
          
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">${{ item.price }}</p>
            
            <div class="quantity-control">
              <button @click="changeQty(item.id, -1)" class="qty-btn" :disabled="item.quantity <= 1">−</button>
              <span class="qty-number">{{ item.quantity }}</span>
              <button @click="changeQty(item.id, 1)" class="qty-btn">+</button>
            </div>
          </div>
        </div>
      </div>
      <p v-else style="text-align: center;">購物車目前是空的</p>
      
      <div class="back-btn-container">
        <router-link to="/" class="back-btn">回到商品頁</router-link>
      </div>
    </div>
    <br><br>
    <div class="color-mix-preview" v-if="userCart.length > 0">
      <h3>購物車調色盤</h3>
      <div class="mixed-circle" :style="{ backgroundColor: mixedColor }"></div>
      <p>總計 ${{ totalAmount }}</p>
      <router-link to="/checkout" @click="goToCheckout" class="checkout-btn">
        前往結帳
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, inject } from "vue";

const globalLogout = inject('globalLogout');
const props = defineProps(["token"]);
const userCart = ref([]);

// 合併商品並強制排序 (確保位置固定)
const mergedCart = computed(() => {
  const map = new Map();
  userCart.value.forEach(item => {
    if (map.has(item.id)) {
      map.get(item.id).quantity += 1;
    } else {
      map.set(item.id, { ...item, quantity: 1 });
    }
  });
  // 轉成陣列後使用 .sort() 確保順序固定
  return Array.from(map.values()).sort((a, b) => a.id - b.id);
});

// 計算總件數
const totalItems = computed(() => {
  return mergedCart.value.reduce((sum, item) => sum + item.quantity, 0);
});

const fetchCart = async () => {
  if (!props.token) return;
  try {
    const response = await fetch("http://localhost:3000/api/cart/get-cart", {
      headers: { Authorization: props.token },
    });
    
    if (response.status === 401 || response.status === 403) {
      globalLogout(); // Token 過期，直接強制登出
      return;
    }

    if (response.ok) {
      userCart.value = await response.json();
    }
  } catch (error) {
    console.error("購物車抓取失敗");
  }
};

// 增加一筆數量
const addOneToCart = async (productId) => {
  try {
    await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': props.token 
      },
      body: JSON.stringify({ productId })
    });
  } catch (error) {
    console.error("增加失敗");
  }
};

// 減少一筆數量
const removeOneFromCart = async (productId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/cart/remove-one/${productId}`, {
      method: "DELETE",
      headers: { Authorization: props.token },
    });
    return response.ok;
  } catch (error) {
    console.error("減少失敗");
    return false;
  }
};

// 整合邏輯
const changeQty = async (productId, delta) => {
  if (delta === 1) {
    await addOneToCart(productId);
  } else {
    await removeOneFromCart(productId);
  }
  // 動作完成後，重新抓取最新的購物車清單
  fetchCart(); 
};

// 刪除全部功能
const removeFromCart = async (productId) => {
  if (!confirm("確定要移除此商品的所有數量嗎？")) return;
  try {
    const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: props.token },
    });
    if (response.ok) fetchCart();
  } catch (error) {
    alert("刪除失敗");
  }
};

const mixedColor = computed(() => {
  if (userCart.value.length === 0) return 'transparent';

  // 累加所有顏色的分量
  const totals = userCart.value.reduce((acc, item) => {
    acc.r += item.red_value;
    acc.g += item.green_value;
    acc.b += item.blue_value;
    return acc;
  }, { r: 0, g: 0, b: 0 });

  // 取平均值
  const r = Math.round(totals.r / userCart.value.length);
  const g = Math.round(totals.g / userCart.value.length);
  const b = Math.round(totals.b / userCart.value.length);

  return `rgb(${r}, ${g}, ${b})`;
});

// 計算總金額
const totalAmount = computed(() => {
  return userCart.value.reduce((sum, item) => sum + item.price, 0);
});

// 處理結帳邏輯
const goToCheckout = () => {
  // 假設你已經計算好 mixedR, mixedG, mixedB
  router.push({
    path: '/checkout',
    query: {
      r: mixedR.value,
      g: mixedG.value,
      b: mixedB.value,
      price: totalAmount.value
    }
  });
};

onMounted(fetchCart);
</script>

<style scoped>
.cart-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.cart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.cart-item-card {
  position: relative;
  display: flex;
  flex-direction: column; 
  align-items: center;
  gap: 15px;
  padding: 25px 15px 15px 15px;
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: #fff;
  transition: box-shadow 0.2s;
}

.cart-item-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 右上角叉叉按鈕 */
.delete-x-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #ccc;
  font-size: 30px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.delete-x-btn:hover {
  color: #ff6b6b;
}

.small-color-box {
  width: 80px; 
  height: 80px;
  border-radius: 10px;
  flex-shrink: 0;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.item-info {
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 8px;
  width: 100%;
}

.item-name {
  font-weight: bold;
  margin: 0;
  font-size: 16px;
  color: #333;
  text-align: center;
}

.item-price {
  margin: 0;
  color: #b08914;
  font-weight: bold;
  font-size: 16px;
}


.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f8f8;
  padding: 4px 12px;
  border-radius: 20px;
  margin-top: 5px;
}

.qty-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #b08914;
  padding: 0;
  line-height: 1;
}

.qty-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.qty-number {
  font-weight: bold;
  font-size: 16px;
  min-width: 25px;
  text-align: center;
  color: #333;
}

.back-btn-container {
  display: flex;
  justify-content: center; 
  margin-top: 30px;
}

.back-btn {
  padding: 10px 24px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #e0e0e0;
}

.color-mix-preview {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.mixed-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px auto;
  border: 4px solid #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  transition: background-color 0.5s ease; /* 讓顏色變換時有漸變效果 */
}

/* 在 <style scoped> 內新增或修改 */

.checkout-btn {
  text-decoration: none;
  margin-top: 15px;
  padding: 12px 40px;
  background-color: #4a4a4a; /* 使用與 App.vue 一致的深灰色調 */
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.checkout-btn:hover {
  text-decoration: none;
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.checkout-btn:active {
  text-decoration: none;
  transform: translateY(0);
}

.color-mix-preview h3 {
  margin-bottom: 5px;
  text-decoration: none;
  color: #333;
}
</style>