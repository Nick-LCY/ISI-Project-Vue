<!-- for F1&2 -->

<template>
	<a-layout>

		<TopBar></TopBar>

		<a-layout-content id="content">

		<div id="buttons">
			<a-radio-group :value="po" @change="handlePOChange">
				<a-radio-button value="all">Show All</a-radio-button>
				<a-radio-button value="pending">Pending Orders</a-radio-button>
        <a-radio-button value="hold">Orders on Hold</a-radio-button>
				<a-radio-button value="past">Past Orders</a-radio-button>
			</a-radio-group>
		</div>

		<div>
			<a-list :grid="{ gutter: 32, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }" :dataSource="changePOStatus(po_info)">
				<a-list-item slot="renderItem" slot-scope="item">
          <router-link :to="'/po-processing/'+item.po_no">
					<a-card :class="item.status" hoverable>
						<a-card-meta>
							<template slot="description">
								<p>PO. Number: {{item.po_no}}</p>
								<p>Purchase Date: {{item.purchase_date}}</p>
								<p>Status: {{item.status}}</p>
								<p>Total Amount: ${{item.total_amount}}</p>
                <p>Customer Name: {{item.customer_name}}</p>
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
    name:'po-list',
    components:{
      TopBar,
    },
    data() {
      return {
        total_pages: 0,
        request_data: {
          current_page: 0,
        },
        po: 'pending',
        po_info: [],
        vendor_po_list_url: 'http://localhost:9981/vendor_purchase_orders',
      }
    },
    
    created(){
      const user_id = window.localStorage.getItem('user_id');
      const token = window.localStorage.getItem('token');
      axios
      .get(this.vendor_po_list_url+'?user_id='+user_id+'&token='+token)
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
      sendRequest(page) {
        axios
        .get(this.vendor_po_list_url + '?page=' + page)
        .then((res) => {
          this.po_info = res.data.po_info.item_list;
          this.request_data.current_page = res.data.po_info.current_page;
          this.total_pages = res.data.po_info.total_pages;
        })
      },
      onChangePage(page){
        this.sendRequest(
            page,
        )
      },
      changePOStatus(po_info) {
        var c = [];
        var i = po_info.length - 1;
        if (this.po == 'pending') {
          for (i; i >= 0; i--) {
            var p = po_info[i];
            if (p.status == "Pending") {
              c.push(p);
            }
          }
			// eslint-disable-next-line no-console
			// console.log(this.po);
          return _.orderBy(c, 'purchase_date', 'desc');
        }
        else if (this.po == 'hold') {
          for (i; i >= 0; i--) {
            p = po_info[i];
            if (p.status == "Hold") {
              c.push(p);
            }
          }
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
 height: 220px;
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