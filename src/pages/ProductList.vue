<template>
  <a-layout id="fixed">
    <TopBar @clicked="search"></TopBar>
      <a-row type="flex" justify="start" :gutter="8">
        <a-button-group>
          <a-button icon="arrow-up" @click="onPriceAsc">Ascending Price</a-button>
          <a-button icon="arrow-down" @click="onPriceDesc">Descending Price</a-button>
        </a-button-group>
        <a-col>    
          <a-dropdown>
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="1">1st item</a-menu-item>
              <a-menu-item key="2">2nd item</a-menu-item>
              <a-menu-item key="3">3rd item</a-menu-item>
            </a-menu>
            <a-button> Category <a-icon type="down" /> </a-button>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-layout-content :style="{ padding: '0 50px', marginTop: '16px' }">
        <a-breadcrumb :style="{ margin: '32px 0' }">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>Product List</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="product-list">
          <a-list :grid="{ gutter: 32, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }" :dataSource="product_list">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-card hoverable>
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  slot="cover"
                />
                <a-card-meta :title="'$'+item.price">
                  <template slot="description">{{item.name}}</template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </a-list>
        </div>
        <a-pagination id="page" showQuickJumper  :total=total_pages :defaultPageSize="20" @change="onChange" />
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    <div id="search-box-container" v-if="visible" >
      <div id="search-box">
        <a-input-search size="large" @search="onSearch"/>
      </div>
    </div>
  </a-layout>
</template>

<style scoped>

 #page {
   margin-top: 50px;
   text-align: center;
 }

 .ant-card{
   width: 300px;
   height: 300px;
   margin-bottom: 30px;
 }

 #search-box-container{
   margin:0 auto;
   height: 100vh;
   width: 100vw;
   position: fixed;
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1;
   background-color: rgba(0, 0, 0, 0.5)
 }

 #search-box{
   width: 60vw;
 }

#main{
  z-index: -1;
}
</style>


<script>

import TopBar from '@/components/TopBar.vue'
import axios from 'axios'

  export default {
    name:'product-list',
    components:{
      TopBar
    },
    data() {
      return {
        total_pages : null,
        product_list : null,
        afterSearchStytle:{}, 
        visible:false     
      }
    },
    
    created(){
      var test = this;
      axios
        .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/products')
        .then((res) =>{ test.product_list = res.data.item_list;
                        test.total_pages = res.data.total_pages*10;
                        })

    },
    methods: {
      onChange: function(){
        let current = this;
        axios
          .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/products',{
                page: this.current_page
                })
          .then((res) => {
            current.product_list = res.data.item_list
          })
      },
      onPriceAsc: function(){
        let current = this;
        
        axios
          .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/products',{
                order_by: '1'
                })
          .then((res) => {
            current.product_list = res.data.item_list
          })
      },
      onPriceDesc: function(){
        let current = this;
        axios
          .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/products',{
                order_by: '0'
                })
          .then((res) => {
            current.product_list = res.data.item_list
            // // eslint-disable-next-line no-console
            // console.log(current.product_list)
          })
      },
      search: function(value){
        this.visible = value
      },
      onSearch: function(value){
        let current = this;
        axios
          .post('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/products',{
                key: value
                })
          .then((res) => {
            current.product_list = res.data.item_list
          })
      }
    },
  };
</script>