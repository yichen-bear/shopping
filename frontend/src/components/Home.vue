<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="brand-visual">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
      </div>
      
      <h1 class="title">探索無限色彩的可能</h1>
      <p class="subtitle">
        在我們的顏色購物站，你不僅能購買經典色彩，<br />
        更能透過混合創造出屬於你自己的獨特配方。
      </p>

      <div class="action-box">
        <button @click="startShopping" class="main-btn">
          立即前往選購
        </button>
        <p v-if="!token" class="login-hint">
          登入後即可解鎖「色彩混合器」功能 ✨
        </p>
      </div>
    </div>

    <div class="feature-grid">
      <div class="feature-card">
        <h3>🎨 經典選色</h3>
        <p>精選數十種高品質 RGB 色彩，滿足你的設計需求。</p>
      </div>
      <div class="feature-card">
        <h3>🧪 自由實驗</h3>
        <p>將心儀的顏色加入購物車，看看它們會混合成什麼驚喜。</p>
      </div>
      <div class="feature-card">
        <h3>✨ 獨家折扣</h3>
        <p>發現資料庫中尚未存在的新顏色？我們提供 7 折命名優惠！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  token: String, // 接收 App.vue 傳下來的 token
});

const router = useRouter();

const startShopping = () => {
  router.push('/products');
};
</script>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
  text-align: center;
}

.hero-section {
  margin-bottom: 80px;
}

.brand-visual {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  filter: blur(20px);
  opacity: 0.6;
}

.circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 -20px;
}
.c1 { background: #ff5f6d; }
.c2 { background: #ffc371; }
.c3 { background: #2193b0; }

.title {
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 800;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
}

.action-box {
  margin-top: 40px;
}

.main-btn {
  background-color: #4a4a4a; /* 延用 mixer-header 顏色 */
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.main-btn:hover {
  background-color: #333;
  transform: translateY(-3px);
}

.login-hint {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #888;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.03);
  transition: y 0.3s;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: #4a4a4a;
}

.feature-card p {
  color: #777;
  font-size: 0.95rem;
}
</style>