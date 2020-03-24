<!-- for Z4 -->

<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>

			<div>
				<router-link :to="'/product-detail/'+p_id">
					<a-card :title="p_name" hoverble>
						<a-card-meta>
							<template slot="description">
								<p>Unit Price: ${{p_price}}</p>
								<p>Quantity: {{p_quantity}}</p>
								<p>Subtotal: ${{p_price*p_quantity}}</p>
								
								<div slot="content">
									<a-form-item>
										<a-button 
											v-if="po_status == 'shipped' && feedback == ''" 
											size="large" 
											@click="giveFeedback">
										Give a Feedback
										</a-button>
									</a-form-item>


									<a-form-item>
										<a-button 
											v-if="feedback == 'sent'" 
											size="large" 
											@click="changeFeedback">
										Change Your Feedback
										</a-button>
									</a-form-item>


									<a-form-item v-show="isShow" >
										<a-textarea :rows="4" @change="handleChange" :value="value"></a-textarea>
									</a-form-item>
									<a-form-item v-show="isShow">
										<a-button 
											htmlType="submit" 
											:loading="submitting" 
											@click="handleSubmit" 
											type="primary">
											Add Comment
										</a-button>
									</a-form-item>
								</div>
							</template>
						</a-card-meta>
					</a-card>
				</router-link>
				
			</div>
			
		</a-layout-content>
	</a-layout>
</template>

<script>
	// import axios from 'axios';
	export default {
		name: 'PurchaseItem',
		props: ['product_id', 'product_name', 'product_price', 'quantity', 'status'],
		components: {
		},
		data() {
			return {
				dis: '',
				feedback: '',
				isShow: false,
				value: '',
				submitting: false,

				p_id: this.product_id,
				p_name: this.product_name,
				p_price: this.product_price,
				p_quantity: this.quantity,
				po_status: this.status,

			}

		},

		// created(){
		// 	const user_id = window.localStorage.getItem('user_id');
		// 	const token = window.localStorage.getItem('token');
		// 	var po_no = this.$route.params.po_no;
		// 	axios
		// 	.get(this.get_po_url+'?user_id='+user_id+'&token='+token+'&po_no='+po_no)
		// 	.then((res) =>{
		// 		this.po_detail = res.data.purchase_detail
		// 		console.log(this.po_detail);

		// 		// eslint-disable-next-line no-console
		// 			// console.log(this.po_info);
		// 	})

		// },

		methods: {

			// giveFeedback() {
			// 	this.isShow = !this.isShow;
			// },
			// handleChange(e) {
			// 	this.value = e.target.value;

			// },
			// handleSubmit() {
			// 	if (!this.value) {return;}
			// 	this.value='';
			// 	this.feedback='sent';
			// 	this.isShow=false;
			// 	const key = `open${Date.now()}`;
			// 	this.$notification.open({
			// 		placement: 'topLeft',
			// 		message: 'Adding comment successful!',
			// 		description:'Your comment has been added successfully. Click the button to see details.',
			// 		btn: h => {
			// 			return h(
			// 				'a-button',
			// 				{
			// 				props: {
			// 					type: 'primary',
			// 					size: 'small',
			// 				},
			// 				on: {
			// 					click: () => {this.$router.push({path: '/product-detail/'+this.$route.params.id});
			// 					// eslint-disable-next-line no-console
			// 					// console.log(this.$route.params);
			// 					this.$notification.close(key);}

			// 				},
			// 			},
			// 				'Confirm',
			// 			);
			// 		},
			// 		key,
			// 		onClose: close,
			// 	});
			// }
		}

	}
</script>


<style scoped>
.ant-layout-content {
	background-color: #fff;
	margin: 24px 16px;
	padding: 24px;
}	
	
</style>