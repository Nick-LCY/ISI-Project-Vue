<template>
  <a-layout id="components-layout-demo-fixed">
    <TopBar></TopBar>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      
      <div id="main-content">

        <a-row type="flex" justify="space-around">
          <a-col :span="8">
            <a-carousel autoplay>
              <div><img src="..\\assets\\thumbnail.jpg"></div>
              <div><img src="..\\assets\\photo1.jpg"></div>
              <div><img src="..\\assets\\photo2.jpg"></div>
              <div><img src="..\\assets\\photo3.jpg"></div>
              <div><img src="..\\assets\\photo4.jpg"></div>
            </a-carousel>
          </a-col>

          <a-col :span="16" class="info" v-for="pro in data" v-bind:key="pro.id">
            <a-divider>{{pro.name}}</a-divider>
            <a-row type="flex" justify="space-around">
              <a-col :span="7" class="basic_info">
                <p>Price: ${{pro.price}}</p>
                <!-- <p>Rating: <a-rate :defaultValue="4.5" disabled allowHalf/></p> -->
                <p><a-button type="primary" size="large">Add to Cart</a-button></p>
                <p class="cate">Category: {{pro.category}}</p>
              </a-col>
              <a-col :span="12" class="description">
                <p>Other Properties:</p>
                <a-tabs tabPosition="left">
                  <a-tab-pane v-for="des in pro.description" :tab=des.id :key=des.id>{{des.content}}</a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-col>
        </a-row> 

        <br><br><br> 

        <!-- <a-row>
          <a-col>
            <a-list
              class="comment-list"
              :header="`${data.length} reviews`"
              itemLayout="horizontal"
              :dataSource="data"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-comment :author="item.author" :avatar="item.avatar">
                  <p>Rating: <a-rate :defaultValue="3.5" disabled allowHalf/></p>
                  <p slot="content">{{item.content}}</p>
                  <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                    <span>{{item.datetime.fromNow()}}</span>
                  </a-tooltip>
                </a-comment>
              </a-list-item>
            </a-list>
          </a-col>
        </a-row> -->
        

      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>



<script>
  import moment from 'moment';
  import axios from 'axios';
  import TopBar from '@/components/TopBar.vue';
  export default {
    name: "product-detail",
    components:{
      TopBar
    },
    data() {
      return {
        collapsed: false,
        moment,
        data: [{

        }],
        // data: [
        //   {
        //     // actions: ['Reply to'],
        //     author: 'Jennifer Chun',
        //     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //     content:
        //       'Good.',
        //     datetime: moment().subtract(1, 'days'),
        //   },
        //   {
        //     // actions: ['Reply to'],
        //     author: 'Monica Lyu',
        //     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //     content:
        //       'Great.',
        //     datetime: moment().subtract(2, 'days'),
        //   },
        //   {
        //     // actions: ['Reply to'],
        //     author: 'Nick Lin',
        //     avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        //     content:
        //       'Just so so.',
        //     datetime: moment().subtract(6, 'days'),
        //   },
        // ],
        
        // methods: {
        //   callback(key) {
        // eslint-disable-next-line no-console
        //     console.log(key);
        //   },
        // },
        
      };
    },
    created(){
      // var test = this;
      axios
        .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product')
        .then((res) =>{ this.data = res.data.product;
                        // test.current_page = res.data.current_page;
                        // test.total_pages = res.data.total_pages*10;
                        // // eslint-disable-next-line no-console
                        // console.log(test.total_pages)
                        // eslint-disable-next-line no-console
                        console.log(this.data)
                        // // eslint-disable-next-line no-console
                        // console.log(test.current_page)
                        })

    },
  };
</script>

<style scoped>
   #components-layout-demo-fixed .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px 16px 0;
    float: left;
  }

  #content-box {
    padding: 0 50px;
  }

  #main-content {
    background: #fff;
    padding: 24px;
  }

  .ant-divider {
    padding-bottom: 10px;
    font-size: 30px;
    font-weight: bold;
  }

  .ant-divider.ant-divider-horizontal.ant-divider-with-text::before,
  .ant-divider.ant-divider-horizontal.ant-divider-with-text::after
  {
    border-top: 3px dashed rgb(1,1,1);
  }

  .ant-carousel {
    width: 100%;
    padding-right: 15px;
  }

  .ant-carousel img {
    margin: 0 auto;
    width: 100%;
    /*height: 100%;*/
    vertical-align: middle;
  }

  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 250px;
    line-height: 250px;
    overflow: hidden;
  }

  .info {
    text-align: left;
    font-size: 20px;
    padding-left: 15px;
  }

  .cate {
    font-size: 15px;
  }

  .description {
    border-left: 2px solid rgb(220, 220, 220);
    padding: 10px;
    margin: 0;
  }

</style>