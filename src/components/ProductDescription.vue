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

					<a-form-item v-bind="formItemLayoutWithOutLabel">
						<a-button
						v-if="form.getFieldValue('keys').length > 2"
						type="dashed" 
						style="width: 30%"
						@click="deleteFormItem(index)">
							<a-icon type="minus-circle-o" /> Delete this field
						</a-button>
					</a-form-item>
				</div>

				<a-form-item v-bind="formItemLayoutWithOutLabel">
					<a-button type="dashed" style="width: 60%" @click="addItem">
						<a-icon type="plus" /> Add field
					</a-button>
				</a-form-item>
				<a-form-item v-bind="formTailLayout">
					<a-button type="primary" html-type="submit">
						Submit changes and next	
					</a-button>
				</a-form-item>
                <a-form-item v-bind="formTailLayout" v-if="p_dess">
                    <a-button type="primary" html-type="submit" @click="next">
                        No descriptions are added or deleted    
                    </a-button>
                </a-form-item>
			</a-form>
		</a-layout-content>
	</a-layout>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'ProductDescription',
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
                if (this.p_dess) {
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
                }
                
            })
                
                
        },

        methods: {
            submitDetail(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {

                    if (!err) {

                        var add_des = [];
                        var delete_des = [];
                        
                        var n1 = this.form.getFieldValue('attribute_name');
                        var n2 = [];
                        var v1 = this.form.getFieldValue('attribute_value');
                        var v2 = [];
                        
                        if (this.p_dess) {
                            for (var d of this.p_dess) {
                                n2.push(d.attribute_name);
                                v2.push(d.attribute_value);
                            }
                            //Check if there's any description was added
                            var n = n1.filter( function( el ) { return n2.indexOf( el ) < 0; });
                            console.log(n);
                            var v = v1.filter( function( el ) { return v2.indexOf( el ) < 0; });
                            for (var i = n.length - 1; i >= 0; i--) {
                                var des = {};
                                des.attribute_name = n[i];
                                des.attribute_value = v[i];
                                add_des.push(des);
                            }
                            console.log(add_des);

                            //Check if there's any description was deleted
                            var delete_des_name = n2.filter( function( el ) { return n1.indexOf( el ) < 0 });
                            console.log(delete_des_name);
                            for (i = delete_des_name.length - 1; i >= 0; i--) {
                                for (d of this.p_dess){
                                    console.log(i);
                                    console.log(d);
                                    if (delete_des_name[i] === d.attribute_name) {
                                        delete_des.push(d.id);
                                    }
                                }
                            }
                            console.log(delete_des);

                            if (delete_des.length) {
                                for (var del of delete_des) {
                                    this.deleteDes(del)
                                }
                            }
                            if (add_des.length) {
                                this.addDes(add_des);
                            }
                        }
                        else {
                            for (i = n1.length-1; i >= 0; i--) {
                                console.log(i);
                                des = {};
                                des.attribute_name = values.attribute_name[i];
                                des.attribute_value = values.attribute_value[i];
                                add_des.push(des);
                            }
                            console.log(add_des);
                            this.addDes(add_des);
                        }
                        
                        var current = 2;
                        this.$emit('submitDesBtn', {current});
                    }
                                    
                    
                });
            },

            next() {
                var current = 2;
                this.$emit('submitChangeDesBtn', {current});
            },

            addItem() {
                this.descriptions.push(
                {
                    attribute_name: '',
                    attribute_value: '',
                })
                const { form } = this;
                form.setFieldsValue({
                keys: this.keys
                })
            },
            deleteFormItem(index) {
                const { form } = this;
                console.log(form.getFieldValue('keys'));
                // can use data-binding to set
                this.descriptions.splice(index, 1);
                var aname = form.getFieldValue('attribute_name');
                var avalue = form.getFieldValue('attribute_value');
                aname.splice(index, 1);
                avalue.splice(index, 1);
                form.setFieldsValue({
                keys: this.keys,
                attribute_name: aname,
                attribute_value: avalue
                })
            },

            addDes(add_des) {
                console.log("add!");
                axios
                .post(
                    this.des_url,
                    {
                        product_id: this.p_id,
                        product_descriptions: add_des,
                        user_id: window.localStorage.getItem("user_id"),
                        token: window.localStorage.getItem("token")
                    }
                )
                .then((res) =>{
                    this.success = res.data.success
                    if(this.success){
                        this.$message.success('Add Success');
                    }
                    else{
                        this.error_message = res.data.message
                    }
                })
            },

            deleteDes(des_id) {
                console.log("delete!");
                axios
                .delete(
                    this.des_url,
                    {params:{
                        "product_id": this.p_id,
                        "des_id": des_id,
                        "user_id": window.localStorage.getItem("user_id"),
                        "token": window.localStorage.getItem("token")
                    }
                        
                    }
                )
                .then((res) =>{
                    this.success = res.data.success
                    if(this.success){
                        this.$message.success('Delete Success');
                    }
                    else{
                        this.error_message = res.data.message
                    }
                })
            },

        }	
    }
</script>