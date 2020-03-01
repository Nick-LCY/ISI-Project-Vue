<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<div>
				<h2>Please enter basic information of new product</h2>
				<a-form :form="form">
					<a-form-item 
						label="Product Name" 
						v-bind="formItemLayout">
						<a-input
							v-decorator="[
							'product_name', 
							{ rules: [{ required: true, message: 'Please input product name.' }] }]"
						/>
					</a-form-item>

					<a-form-item 
						label="Category" 
						v-bind="formItemLayout">
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
						v-bind="formItemLayout">
						<a-input
							v-decorator="[
							'price', 
							{ rules: [{ required: true, message: 'Please input product price.' }] }]"
						/>
					</a-form-item>

					<a-form-item 
						label="Thumbnail Image" 
						v-bind="formItemLayout">
						<a-upload
							v-decorator="[
							'thumbnail', 
							{ rules: [{ required: true, message: 'Please upload thumbnail image.' }] }]"
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
						v-for="(k, index) in form.getFieldValue('keys')"
						:key="k"
						v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
						:label="index === 0 ? 'Properties' : ''"
						:required="true">
						<a-input-group 
							compact
							v-decorator="[
							`names[${k}]`,
							{validateTrigger: ['change', 'blur'],
							rules: [{
								required: true,
								message: 'Please input product\'s description or delete this field.',
								},],
							},]"
						>
							<a-select defaultValue="Option1">
								<a-select-option value="Option1">Option1</a-select-option>
								<a-select-option value="Option2">Option2</a-select-option>
							</a-select>

							<a-textarea
							placeholder="product description"
							style="width: 60%; margin-right: 8px"
							autosize
							/>
							
							<a-icon
							v-if="form.getFieldValue('keys').length > 2"
							class="dynamic-delete-button"
							type="minus-circle-o"
							:disabled="form.getFieldValue('keys').length === 1"
							@click="() => remove(k)"
							/>
						</a-input-group>
					</a-form-item>

					<a-form-item v-bind="formItemLayoutWithOutLabel">
						<a-button type="dashed" style="width: 60%" @click="add">
							<a-icon type="plus" /> Add field
						</a-button>
					</a-form-item>

					<a-form-item 
						label="Detailed Photographs" 
						v-bind="formItemLayout">
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
	// const formItemLayout = {
	// 	labelCol: { span: 4 },
	// 	wrapperCol: { span: 8 },
	// };
	const formTailLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 8, offset: 4 },
	};      

	let id = 2;

	export default {
		name: 'add-product',
		components: {
			TopBar,
		},
		data() {
			return {
				loading: false,
				imageUrl: '',
				previewVisible: false,
				previewImage: '',
				thumb: [],
				photos: [],
				formItemLayout: {
					labelCol: {
						xs: { span: 24 },
						sm: { span: 4 },
					},
					wrapperCol: {
						xs: { span: 24 },
						sm: { span: 20 },
					},
				},
				formTailLayout,
				formItemLayoutWithOutLabel: {
					wrapperCol: {
						xs: { span: 24, offset: 0 },
						sm: { span: 20, offset: 4 },
					},
				},
			}
		},

		beforeCreate() {
			this.form = this.$form.createForm(this, { name: 'add_product' });
			this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
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
			remove(k) {
				const { form } = this;
				// can use data-binding to get
				const keys = form.getFieldValue('keys');
				// We need at least one passenger
				if (keys.length === 1) {
					return;
				}

				// can use data-binding to set
				form.setFieldsValue({
					keys: keys.filter(key => key !== k),
				});
			},

			add() {
				const { form } = this;
				// can use data-binding to get
				const keys = form.getFieldValue('keys');
				const nextKeys = keys.concat(id++);
				// can use data-binding to set
				// important! notify form to detect changes
				form.setFieldsValue({
					keys: nextKeys,
				});
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