<template>
  <a-layout-header>
    <div class="right-align" style="float: right;">
      <div id="search-container">
        <a-button type="primary" size="large" @click="showSearchBox"><a-icon type="search" />Search</a-button>
      </div>
      <div id="avatar-container" v-if="!is_login"  @click="showLoginBox">
        <a-avatar id="user-icon" icon="user" size="large" @click="showLoginBox"/>
      </div>
    </div>

    <a-menu theme="dark" mode="horizontal" style="line-height: 64px;" :defaultSelectedKeys="['products']">
      <a-menu-item key="products">Products</a-menu-item>
      <a-menu-item key="orders">Orders</a-menu-item>
      <a-menu-item key="shipping_cart">Shopping Cart</a-menu-item>
      <a-sub-menu v-if="is_login">
        <span slot="title"><a-icon type="user" />{{user_name}}</span>
        <a-menu-item-group>
          <a-menu-item key="change_pwd">Change Password</a-menu-item>
          <a-menu-item key="logout" @click="logout">Log Out</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
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

  #user-container {
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
import axios from 'axios'

  export default {
    name: 'TopBar',
    components:{
    },
    data(){
      return {
        is_login: window.localStorage.getItem('is_login'),
        user_name: window.localStorage.getItem('user_name'),
        request_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/logout'
      }
    },
    created(){
      console.log(window.localStorage.getItem('user_name'))
    },
    methods:{
      showSearchBox() {
        this.$emit('clickSearchBtn',true)
      },
      showLoginBox() {
        this.$emit('clickLoginBtn',true)
      },
      logout(){
        const user_id = window.localStorage.getItem('user_id')
        axios
            .post(this.request_url,{id:user_id})
            .then((res) =>{
              if(res.data.success){
                window.localStorage.clear()
              }         
            })
      }
    }
  }
</script>