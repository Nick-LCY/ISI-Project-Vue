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
					<p v-if="po_detail.status === 'shipped'">Shipment Date: {{po_detail.shipment_date}}</p>
					<p v-if="po_detail.status === 'cancelled'">Cancel Date: {{po_detail.cancel_date}}</p>
					<p v-if="po_detail.status === 'cancelled'">Cancelled By: {{po_detail.cancelled_by}}</p>
				</div>
			</div>

			<a-divider />

			<div>
				<h2>Details:</h2>
				<div>
					<a-list :grid="{column: 1}" :dataSource="po_detail.purchase_items">
						<a-list-item slot="renderItem" slot-scope="item">
							<PurchaseItem
							:po_no="po_detail.po_no"
							:product_id="item.product_id"
							:product_name="item.product_name"
							:product_price="item.product_price"
							:quantity="item.quantity"
							:status="po_detail.status">
							</PurchaseItem>
						</a-list-item>
					</a-list>
				</div>
				
			</div>

			<div class="cancel">
				<a-button 
				type="danger" 
				size="large" 
				@click="cancelPO(po_detail.po_no)" 
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
	import PurchaseItem from '@/components/PurchaseItem.vue';
	
	export default {
		name: 'purchase-detail',
		components: {
			TopBar,
			PurchaseItem,
		},
		data() {
			return {
				dis: '',
				po_url: 'http://localhost:9981/purchase_order',
				
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
			.get(this.po_url+'?user_id='+user_id+'&token='+token+'&po_no='+po_no)
			.then((res) =>{
				this.po_detail = res.data.purchase_detail
				console.log(this.po_detail);
			})

		},

		computed: {
			disable: function() {
				var d =this.dis;
				if (this.po_detail.status == 'pending' || this.po_detail.status == 'hold') {
					d=false;
				} else {
					d=true;
				}
				return d;
			}
		},

		methods: {
			cancelPO(po_no) {
				const user_id = window.localStorage.getItem('user_id');
				const token = window.localStorage.getItem('token');

				axios
				.patch(
					this.po_url,
					{
						user_id: user_id,
						token: token,
						po_no: po_no,
						status: "cancelled",
					}
				)
				.then((res) =>{
					this.success = res.data.success;
					if(this.success){
						this.po_detail.status = 'cancelled';
						this.po_detail.cancelled_by = res.data.cancelled_by;
						this.dis = true;
						console.log('success');
						location. reload();
					}
					else{
						this.error_message = res.data.message;
						console.log('fail');
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