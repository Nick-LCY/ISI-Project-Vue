<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<div>
				<h2>Please enter basic information of new product</h2>
				<a-form :form="form">
					<a-form-item 
						label="Product Name" 
						:label-col="formItemLayout.labelCol" 
						:wrapper-col="formItemLayout.wrapperCol">
						<a-input
							v-decorator="[
							'product_name', 
							{ rules: [{ required: true, message: 'Please input product name.' }] }]"
						/>
					</a-form-item>

					<a-form-item 
						label="Category" 
						:label-col="formItemLayout.labelCol" 
						:wrapper-col="formItemLayout.wrapperCol">
						<a-select
							v-decorator="[
							'category',
							{ rules: [{ required: true, message: 'Please select the category' }] },
							]"
							placeholder="Select a option and change input text above"
						>
							<a-select-option value="male">
								A
							</a-select-option>
							<a-select-option value="female">
								B
							</a-select-option>
						</a-select>
					</a-form-item>

					<a-form-item 
						label="Price" 
						:label-col="formItemLayout.labelCol" 
						:wrapper-col="formItemLayout.wrapperCol">
						<a-input
							v-decorator="['price', { rules: [{ required: true, message: 'Please input product price.' }] }]"
						/>
					</a-form-item>

					<a-form-item 
						label="Thumbnail Image" 
						:label-col="formItemLayout.labelCol" 
						:wrapper-col="formItemLayout.wrapperCol">
						<a-upload
							v-decorator="['thumbnail', { rules: [{ required: true, message: 'Please upload thumbnail image.' }] }]"
							listType="picture-card"
							:fileList="thumb"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							@preview="handlePreview"
							@change="handleThumbChange"							
						>
							<div v-if="thumb.length < 1">
								<a-icon type="plus" />
								<div class="ant-upload-text">Upload</div>
							</div>
						</a-upload>
						<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
							<img alt="example" style="width: 100%" :src="previewImage" />
						</a-modal>
					</a-form-item>

					<a-form-item 
						label="Detailed Photographs" 
						:label-col="formItemLayout.labelCol" 
						:wrapper-col="formItemLayout.wrapperCol">
						<a-upload
							listType="picture-card"
							:fileList="photos"
							action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
							@preview="handlePreview"
							@change="handlePhotoChange"							
						>
							<div v-if="photos.length < 4">
								<a-icon type="plus" />
								<div class="ant-upload-text">Upload</div>
							</div>
						</a-upload>
						<a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
							<img alt="example" style="width: 100%" :src="previewImage" />
						</a-modal>
					</a-form-item>

					<a-form-item 
						:label-col="formTailLayout.labelCol" 
						:wrapper-col="formTailLayout.wrapperCol">
						<a-button type="primary" @click="check">
							Submit
						</a-button>
					</a-form-item>


				</a-form>
			</div>

		</a-layout-content>
	</a-layout>

</template>

<script>
	import TopBar from '@/components/TopBar.vue';
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 8 },
	};
	const formTailLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 8, offset: 4 },
	};

	export default {
		name: 'add-product',
		components: {
			TopBar,
		},
		data() {
			return {
				form: this.$form.createForm(this, { name: 'add_product' }),
				loading: false,
				imageUrl: '',
				previewVisible: false,
				previewImage: '',
				thumb: [],
				photos: [],
				formItemLayout,
				formTailLayout,
			}
		},
		methods: {
			check() {
				this.form.validateFields(err => {
					if (!err) {
						console.info('success');
					}
				});
			},
			handleThumbChange({ fileList }) {
				this.thumb = fileList; 
			},
			handlePhotoChange({ fileList }) {
				this.photos = fileList; 
			},
			handlePreview(file) {
				this.previewImage = file.url || file.thumbUrl;
				this.previewVisible = true;
			},
			handleCancel() {
				this.previewVisible = false;
			},
		}	
	}
</script>

<style scoped>
.ant-layout-content {
	background-color: #fff;
	margin: 24px 16px;
	padding: 24px;
}

h2 {
	padding: 10px;
}

.ant-upload-select-picture-card i {
	font-size: 32px;
	color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
	margin-top: 8px;
	color: #666;
}

</style>