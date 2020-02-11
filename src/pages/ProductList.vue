<template>
  <a-layout id="fixed">
    <TopBar></TopBar>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
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
  </a-layout>
</template>

<style>

 #page {
   margin-top: 50px;
   text-align: center;
 }

 .ant-card{
   width: 300px;
   height: 300px;
   margin-bottom: 30px;
 }

</style>
=======


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
      }
    },
    created(){
      var test = this;
      axios
        .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/products')
        .then((res) =>{ test.product_list = res.data.item_list;
                        // test.current_page = res.data.current_page;
                        test.total_pages = res.data.total_pages*10;
                        // // eslint-disable-next-line no-console
                        // console.log(test.total_pages)
                        // eslint-disable-next-line no-console
                        console.log(test.product_list)
                        // // eslint-disable-next-line no-console
                        // console.log(test.current_page)
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
            // // eslint-disable-next-line no-console
            // console.log(current.product_list)
          })
      },
    },
  };
</script>