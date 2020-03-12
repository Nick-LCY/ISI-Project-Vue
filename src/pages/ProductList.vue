<template>
  <a-layout>

    <TopBar 
    @clickSearchBtn="gotSearchResult" 
    v-bind:request_data=request_data
    >
    </TopBar>

    <a-row type="flex" justify="start" :gutter="8">
      <a-button-group>
        <a-button icon="arrow-up" @click="onPriceAsc">Ascending Price</a-button>
        <a-button icon="arrow-down" @click="onPriceDesc">Descending Price</a-button>
      </a-button-group>
      <a-cascader :options="options" @change="onChangeCategory" placeholder="Please select" />
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
              <img :src="item.thumbnail_location" slot="cover" class="thumbnail-image"/>
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

.thumbnail-image{
  height: 180px;
  object-fit: cover;
  width: 100%;  
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
        options: [
{"value": "A___", "label": "women", "children": [{"value": "AA__", "label": "new-products", "children": [{"value": "AAA_", "label": "premium", "children": []}, {"value": "AAB_", "label": "clothing", "children": []}, {"value": "AAC_", "label": "shoes", "children": []}, {"value": "AAD_", "label": "accessories", "children": []}, {"value": "AAE_", "label": "bags", "children": []}, {"value": "AAF_", "label": "sports", "children": []}, {"value": "AAG_", "label": "beauty", "children": []}, {"value": "AAH_", "label": "trends", "children": []}]}, {"value": "AB__", "label": "premium", "children": [{"value": "ABA_", "label": "clothing", "children": []}, {"value": "ABB_", "label": "shoes", "children": []}, {"value": "ABC_", "label": "accessories", "children": []}, {"value": "ABD_", "label": "sports", "children": []}, {"value": "ABE_", "label": "beauty", "children": []}]}, {"value": "AC__", "label": "tommy-hilfiger", "children": []}, {"value": "AD__", "label": "calvin-klein", "children": []}, {"value": "AE__", "label": "polo-ralph-lauren", "children": []}, {"value": "AF__", "label": "guess", "children": []}, {"value": "AG__", "label": "scotch-soda", "children": []}, {"value": "AH__", "label": "agnes-b", "children": []}, {"value": "AI__", "label": "puma-select", "children": []}, {"value": "AJ__", "label": "coach", "children": []}, {"value": "AK__", "label": "gucci", "children": []}, {"value": "AL__", "label": "michael-kors", "children": []}, {"value": "AM__", "label": "love-moschino", "children": []}, {"value": "AN__", "label": "swarovski", "children": []}, {"value": "AO__", "label": "veja", "children": []}, {"value": "AP__", "label": "clothing", "children": [{"value": "APA_", "label": "dresses", "children": []}, {"value": "APB_", "label": "fashion-tops", "children": []}, {"value": "APC_", "label": "pants-leggings", "children": []}, {"value": "APD_", "label": "jeans", "children": []}, {"value": "APE_", "label": "skirts", "children": []}, {"value": "APF_", "label": "shorts", "children": []}, {"value": "APG_", "label": "knitwear-cardigans", "children": []}, {"value": "APH_", "label": "hoodies-sweatshirts", "children": []}, {"value": "API_", "label": "jackets-coats", "children": []}, {"value": "APJ_", "label": "blazers", "children": []}, {"value": "APK_", "label": "lingerie-sleepwear", "children": []}, {"value": "APL_", "label": "playsuits-jumpsuits", "children": []}, {"value": "APM_", "label": "swimwear-beachwear", "children": []}, {"value": "APN_", "label": "socks-tights", "children": []}, {"value": "APO_", "label": "petite", "children": []}, {"value": "APP_", "label": "plus-size", "children": []}, {"value": "APQ_", "label": "maternity", "children": []}]}, {"value": "AQ__", "label": "shoes", "children": [{"value": "AQA_", "label": "heels", "children": []}, {"value": "AQB_", "label": "boots", "children": []}, {"value": "AQC_", "label": "sneakers", "children": []}, {"value": "AQD_", "label": "flats", "children": []}, {"value": "AQE_", "label": "sandals", "children": []}, {"value": "AQF_", "label": "wedges", "children": []}, {"value": "AQG_", "label": "slip-ons", "children": []}, {"value": "AQH_", "label": "flip-flops", "children": []}, {"value": "AQI_", "label": "sports-shoes", "children": []}, {"value": "AQJ_", "label": "comfort-shoes", "children": []}]}, {"value": "AR__", "label": "accessories", "children": [{"value": "ARA_", "label": "watches", "children": []}, {"value": "ARB_", "label": "eyewear", "children": []}, {"value": "ARC_", "label": "jewellery", "children": []}, {"value": "ARD_", "label": "scarves-shawls", "children": []}, {"value": "ARE_", "label": "hair-accessories", "children": []}, {"value": "ARF_", "label": "technology", "children": []}, {"value": "ARG_", "label": "other-accessories", "children": []}]}, {"value": "AS__", "label": "bags", "children": [{"value": "ASA_", "label": "clutches", "children": []}, {"value": "ASB_", "label": "crossbody-bags", "children": []}, {"value": "ASC_", "label": "tote-bags", "children": []}, {"value": "ASD_", "label": "wallets-purses", "children": []}, {"value": "ASE_", "label": "backpacks", "children": []}, {"value": "ASF_", "label": "leather-bags", "children": []}, {"value": "ASG_", "label": "travel", "children": []}, {"value": "ASH_", "label": "hand-bags", "children": []}, {"value": "ASI_", "label": "shopper-bags", "children": []}, {"value": "ASJ_", "label": "laptop-bags", "children": []}]}, {"value": "AT__", "label": "sports", "children": [{"value": "ATA_", "label": "shop-by-category", "children": []}, {"value": "ATB_", "label": "shop-by-sport-activity", "children": []}]}, {"value": "AU__", "label": "beauty", "children": [{"value": "AUA_", "label": "makeup", "children": []}, {"value": "AUB_", "label": "skin-care", "children": []}, {"value": "AUC_", "label": "body", "children": []}, {"value": "AUD_", "label": "nails", "children": []}, {"value": "AUE_", "label": "hair", "children": []}, {"value": "AUF_", "label": "tools-brushes", "children": []}, {"value": "AUG_", "label": "fragrance", "children": []}]}, {"value": "AV__", "label": "trends", "children": [{"value": "AVA_", "label": "florals", "children": []}, {"value": "AVB_", "label": "nude-neutrals", "children": []}, {"value": "AVC_", "label": "denim", "children": []}, {"value": "AVD_", "label": "monochrome", "children": []}, {"value": "AVE_", "label": "athleisure", "children": []}, {"value": "AVF_", "label": "lace", "children": []}, {"value": "AVG_", "label": "stripes", "children": []}]}, {"value": "AW__", "label": "be-inspired", "children": []}, {"value": "AX__", "label": "occasions", "children": [{"value": "AXA_", "label": "bridal", "children": []}, {"value": "AXB_", "label": "evening", "children": []}, {"value": "AXC_", "label": "work-wear", "children": []}, {"value": "AXD_", "label": "basics", "children": []}]}, {"value": "AY__", "label": "korean-fashion", "children": []}, {"value": "AZ__", "label": "zaloraloveslocal", "children": []}, {"value": "A[__", "label": "australian-brands", "children": []}, {"value": "A\\__", "label": "just-for-you", "children": []}, {"value": "A]__", "label": "brands", "children": []}]},
{"value": "B___", "label": "men", "children": [{"value": "BA__", "label": "new-products", "children": [{"value": "BAA_", "label": "premium", "children": []}, {"value": "BAB_", "label": "clothing", "children": []}, {"value": "BAC_", "label": "shoes", "children": []}, {"value": "BAD_", "label": "accessories", "children": []}, {"value": "BAE_", "label": "bags", "children": []}, {"value": "BAF_", "label": "sports", "children": []}, {"value": "BAG_", "label": "grooming", "children": []}]}, {"value": "BB__", "label": "premium", "children": [{"value": "BBA_", "label": "clothing", "children": []}, {"value": "BBB_", "label": "shoes", "children": []}, {"value": "BBC_", "label": "accessories", "children": []}, {"value": "BBD_", "label": "sports", "children": []}]}, {"value": "BC__", "label": "polo-ralph-lauren", "children": []}, {"value": "BD__", "label": "calvin-klein", "children": []}, {"value": "BE__", "label": "tommy-hilfiger", "children": []}, {"value": "BF__", "label": "selected-homme", "children": []}, {"value": "BG__", "label": "guess", "children": []}, {"value": "BH__", "label": "scotch-soda", "children": []}, {"value": "BI__", "label": "sport-b", "children": []}, {"value": "BJ__", "label": "boss", "children": []}, {"value": "BK__", "label": "brooks-brothers", "children": []}, {"value": "BL__", "label": "puma-select", "children": []}, {"value": "BM__", "label": "gucci", "children": []}, {"value": "BN__", "label": "coach", "children": []}, {"value": "BO__", "label": "veja", "children": []}, {"value": "BP__", "label": "clothing", "children": [{"value": "BPA_", "label": "shirt", "children": []}, {"value": "BPB_", "label": "pants", "children": []}, {"value": "BPC_", "label": "jeans", "children": []}, {"value": "BPD_", "label": "outerwear", "children": []}, {"value": "BPE_", "label": "t-shirts", "children": []}, {"value": "BPF_", "label": "polos", "children": []}, {"value": "BPG_", "label": "underwear", "children": []}, {"value": "BPH_", "label": "shorts", "children": []}, {"value": "BPI_", "label": "socks", "children": []}, {"value": "BPJ_", "label": "beachwear", "children": []}]}, {"value": "BQ__", "label": "shoes", "children": [{"value": "BQA_", "label": "sneakers-plimsolls", "children": []}, {"value": "BQB_", "label": "loafers-boat-shoes", "children": []}, {"value": "BQC_", "label": "slip-ons", "children": []}, {"value": "BQD_", "label": "formal-shoes", "children": []}, {"value": "BQE_", "label": "sandals-flip-flops", "children": []}, {"value": "BQF_", "label": "boots", "children": []}, {"value": "BQG_", "label": "sports-shoes", "children": []}, {"value": "BQH_", "label": "shoes-accessories", "children": []}]}, {"value": "BR__", "label": "accessories", "children": [{"value": "BRA_", "label": "watches", "children": []}, {"value": "BRB_", "label": "eyeglasses", "children": []}, {"value": "BRC_", "label": "wallets", "children": []}, {"value": "BRD_", "label": "belts", "children": []}, {"value": "BRE_", "label": "ties-accessories", "children": []}, {"value": "BRF_", "label": "hats-and-caps", "children": []}, {"value": "BRG_", "label": "jewellery", "children": []}, {"value": "BRH_", "label": "scarves-shawls", "children": []}, {"value": "BRI_", "label": "technology", "children": []}]}, {"value": "BS__", "label": "bags", "children": [{"value": "BSA_", "label": "totes", "children": []}, {"value": "BSB_", "label": "laptop-bags", "children": []}, {"value": "BSC_", "label": "messenger", "children": []}, {"value": "BSD_", "label": "travel", "children": []}, {"value": "BSE_", "label": "backpack", "children": []}, {"value": "BSF_", "label": "duffle-bags", "children": []}, {"value": "BSG_", "label": "briefcases", "children": []}]}, {"value": "BT__", "label": "sports", "children": [{"value": "BTA_", "label": "shop-by-category", "children": []}, {"value": "BTB_", "label": "shop-by-activity", "children": []}]}, {"value": "BU__", "label": "grooming", "children": [{"value": "BUA_", "label": "shaving", "children": []}, {"value": "BUB_", "label": "body", "children": []}, {"value": "BUC_", "label": "skin-care", "children": []}, {"value": "BUD_", "label": "hair-care", "children": []}, {"value": "BUE_", "label": "fragrance", "children": []}, {"value": "BUF_", "label": "gift-sets", "children": []}]}, {"value": "BV__", "label": "brands", "children": []}]}
],
        total_pages: 0,
        product_list: [],
        request_data: {
          current_page: 0,
          key: '%',
          order_by: '1',
          category: '____'
        },
        is_vendor: false,
        request_url: 'http://localhost:9981/products'
      }
    },
    created(){
      var is_vendor = window.localStorage.getItem('is_vendor')
      this.is_vendor = is_vendor
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
      onChangeCategory(category){
        this.request_data.category = category[category.length-1]
        this.sendRequest(
            1,
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