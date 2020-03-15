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
						:data="test"
						:name="'file1'"
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

					<div
					v-for="(k, index) in descriptions"
					:key="index"
					>
						<a-form-item
						v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
						:label="index === 0 ? 'Properties' : ''"
						:required="true"
						>
							<a-input 
								v-decorator="[
								`attribute_name[${index}]`,
								{validateTrigger: ['change', 'blur'],
								rules: [{
									required: true,
									message: 'Please input product\'s description or delete this field',
									},],
								},]"
								placeholder="Prodcut attribute name" 
								style="width: 40%;">
							</a-input>
						</a-form-item>


						<a-form-item v-bind="formItemLayoutWithOutLabel">
							<a-textarea
								v-decorator="[
								`attribute_value[${index}]`,
								{validateTrigger: ['change', 'blur'],
								rules: [{
									required: true,
									message: 'Please input product\'s description or delete this field',
									},],
								},]"
								placeholder="Product attribute value"
								style="width: 70%;"
								autosize
							/>
						</a-form-item>

						<a-form-item v-bind="formItemLayoutWithOutLabel">
							<a-button
							v-if="form.getFieldValue('keys').length > 2"
							type="dashed" 
							style="width: 30%"
							@click="deleteFormItem(index)">
								<a-icon type="minus-circle-o" /> Delete this field
							</a-button>
						</a-form-item>
					</div>

					<a-form-item v-bind="formItemLayoutWithOutLabel">
						<a-button type="dashed" style="width: 60%" @click="addItem">
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

	import axios from 'axios';
	import TopBar from '@/components/TopBar.vue';
	import addBasic from '@/components/AddBasicInfo.vue';

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

				descriptions: [
					{
						attribute_name: '',
						attribute_value: '',
					},
					{
						attribute_name: '',
						attribute_value: '',
					},
				],

				imageUrl: '',
				previewVisible: false,
				previewImage: '',
				thumb: [],
				photos: [],

				description_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product_description',
				image_url: 'http://localhost:9981/upload_example',

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

		computed: {
			keys () {
				let arr = []
				this.descriptions.forEach((val, index) => {
					arr.push(index)
				})
				return arr
			}
		},

		beforeCreate() {
			this.form = this.$form.createForm(this, { name: 'add_product' });
			// this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
			this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
			this.form.getFieldDecorator('attribute_name', { initialValue: [], preserve: false })
			this.form.getFieldDecorator('attribute_value', { initialValue: [], preserve: false })
		},

		

		methods: {
			changeCurrent(value) {
				this.current = value.current;
				this.product_id = value.product_id;
				console.log(this.product_id);
			},

			test() {
				// var formatData = new FormData()
				// formatData.append('file1', data.file)
				// formatData.append('test', 'HelloWorld')
				// axios.post("http://localhost:9981/upload_example", formatData).then((res) => {
				// 	console.log(res)
				// 	let file = {  
				// 			uid: '123456',
				// 			name: 'rua!',
				// 			status: 'done',
				// 			response: '{"status": "success"}',
				// 			linkProps: '{"download": "http://localhost:9981/static/批注 2020-03-15 165833.png"}'
				// 		}
				// 	this.thumb.push(file);
				// })
				return {'test': 'HelloYou'}
			},
			
			submitDetail(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					var product_descriptions = [];
					console.log(values);
					for (var i in this.form.getFieldValue('keys')) {
						console.log(i);
						var des = {};
						des.attribute_name = values.attribute_name[i];
						des.attribute_value = values.attribute_value[i];
						des.sequence = parseInt(i)+1
						des.product_id = this.product_id;
						console.log(des);
						product_descriptions.push(des);
					}

					if (!err) {
						axios
						.post(
							this.description_url,
							product_descriptions,			
						)
						.then((res) =>{
							this.success = res.data.success
							if(this.success){
								this.$message.success('Product description has been added');
								this.$router.push({path:`/product-detail/${this.product_id}`})
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

			addItem () {
				this.descriptions.push(
				{
					attribute_name: '',
					attribute_value: '',
				})
				const { form } = this;
				form.setFieldsValue({
				keys: this.keys
				})
			},
			deleteFormItem (index) {
				const { form } = this;
				console.log(index);
				// can use data-binding to set
				this.descriptions.splice(index, 1);
				var aname = form.getFieldValue('attribute_name');
				var avalue = form.getFieldValue('attribute_value');
				aname.splice(index, 1);
				avalue.splice(index, 1)
				form.setFieldsValue({
				keys: this.keys,
				attribute_name: aname,
				attribute_value: avalue
				})
			},

		}	
	}
</script>

<style scoped>
.ant-layout-content {
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