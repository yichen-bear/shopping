<template>
	<div class="orders-container">
		<h2>購買紀錄</h2>
		<div v-if="orders && orders.length === 0" class="no-data">
			目前還沒有購買紀錄
		</div>

		<div v-for="order in orders" :key="order.id" class="order-card">
			<div
				class="order-color"
				:style="{
					backgroundColor: `rgb(${order.red_value}, ${order.green_value}, ${order.blue_value})`,
				}"
			></div>
			<div class="order-info">
				<h3>{{ order.product_name }}</h3>
				<p>實付金額：${{ order.price }}</p>
				<small>購買時間：{{ formatDate(order.purchase_date) }}</small>
			</div>
		</div>
        <br>
        <div class="button-group">
            <router-link to="/products" class="main-btn">前往挑選</router-link>
		    <router-link to="/cart" class="main-btn">前往結帳</router-link>
        </div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(["token"]);
const orders = ref([]);
const router = useRouter();

// 解析 JWT Token 取得 email
const getEmailFromToken = (token) => {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join(""),
		);
		return JSON.parse(jsonPayload).email;
	} catch (e) {
		return null;
	}
};

const fetchOrders = async () => {
	const email = getEmailFromToken(props.token);
	if (!email) return;

	try {
		const response = await fetch(
			`http://localhost:3000/api/cart/history/${email}`,
		);
		const data = await response.json();
		orders.value = data;
	} catch (err) {
		console.error("抓取訂單失敗：", err);
	}
};

const formatDate = (dateStr) => {
  if (!dateStr) return "無日期";
  
  const date = new Date(dateStr);
  
  date.setHours(date.getHours() + 8);
  
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

onMounted(() => {
	if (props.token) {
		fetchOrders();
	}
});
</script>

<style scoped>
h2 {
	text-align: center;
}
.orders-container {
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
}
.order-card {
	display: flex;
	align-items: center;
	background: white;
	margin-bottom: 15px;
	padding: 15px;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.order-color {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	margin-right: 20px;
}
.no-data {
	text-align: center;
	color: #888;
	margin-top: 50px;
}
.button-group {
    display: flex;       
    justify-content: center; 
    gap: 20px;             
    margin: 30px 0;        
    flex-wrap: wrap;        
}

.main-btn {
    text-decoration: none;
    background-color: #4a4a4a;
    color: white;
    padding: 12px 30px;   
    font-size: 1rem;     
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    display: inline-block;  
    min-width: 120px;      
}

.main-btn:hover {
    background-color: #333;
    transform: translateY(-3px);
}
</style>
