<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content id="content">

		<div id="buttons">
			<a-radio-group :value="po" @change="handlePOChange">
				<a-radio-button value="all">Show All</a-radio-button>
				<a-radio-button value="current">Current Purchase</a-radio-button>
				<a-radio-button value="past">Past Purchase</a-radio-button>
			</a-radio-group>
		</div>

		<div>
			<a-list :grid="{ gutter: 32, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }" :dataSource="changePOStatus(po_info)">
				<a-list-item slot="renderItem" slot-scope="item">
          <router-link :to="'/purchase-detail/'+item.id">
					<a-card :class="item.status" hoverable>
						<a-card-meta>
							<template slot="description">
								<p>PO. Number: {{item.po_no}}</p>
								<p>Purchase Date: {{item.purchase_date}}</p>
								<p>Status: {{item.status}}</p>
								<p>Total Amount: ${{item.total_amount}}</p>
							</template>
						</a-card-meta>
						<template class="ant-card-actions" slot="actions">
							<p><a-icon type="file-text" /> More Deatils <a-icon type="right" /></p>
						</template>
					</a-card>
          </router-link>
				</a-list-item>
			</a-list>
		</div>

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




<script>
  import axios from 'axios';
  import _ from 'lodash';
  import TopBar from '@/components/TopBar.vue';

  export default {
    name:'purchase-tracking',
    components:{
      TopBar,
    },
    data() {
      return {
        total_pages: 0,
        request_data: {
          current_page: 0,
          key: '%',
          order_by: '1',
          category: '____'
        },
        po: 'current',
        po_info: [],
      }
    },
    
    created(){
      axios
      .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/purchase_orders')
      .then((res) =>{
        this.po_info = res.data.po_info.item_list;
        this.total_pages = res.data.po_info.total_pages;
        this.request_data.current_page = res.data.po_info.current_page;

        // eslint-disable-next-line no-console
			// console.log(this.po_info);
      })

    },

    methods: {
      handlePOChange(e) {
        this.po = e.target.value;
      },
      sendRequest(page, key, category, order_by) {
        axios
        .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/purchase_orders'
          + '?page=' + page
          + '&key=' + key
          + '&order_by=' + order_by
          + '&category=' + category)
        .then((res) => {
          this.po_info = res.data.po_info.item_list;
          this.request_data.current_page = res.data.po_info.current_page;
          this.total_pages = res.data.po_info.total_pages;
        })
      },
      onChangePage(page){
        this.sendRequest(
            page,
            this.request_data.key,
            this.request_data.category,
            this.request_data.order_by
          )
      },
      changePOStatus(po_info) {
        var c = [];
        var i = po_info.length - 1;
        if (this.po == 'current') {
          for (i; i >= 0; i--) {
            var p = po_info[i];
            if (p.status == "Pending" || p.status == "Hold") {
              c.push(p);
            }
          }
			// eslint-disable-next-line no-console
			// console.log(this.po);
          return _.orderBy(c, 'purchase_date', 'desc');
        }
        else if (this.po == 'past') {
          for (i; i >= 0; i--) {
            p = po_info[i];
            if (p.status == "Shipped" || p.status == "Cancelled") {
              c.push(p);
            }
          }
          return _.orderBy(c, 'purchase_date', 'desc');
        }
        else
          return _.orderBy(po_info, 'purchase_date', 'desc');
        }
      },

    };
</script>

<style scoped>
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
 height: 182px;
 margin-bottom: 30px;
}

#box-container{
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
 margin-top: -20vh;
 width: 60vw;
}

#buttons{
	margin: 50px auto;
	text-align: center;
}

.Pending {
	background-color: #fff3cf;
}

.Hold {
	background-color: #fcdbd9;
}

.Shipped {
	background-color: #cfefdf;
}

.Cancelled {
	background-color: #e9e9e9;
}

</style>