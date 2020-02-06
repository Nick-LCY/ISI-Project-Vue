<template>
  <a-layout id="fixed">
    <TopBar></TopBar>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-breadcrumb :style="{ margin: '32px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="product-list">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-card hoverable>
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                slot="cover"
              />
              <a-card-meta title="$27">
                <template slot="description">a bear</template>
              </a-card-meta>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card hoverable>
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                slot="cover"
              />
              <a-card-meta title="$27">
                <template slot="description">a bear</template>
              </a-card-meta>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card hoverable>
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                slot="cover"
              />
              <a-card-meta title="$27">
                <template slot="description">a bear</template>
              </a-card-meta>
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card hoverable>
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                slot="cover"
              />
              <a-card-meta title="$27">
                <template slot="description">a bear</template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <a-pagination id="page" showQuickJumper :defaultCurrent="2" :total="500" @change="onChange" />
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

 /* #search-box{
   float: right;
 } */
</style>

<script>
import TopBar from '@/components/TopBar.vue'
  export default {
    name:'product-list',
    components:{
      TopBar
    },
    methods: {
      onChange() {

      },
    },
  };
</script>