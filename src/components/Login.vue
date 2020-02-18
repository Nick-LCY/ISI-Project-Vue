<template>
    <a-modal 
    v-model="login_visible" 
    title="Login"
    footer=''
    >
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
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
          <a href="5">
            register now!
          </a>
        </a-form-item>
      </a-form>
    </a-modal>
</template>

<style scoped>
#login-box{
 padding-top: 30px;
 padding-left: 20px;
 padding-right: 20px;
 margin:50px;
 width: 35vw;
 border-radius: 3px;
 background-color: white;
}
</style>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      request_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/login',
      user_id:'',
      token:'',
      logState: this.GLOBAL.logState,
    };
  },
  props:{
      login_visible:Boolean
  },
  beforeCreate() {
  this.form = this.$form.createForm(this, { name: 'normal_login' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          values.pwd = this.$md5(values.pwd)
          axios
            .post(this.request_url)
            .then((res) =>{
              this.user_id = res.data.id
              this.token = res.data.token
              this.login_visible = false
          })
        }
      });
    },

  },
  
};
</script>

<style scoped>
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