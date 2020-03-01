<template>
  <a-layout id="components-layout-demo-fixed">
    <TopBar></TopBar>

    <a-layout-content id="content">
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
            <!-- <a-carousel autoplay arrows dotsClass="slick-dots slick-thumb">
              <a slot="customPaging" slot-scope="props">
                <img :src="getImgUrl(props.i)" />
              </a>
              <div v-for="item in 5" v-bind:key="item">
                <img :src="baseUrl+'abstract0'+item+'.jpg'" />
              </div>
            </a-carousel> -->
          </a-col>

          <a-col :span="16" class="info">
            <a-divider>{{product.name}}</a-divider>
            <a-row type="flex" justify="space-around">
              <a-col :span="7" class="basic_info">
                <p>Price: ${{product.price}}</p>
                <p>Rating: <a-rate :defaultValue="getValue()" disabled allowHalf/></p>
                <p><a-button type="primary" size="large">Add to Cart</a-button></p>
                <p class="cate">Category: {{product.category}}</p>
              </a-col>
              <a-col :span="15" class="description">
                <p>Other Properties:</p>
                <a-tabs tabPosition="left">
                  <a-tab-pane v-for="des in product.product_descriptions" :tab=des.attribute_name :key=des.id>{{des.attribute_value}}</a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-col>
        </a-row> 

        <br><br><br> 

        <a-row>
          <a-col>
            <a-list
              class="comment-list"
              :header="`${reviews.length} reviews`"
              itemLayout="horizontal"
              :dataSource="reviews"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-comment :author="item.author" :avatar="item.avatar">
                  <a-rate v-model="item.rate" disabled allowHalf/>
                  <p slot="content">{{item.content}}</p>
                  <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                    <span>{{item.datetime.fromNow()}}</span>
                  </a-tooltip>
                </a-comment>
              </a-list-item>
            </a-list>
          </a-col>
        </a-row>
        

      </div>
    </a-layout-content>
  </a-layout>
</template>



<script>
  import moment from 'moment';
  import axios from 'axios';
  import TopBar from '@/components/TopBar.vue';

  export default {
    name: "product-detail",
    components:{
      TopBar,
    },
    data() {
      return {
        product: '',
        collapsed: false,
        moment,
        value: 3.5,
        reviews: [
          {
            author: 'Jennifer Chun',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Good.',
            datetime: moment().subtract(1, 'days'),
            rate: 4,
          },
          {
            author: 'Monica Lyu',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Great.',
            datetime: moment().subtract(2, 'days'),
            rate: 4.5,
          },
          {
            author: 'Nick Lin',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Just so so.',
            datetime: moment().subtract(6, 'days'),
            rate: 2.5,
          },
        ],
      };
    },
    created(){
      axios
        .get('http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product')
        .then((res) =>{ this.product = res.data;
                        // eslint-disable-next-line no-console
                        // console.log(this.product)
                        })

    },
    methods: {
      getValue() {
        var star = 0;
        for (var i = this.reviews.length - 1; i >= 0; i--) {
           star += this.reviews[i].rate;
        }
        star = star/this.reviews.length;
        return star; 
      },
     

    },
  };
</script>

<style scoped>
  #content {
    padding: 0 50px;
    margin-top: 16px;
    margin-bottom: 50px;
  }

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

  

  .ant-carousel img {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    vertical-align: middle;
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

  .ant-tabs {
    height: 200px;
  }

<<<<<<< Updated upstream
  .ant-carousel {
    width: 100%;
    padding-right: 15px;
  }

/*  .ant-carousel >>> .slick-dots {
    height: auto;
  }
  .ant-carousel >>> .slick-slide img {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 80%;
  }*/
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 250px;
    line-height: 250px;
    overflow: hidden;
  }
  /*.ant-carousel >>> .slick-thumb {
    bottom: -45px;
  }
  .ant-carousel >>> .slick-thumb li {
    width: 60px;
    height: 45px;
  }
  .ant-carousel >>> .slick-thumb li img {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }
  .ant-carousel >>> .slick-thumb li.slick-active img {
    filter: grayscale(0%);
  }*/

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

</style>