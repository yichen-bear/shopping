<template>
	<div class="checkout-page">
		<div class="checkout-box">
			<h2>確認您的混和色彩</h2>

			<div class="color-display">
				<div
					class="color-preview"
					:style="{ backgroundColor: `rgb(${r}, ${g}, ${b})` }"
				></div>
				<p>配方：RGB({{ r }}, {{ g }}, {{ b }})</p>
			</div>

			<hr />

			<div v-if="isNewColor" class="status-section discovery">
				<h3>✨ 發現新顏色！</h3>
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
				<h3>🎨 經典色彩：{{ existingName }}</h3>
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
const existingName = ref(""); // 用來儲存舊顏色的名字

const checkColorExistence = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/products/check-color?r=${r.value}&g=${g.value}&b=${b.value}`,
    );
    const data = await res.json();

    if (data.exists) {
      isNewColor.value = false;
      displayPrice.value = data.originalProduct.price;
      // 【新增】將資料庫回傳的商品名稱存起來
      existingName.value = data.originalProduct.name; 
    } else {
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
		const token = localStorage.getItem("myToken");

		// 從 Token 取得使用者 Email
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
				return JSON.parse(jsonPayload).email; // 請確保你的 Token Payload 裡面的確叫 email
			} catch (e) {
				return null;
			}
		};
		const userEmail = getEmailFromToken(token);

		// 新顏色執行上架
		if (isNew) {
			const addResponse = await fetch(
				"http://localhost:3000/api/products/add-new",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: newName.value,
						price: totalPrice.value,
						r: r.value,
						g: g.value,
						b: b.value,
					}),
				},
			);
			if (!addResponse.ok) throw new Error("商品上架失敗");
		}

		// 將結帳資料寫入歷史訂單資料庫
		await fetch("http://localhost:3000/api/cart/confirm", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: userEmail,
				productName: isNew ? newName.value : existingName.value, // 或是從 route.query 拿名稱
				price: isNew? Math.round(totalPrice.value * 0.7):totalPrice.value,
				r: r.value,
				g: g.value,
				b: b.value,
			}),
		});

		// 清空購物車
		const response = await fetch("http://localhost:3000/api/cart/clear-cart", {
			method: "DELETE",
			headers: { Authorization: token },
		});

		if (response.ok) {
			alert(
				isNew
					? `恭喜！「${newName.value}」已永久上架並購買成功！`
					: "購買成功！",
			);
			router.push("/orders");
		} else {
			alert("結帳過程出現問題");
		}
	} catch (error) {
		console.error("操作失敗:", error);
		alert("系統忙碌中，請稍後再試");
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
