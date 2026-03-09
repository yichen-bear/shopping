<template>
  <div class="checkout-container">
    <h2>結帳確認</h2>
    
    <div class="result-card">
      <div class="mixed-preview" :style="{ backgroundColor: finalColor }"></div>
      <p>混合結果：RGB({{ r }}, {{ g }}, {{ b }})</p>
      <p>原始總價：${{ totalPrice }}</p>
    </div>

    <div v-if="isNewColor" class="new-discovery">
      <h3>🎉 恭喜！你調配出了全新的顏色！</h3>
      <p>目前的價格已為你打 7 折：<span class="discount-price">${{ Math.round(totalPrice * 0.7) }}</span></p>
      <input v-model="newName" placeholder="請為這個新顏色命名" class="name-input" />
      <button @click="confirmPurchase(true)" class="checkout-btn">命名並結帳</button>
    </div>

    <div v-else class="old-color">
      <p>這是一個已存在的經典顏色。</p>
      <p>應付金額：${{ totalPrice }}</p>
      <button @click="confirmPurchase(false)" class="checkout-btn">確認結帳</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 從路由參數或從 localStorage 拿到混合後的 RGB
const r = ref(route.query.r || 0);
const g = ref(route.query.g || 0);
const b = ref(route.query.b || 0);
const totalPrice = ref(route.query.price || 0);
const finalColor = `rgb(${r.value}, ${g.value}, ${b.value})`;

const isNewColor = ref(false);
const newName = ref("");

const checkColorExistence = async () => {
  const res = await fetch(`http://localhost:3000/api/products/check-color?r=${r.value}&g=${g.value}&b=${b.value}`);
  const data = await res.json();
  isNewColor.value = !data.exists;
};

const confirmPurchase = async (saveAsNew) => {
  if (saveAsNew && !newName.value) return alert("請輸入顏色名稱！");
  
  // 這裡執行結帳 API，如果是新顏色，則呼叫新增商品的 API
  alert("結帳成功！感謝購買。");
  router.push('/');
};

onMounted(checkColorExistence);
</script>