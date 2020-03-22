<template>

	<a-layout>

		<a-layout-content>

			<a-alert
            v-if="!success"
            message="Error"
            :description="error_message"
            type="error"
            showIcon
            />

            <br>
			<a-form :form="form" @submit="submitDetail">
				<div
				v-for="(k, index) in descriptions"
				:key="index"
				>
					<a-form-item
					v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
					:label="index === 0 ? 'Properties' : ''"
					:required="true"
					>
						<a-input 
							v-decorator="[
							`attribute_name[${index}]`,
							{
								validateTrigger: ['change', 'blur'],
								rules: [{
									required: true,
									message: 'Please input product\'s description or delete this field',
									},
								],
								initialValue: descriptions[index].attribute_name
							},
							]"
							placeholder="Prodcut attribute name" 
							style="width: 40%;">
						</a-input>
					</a-form-item>


					<a-form-item v-bind="formItemLayoutWithOutLabel">
						<a-textarea
							v-decorator="[
							`attribute_value[${index}]`,
							{
								validateTrigger: ['change', 'blur'],
								rules: [{
									required: true,
									message: 'Please input product\'s description or delete this field',
									},
								],
								initialValue: descriptions[index].attribute_value
							},
							]"
							placeholder="Product attribute value"
							style="width: 70%;"
							autosize
						/>
					</a-form-item>

				</div>

				<a-form-item v-bind="formTailLayout">
					<a-button type="primary" html-type="submit">
						Submit changes and next	
					</a-button>
				</a-form-item>

                <a-form-item v-bind="formTailLayout">
                    <a-button type="primary" html-type="submit" @click="next">
                        No changes are made 
                    </a-button>
                </a-form-item>
			</a-form>
		</a-layout-content>
	</a-layout>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'ChangeDes',
        props: ['product_id', 'product_descriptions'],
        data() {
            return {   
                success: true,
                submit: false,
                error_message: '',
                p_id: this.product_id,
                p_dess: this.product_descriptions,

                pdess: [],
                origin_length: 0,
                
                descriptions: [
                    {
                        attribute_name: '',
                        attribute_value: '',
                    },
                    {
                        attribute_name: '',
                        attribute_value: '',
                    },
                ],
                des_url: 'http://localhost:9981/product_description',
                
                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 16},
                },
                formTailLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 8, offset: 4},
                },
                formItemLayoutWithOutLabel: {
                    wrapperCol: {span: 16, offset: 4},
                },
            }
        },
        computed: {
            keys () {
                let arr = []
                this.descriptions.forEach((val, index) => {
                    arr.push(index)
                })
                return arr
            }
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'product_description' });
            this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
            this.form.getFieldDecorator('attribute_name', { initialValue: [], preserve: false });
            this.form.getFieldDecorator('attribute_value', { initialValue: [], preserve: false });
            this.$nextTick(function() {
                this.origin_length = this.p_dess.length;
				this.descriptions = [];
				var aname = [];
				var avalue = [];
				for (var p_des of this.p_dess) {
					aname.push(p_des.attribute_name);
					avalue.push(p_des.attribute_value);
					this.descriptions.push(p_des);
				}
				// console.log(this.p_dess);
				console.log(aname);
				this.form.setFieldsValue({
					keys: this.keys,
					attribute_name: aname,
					attribute_value: avalue
				})
				console.log(this.form.getFieldValue('attribute_name'))
				console.log(this.descriptions)
                
            })
                
                
        },

        methods: {
            submitDetail(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {

                    if (!err) {

                        var change_des = [];
                        var l = this.p_dess.length;                        

                        for (var i = l-1; i >= 0; i--) {
                            if (values.attribute_name[i] != this.p_dess[i].attribute_name ||
                                values.attribute_value[i] != this.p_dess[i].attribute_value) {
                                var des = {};
                                des.attribute_name = values.attribute_name[i];
                                des.attribute_value = values.attribute_value[i];
                                des.id = this.p_dess[i].id;
                                change_des.push(des);
                            }
                        }
                        console.log(change_des);
                        this.changeDes(change_des);
                        var des_current = 1;
                        this.$emit('submitChangeDesBtn', {des_current});
                    }
                                    
                    
                });
            },

            next() {
                var des_current = 1;
                this.$emit('submitChangeDesBtn', {des_current});
            },

            changeDes(change_des) {
                console.log("change!");
                axios
                .patch(
                    this.des_url,
                    {
                        product_id: this.p_id,
                        product_descriptions: change_des,
                        user_id: window.localStorage.getItem("user_id"),
                        token: window.localStorage.getItem("token")
                    }
                )
                .then((res) =>{
                    this.success = res.data.success
                    if(this.success){
                        this.$message.success('Change Success');
                        // var current = 2;
                        // this.$emit('submitDesBtn', {current, product_descriptions});
                    }
                    else{
                        this.error_message = res.data.message
                    }
                })
            },

        }	
    }
</script>