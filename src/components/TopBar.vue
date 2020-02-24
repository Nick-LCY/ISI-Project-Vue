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
            <a-menu-item key="change_pwd" @click="change_pwd_visible = true">Change Password</a-menu-item>
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
          :description="login_error_message"
          type="error"
          showIcon
        />
      </div>
      <a-form
        id="components-form-login"
        :form="login_form"
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
    <a-modal
    v-model="change_pwd_visible" 
    title="Change Password"
    footer=''
    >
      <div v-if="!change_pwd_success">
        <a-alert
          message="Error"
          :description="change_pwd_error_message"
          type="error"
          showIcon
        />
      </div>
      <a-form
        id="components-form-change-pwd"
        :form="change_pwd_form"
        class="change-pwd-form"
        @submit="changePassword"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'current_pwd',
              { rules: [{ required: true, message: 'Please input your Current password!' }] },
            ]"
            type="password"
            placeholder="Current Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
       </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'new_pwd',
              { 
                rules: [
                { required: true, message: 'Please input your New password!' },
                {
                  validator: validateToNextPassword && checkPasswordFormat
                },
                ] 
              },
            ]"
            type="password"
            placeholder="New Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'confirm_pwd',
              { 
                rules: [
                  { required: true, message: 'Please confirm your New password!' },
                  {
                    validator: compareToFirstPassword,
                  },
                ] 
              },
            ]"
            type="password"
            @blur="handleConfirmBlur"
            placeholder="Confirm Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
       </a-form-item>
       <a-form-item>
          <a-button type="primary" html-type="submit" class="change-pwd-form-button">
            Submit
          </a-button>
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
  #components-form-login .login-form {
  max-width: 300px;
  }
  /* #components-form-login .login-form-forgot {
    float: right;
  } */
  #components-form-login .login-form-button {
    width: 100%;
  }
  #components-form-change-pwd .change-pwd-form {
  max-width: 300px;
  }
  /* #components-form-change-pwd .change-pwd-form-forgot {
    float: right;
  } */
  #components-form-change-pwd .change-pwd-form-button {
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
        login_success:true,
        login_error_message:'',
        change_pwd_visible:false,
        change_pwd_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/change_pwd',
        change_pwd_error_message:'',
        change_pwd_success:true,
        confirmDirty: false,
      }
    },
    props:{
      login_visible:Boolean
    },
    beforeCreate() {
      this.login_form = this.$form.createForm(this, { name: 'login' })
      this.change_pwd_form = this.$form.createForm(this, { name: 'change_pwd' })
      this.user_name = window.localStorage.getItem('user_name')
      this.is_login = window.localStorage.getItem('is_login')
    },
    created(){
      var login_state =  window.localStorage.getItem('is_login')
      var login_name =  window.localStorage.getItem('user_name')
      this.user_name = login_name
      this.is_login = login_state
    },

    updated(){
      var login_state =  window.localStorage.getItem('is_login')
      var login_name =  window.localStorage.getItem('user_name')
      this.user_name = login_name
      this.is_login = login_state
    },
    methods:{
      showSearchBox() {
        this.$emit('clickSearchBtn',true)
      },
      showLoginBox() {
        this.$emit('clickLoginBtn',true)
      },
      logout(){
        var user_id = window.localStorage.getItem('user_id')
        window.localStorage.setItem('is_login', false)
        var login_state = window.localStorage.getItem('is_login')
        axios
            .post(
              this.logout_url,
              {
                id:user_id
              }
            )
            .then((res) =>{
              if(res.data.success){
                window.localStorage.clear()
                this.is_login = login_state
              }         
            })
      },
      login(e) {
        e.preventDefault();
        this.login_form.validateFields((err, values) => {
          if (!err) {
            values.pwd = this.$md5(values.pwd)
            axios
              .post(
                this.login_url,
                {
                  email: values.email,
                  pwd: values.pwd
                },
              )
              .then((res) =>{
                this.login_success = res.data.success
                if(this.login_success){
                  var user_id = res.data.id
                  var user_name = res.data.name
                  var token = res.data.token
                  window.localStorage.setItem('user_id', user_id)
                  window.localStorage.setItem('user_name', user_name)
                  window.localStorage.setItem('token', token)
                  window.localStorage.setItem('is_login', true)
                  this.$emit('loginFinish',false)
                }
                else{
                  this.login_error_message = res.data.message
                }
            })
          }
        });
      },
      changePassword(e){
        e.preventDefault();
        this.change_pwd_form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                var current_pwd = this.$md5(values.current_pwd)              
                var new_pwd = this.$md5(values.new_pwd)
                var user_id = window.localStorage.getItem('user_id')
                axios
                    .post(
                      this.change_pwd_url,
                      {
                        id: user_id,
                        current_pwd: current_pwd,
                        new_pwd: new_pwd
                      }
                    )
                    .then((res) =>{
                        this.change_pwd_success = res.data.success
                        if(this.change_pwd_success){
                            var token = res.data.token
                            window.localStorage.setItem('token', token)
                            this.change_pwd_visible = false
                        }
                        else{
                            this.change_pwd_error_message = res.data.message
                        }

                })
            }
        });

      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.change_pwd_form;
        if (value && value !== form.getFieldValue('new_pwd')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
      },
      validateToNextPassword(rule, value, callback) {
        const form = this.change_pwd_form;
        if (value && this.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
      },
      checkPasswordFormat(rule, value, callback) {
        var strongRegex = new RegExp("^(?=.*[A-Z])(?=.*[0-9])")
        if (value.length>5 && strongRegex.test(value)) {
            callback();
        } else {
            callback('The password should contain at least 6 characters, in which there must be at least one digit and one capital letter');
        }
      }

    }
  }
</script>