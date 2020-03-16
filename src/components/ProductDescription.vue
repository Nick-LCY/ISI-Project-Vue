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
							{validateTrigger: ['change', 'blur'],
							rules: [{
								required: true,
								message: 'Please input product\'s description or delete this field',
								},],
							},]"
							placeholder="Prodcut attribute name" 
							style="width: 40%;">
						</a-input>
					</a-form-item>


					<a-form-item v-bind="formItemLayoutWithOutLabel">
						<a-textarea
							v-decorator="[
							`attribute_value[${index}]`,
							{validateTrigger: ['change', 'blur'],
							rules: [{
								required: true,
								message: 'Please input product\'s description or delete this field',
								},],
							},]"
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
						Next	
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
        props: ['product_id'],
        data() {
            return {   

                success: true,
                submit: false,
                error_message: '',
                p_id: this.product_id,
                

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

                description_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product_description',

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
            this.form = this.$form.createForm(this, { name: 'add_description' });
            // this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
            this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
            this.form.getFieldDecorator('attribute_name', { initialValue: [], preserve: false })
            this.form.getFieldDecorator('attribute_value', { initialValue: [], preserve: false })
        },

        // create() {

        // },

        methods: {
            submitDetail(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {
                    var product_descriptions = [];
                    console.log(values);
                    console.log(this.p_id);
                    for (var i in this.form.getFieldValue('keys')) {
                        
                        var des = {};
                        des.attribute_name = values.attribute_name[i];
                        des.attribute_value = values.attribute_value[i];
                        des.sequence = parseInt(i)+1
                        des.product_id = this.p_id;
                        product_descriptions.push(des);
                    }

                    if (!err) {
                        axios
                        .post(
                            this.description_url,
                            product_descriptions,			
                        )
                        .then((res) =>{
                            this.success = res.data.success
                            if(this.success){
                                this.$message.success('Product description has been added');
                                // this.$router.push({path:`/product-detail/${this.product_id}`})
                                var current = 2;
								this.$emit('submitDesBtn', {current});
                            }
                            else{
                                this.error_message = res.data.message
                            }

                        })
                    }
                                    
                    
                });
            },

            addItem () {
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
            deleteFormItem (index) {
                const { form } = this;
                console.log(index);
                // can use data-binding to set
                this.descriptions.splice(index, 1);
                var aname = form.getFieldValue('attribute_name');
                var avalue = form.getFieldValue('attribute_value');
                aname.splice(index, 1);
                avalue.splice(index, 1)
                form.setFieldsValue({
                keys: this.keys,
                attribute_name: aname,
                attribute_value: avalue
                })
            },

        }	
    }
</script>