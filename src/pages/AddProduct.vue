<!-- for E3&4 -->

<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>

			<a-alert
                v-if="!success"
                message="Error"
                :description="error_message"
                type="error"
                showIcon
            />

            <br><br>

			<div class=steps>
				<a-steps :current="current">
					<a-step v-for="item in steps" :key="item.title" :title="item.title" />
				</a-steps>
			</div>


			<div class="steps-content" v-if="current === 0">
				<a-form :form="form" @submit="submitBasic">
					<a-form-item 
					label="Product Name" 
					v-bind="formItemLayout"
					>
						<a-input
						v-decorator="[
							'product_name', 
							{ rules: [
								{ required: true, message: 'Please input product name' }
							] },
						]"
						placeholder="Product name"
						/>
					</a-form-item>

					<a-form-item 
					label="Category" 
					v-bind="formItemLayout"
					>
						<a-input
						v-decorator="[
							'category',
							{rules: [{ required: true, message: 'PLease input product category'}] },
						]"
						placeholder="Product category"
						/>
					</a-form-item>

					<a-form-item 
					label="Price" 
					v-bind="formItemLayout"
					>
						<a-input
						v-decorator="[
							'price', 
							{ rules: [
								{ required: true, message: 'Please input product price' },
								{
									type: 'number', 
									message: 'Please input number only',
									transform(value) {return Number(value);}
								}
							] },
						]"
						placeholder="Product price (Please input number only)"
						/>
					</a-form-item>

					<a-form-item v-bind="formTailLayout">
						<a-button type="primary" html-type="submit">
							Submit
						</a-button>
					</a-form-item>

				</a-form>
			</div>

			<div class="steps-content" v-if="current === 1">
				<a-form :form="form" @submit="submitDetail">

					<a-form-item 
						label="Thumbnail Image" 
						v-bind="formItemLayout">
						<a-upload
						v-decorator="[
						'thumbnail', 
						{ rules: [{ required: true, message: 'Please upload thumbnail image' }] }]"
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
					:required="true"
					>
						<a-input-group 
						compact
						v-decorator="[
						`names[${k}]`,
						{validateTrigger: ['change', 'blur'],
						rules: [{
							required: true,
							message: 'Please input product\'s description or delete this field',
							},],
						},]"
						>
							<a-input placeholder="Prodcut attribute name" style="width: 30%; margin-right: 2px;">
							</a-input>

							<a-textarea
							placeholder="Product attribute value"
							style="width: 68%; margin-left: 17px;"
							autosize
							/>
							
							<a-icon
							v-if="form.getFieldValue('keys').length > 2"
							class="dynamic-delete-button"
							type="minus-circle-o"
							:disabled="form.getFieldValue('keys').length === 2"
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

					<a-form-item v-bind="formTailLayout">
						<a-button type="primary" html-type="submit">
							Submit
						</a-button>
					</a-form-item>

				</a-form>
			</div>

		</a-layout-content>
	</a-layout>

</template>

<script>
<<<<<<< Updated upstream
	import TopBar from '@/components/TopBar.vue';
	import axios from 'axios';

	let id = 2;

	export default {
		name: 'add-product',
		components: {
			TopBar,
		},
		data() {
			return {

				dis: '',
				current: 0,
				success: true,
				submit: false,
				error_message: '',

				steps: [
					{
						title: 'Input product\'s basic information',
					},
					{
						title: 'Input product\'s detail information',
					},
				],

				// loading: false,
				imageUrl: '',
				previewVisible: false,
				previewImage: '',
				thumb: [],
				photos: [],

				create_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/create_product',

				formItemLayout: {
					labelCol: {span: 4},
					wrapperCol: {span: 16},
				},
				formTailLayout: {
					labelCol: {span: 4},
					wrapperCol: {span: 8, offset: 4},
				},
				formItemLayoutWithOutLabel: {
					wrapperCol: {span: 16, offset: 4},
				},
			}
		},

		beforeCreate() {
			this.form = this.$form.createForm(this, { name: 'add_product' });
			this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
		},

		// computed: {
		// 	disable: function() {
		// 		var d =this.dis;
		// 		if (this.success&&this.submit) {
		// 			d=false;
		// 		}
		// 		else d=true;
		// 		return d;
		// 	}
		// },

		methods: {

			submitBasic(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						axios
						.post(
							this.create_url,
							{
								name: values.name,
								category: values.category,
								price: values.price,
							}
						)
						.then((res) =>{
							this.success = res.data.success
							if(this.success){
								this.$message.success('Product has been created');
								this.current++;
							}
							else{
								this.error_message = res.data.message
							}

						})
					}
				});
			},

			submitDetail(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						axios
						.post(
							this.create_url,
							{
								name: values.name,
								category: values.category,
								price: values.price,
							}
						)
						.then((res) =>{
							this.success = res.data.success
							if(this.success){
								this.$message.success('Product has been created');
								this.current++;
							}
							else{
								this.error_message = res.data.message
							}

						})
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
.steps-content {
    margin-top: 16px;
   /* border: 1px dashed #e9e9e9;
    border-radius: 6px;*/
/*    background-color: #fafafa;*/
    min-height: 200px;
    padding-top: 80px;
}

.steps-action {
    margin-top: 24px;
}

.steps {
	width: 700px;
	text-align: center;
}

</style>