<!-- for Z4 -->

<template>
	<a-layout>

		<a-layout-content>

			<div>
				<a-card :title="p_name" hoverble>
					<a-card-meta>
						<template slot="description">
							<p>Unit Price: ${{p_price}}</p>
							<p>Quantity: {{p_quantity}}</p>
							<p>Subtotal: ${{p_price*p_quantity}}</p>
							
							<div slot="content">

								<a-form-item>
									<a-button 
									type="primary"
									@click="toDetail">
										Product Detail
									</a-button>
									<a-button 
									v-if="po_status == 'shipped' && feedback == ''" 
									@click="giveFeedback">
										Give a Feedback
									</a-button>
								</a-form-item>

								<a-form-item v-show="isShow" >
									<a-textarea :rows="4" @change="textChange" :value="content"></a-textarea>
								</a-form-item>

								<a-form-item v-show="isShow">
									<a-rate
									:tooltips="desc"
									:defaultValue="stars"
									:allowClear="false"
									@change="starChange"
									/>
									<span class="ant-rate-text">{{desc[stars - 1]}}</span>
								</a-form-item>

								<a-form-item v-show="isShow">
									<a-button 
									htmlType="submit" 
									:loading="submitting" 
									@click="handleSubmit" 
									type="primary">
										Submit
									</a-button>
								</a-form-item>
							</div>
						</template>
					</a-card-meta>
				</a-card>
				
			</div>
			
		</a-layout-content>
	</a-layout>
</template>

<script>
	import axios from 'axios';
	export default {
		name: 'PurchaseItem',
		props: ['po_no', 'product_id', 'product_name', 'product_price', 'quantity', 'status'],
		components: {
		},
		data() {
			return {
				success: true,
				error_message: '',

				feedback: '',
				isShow: false,
				content: '',
				stars: 0,
				desc: ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'],
				submitting: false,

				po_number: this.po_no,
				p_id: this.product_id,
				p_name: this.product_name,
				p_price: this.product_price,
				p_quantity: this.quantity,
				po_status: this.status,



				review_url: 'http://localhost:9981/review',
			}

		},

		methods: {
			toDetail() {
				this.$router.push({path: '/product-detail/'+this.p_id});
			},

			giveFeedback() {
				this.isShow = !this.isShow;
			},
			textChange(e) {
				this.content = e.target.value;
			},
			starChange(e) {
				this.stars = e;
				console.log(this.stars)
			},
			handleSubmit() {
				console.log(this.p_id);
				if (!this.content) {this.$message.error('Please enter your feedback before submitting!');}
				else if (this.stars === 0) {this.$message.error('Please give your rate!');}
				else {
					axios
					.post(
						this.review_url,
						{
							po_no: this.po_number,
							product_id: this.p_id,
							content: this.content,
							stars: this.stars,
							token: window.localStorage.getItem("token")
						}
					)
					.then((res) =>{
						this.success = res.data.success
						if(this.success){
							this.content = '';
							this.feedback = 'sent';
							this.isShow = false;
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
											click: () => {this.$router.push({path: '/product-detail/'+this.p_id});
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
						else{
							this.error_message = res.data.message
						}

					})
					
				}				
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

button {
	margin: 5px 10px 5px 0;
}
	
</style>