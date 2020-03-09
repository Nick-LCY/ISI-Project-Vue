<!-- for D3&4 -->

<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<div>

				<a-alert
					v-if="!success"
					message="Error"
					:description="error_message"
					type="error"
					showIcon
				/>
				<h2>Basic Information:</h2>
				<div class="basicInfo">
					<p>Purchase Number: {{po_detail.po_no}}</p>

					<p>Purchase Date: {{po_detail.purchase_date}}</p>
					<p>Customer Name: {{po_detail.customer_name}}</p>
					<p>Shipping Address: {{po_detail.shipping_address}}</p>
					<p>Total Amount: ${{po_detail.total_amount}}</p>
					<p>Status: {{po_detail.status}}</p>
					<p v-if="po_detail.status === 'Shipped'">Shipment Date: {{po_detail.shipment_date}}</p>
					<p v-if="po_detail.status === 'Cancelled'">Cancel Date: {{po_detail.cancel_date}}</p>
					<p v-if="po_detail.status === 'Cancelled'">Cancelled By: {{po_detail.cancelled_by}}</p>
				</div>
			</div>

			<a-divider />

			<div>
				<h2>Details:</h2>
				<div>
					<a-list :grid="{column: 1}" :dataSource="po_detail.purchase_items">
						<a-list-item slot="renderItem" slot-scope="item">
							<router-link :to="'/product-detail/'+item.product_id">
							<a-card :title="item.product_name" hoverble>
								<a-card-meta>
									<template slot="description">
										<p>Unit Price: ${{item.product_price}}</p>
										<p>Quantity: {{item.quantity}}</p>
										<p>Subtotal: ${{item.product_price*item.quantity}}</p>
										
										<!-- <div slot="content">
											<a-form-item>
												<a-button 
													v-if="po_detail.status == 'Shipped' && feedback == ''" 
													size="large" 
													@click="giveFeedback">
												Give a Feedback
												</a-button>
											</a-form-item> -->


											<!-- <a-form-item>
												<a-button 
													v-if="feedback == 'sent'" 
													size="large" 
													@click="changeFeedback">
												Change Your Feedback
												</a-button>
											</a-form-item> -->


											<!-- <a-form-item v-show="isShow" >
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
											</a-form-item> -->
										<!-- </div> -->
									</template>
								</a-card-meta>
							</a-card>
							</router-link>
						</a-list-item>
					</a-list>
				</div>
				
			</div>

			<div class="cancel">
				<a-button 
				type="danger" 
				size="large" 
				@click="cancelPO(po_detail.po_no, po_detail.status)" 
				:disabled="disable"
				>
					Cancel
				</a-button>
			</div>
			
		</a-layout-content>
	</a-layout>
</template>

<script>
	import axios from 'axios';
	import TopBar from '@/components/TopBar.vue';
	export default {
		name: 'purchase-detail',
		components: {
			TopBar,
		},
		data() {
			return {
				dis: '',
				feedback: '',
				isShow: false,
				value: '',
				submitting: false,
				get_po_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/purchase_order',
				update_po_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/update_purchase_order',

				po_detail: {},

				success: true,
				error_message: '',

				
			}

		},

		created(){
			const user_id = window.localStorage.getItem('user_id');
			const token = window.localStorage.getItem('token');
			var po_no = this.po_detail.po_no;
			axios
			.get(this.get_po_url+'?user_id='+user_id+'&token='+token+'&po_no='+po_no)
			.then((res) =>{
				this.po_detail = res.data.purchase_detail

				// eslint-disable-next-line no-console
					// console.log(this.po_info);
			})

		},

		computed: {
			disable: function() {
				var d =this.dis;
				if (this.po_detail.status == 'Pending' || this.po_detail.status == 'Hold') {
					d=false;
				}
				else d=true;
				return d;
			}
		},

		methods: {
			cancelPO(po_no, status) {
				const user_id = window.localStorage.getItem('user_id');
				const token = window.localStorage.getItem('token');

				axios
				.post(
					this.update_po_url,
					{
						user_id: user_id,
						token: token,
						po_no: po_no,
						status: status,
					}
				)
				.then((res) =>{
					this.success = res.data.success;
					if(this.success){
						this.po_detail.status='Cancelled';
						this.dis=true;
						console.log('success');
					}
					else{
						this.error_message = res.data.message;
						console.log('fail');
					}
				})
			},

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

.basicInfo {
	padding: 20px;
	border: 2px solid rgb(232, 232, 232);
}

.ant-divider {
	background-color: black;
}

.cancel {
	box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    position: fixed;
    right: 100px;
    bottom: 50px;
    z-index: 10;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

	
	
	
</style>