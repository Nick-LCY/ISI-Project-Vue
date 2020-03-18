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
							Next
						</a-button>
					</a-form-item>

				</a-form>

		</a-layout-content>
	</a-layout>

</template>

<script>
	import axios from 'axios';

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


				create_url: 'http://localhost:9981/product',
				get_product_url: 'http://localhost:9981/product',

				change_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/change_product',

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
			this.form = this.$form.createForm(this, { name: 'product_basic' });
		},

		mounted() {
			this.form.setFieldsValue({
				"name": this.p_name,
				"category": this.p_category,
				"price": this.p_price,
			})
		},

		methods: {

			submitBasic(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					if (!err) {
						if (this.p_id) {
							axios
							.post(
								this.change_url,
								{
									id: this.p_id,
									name: values.name,
									category: values.category,
									price: values.price,
									user_id: window.localStorage.getItem("user_id"),
									token: window.localStorage.getItem("token")
								}
							)
							.then((res) =>{
								this.success = res.data.success
								if(this.success){
									this.$message.success('Success');
									var name = res.data.product_detail.name;
									// console.log(name);
									var category = res.data.product_detail.category;
									var price = res.data.product_detail.price;
									var current = 1;
									this.$emit('submitBasicBtn',{current, name, category, price});
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
								this.create_url,
								{
									name: values.name,
									category: values.category,
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