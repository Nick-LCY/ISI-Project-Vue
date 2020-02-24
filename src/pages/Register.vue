<template>
    <a-layout>
        <TopBar></TopBar>
        <a-layout-content id="content">
            <a-alert
                v-if="!success"
                message="Error"
                :description="error_message"
                type="error"
                showIcon
            />
            <div id="register-form">
                <a-form :form="form" @submit="handleSubmit" style="width: 60vw;">
                    <a-form-item v-bind="formItemLayout" label="E-mail">
                        <a-input
                            v-decorator="[
                            'email',
                            {
                                rules: [
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                                ],
                            },
                            ]"
                        />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="Password">
                        <a-input
                            v-decorator="[
                            'pwd',
                            {
                                rules: [
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    validator: validateToNextPassword && checkPasswordFormat
                                },
                                ],
                            },
                            ]"
                            type="password"
                        />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="Confirm Password">
                        <a-input
                            v-decorator="[
                            'confirm',
                            {
                                rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                {
                                    validator: compareToFirstPassword,
                                },
                                ],
                            },
                            ]"
                            type="password"
                            @blur="handleConfirmBlur"
                        />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            Nickname&nbsp;
                            <a-tooltip title="What do you want others to call you?">
                            <a-icon type="question-circle-o" />
                            </a-tooltip>
                        </span>
                        <a-input
                            v-decorator="[
                            'name',
                            {
                                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                            },
                            ]"
                        />
                        </a-form-item>
                    <a-form-item v-bind="formItemLayout" label="Shipping Address">
                        <a-input
                            v-decorator="[
                            'shipping_addr',
                            {
                                rules: [{ required: true, message: 'Please input your ship address!', whitespace: true }],
                            },
                            ]"
                        />
                    </a-form-item>
                    <a-form-item v-bind="tailFormItemLayout">
                        <a-button type="primary" html-type="submit">
                            Register
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-layout-content>
  </a-layout>
</template>

<script>
import TopBar from '@/components/TopBar.vue'
import axios from 'axios'

export default {
    name:'register',
    components:{
      TopBar,
    },
    data() {
        return {
        confirmDirty: false,
        formItemLayout: {
            labelCol: {
            xs: { span: 16 },
            sm: { span: 8 },
            },
            wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
            },
        },
        tailFormItemLayout: {
            wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
            },
        },
        request_url:'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/user',
        error_message:'',
        success:true,
        };
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'register' });
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    values.pwd = this.$md5(values.pwd)
                    axios
                        .post(this.request_url)
                        .then((res) =>{
                            this.success = res.data.success
                            if(this.success){
                                var user_id = res.data.id
                                window.localStorage.setItem('user_id', user_id)
                                var user_name = res.data.name
                                window.localStorage.setItem('user_name', user_name)
                                var token = res.data.token
                                window.localStorage.setItem('token', token)
                                window.localStorage.setItem('is_login', true)
                                this.$router.push({path:'/'})
                            }
                            else{
                                this.error_message = res.data.message
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
            const form = this.form;
            if (value && value !== form.getFieldValue('pwd')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        },

        validateToNextPassword(rule, value, callback) {
            const form = this.form;
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
    },
}
</script>

<style scoped>
#register-form {
    width: 100vw;
    display: flex;
    justify-content: center;
    background-color: white;
}

.ant-form {
    margin-top: 5%;
    margin-right: 15%;
}
</style>