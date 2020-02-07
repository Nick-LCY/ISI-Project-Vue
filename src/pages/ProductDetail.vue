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

        <!-- <a-carousel autoplay arrows dotsClass="slick-dots slick-thumb">
          <div><img src="..\\assets\\photo1.jpg"></div>
          <div><img src="..\\assets\\photo2.jpg"></div>
          <div><img src="..\\assets\\photo3.jpg"></div>
          <div><img src="..\\assets\\photo4.jpg"></div>
        </a-carousel> -->
        <div class="carou">
          <a-carousel arrows dotsClass="slick-dots slick-thumb">
            <a slot="customPaging" slot-scope="props">
              <img :src="getImgUrl(props.i)" />
            </a>
            <div v-for="p in 4" :key="p">
              <img :src="baseUrl+'photo'+p+'.jpg'" />
            </div>
          </a-carousel>
        </div>
        
        
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
  const baseUrl = '../assets/';
  export default {
    data() {
      return {
        baseUrl,
        // collapsed: false,
        // photos: [
        //   {src: require('../assets/thumbnail.jpg')},
        //   {src: require('../assets/photo1.jpg')},
        //   {src: require('../assets/photo2.jpg')},
        //   {src: require('../assets/photo3.jpg')},
        //   {src: require('../assets/photo4.jpg')},
        // ],
      };
    },
    methods: {
      getImgUrl(i) {
        return `${baseUrl}photo${i + 1}.jpg`;
        // return this.photos[i];
      },
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

  .thumbnail {
    width: 50px;
    padding-right: 10px;
  }

/*  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }*/

/*  .carou {
    position: absolute;
    left: 0px;
  }*/

  .ant-carousel >>> .slick-dots {
    height: auto;
  }
  .ant-carousel >>> .slick-slide img {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 80%;
  }
  .ant-carousel >>> .slick-thumb {
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
  }

</style>