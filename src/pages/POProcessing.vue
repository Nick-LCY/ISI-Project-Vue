<!-- for F3, 5, 6, 7 -->

<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<a-alert
            v-if="!success"
            message="Error"
            :description="error_message"
            type="error"
            showIcon
            />
			<div>
				<h2>Basic Information:</h2>
				<div class="basicInfo">
					<p>Purchase Number: {{po_detail.po_no}}</p>

					<p>Purchase Date: {{po_detail.purchase_date}}</p>
					<p>Customer Name: {{po_detail.customer_name}}</p>
					<p>Shipping Address: {{po_detail.shipping_address}}</p>
					<p>Total Amount: ${{po_detail.total_amount}}</p>
					<p>Status: {{po_detail.status}}</p>
					<p v-if="po_detail.status === 'shipped'">Shipment Date: {{po_detail.shipment_date}}</p>
					<p v-if="po_detail.status === 'cancelled'">Cancel Date: {{po_detail.cancel_date}}</p>
					<p v-if="po_detail.status === 'cancelled'">Cancelled By: {{po_detail.cancelled_by}}</p>
				</div>
				<br>

				<div class="buttons" v-if="po_detail.status === 'pending'">
					<a-button @click="shipPO(po_detail.po_no, 'shipped')" type="primary">Ship</a-button>
					<a-button @click="holdPO(po_detail.po_no, 'hold')">Hold</a-button>
					<a-button @click="cancelPO(po_detail.po_no, 'cancelled')" type="danger">Cancel</a-button>
				</div>
				<div class="buttons" v-if="po_detail.status === 'hold'">
					<a-button @click="shipPO(po_detail.po_no, 'shipped')" type="primary">Unhold and Ship</a-button>
					<a-button @click="cancelPO(po_detail.po_no, 'cancelled')" type="danger">Cancel</a-button>
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
										
									</template>
								</a-card-meta>
							</a-card>
							</router-link>
						</a-list-item>
					</a-list>
				</div>
				
			</div>
			
		</a-layout-content>
	</a-layout>
</template>

<script>
	import axios from 'axios';
	import TopBar from '@/components/TopBar.vue';
	export default {
		name: 'po-processing',
		components: {
			TopBar,
		},
		data() {
			return {
				get_po_url: 'http://localhost:9981/purchase_order',
				update_po_url: 'http://localhost:9981/purchase_order',

				po_detail: {},

				success: true,
				error_message: '',

				
			}

		},

		created(){
			const user_id = window.localStorage.getItem('user_id');
			const token = window.localStorage.getItem('token');
			var po_no = this.$route.params.po_no;
			axios
			.get(this.get_po_url+'?user_id='+user_id+'&token='+token+'&po_no='+po_no)
			.then((res) =>{
				this.po_detail = res.data.purchase_detail

			})

		},

		methods: {
			cancelPO(po_no, status) {
				const user_id = window.localStorage.getItem('user_id');
				const token = window.localStorage.getItem('token');

				axios
				.patch(
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
						this.po_detail.status='cancelled';
						this.po_detail.cancelled_by = res.data.cancelled_by;
					}
					else{
						this.error_message = res.data.error_message;
					}
				})
			},

			shipPO(po_no, status) {
				const user_id = window.localStorage.getItem('user_id');
				const token = window.localStorage.getItem('token');

				axios
				.patch(
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
					console.log(res);
					if(this.success){
						this.po_detail.status='shipped';
					}
					else{
						this.error_message = res.data.error_message;
					}
				})
			},

			holdPO(po_no, status) {
				const user_id = window.localStorage.getItem('user_id');
				const token = window.localStorage.getItem('token');

				axios
				.patch(
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
						this.po_detail.status='hold';
					}
					else{
						this.error_message = res.data.error_message;
					}
				})
			},

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
	text-transform: capitalize;
}

.ant-divider {
	background-color: black;
}

button {
	margin: 5px 10px 5px 0;
}

	
	
</style>