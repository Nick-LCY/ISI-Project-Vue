<template>
  <a-layout-header>
<!--     <div class="left-align" style="float: left;">
      <div id="logo-container">
      </div>
    </div> -->

    <div class="right-align" style="float: right;">
      <div id="search-container">
        <a-button type="primary" size="large" @click="showSearchBox"><a-icon type="search" />Search</a-button>
      </div>
      <div id="avatar-container">
        <a-avatar id="user-icon" icon="user" size="large"/>
      </div>
    </div>

    <a-menu theme="dark" mode="horizontal" style="line-height: 64px;" :defaultSelectedKeys="['products']">
      <a-menu-item key="products">Products</a-menu-item>
      <a-menu-item key="orders">Orders</a-menu-item>
      <a-menu-item key="shipping_cart">Shopping Cart</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<style scoped>
  .right-align {
    height: 64px;
    display: flex;
  }
  #avatar-container {
    margin: 0 5px;
    display: flex;
    align-items: center;
  }
  #user-icon {
    top: 0;
  }
  #search-container {
    margin: 0 5px;
  }
</style>

<script>
  export default {
    name: 'TopBar',
    data(){
      return {
      }
    },
    methods:{
      showSearchBox() {
        this.$emit('clicked',true)     
      },
    }
  }
</script>