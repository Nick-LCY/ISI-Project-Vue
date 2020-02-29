<template>
    <a-layout>
        <!-- <TopBar @clickSearchBtn="search_visible = true" @clickLoginBtn="login_visible = true" @loginFinish="login_visible = false" v-bind:login_visible=login_visible></TopBar> -->
        <a-layout-content>
        <a-breadcrumb id="breadcrumb">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>Shopping Cart</a-breadcrumb-item>
        </a-breadcrumb>
        <a-row :gutter="16">
            <a-col class="left" :span="18">
                <a-table 
                :columns="columns" 
                :dataSource="items" 
                :rowKey="record => record.id"
                >
                <img slot="thumbnail_location" slot-scope="thumbnail_location" :src="thumbnail_location" />
                <!-- <a-input-number id="inputNumber" :min="1"  @change="onChange" slot="quantity" v-model="items.quantity"/> -->
                <a-icon type="delete" slot="remove" @click="RemoveItem" />
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
                        <a-button id="checkout-btn" type='primary'>
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
// import TopBar from '@/components/TopBar.vue'
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
    //   TopBar,
    },
    data(){
        return{
            columns,
            get_items_request_url:'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/shopping_cart',
            items:[],
            total:''
        }
    },
    created(){
        const user_id = window.localStorage.getItem('user_id')
        const token = window.localStorage.getItem('token')
        axios
        .get(this.get_items_request_url+'?user_id=' + user_id
          + '&token=' + token)
        .then((res) =>{
            this.items = res.data.shopping_cart_items
        })
        var total = 0
        var item
        for(item in this.items){
            total += item.subtotal
        }
        this.total = total
        
    },
    methods:{
        removeItem(record){
            // const user_id = window.localStorage.getItem('user_id')
            // const token = window.localStorage.getItem('token')
            // const items = [...this.items]
            console.log(record.rowKey)
            // this.items = items.filter(item => item.key !== key);
        }
    }

    
}
</script>

<style scoped>
#breadcrumb {
   margin: 32px 0;
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
</style>