<template>
	<div class="main-container">
		<h1 class="title">Barcode Generator</h1>
		<div class="dropdown-container">
			<label for="barcode-format">Select Format:</label>
			<select class="custom-dropdown" id="barcode-format" v-model="selectedFormat" @change="generateBarcodes">
				<option value="CODE128">CODE128</option>
				<option value="CODE39">CODE39</option>
				<option value="EAN8">EAN8</option>
				<option value="MSI">MSI</option>
				<option value="CODABAR">CODABAR</option>
				<!-- Add more barcode format options here -->
			</select>
		</div>
		<button @click="generatePDF">Generate PDF</button>
		<button @click="generateZip">Generate ZIP</button>
		<div class="generator-container">
			<div class="input-section">
				<textarea v-model="inputText" @input="generateBarcodes" placeholder="Enter code value..."></textarea>
			</div>
			<div class="barcodes-section">
				<div class="barcodes-scrollable" ref="pdfContainer">
					<template v-for="(line, index) in inputLines" :key="index">
						<div v-if="line.startsWith('//') && line.substring(2).trim().length > 0" class="barcode-text">
							<h3>{{ line.trim().substring(2) }}</h3>
						</div>
						<div v-else-if="line.startsWith('//') && line.substring(2).trim().length === 0" class="barcode-text">
							<div style="height: 50px;" />
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
	</div>
</template>
  
<script>
import JsBarcode from "jsbarcode";
import html2pdf from "html2pdf.js";
import JSZip from "jszip";

export default {
	data() {
		return {
			inputText: "",
			barcodeList: [],
			selectedFormat: "CODE128" // default
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

					try {
						JsBarcode(canvas, line.trim(), {
							format: this.selectedFormat, // Change this to other formats like "CODE39", "EAN13", etc.
							displayValue: true,
							fontSize: 16,
							margin: 10,
						});

						this.barcodeList.push(canvas.toDataURL());
					} catch (e) {
						console.log(e);
					}
				}
			});
		},
		generatePDF() {
			if (this.inputText !== "") {
				const element = this.$refs.pdfContainer;
				const options = {
					margin: 0,
					filename: "barcodes.pdf",
					image: {
						type: "jpeg",
						quality: 0.98,
					},
					html2canvas: {
						scale: 2,
					},
					jsPDF: {
						unit: "mm",
						format: "a4",
						orientation: "portrait",
					},
				};

				html2pdf().set(options).from(element).save();
			}
		},
		async generateZip() {
			if (this.inputText !== "") {

				const zip = new JSZip();

				for (let i = 0; i < this.inputLines.length; i++) {
					const line = this.inputLines[i];

					if (!line.startsWith("//")) {
						const canvas = document.createElement("canvas");
						JsBarcode(canvas, line, {
							format: this.selectedFormat,
							displayValue: true,
							fontSize: 16,
							margin: 10,
						});

						const base64Image = canvas.toDataURL().split(";base64,").pop();
						const filename = `${line.trim()}`;
						zip.file(`${filename}.png`, base64Image, { base64: true });
					}
				}

				const zipBlob = await zip.generateAsync({ type: "blob" });
				const zipURL = URL.createObjectURL(zipBlob);
				const a = document.createElement("a");
				a.href = zipURL;
				a.download = "barcodes.zip";
				a.click();
			}
		},
	},
};
</script>
  
<style>
.main-container {
	background-color: #f7f7f7;
	height: 99%;
	width: 80%;
	margin: 0 auto;
}

@media (max-width: 800px) {
	.main-container {
		width: 95%;
	}
}

.generator-container {
	height: 83%;
	display: flex;
	justify-content: space-between;
	align-items: stretch;
}

@media (max-height: 700px) {
	.generator-container {
		height: 75%;
	}
}

.title {
	text-align: center;
	margin: 0px;
	padding: 0px;
	padding-top: 20px;
}

.dropdown-container {
	text-align: center;
	margin-bottom: 10px;
}

.dropdown-container label {
	margin-right: 10px;
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

/* Custom styles for the dropdown */
.custom-dropdown {
	padding: 8px 16px;
	font-size: 16px;
	border: 1px solid #ccc;
	border-radius: 5px;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat right 8px center/16px 16px;
	background-color: #fff;
	cursor: pointer;
}

/* Hover effect for the dropdown */
.custom-dropdown:hover {
	border-color: #007bff;
}

/* Focus style for the dropdown */
.custom-dropdown:focus {
	outline: none;
	box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

.dropdown-container select {
	padding: 5px;
	border-radius: 3px;
	width: 200px;
	text-align: center;
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
	border-radius: 3px;
	font-size: 16px;
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
	max-height: calc(100% - 40px);
	min-height: calc(100% - 35px);
	border: 1px solid gray;
	border-radius: 3px;
	margin-right: 10px;
	padding: 5px;
	width: 100%;
	background-color: white;
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

button {
	margin: 4px;
	padding: 10px 20px;
	font-size: 16px;
	background-color: #007bff;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: background-color 0.3s ease;
}

button:hover {
	background-color: #0056b3;
}
</style>
  