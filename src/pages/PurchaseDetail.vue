<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<div>
				<h2>Basic Information:</h2>
				<div class="basicInfo">
					<p>Purchase Number: {{po_no}}</p>

					<p>Purchase Date: {{purchase_date}}</p>
					<p>Customer Name: {{customer_name}}</p>
					<p>Shipping Address: {{shipping_address}}</p>
					<p>Total Amount: ${{total_amount}}</p>
					<p>Status: {{status}}</p>
					<p v-if="status === 'Shipped'">Shipment Date: {{shipment_date}}</p>
					<p v-if="status === 'Cancelled'">Cancel Date: {{cancel_date}}</p>
					<p v-if="status === 'Cancelled'">Cancelled By: {{cancelled_by}}</p>
				</div>
			</div>

			<a-divider />

			<div>
				<h2>Details:</h2>
				<div>
					<a-list :grid="{column: 1}" :dataSource="po_detail">
						<a-list-item slot="renderItem" slot-scope="item">
							<a-card :title="item.product_name">
								<a-card-meta>
									<template slot="description">
										<p>Unit Price: ${{item.product_price}}</p>
										<p>Quantity: {{item.quantity}}</p>
										<p>Subtotal: ${{item.product_price*item.quantity}}</p>
										
										<div slot="content">
											<a-form-item>
												<a-button 
													v-if="status == 'Shipped' && feedback == ''" 
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
						</a-list-item>
					</a-list>
				</div>
				
			</div>

			<div class="cancel">
				<a-button type="danger" size="large" @click="cancelPO" :disabled="disable">Cancel</a-button>
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

				status: '',
				po_no: '',
				purchase_date: '',
				customer_name: '',
				shipping_address: '',
				total_amount: '',
				shipment_date: '',
				cancel_date: '',
				cancelled_by: '',

				po_detail: [],

				
			}

		},

		created(){
			axios
			.get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/purchase_order')
			.then((res) =>{
				this.po_detail = res.data.purchase_detail.purchase_items;
				this.status = res.data.purchase_detail.status;
				this.po_no = res.data.purchase_detail.po_no;
				this.purchase_date = res.data.purchase_detail.purchase_date;
				this.customer_name = res.data.purchase_detail.customer_name;
				this.shipping_address = res.data.purchase_detail.shipping_address;
				this.total_amount = res.data.purchase_detail.total_amount;
				this.shipment_date = res.data.purchase_detail.shipment_date;
				this.cancel_date = res.data.purchase_detail.cancel_date;
				this.cancelled_by = res.data.purchase_detail.cancelled_by;

				// eslint-disable-next-line no-console
					// console.log(this.po_info);
			})

		},

		computed: {
			disable: function() {
				var d =this.dis;
				if (this.status == 'Pending' || this.status == 'Hold') {
					d=false;
				}
				else d=true;
				return d;
			}
		},

		methods: {
			cancelPO() {
				this.status='Cancelled';
				this.dis=true;
			},

			giveFeedback() {
				this.isShow = !this.isShow;
			},
			handleChange(e) {
				this.value = e.target.value;

			},
			handleSubmit() {
				if (!this.value) {return;}
				this.value='';
				this.feedback='sent';
				this.isShow=false;
				const key = `open${Date.now()}`;
				this.$notification.open({
					placement: 'topLeft',
					message: 'Adding comment successful!',
					description:'Your comment has been added successfully. Click the button to see details.',
					btn: h => {
						return h(
							'a-button',
							{
							props: {
								type: 'primary',
								size: 'small',
							},
							on: {
								click: () => {this.$router.push({path: '/1'});
								this.$notification.close(key);}

							},
						},
							'Confirm',
						);
					},
					key,
					onClose: close,
				});
			}
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