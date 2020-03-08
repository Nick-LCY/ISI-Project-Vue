<template>
  <a-layout>

    <TopBar 
    @clickSearchBtn="gotSearchResult" 
    v-bind:request_data=request_data
    >
    </TopBar>

    <!-- <TopBar 
    @clickSearchBtn="gotSearchResult" 
    @clickLoginBtn="login_visible = true" 
    @loginFinish="login_visible = false" 
    v-bind:login_visible=login_visible
    v-bind:request_data=request_data
    >
    </TopBar> -->

    <a-row type="flex" justify="start" :gutter="8">
      <a-button-group>
        <a-button icon="arrow-up" @click="onPriceAsc">Ascending Price</a-button>
        <a-button icon="arrow-down" @click="onPriceDesc">Descending Price</a-button>
      </a-button-group>
    </a-row>

    <a-layout-content id="content">

      <a-breadcrumb id="breadcrumb">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Product List</a-breadcrumb-item>
      </a-breadcrumb>

      <a-list :grid="{ gutter: 32, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }" :dataSource="product_list">
        
        <a-list-item slot="renderItem" slot-scope="item">
          <router-link :to="'/product-detail/'+item.id">
            <a-card hoverable>
              <img :src="item.thumbnail_location" slot="cover"/>
              <a-card-meta :title="'$'+item.price">
                <template slot="description">
                  {{item.name}}<br>
                  [{{item.category}}]
                </template>
              </a-card-meta>
            </a-card>
          </router-link>
        </a-list-item>
      </a-list>

      <a-pagination 
        id="page"
        showQuickJumper
        :total="total_pages*20"
        :current=request_data.current_page
        :defaultPageSize="20"
        @change="onChangePage"
      />

    </a-layout-content>

  </a-layout>
</template>

<style scoped>
#breadcrumb {
   margin: 32px 0;
}

#content {
   padding: 0 50px;
   margin-top: 16px;
}

#page {
 margin: 50px 0;
 text-align: center;
}

.ant-card{
 width: 300px;
 height: 300px;
 margin-bottom: 30px;
}
</style>


<script>
  import TopBar from '@/components/TopBar.vue'
  import axios from 'axios'

  export default {
    name:'product-list',
    components:{
      TopBar,
    },
    data() {
      return {
        total_pages: 0,
        product_list: [],
        request_data: {
          current_page: 0,
          key: '%',
          order_by: '1',
          category: '____'
        },
        request_url: 'http://localhost:9981/products',
      }
    },
    created(){
      axios
      .get(this.request_url)
      .then((res) =>{
        this.product_list = res.data.item_list;
        this.total_pages = res.data.total_pages;
        this.request_data.current_page = res.data.current_page;
      })
    },
    methods: {
      onChangePage(page){
        this.sendRequest(
            page,
            this.request_data.key,
            this.request_data.category,
            this.request_data.order_by
          )
      },
      onPriceAsc(){
        this.request_data.order_by = 1;
        this.sendRequest(
            1,
            this.request_data.key,
            this.request_data.category,
            this.request_data.order_by
          )
      },
      onPriceDesc(){
        this.request_data.order_by = 0;
        this.sendRequest(
            1,
            this.request_data.key,
            this.request_data.category,
            this.request_data.order_by
          )
      },
      gotSearchResult(value){
        this.product_list = value.product_list
        this.request_data.current_page = value.current_page
        this.total_pages = value.total_pages
        this.category = value.category
      },
      sendRequest(page, key, category, order_by) {
        axios
        .get(this.request_url
          + '?page=' + page
          + '&key=' + key
          + '&order_by=' + order_by
          + '&category=' + category)
        .then((res) => {
          this.product_list = res.data.item_list;
          this.request_data.current_page = res.data.current_page;
          this.total_pages = res.data.total_pages;
          this.category = res.data.item_list.category;
        })
      },
    },
  };
</script>