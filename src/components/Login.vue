<template>
    <!-- <div id="login-box"> -->
    <a-modal v-model="login_visible" title="Login">
        <a-form layout="vertical" :form="form" @submit="handleSubmit">
            <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
            <a-input
                v-decorator="[
                'userName',
                { rules: [{ required: true, message: 'Please input your username!' }] },
                ]"
                placeholder="Username"
            >
                <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
            </a-form-item>
            <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
            <a-input
                v-decorator="[
                'password',
                { rules: [{ required: true, message: 'Please input your Password!' }] },
                ]"
                type="password"
                placeholder="Password"
            >
                <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
            </a-form-item>
            <!-- <a-form-item>
            <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
                Log in
            </a-button>
            </a-form-item> -->
        </a-form>
    </a-modal>
    <!-- </div> -->
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
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data() {
    return {
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
    };
  },
  props:{
      login_visible:Boolean
  },
  mounted() {
    this.$nextTick(() => {
      // To disabled submit button at the beginning.
      this.form.validateFields();
    });
  },
  methods: {
    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('userName') && getFieldError('userName');
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched('password') && getFieldError('password');
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
  },
};
</script>