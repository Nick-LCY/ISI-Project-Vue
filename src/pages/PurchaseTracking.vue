<!-- for D1&2 -->

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
			<a-list
      :grid="{ gutter: 32, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }"
      :dataSource="changePOStatus(po_info)"
      :pagination="pagination">
				<a-list-item slot="renderItem" slot-scope="item">
          <router-link :to="'/purchase-detail/'+item.po_no">
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
        pagination: {
          pageSize: 20,
        },
        po: 'current',
        po_info: [],
        po_list_url: 'http://localhost:9981/purchase_orders',
      }
    },
    
    created(){
      const user_id = window.localStorage.getItem('user_id');
      const token = window.localStorage.getItem('token');
      axios
      .get(this.po_list_url+'?user_id='+user_id+'&token='+token)
      .then((res) =>{
        this.po_info = res.data.po_info;
        console.log(res.data);

        // eslint-disable-next-line no-console
			// console.log(this.po_info);
      })

    },

    methods: {
      handlePOChange(e) {
        this.po = e.target.value;
      },

      changePOStatus(po_info) {
        if (po_info) {
          var c = [];
          var i = po_info.length - 1;
          if (this.po == 'current') {
            for (i; i >= 0; i--) {
              var p = po_info[i];
              if (p.status == "pending" || p.status == "hold") {
                c.push(p);
              }
            }
            return _.orderBy(c, 'purchase_date', 'desc');
          }
          else if (this.po == 'past') {
            for (i; i >= 0; i--) {
              p = po_info[i];
              if (p.status == "shipped" || p.status == "cancelled") {
                c.push(p);
              }
            }
            return _.orderBy(c, 'purchase_date', 'desc');
          }
          else
            return _.orderBy(po_info, 'purchase_date', 'desc');
          }
        }        
      },

    };
</script>

<style scoped>
#content {
 padding: 0 50px;
 margin: 16px 0 50px 0;
}

.ant-card{
 width: 300px;
 height: 182px;
 margin-bottom: 30px;
}

#search-box{
 margin-top: -20vh;
 width: 60vw;
}

#buttons{
	margin: 50px auto;
	text-align: center;
}

.pending {
	background-color: #fff3cf;
  text-transform: capitalize;
}

.hold {
	background-color: #fcdbd9;
  text-transform: capitalize;
}

.shipped {
	background-color: #cfefdf;
  text-transform: capitalize;
}

.cancelled {
	background-color: #e9e9e9;
  text-transform: capitalize;
}

</style>