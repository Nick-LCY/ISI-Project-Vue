<!-- for E3&4 -->

<template>
	<a-layout>

		<a-layout-content>

			<a-alert
            v-if="!success"
            message="Error"
            :description="error_message"
            type="error"
            showIcon
            />

            <br>

				<a-form :form="form" @submit="submitBasic">
					<a-form-item 
					label="Product Name" 
					v-bind="formItemLayout"
					>
						<a-input
						v-decorator="[
							'name',
							{
								rules: [
									{ required: true, message: 'Please input product name' }
								] 
							},
						]"
						placeholder="Product name"
						/>
					</a-form-item>

					<a-form-item 
					label="Category" 
					v-bind="formItemLayout"
					>
						<a-cascader
						v-decorator="[
							'category',
							{
								rules: [
									{ type: 'array', required: true, message: 'Please select category' },
								],
							},
						]"
						:options="options"
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
							Next
						</a-button>
					</a-form-item>

				</a-form>

		</a-layout-content>
	</a-layout>

</template>

<script>
	import axios from 'axios';
	import category_processing from '@/config/category.js';
	export default {
		name: 'ProductBasic',
		props: ['product_id', 'product_name', 'product_category', 'product_price'],
		data() {
			return {
				success: true,
				submit: false,
				error_message: '',

				p_id: this.product_id,
				p_name: this.product_name,
				p_category: this.product_category,
				p_price: this.product_price,
				p_cate: [],
				product_url: 'http://localhost:9981/product',
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
				options: category_processing.options,
			}
		},
		beforeCreate() {
			this.form = this.$form.createForm(this, { name: 'product_basic' });
			this.$nextTick(	function () {
				if (this.p_id) {
					for (var i = 0; i < this.p_category.length; i++) {
						this.p_cate.push(this.p_category.slice(0, i+1) + '_'.repeat(3-i))
					}
				}
			})
		},

		mounted() {
			this.form.setFieldsValue({
				"name": this.p_name,
				"category": this.p_cate,
				"price": this.p_price,
			})
		},
		
		methods: {
			submitBasic(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						var cate = values.category;
						console.log(cate);
						if (this.p_id) {
							axios
							.patch(
								this.product_url,
								{
									id: this.p_id,
									name: values.name,
									category: cate[cate.length-1],
									price: values.price,
									user_id: window.localStorage.getItem("user_id"),
									token: window.localStorage.getItem("token")
								}
							)
							.then((res) =>{
								this.success = res.data.success
								if(this.success){
									this.$message.success('Success');
									var current = 1;
									this.$emit('submitBasicBtn',{current});
									// console.log(res.data);
								}
								else{
									this.error_message = res.data.message
								}
							})
						}
						else{
							axios
							.post(
								this.product_url,
								{
									name: values.name,
									category: cate[cate.length-1],
									price: values.price,
									user_id: window.localStorage.getItem("user_id"),
									token: window.localStorage.getItem("token")
								}
							)
							.then((res) =>{
								this.success = res.data.success
								if(this.success){
									this.$message.success('Success');
									var product_id = res.data.product_detail.id;
									var current = 1;
									this.$emit('submitBasicBtn',{current, product_id});
									// console.log(res.data);
								}
								else{
									this.error_message = res.data.message
								}
							})
						}
					}
				});
			},
		}	
	}
</script>

<style scoped>
.ant-layout-content {
	margin: 24px 16px;
	padding: 24px;
}
</style>