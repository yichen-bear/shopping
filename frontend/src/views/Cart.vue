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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

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

onMounted(fetchCart);
</script>

<style scoped>
.cart-section {
  max-width: 800px;
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
</style>