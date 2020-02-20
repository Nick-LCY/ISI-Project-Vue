<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content>
			<div>
				<h2>Basic Information:</h2>
				<div class="basicInfo">
					<p>Purchase Date: {{purchase_date}}</p>
					<p>Customer Name: {{customer_name}}</p>
					<p>Shipping Address: {{shipping_address}}</p>
					<p>Total Amount: ${{total_amount}}</p>
					<p v-if="status === 'shipped'">Shipment Date: {{shipment_date}}</p>
					<p v-if="status === 'canceled'">Cancel Date: {{cancel_date}}</p>
					<p v-if="status === 'canceled'">Canceled By: {{canceled_by}}</p>
				</div>
			</div>

			<a-divider />

			<div>
				<h2>Details:</h2>
				<div>
					<a-list :grid="{column: 1}" :dataSource="po_detail">
						<a-list-item slot="renderItem" slot-scope="item">
							<a-card>
								<a-card-meta>
									<template slot="description">
										<p>Product Name: {{item.product_name}}</p>
										<p>Unit Price: ${{item.unit_price}}</p>
										<p>Quantity: {{item.quantity}}</p>
										<p>Subtotal: ${{item.unit_price*item.quantity}}</p>
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
	import TopBar from '@/components/TopBar.vue';
	export default {
		name: 'purchase-detail',
		components: {
			TopBar,
		},
		data() {
			return {
				disable: false,

				status: '',
				purchase_date: '20/01/2020',
				customer_name: 'J',
				shipping_address: 'Rua de Lalala',
				total_amount: '100',
				shipment_date: '21/01/2020',
				cancel_date: '22/01/2020',
				canceled_by: 'M',

				po_detail: [
					{
						product_name: 'chide',
						unit_price: '10',
						quantity: '3',
					},
					{
						product_name: 'chide',
						unit_price: '30',
						quantity: '3',
					},
				]

				
			}

		},

		methods: {
			cancelPO() {
				this.status='canceled';
				this.disable='true';
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