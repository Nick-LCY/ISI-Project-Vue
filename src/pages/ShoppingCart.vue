<template>
    <a-layout>
        <TopBar @clickSearchBtn="search_visible = true" @clickLoginBtn="login_visible = true" @loginFinish="login_visible = false" v-bind:login_visible=login_visible></TopBar>
        <a-layout-content>
        <a-breadcrumb id="breadcrumb">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>Shopping Cart</a-breadcrumb-item>
        </a-breadcrumb>
        <a-row :gutter="16">
            <a-col class="left" :span="18">
                <a-table 
                :columns="columns" 
                :dataSource="data" 
                showHeader=false
                >
                </a-table>
            </a-col>
            <a-col class="right" :span="6">
                <a-affix :offsetTop="10">
                    <a-row id="checkout-card-container">
                        <a-card id="checkout-card">
                            <p id="total-cost-title"> TOTAL COST </p>
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
import TopBar from '@/components/TopBar.vue'
const columns = [
    {
        title:'Product',
        dataIndex:'product_img',
    },
    {
        title:'Name',
        dataIndex:'product_name',
    },
    {
        title:'Quantity',
        dataIndex:'quantity',
    },
    {
        title:'Subtotal',
        dataIndex:'subtotal',
    },
]

export default {
    name:'shopping-cart',
    components:{
      TopBar,
    },
    data(){
        return{
            columns
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
    height: 15vh;
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
</style>