<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :defaultSelectedKeys="['2']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      
      <div id="main-content">
        <div class="title">
          Good's name
        </div>

        <a-row>
           <a-col class="info">
            <a-row>
              Price: {{price}}
            </a-row>
            <a-row id="app">
              Rating: <star :num="5" :stor="3.5"></star>
            </a-row>
            <a-row>
              <a-button>Add to cart</a-button>
            </a-row>
            <a-row>Category: Lv1 Cate, Lv2 Cate, Lv3 Cate, Lv4 Cate</a-row>
          </a-col>
          <a-col class="carou">
            <a-carousel autoplay arrows>
              <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
                <a-icon type="left-circle" />
              </div>
              <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
                <a-icon type="right-circle" />
              </div>
              <div><img src="..\\assets\\thumbnail.jpg"></div>
              <div><img src="..\\assets\\photo1.jpg"></div>
              <div><img src="..\\assets\\photo2.jpg"></div>
              <div><img src="..\\assets\\photo3.jpg"></div>
              <div><img src="..\\assets\\photo4.jpg"></div>
            </a-carousel>
          </a-col>
         
        </a-row> 

        <br><br><br> 


        <a-row class="description">
          Other properties:
          <a-row>
            Key1: Value1
          </a-row>
          <a-row>
            Key2: Value2
          </a-row>
          <a-row>
            Key3: Value3
          </a-row>
        </a-row>

        <br><br><br>

        <a-row>
          <a-divider>Review</a-divider>
          <a-card :loading="loading" title="User Name:">
            Rating: <star :num="5" :stor="5"></star>
            <br>
            Comment:
          </a-card>
          <br>
          <a-card :loading="loading" title="User Name:">
            Rating: <star :num="5" :stor="4.5"></star>
            <br>
            Comment:
          </a-card>
          <br>
          <a-card :loading="loading" title="User Name:">
            Rating: <star :num="5" :stor="4"></star>
            <br>
            Comment:
          </a-card>
        </a-row>
        

      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>



<script>
  import star from '../components/Star.vue'
  export default {
    components: {
      star
    },
    data() {
      return {
        collapsed: false,
        price: '$100.01',
      };
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
/*    min-height: 280px;*/
  }

  .title {
    padding-bottom: 25px;
    font-size: 30px;
    font-weight: bold;
  }

  .ant-carousel img {
    margin: 0 auto;
    width: 100%;
    /*height: 100%;*/
    vertical-align: middle;
  }

  .ant-carousel {
    width: 40%;
  }

  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 300px;
    line-height: 300px;
    /*background: #364d79;*/
    overflow: hidden;
  }

  .ant-carousel >>> .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: rgb(1, 1, 1);
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }

  .ant-carousel >>> .custom-slick-arrow:before {
    display: none;
  }

  .ant-carousel >>> .custom-slick-arrow:hover {
    opacity: 0.5;
  }

  .ant-carousel >>> .slick-slide h3 {
    color: rgb(1, 1, 1);
  }

  .info {
    float: right;
    text-align: left;
    font-size: 20px;
  }

  .description {
    font-size: 20px;
  }

  .description >>> .a-row {
    font-size: 15px;
  }

</style>