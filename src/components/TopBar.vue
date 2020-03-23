<template>
  <div>
    <a-layout-header>
      <div class="right-align" style="float: right;">
        <div id="search-container">
          <a-button type="primary" size="large" @click="showSearchBox" v-if="this.search.button_visible"><a-icon type="search" />Search</a-button>
        </div>
        <div id="avatar-container" v-if="!login_data.state"  @click="showLoginBox">
          <a-avatar id="user-icon" icon="user" size="large" @click="showLoginBox"/>
        </div>
      </div>
   
      <a-menu theme="dark" mode="horizontal" style="line-height: 64px;" v-model="menu_selected">
        <a-menu-item key="/">
          Products
          <router-link :to="{path: '/'}"></router-link>
        </a-menu-item>
        <a-menu-item v-if="is_vendor === 'false' || is_vendor === null" key="/purchase-tracking">
          Orders     
          <router-link :to="{path: '/purchase-tracking'}"></router-link>
        </a-menu-item>
        <a-menu-item v-if="is_vendor === 'true'" key="/po-list">
          Orders     
          <router-link :to="{path: '/po-list'}"></router-link>
        </a-menu-item>
        <a-menu-item v-if="is_vendor === 'false' || is_vendor === null" key="/shopping_cart">
          Shopping Cart
          <router-link :to="{path: '/shopping-cart'}"></router-link>
        </a-menu-item>
        <a-sub-menu v-if="login_data.state">
          <span slot="title"><a-icon type="user" />{{login_data.name}}</span>
          <a-menu-item-group>
            <a-menu-item key="change_pwd" @click="change_pwd.modal_visible = true">Change Password</a-menu-item>
            <a-menu-item key="logout" @click="logout">Log Out</a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
      </a-menu>

      <a-alert
      v-if="!error.success"
      message="Error"
      :description="error_message"
      type="error"
      showIcon
      />
    </a-layout-header>

    <div id="box-container" v-if="search.box_visible">
      <div id="search-box">
        <a-input-search size="large" @search="onSearch"/>
      </div>
    </div>
    
    <a-modal 
    v-model="login_data.modal_visible" 
    title="Login"
    footer=''
    :afterClose="closeLoginModal"
    >
      <div v-if="!login_data.success">
        <a-alert
          message="Error"
          :description="login_data.error_message"
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
          <a href="register">
            register now!
          </a>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
    v-model="change_pwd.modal_visible" 
    title="Change Password"
    footer=''
    :afterClose="closeChangePwdModal"
    >
      <div v-if="!change_pwd.success">
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
  #components-form-login .login-form-button {
    width: 100%;
  }
  #components-form-change-pwd .change-pwd-form {
  max-width: 300px;
  }
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
        login_data:{
          modal_visible:false,
          state:'',
          name:'',
          login_url:'http://localhost:9981/login',
          logout_url:'http://localhost:9981/logout',
          success:true,
          error_message:'',
        },
        error:{
          success:true,
          error_message:''
        },
        change_pwd:{
          modal_visible:false,
          url: 'http://localhost:9981/change_pwd',
          error_message:'',
          success:true
        },
        search:{
          box_visible:false,
          button_visible:true,
          button_type:'',
          item_url: 'http://localhost:9981/products',
          po_url:'http://localhost:9981/purchase_order',
          result:{
            product_list:[],
            current_page:'',
            total_pages:'',
            category:''
          }
        },
        confirmDirty: false,
        menu_selected:this.$route.path,
        is_vendor:''
      }
    },
    props:{
      request_data:
      {
          current_page: 0,
          key: '%',
          order_by: '1',
          category: '____'
      },
      login_page:Boolean

    },
    beforeCreate() {
      this.login_form = this.$form.createForm(this, { name: 'login' })
      this.change_pwd_form = this.$form.createForm(this, { name: 'change_pwd' })
    },
    created(){
      this.menu_selected =[this.$route.path]
      this.setLoginData()
      this.searchBtnVisible()
      this.checkRequestFromLoginPage()
    },
    updated(){
      this.setLoginData()
    },
    methods:{
      showSearchBox() {
        this.search.box_visible = true
      },
      showLoginBox() {
        this.login_data.modal_visible = true
      },
      onSearch(value){
        if(this.search.button_type == 'user_search_item' || this.search.button_type == 'vendor_search_item')
        {
          this.request_data.key = value;
          axios
          .get(
            this.search.item_url
            + '?page=' + 1
            + '&key=' + this.request_data.key
            + '&order_by=' + this.request_data.order_by
            + '&category=' + this.request_data.category
            )
          .then((res) => {
            this.search.result.product_list = res.data.item_list;
            this.search.result.current_page = res.data.current_page;
            this.search.result.total_pages = res.data.total_pages;
            this.search.result.category = res.data.item_list.category;
            this.$emit('clickSearchBtn',this.search.result)
            this.search.box_visible = false
          })
        }
        else if(this.search.button_type == 'vendor_search_purchase_order')
        {
          axios
          .get(
            this.search.po_url
            +'?token=' + window.localStorage.getItem('token')
            +'&po_no=' + value
            +'&user_id=' + window.localStorage.getItem('user_id')
          )
          .then((res) => {
            this.error.success = res.data.success
            if(res.data.success){
              this.$router.push({path:`/po-processing/${res.data.purchase_detail.po_no}`})
            }
            else{
              this.error.error_message = res.data.message
            }
          }
          )
        }
      },
      logout(){
        var user_id = window.localStorage.getItem('user_id')
        axios
            .post(
              this.login_data.logout_url,
              {
                id:user_id
              }
            )
            .then((res) =>{
              this.error.success = res.data.success
              if(res.data.success){
                window.localStorage.clear()
                this.login_data.state = false
                this.$router.push({path:'/'})
              }
              else{
                this.error.error_message = res.data.error_message
              }         
            })
      },
      checkRequestFromLoginPage(){
        if(this.login_page)
        {
          this.login_data.modal_visible = true
        }
      },
      login(e) {
        e.preventDefault();
        this.login_form.validateFields((err, values) => {
          if (!err) {
            values.pwd = this.$md5(values.pwd)
            axios
              .post(
                this.login_data.login_url,
                {
                  email: values.email,
                  pwd: values.pwd
                }
              )
              .then((res) =>{
                this.login_data.success = res.data.success
                if(this.login_data.success)
                {
                  const user_id = res.data.id
                  const user_name = res.data.name
                  const token = res.data.token
                  const type = res.data.type
                  window.localStorage.setItem('user_id', user_id)
                  window.localStorage.setItem('user_name', user_name)
                  window.localStorage.setItem('token', token)
                  window.localStorage.setItem('is_vendor', type)
                  window.localStorage.setItem('is_login', true)
                  this.login_data.modal_visible = false
                  if(this.login_page)
                  {
                    this.$emit('LoginFinish', false)
                    this.$router.push({path:'/'})
                  }
                }
                else
                {
                  this.login_data.error_message = res.data.message
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
                      this.change_pwd.url,
                      {
                        id: user_id,
                        current_pwd: current_pwd,
                        new_pwd: new_pwd
                      }
                    )
                    .then((res) =>{
                        this.change_pwd.success = res.data.success
                        if(this.change_pwd.success){
                            var token = res.data.token
                            window.localStorage.setItem('token', token)
                            this.change_pwd.modal_visible = false
                            this.$message.success('Password changed successfully')
                        }
                        else{
                            this.change_pwd.error_message = res.data.message
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
      },
      closeLoginModal(){
        this.login_data.modal_visible = false
      },
      closeChangePwdModal(){
        this.change_pwd.modal_visible = false
      },
      searchBtnVisible(){
        var path = this.$route.path
        if(path == '/')
        {
          this.search.button_visible = true
          if(this.is_vendor)
          {
            this.search.button_type = 'vendor_search_item'
          }
          else
          {
            this.search.button_type = 'user_search_item'
          }
        }
        else if(path == '/po-list')
        {
          this.search.button_visible = true
          this.search.button_type = 'vendor_search_purchase_order'
        }
        else
        {
          this.search.button_visible = false
        }
      },
      setLoginData(){
        var is_login =  window.localStorage.getItem('is_login')
        var user_name =  window.localStorage.getItem('user_name')
        var is_vendor = window.localStorage.getItem('is_vendor')
        this.login_data.name = user_name
        this.login_data.state = is_login
        this.is_vendor = is_vendor
      }
    }
  }
</script>