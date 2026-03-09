<template>
  <div class="checkout-page">
    <div class="checkout-box">
      <h2>顏色確認</h2>
      
      <div class="color-display">
        <div class="color-preview" :style="{ backgroundColor: `rgb(${r}, ${g}, ${b})` }"></div>
        <div class="color-info">
          <p>配方：RGB({{ r }}, {{ g }}, {{ b }})</p>
          <p>原始價格：${{ totalPrice }}</p>
        </div>
      </div>

      <hr />

      <div v-if="isNewColor" class="bonus-section">
        <h3>✨ 驚喜！這是全新的顏色配方</h3>
        <p class="discount-tag">獲得新色發現獎勵：7 折優惠！</p>
        <p class="final-price">折後價：${{ Math.round(totalPrice * 0.7) }}</p>
        
        <input v-model="newName" placeholder="請為新顏色命名..." class="name-input" />
        <button @click="confirmPurchase(true)" class="pay-btn">確認命名並購買</button>
      </div>

      <div v-else class="normal-section">
        <p>此顏色已存在於資料庫中。</p>
        <p class="final-price">應付金額：${{ totalPrice }}</p>
        <button @click="confirmPurchase(false)" class="pay-btn">確認結帳</button>
      </div>
      
      <button @click="$router.back()" class="cancel-btn">返回修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 接收 Query 資料並轉為數字
const r = ref(route.query.r || 0);
const g = ref(route.query.g || 0);
const b = ref(route.query.b || 0);
const totalPrice = ref(route.query.price || 0);

const isNewColor = ref(false);
const newName = ref("");

const checkColorExistence = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/products/check-color?r=${r.value}&g=${g.value}&b=${b.value}`);
    const data = await res.json();
    isNewColor.value = !data.exists;
  } catch (err) {
    console.error("檢查失敗");
  }
};

const confirmPurchase = (isNew) => {
  if (isNew && !newName.value) return alert("請輸入名稱");
  alert("購買成功！");
  router.push('/');
};

onMounted(checkColorExistence);
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
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
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
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
</style>