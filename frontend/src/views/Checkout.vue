<template>
  <div class="checkout-page">
    <div class="checkout-box">
      <h2>確認您的專屬色彩</h2>

      <div class="color-display">
        <div
          class="color-preview"
          :style="{ backgroundColor: `rgb(${r}, ${g}, ${b})` }"
        ></div>
        <p>配方：RGB({{ r }}, {{ g }}, {{ b }})</p>
      </div>

      <hr />

      <div v-if="isNewColor" class="status-section discovery">
        <h3>✨ 發現新配方！</h3>
        <p>這是資料庫中沒有的新顏色，享有 7 折優惠。</p>
        <p class="price-display">
          <span class="old-price">${{ totalPrice }}</span>
          <span class="new-price">${{ Math.round(totalPrice * 0.7) }}</span>
        </p>
        <input
          v-model="newName"
          placeholder="請為新顏色命名..."
          class="name-input"
        />
        <button @click="confirmPurchase(true)" class="pay-btn">
          命名並以優惠價結帳
        </button>
      </div>

      <div v-else class="status-section existing">
        <h3>🎨 經典色彩</h3>
        <p>此顏色已存在於我們的收藏中。</p>
        <p class="price-display">
          <span class="new-price">${{ totalPrice }}</span>
        </p>
        <button @click="confirmPurchase(false)" class="pay-btn">
          以原價結帳
        </button>
      </div>

      <button @click="$router.back()" class="cancel-btn">返回修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const displayPrice = ref(0); // 用來顯示最終價格

const r = ref(Number(route.query.r));
const g = ref(Number(route.query.g));
const b = ref(Number(route.query.b));
const totalPrice = ref(Number(route.query.price));

const isNewColor = ref(false);
const newName = ref("");

const checkColorExistence = async () => {
  try {
    // 呼叫我們剛剛在後端寫好的那個 API
    const res = await fetch(`http://localhost:3000/api/products/check-color?r=${r.value}&g=${g.value}&b=${b.value}`);
    const data = await res.json();
    
    if (data.exists) {
      // 1. 如果資料庫已有此顏色：不是新顏色，使用該商品原本的價格
      isNewColor.value = false;
      displayPrice.value = data.originalProduct.price; 
    } else {
      // 2. 如果是新顏色：標記為新顏色，並計算 7 折價格
      isNewColor.value = true;
      displayPrice.value = Math.round(totalPrice.value * 0.7);
    }
  } catch (err) {
    console.error("比對失敗", err);
  }
};

onMounted(checkColorExistence);

const confirmPurchase = async (isNew) => {
  if (isNew && !newName.value) return alert("請輸入名稱");

  try {
    // 先呼叫清空購物車的 API
    const token = localStorage.getItem("myToken");
    const response = await fetch("http://localhost:3000/api/cart/clear-cart", {
      method: "DELETE",
      headers: { 
        "Authorization": token 
      }
    });

    if (response.ok) {
      // 清空成功後，再顯示成功訊息並跳轉
      alert("購買成功！購物車已清空。");
      router.push("/");
    } else {
      alert("結帳過程出現問題，請稍後再試。");
    }
  } catch (error) {
    console.error("結帳失敗:", error);
    alert("連線伺服器失敗");
  }
};
</script>

<style scoped>
.checkout-page {
  padding-top: 100px;
  display: flex;
  justify-content: center;
  min-height: 80vh;
}
.checkout-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
}
.color-preview {
  width: 150px;
  height: 150px;
  margin: 20px auto;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.discount-tag {
  color: #27ae60;
  font-weight: bold;
}
.final-price {
  font-size: 28px;
  font-weight: bold;
  color: #d35400;
  margin: 10px 0;
}
.name-input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.pay-btn {
  width: 100%;
  padding: 15px;
  background: #4a4a4a;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
.cancel-btn {
  background: none;
  border: none;
  color: #888;
  margin-top: 15px;
  cursor: pointer;
}
.old-price {
  text-decoration: line-through;
  color: #888;
  font-size: 18px;
  margin-right: 10px;
}
.new-price {
  color: #d35400;
  font-size: 28px;
  font-weight: bold;
}
.discovery {
  background-color: #fafff0;
  padding: 20px;
  border-radius: 10px;
}
.existing {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
}
</style>
