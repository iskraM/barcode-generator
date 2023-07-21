<template>
	<div class="main-container">
		<div class="input-section">
			<textarea v-model="inputText" @input="generateBarcodes" placeholder="Enter text..."></textarea>
		</div>
		<div class="barcodes-section">
			<div class="barcodes-scrollable">
				<template v-for="(line, index) in inputLines" :key="index">
					<div v-if="line.startsWith('//')" class="barcode-text">
						<h3>{{ line.substring(2) }}</h3>
					</div>
					<div v-else class="barcode-item">
						<img :src="barcodeList[index]" alt="Barcode" />
					</div>
					<br />
				</template>
				<!-- <canvas v-for="(barcodeData, index) in barcodeList" :key="index" :ref="'barcodeCanvas' + index"></canvas> -->
			</div>
		</div>
	</div>
</template>
  
<script>
import JsBarcode from "jsbarcode";

export default {
	data() {
		return {
			inputText: "",
			barcodeList: [],
		};
	},
	computed: {
		inputLines() {
			return this.inputText.split("\n").filter(line => line.trim() !== "");
		}
	},
	methods: {
		generateBarcodes() {
			this.barcodeList = [];
			this.inputLines.forEach((line) => {
				if (line.startsWith("//")) {
					this.barcodeList.push(null);
				} else {
					const canvas = document.createElement("canvas");
					JsBarcode(canvas, line, {
						format: "CODE128", // Change this to other formats like "CODE39", "EAN13", etc.
						displayValue: true,
						fontSize: 16,
						margin: 10,
					});

					this.barcodeList.push(canvas.toDataURL());
				}
			});
		},
	},
};
</script>
  
<style>
.main-container {
	background-color: lightgray;
	height: 100%;
	width: 60%;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
	align-items: stretch;
	flex-wrap: wrap;
}

.input-section {
	width: 40%;
	height: 100%;
	display: flex;
	padding: 10px;
	box-sizing: border-box;
}

textarea {
	width: 100%;
	min-height: 0;
	resize: none;
	padding: 10px;
	box-sizing: border-box;
	overflow-y: auto;
}

.barcodes-section {
	width: 60%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow-y: hidden;
}

.barcodes-scrollable {
	max-height: calc(100vh - 40px);
	min-height: calc(100vh - 35px);
	border: 1px solid black;
	border-radius: 3px;
	margin-right: 10px;
	padding: 5px;
	width: 100%;
	overflow-y: auto;
}

.barcode-item {
	margin-bottom: 15px;
	display: flex;
	justify-content: center;
}

.barcode-text {
	margin-top: 15px;
	display: flex;
	justify-content: center;
}

.barcode-text h3 {
	margin: 0;
	padding: 0;
}

br {
	display: block;
	margin: 0;
	line-height: 1px;
	content: "";
}

</style>
  