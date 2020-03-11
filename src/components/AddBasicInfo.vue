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
						>
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
						</a-input-group> -->


					</a-form-item>

					<a-form-item v-bind="formItemLayoutWithOutLabel">
						<a-button type="dashed" style="width: 60%" @click="add">
							<a-icon type="plus" /> Add field
						</a-button>
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

	let id = 2;

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
			// this.form.getFieldDecorator('keys', { 
			// 	initialValue: [
			// 		fields.attribute_name === undefined ? 0 :fields.attribute_name,
			// 		fields.attribute_value === undefined ? 0 :fields.attribute_value,
			// 	],
			// 	getValueFromEvent: this.getDecoratorValue,
			// 	preserve: true });
			this.form.getFieldDecorator('keys', {initialValue: [0,1], preserve:true});
		},

		methods: {

			submitBasic(e) {
				e.preventDefault();
				this.form.validateFieldsAndScroll((err, values) => {
					console.log(values.attribute_name);
					console.log(values.attribute_value);
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

			// getDecoratorValue = (v) => {
			// 	const setFieldsValue = this.props.form.setFieldsValue;
			// 	const fieldName = v.name;
			// 	const fieldValue = v.value;
			// 	setFieldsValue({ [fieldName]: fieldValue });
			// }
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