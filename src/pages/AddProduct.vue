<!-- for E3&4 -->

<template>
    <a-layout>

        <TopBar></TopBar>

        <a-layout-content>

            <div class=steps>
                <a-steps :current="current">
                    <a-step v-for="item in steps" :key="item.title" :title="item.title" />
                </a-steps>
            </div>

            <div class="steps-content" v-if="current === 0">
                <addBasic @submitBasicBtn="changeCurrent"></addBasic>
            </div>

            <div class="steps-content" v-if="current === 1">

                <a-alert
                    v-if="!success"
                    message="Error"
                    :description="error_message"
                    type="error"
                    showIcon
                />

                <br>

                <a-form :form="form" @submit="submitDetail">

                    <!-- Preview Image Modal -->
                    <a-modal :visible="preview_visible" :footer="null" @cancel="handleModalCancel">
                        <img alt="example" style="box-sizing: border-box; width: 100%; padding: 15px;" :src="preview_image" />
                    </a-modal>

                    <a-form-item label="Thumbnail Image" 
                        v-bind="formItemLayout">
                        <a-upload
                            v-decorator="[
                                'thumbnail',
                                { rules: [{ required: true, message: 'Please upload thumbnail image' }] }
                            ]"
                            listType="picture-card"
                            :fileList="thumbnail_file_list"
                            :customRequest="handleThumbnailRequest"
                            :remove="handleThumbnailRemove"
                            @preview="handlePreview">
                            <div v-if="thumbnail_file_list.length < 1">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>

                    <div
                        v-for="(k, index) in descriptions"
                        :key="index">
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

                    <a-form-item label="Detailed Photographs"
                        v-bind="formItemLayout">
                        <a-upload
                            listType="picture-card"
                            :fileList="photograph_file_list"
                            @preview="handlePreview">
                            <div v-if="photograph_file_list.length < 4">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>

                    <a-form-item v-bind="formTailLayout">
                        <a-button type="primary" html-type="submit">
                            Submit
                        </a-button>
                    </a-form-item>

                </a-form>
            </div>

        </a-layout-content>
    </a-layout>

</template>

<script>

    import axios from 'axios';
    import TopBar from '@/components/TopBar.vue';
    import addBasic from '@/components/AddBasicInfo.vue';

    export default {
        name: 'add-product',
        components: {
            TopBar,
            addBasic,
        },
        data() {
            return {
                
                current: 0,
                success: true,
                submit: false,
                error_message: '',
                product_id: '',

                steps: [
                    {
                        title: 'Input product\'s basic information',
                    },
                    {
                        title: 'Input product\'s detail information',
                    },
                ],

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

                preview_visible: false,
                preview_image: '',
                thumbnail_file_list: [],
                photograph_file_list: [],

                description_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product_description',
                upload_thumbnail_url: 'http://localhost:9981/thumbnail',
                upload_photograpth_url: 'http://localhost:9981/photograph',

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
            this.form = this.$form.createForm(this, { name: 'add_product' });
            // this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
            this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
            this.form.getFieldDecorator('attribute_name', { initialValue: [], preserve: false })
            this.form.getFieldDecorator('attribute_value', { initialValue: [], preserve: false })
        },

        methods: {
            changeCurrent(value) {
                this.current = value.current;
                this.product_id = value.product_id;
                // console.log(this.product_id);
            },

            handleThumbnailRequest(data) {
                // Init fileList
                this.thumbnail_file_list = [{
                    "uid": data.file.uid,
                    "lastModified": data.file.lastModified,
                    "lastModifiedDate": data.file.lastModifiedDate,
                    "name": data.file.name,
                    "size": data.file.size,
                    "type": data.file.type,
                    "originFileObj": data.file,
                    "status": "uploading",
                    "percent": 0
                }]
                // Display upload progress while uploading
                var config = {
                    onUploadProgress: progressEvent => {
                        this.thumbnail_file_list[0].percent
                            = (progressEvent.loaded / progressEvent.total * 100 | 0)
                    }
                }
                // Organize upload needed data
                var formatData = new FormData()
                formatData.append("thumbnail", data.file)
                formatData.append("user_id", window.localStorage.getItem('user_id'))
                formatData.append("product_id", this.product_id)
                formatData.append("token", window.localStorage.getItem('token'))
                // Upload file
                axios
                .post(this.upload_thumbnail_url, formatData, config)
                .then((res) => {
                    // Display file when upload success
                    if(res.data.success) {
                        this.thumbnail_file_list[0].status = "done"
                        this.thumbnail_file_list[0].thumbUrl = res.data.file_link
                        this.thumbnail_file_list[0].file_id = res.data.file_id
                    } else {
                        this.thumbnail_file_list[0].status = "error"
                    }
                })
                .catch(() => {
                    // Catch any probably error
                    this.thumbnail_file_list[0].status = "error"
                })
            },

            handleThumbnailRemove() {
                // Remove uploaded file if success
                axios.delete(this.upload_thumbnail_url, {"params": {
                    "user_id": window.localStorage.getItem("user_id"),
                    "token": window.localStorage.getItem("token"),
                    "product_id": this.product_id
                }}).then((res) => {
                    if(res.data.success) {
                        this.thumbnail_file_list = []
                    }
                })
            },

            handlePreview(e) {
                this.preview_image = e.thumbUrl;
                this.preview_visible = true;
            },

            handleModalCancel() {
                this.preview_visible = false;
            },
            
            submitDetail(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err, values) => {
                    var product_descriptions = [];
                    console.log(values);
                    for (var i in this.form.getFieldValue('keys')) {
                        console.log(i);
                        var des = {};
                        des.attribute_name = values.attribute_name[i];
                        des.attribute_value = values.attribute_value[i];
                        des.sequence = parseInt(i)+1
                        des.product_id = this.product_id;
                        console.log(des);
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
                                this.$router.push({path:`/product-detail/${this.product_id}`})
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

<style scoped>
.ant-layout-content {
    margin: 24px 16px;
    padding: 24px;
}

.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.steps-content {
    margin-top: 16px;
    min-height: 200px;
    padding-top: 80px;
}

.steps-action {
    margin-top: 24px;
}

.steps {
    width: 700px;
    text-align: center;
}

</style>