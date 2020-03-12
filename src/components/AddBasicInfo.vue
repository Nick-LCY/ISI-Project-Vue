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

		</a-layout-content>
	</a-layout>

</template>

<script>
	import axios from 'axios';


	export default {
		name: 'addBasic',
		components: {
		},
		data() {
			return {

				success: true,
				submit: false,
				error_message: '',

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
			this.form = this.$form.createForm(this, { name: 'add_basic' });
		},

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
								var current = 1;
								var product_id = res.data.product_detail.id;
								this.$emit('submitBasicBtn',{current, product_id});
								console.log(res.data);
							}
							else{
								this.error_message = res.data.message
							}

						})
					}
				});
			},

		}	
	}
</script>

<style scoped>
.ant-layout-content {
	/*background-color: #fff;*/
	margin: 24px 16px;
	padding: 24px;
}

</style>