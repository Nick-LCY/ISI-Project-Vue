<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<div>
				<h2>Please enter basic information of new product</h2>
				<a-form :form="form">
					<a-form-item label="Product Name" :label-col="{ span: 3 }" :wrapper-col="{ span: 10 }">
						<a-input
							v-decorator="['product-name', { rules: [{ required: true, message: 'Please type product name.' }] }]"
						/>
					</a-form-item>
				</a-form>
			</div>

		</a-layout-content>
	</a-layout>

</template>

<script>
	import TopBar from '@/components/TopBar.vue';

export default {
	name: 'add-product',
	components: {
		TopBar,
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'add_product' }),

		}
	},
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

</style>