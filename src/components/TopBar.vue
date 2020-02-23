<template>
  <div>
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
    <a-modal 
    v-model="login_visible" 
    title="Login"
    footer=''
    >
      <div v-if="!login_success">
        <a-alert
          message="Error"
          :description="error_message"
          type="error"
          showIcon
        />
      </div>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="login"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'email',
              { rules: [{ required: true, message: 'Please input your email!' }] },
            ]"
            placeholder="Email"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'pwd',
              { rules: [{ required: true, message: 'Please input your Password!' }] },
            ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              },
            ]"
          >
            Remember me
          </a-checkbox>
          <a class="login-form-forgot" href="">
            Forgot password
          </a>
          <a-button type="primary" html-type="submit" class="login-form-button">
            Log in
          </a-button>
          Or
          <a href="3">
            register now!
          </a>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
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
  #components-form-demo-normal-login .login-form {
  max-width: 300px;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
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
        is_login: '',
        user_name: '',
        logout_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/logout',
        login_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/login',
        login_success:true
      }
    },
    props:{
      login_visible:Boolean
    },
    beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
    },
    updated(){
      this.is_login =  window.localStorage.getItem('is_login')
      this.user_name = window.localStorage.getItem('user_name')
      console.log(this.is_login)
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
            .post(this.logout_url,{id:user_id})
            .then((res) =>{
              if(res.data.success){
                window.localStorage.clear()
              }         
            })
        this.is_login =  false
      },
      login(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            values.pwd = this.$md5(values.pwd)
            axios
              .post(this.login_url)
              .then((res) =>{
                this.login_success = res.data.success
                if(this.login_success){
                  const user_id = res.data.id
                  const user_name = res.data.name
                  const token = res.data.token
                  window.localStorage.setItem('user_id', user_id)
                  window.localStorage.setItem('user_name', user_name)
                  window.localStorage.setItem('token', token)
                  window.localStorage.setItem('is_login', true)
                  this.$emit('loginFinish',false)
                }
                else{
                  this.error_message = res.data.message
                }

            })
          }
        });
    },
    }
  }
</script>