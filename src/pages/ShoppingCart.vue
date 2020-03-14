<template>
    <a-layout>
        <TopBar></TopBar>
        <a-layout-content>
        <a-row :gutter="16" id="row">
            <a-alert
            v-if="!success"
            message="Error"
            :description="error_message"
            type="error"
            showIcon
            />
            <a-col class="left" :span="18">
                <a-table 
                :columns="columns" 
                :dataSource="items" 
                :rowKey="item => item.id"
                :pagination="false"
                >
                    <img
                    id="product-image"
                    slot="thumbnail_location" 
                    slot-scope="thumbnail_location,record" 
                    :src="thumbnail_location" 
                    @click="() => toProductDetailPage(record.id)" 
                    />
                    <a-input-number 
                    :min="1" 
                    slot="quantity" 
                    slot-scope="text,record" 
                    v-model="record.quantity"
                    @change="() => changeQuantity(record.id,record.quantity)" 
                    />
                    <template slot="remove" slot-scope="text, record">
                        <a-popconfirm
                        v-if="items.length"
                        title="Sure to remove?"
                        @confirm="() => remove(record.id)"
                        >
                        <a href="javascript:;">Remove</a>
                        </a-popconfirm>
                    </template>
                </a-table>
            </a-col>
            <a-col class="right" :span="6">
                <a-affix :offsetTop="10">
                    <a-row id="checkout-card-container">
                        <a-card id="checkout-card">
                            <p id="total-cost-title"> TOTAL COST </p>
                            <p id="total-cost-content">${{total}}</p>
                        </a-card>
                    </a-row>
                    <a-row>
                        <a-button id="checkout-btn" type='primary' @click="checkout">
                            CHECK OUT
                        </a-button>
                    </a-row>

                </a-affix>
            </a-col>
        </a-row>
        </a-layout-content>
    </a-layout>

</template>

<script>
import TopBar from '@/components/TopBar.vue'
import axios from 'axios'

const columns = [
    {
        title:'Product',
        dataIndex:'thumbnail_location',
        scopedSlots: { customRender: 'thumbnail_location' },
        align: 'center'
    },
    {
        title:'Name',
        dataIndex:'name',
        align: 'center'
    },
    {
        title:'Unit Price',
        dataIndex:'single_price',
        align:'center'
    },
    {
        title:'Quantity',
        dataIndex:'quantity',
        scopedSlots: { customRender: 'quantity' },
        align: 'center'
    },
    {
        title:'Subtotal',
        dataIndex:'subtotal',
        align: 'center'
    },
    {
        title:'',
        dataIndex:'remove',
        scopedSlots: { customRender: 'remove' },
    }
]

export default {
    name:'shopping-cart',
    components:{
      TopBar,
    },
    data(){
        return{
            columns,
            get_items_url:'http://localhost:9981/shopping_cart',
            checkout_url:'http://localhost:9981/purchase_order',
            remove_url:'http://localhost:9981/shopping_cart',
            change_url:'http://localhost:9981/shopping_cart',
            items:[],
            total:'',
            success:true,
            error_message:'',
        }
    },
    created(){
        const user_id = window.localStorage.getItem('user_id')
        const token = window.localStorage.getItem('token')
        axios
        .get(this.get_items_url+'?user_id=' + user_id
          + '&token=' + token)
        .then((res) =>{
            this.items = res.data.shopping_cart_items
            var total = 0
            for(var item of this.items){
                total += item.subtotal
            }
            this.total = total
        })     
    },
    methods:{
        remove(product_id){
            const user_id = window.localStorage.getItem('user_id')
            const token = window.localStorage.getItem('token')
            axios
            .delete(
                this.remove_url,
                {
                    params: 
                        {
                            user_id: user_id,
                            token: token,
                            product_id: product_id
                        }
                }
            )
            .then((res) =>{
                this.success = res.data.success
                if(this.success){
                    const items = [...this.items];
                    this.items = items.filter(item => item.id !== product_id)
                    var total = 0
                    for(var item of this.items){
                        total += item.subtotal
                    }
            this.total = total
                }
                else{
                    this.error_message = res.data.message
                }
        })
        },
        checkout(){
            const user_id = window.localStorage.getItem('user_id')
            const token = window.localStorage.getItem('token')
            const items = this.items
            var purchase_items = []
            var _ = require('lodash');
            for (var item of items){
                purchase_items.push(_.pick(item,['id', 'quantity']))
            }
            axios
            .post(
                this.checkout_url,
                {
                    user_id: user_id,
                    token: token,
                    purchase_items: purchase_items,
                }
                )
            .then((res) =>{
                this.success = res.data.success
                if(this.success){
                    this.items = []
                    const po_no = res.data.purchase_detail.po_no
                    this.$router.push({path:`/purchase-detail/${po_no}`})
                }
                else{
                    this.error_message = res.data.message
                }
        })
        },
        toProductDetailPage(product_id){
            this.$router.push({path:`/product-detail/${product_id}`})
        },
        changeQuantity(product_id, quantity){
            const user_id = window.localStorage.getItem('user_id')
            const token = window.localStorage.getItem('token')
            axios
            .post(
                this.change_url,
                {
                    user_id: user_id,
                    token: token,
                    product_id: product_id,
                    quantity: quantity
                }
                )
            .then((res) =>{
                this.success = res.data.success
                if(this.success){
                    this.items = res.data.shopping_cart_items
                    var total = 0
                    for(var item of this.items){
                        total += item.subtotal
                    }
                    this.total = total
                }
                else{
                    this.error_message = res.data.message
                }
        })            
        }
    }

    
}
</script>

<style scoped>

#row {
    margin-top: 5vh;
}

#checkout-btn {
    width: 22vw;
    height: 12vh;
}

#checkout-card {
    width: 22vw;
    height: 30vh;
}

#checkout-card-container {
    margin-bottom: 5%;
}

#total-cost-title {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
}

#total-cost-content {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
}

#product-image:hover {
    transform: scale(1.2);
    border-style: solid;
    border-width: 1px;
}
</style>