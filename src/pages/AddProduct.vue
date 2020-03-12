<!-- for E3&4 -->

<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>

			<div class=steps>
				<a-steps :current="current">
					<a-step v-for="item in steps" :key="item.title" :title="item.title" />
				</a-steps>
			</div>

			<div class="steps-content" v-if="current === 0">
				<addBasic @submitBasicBtn="changeCurrent"></addBasic>
			</div>

			<div class="steps-content" v-if="current === 1">

				<a-alert
                v-if="!success"
                message="Error"
                :description="error_message"
                type="error"
                showIcon
				/>

				<br>

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
						:action="image_url"
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
						<!-- <a-input-group 
						compact
						v-decorator="[
						`attributes[${k}]`,
						{validateTrigger: ['change', 'blur'],
						rules: [{
							required: true,
							message: 'Please input product\'s description or delete this field',
							},],
						},]"
						> -->
							<a-input 
							v-decorator="[
							`attribute_name[${k}]`,
							{validateTrigger: ['change', 'blur'],
							rules: [{
								required: true,
								message: 'Please input product\'s description or delete this field',
								},],
							},]"
							placeholder="Prodcut attribute name" 
							style="width: 30%; margin-right: 2px;">
							</a-input>

							<a-textarea
							v-decorator="[
							`attribute_value[${k}]`,
							{validateTrigger: ['change', 'blur'],
							rules: [{
								required: true,
								message: 'Please input product\'s description or delete this field',
								},],
							},]"
							placeholder="Product attribute value"
							style="width: 66%; margin-left: 17px;"
							autosize
							/>
							
							<a-icon
							v-if="form.getFieldValue('keys').length > 2"
							class="dynamic-delete-button"
							type="minus-circle-o"
							:disabled="form.getFieldValue('keys').length === 2"
							@click="() => remove(k)"
							/>
						<!-- </a-input-group> -->
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
						:action="image_url"
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

	import axios from 'axios';
	import TopBar from '@/components/TopBar.vue';
	import addBasic from '@/components/AddBasicInfo.vue';

	let id = 2;


	// function getBase64(img, callback) {
	// 	const reader = new FileReader();
	// 	reader.addEventListener('load', () => callback(reader.result));
	// 	reader.readAsDataURL(img);
	// }

	export default {
		name: 'add-product',
		components: {
			TopBar,
			addBasic,
		},
		data() {
			return {

				current: 0,
				success: true,
				submit: false,
				error_message: '',
				product_id: '',

				steps: [
					{
						title: 'Input product\'s basic information',
					},
					{
						title: 'Input product\'s detail information',
					},
				],

				imageUrl: '',
				previewVisible: false,
				previewImage: '',
				thumb: [],
				photos: [],

				description_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product_description',
				image_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/upload_images',

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

		methods: {
			changeCurrent(value) {
				this.current = value.current;
				this.product_id = value.product_id;
				console.log(this.product_id);
			},

			
			submitDetail(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					for (var i in this.form.getFieldValue('keys')) {
						if (!err) {
							axios
							.post(
								this.description_url,
								{
									attribute_name: values.attribute_name[i],
									attribute_value: values.attribute_value[i],
									product_id: this.product_id,
									sequence: parseInt(i)+1,
								}
							)
							.then((res) =>{
								this.success = res.data.success
								if(this.success){
									this.$message.success('Product description has been added');
								}
								else{
									this.error_message = res.data.message
								}

							})
						}
					}					
					
				});
			},

			handleThumbChange({ fileList }) {
				this.thumb = fileList;
				// console.log(this.thumb);
			},
			handlePhotoChange({ fileList }) {
				this.photos = fileList; 
			},
			handlePreview(file) {
				this.previewImage = file.url;
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

			

			// uploadThumb(data) {
			// 	this.thumb = [...this.thumb, data.file]
			// 	console.log(data);
			// 	console.log(this.thumb);
			// 	this.upLoad(data.file);

			// },
			// upLoad(fileImage) {
			// 	// const {thumb} = this.thumb; 
			// 	const params = new FormData(); //创建一个form对象,必须是form对象否则后端接受不到数据
			// 	params.append('file', this.thumb);
			// 	// thumb.forEach(file => {
			// 	// 	params.append('files[]', file);
			// 	// });
			// 	console.log(params);
			// 	console.log(fileImage);

			// 	// params.append("prefix", "app/shop/factory");
			// 	//添加请求头  通过form添加的图片和文件的格式必须是multipart/form-data
			// 	let config = {
			// 		headers: { 'Content-Type': 'multipart/form-data' }
			// 	};
			// 	axios
			// 	.post(this.image_url, params, config)
			// 	.then(res => {
			// 		this.success = res.data.success
			// 			if(this.success){
			// 				this.$message.success('Product description has been added');
			// 					// let filePath = {
			// 					// uid: "-1",
			// 					// name: res.data.thumb.fileName,
			// 					// status: "done",
			// 					// url: res.data.thumb.filePath
			// 				// };
			// 				// this.thumb.push(filePath);
			// 			}
			// 			else{
			// 				this.error_message = res.data.message
			// 			}
					
			// 	});
			// },

			// saveFile (data){  
			// 	const formData = new FormData()  
			// 	formData.append('file', data.file)  
			// 	axios
			// 	.post(
			// 		this.image_url,
			// 		{
			// 			data: formData,
			// 			product_id: this.product_id,
			// 		}
			// 	)
			// 	.then((res) => {  
			// 		if (res.code === 0){  
			// 			let file = this.fileFormatter(res.data) 
			// 			// 上传单个文件后，将该文件会先到a-upload组件的已上传文件列表中的操作
			// 			this.thumb.push(file) 
			// 		} else {  
			// 			this.$message.error(res.msg)  
			// 		}  
			// 	})  
			// },

			// fileFormatter(data) {  
			// 	let file = {  
			// 		uid: data.uuid,    // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突  
			// 		name: data.name,   // 文件名  
			// 		status: 'done', // 状态有：uploading done error removed  
			// 		response: '{"status": "success"}', // 服务端响应内容  
			// 	}  
			// 	return file  
			// },

			// saveFile (formData) {
			// 	this.form.validateFields((err, values) => {
			// 		if (!err) {
			// 			let that = this
			// 			this.axios(
			// 			{
			// 				method: 'post',
			// 				url: this.image_url,
			// 				data: formData
			// 			})
			// 			.then((response) => {
			// 				console.log(response)
			// 			})
			// 			.catch(function (error) {
			// 				console.log(error)
			// 			})
			// 		}
			// 	})
			// },
		}	
	}
</script>

<style scoped>
.ant-layout-content {
	/*background-color: #fff;*/
	margin: 24px 16px;
	padding: 24px;
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