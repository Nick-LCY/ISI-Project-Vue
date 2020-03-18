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
                <ProductBasic @submitBasicBtn="changeCurrentB"></ProductBasic>
            </div>

            <div class="steps-content" v-if="current === 1">
                <ProductDescription
                @submitDesBtn="changeCurrentD"
                :product_id="product_id"
                >
                </ProductDescription>
            </div>

            <div class="steps-content" v-if="current === 2">

                <a-alert
                v-if="!success"
                message="Error"
                :description="error_message"
                type="error"
                showIcon
                />

                <br>

                <a-form :form="form" @submit="submitImage">
                    <!-- Preview Image Modal -->
                    <a-modal :visible="preview_visible" :footer="null" @cancel="preview_visible = false">
                        <img alt="example" style="box-sizing: border-box; width: 100%; padding: 15px;" :src="preview_image" />
                    </a-modal>
                    <!-- Thumbnail Upload Field -->
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
                    <!-- Photographs Upload Field -->
                    <a-form-item label="Detailed Photographs"
                        v-bind="formItemLayout">
                        <a-upload
                            v-decorator="[
                                'photograph',
                            ]"
                            listType="picture-card"
                            :fileList="photograph_file_list"
                            :customRequest="handlePhotographRequest"
                            :remove="handlePhotographRemove"
                            @preview="handlePreview">
                            <div v-if="photograph_file_list.length < 4">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                    </a-form-item>
                    <!-- Submit Button -->
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
    import ProductBasic from '@/components/ProductBasicInfo.vue';
    import ProductDescription from '@/components/ProductDescription.vue';

    export default {
        name: 'add-product',
        components: {
            TopBar,
            ProductBasic,
            ProductDescription,
        },
        data() {
            return {
                
                success: true,
                submit: false,
                error_message: '',
                product_id: '',

                current: 0,
                steps: [
                    {
                        title: 'Input product\'s basic information',
                    },
                    {
                        title: 'Input product\'s description',
                    },
                    {
                        title: 'Upload product\'s thumbnail and photographs',
                    },
                ],

                preview_visible: false,
                preview_image: '',
                thumbnail_file_list: [],
                photograph_file_list: [],

                thumbnail_processing_url: 'http://localhost:9981/thumbnail',
                photograpth_processing_url: 'http://localhost:9981/photograph',

                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 16},
                },
                formTailLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 8, offset: 4},
                },
            }
        },

        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'add_product' });
        },

        methods: {
            changeCurrentB(value) {
                this.current = value.current;
                this.product_id = value.product_id;
                console.log(this.current);
            },

            changeCurrentD(value) {
                this.current = value.current;
                console.log(this.current);
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
                .post(this.thumbnail_processing_url, formatData, config)
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

            handlePhotographRequest(data) {
                var fileListObj = {
                    "uid": data.file.uid,
                    "lastModified": data.file.lastModified,
                    "lastModifiedDate": data.file.lastModifiedDate,
                    "name": data.file.name,
                    "size": data.file.size,
                    "type": data.file.type,
                    "originFileObj": data.file,
                    "status": "uploading",
                    "percent": 0
                }
                // Init fileList
                this.photograph_file_list.push(fileListObj)
                // Display upload progress while uploading
                var config = {
                    onUploadProgress: progressEvent => {
                        fileListObj.percent
                            = (progressEvent.loaded / progressEvent.total * 100 | 0)
                    }
                }
                // Organize upload needed data
                var formatData = new FormData()
                formatData.append("photograph", data.file)
                formatData.append("user_id", window.localStorage.getItem('user_id'))
                formatData.append("product_id", this.product_id)
                formatData.append("token", window.localStorage.getItem('token'))
                // Upload file
                axios
                .post(this.photograpth_processing_url, formatData, config)
                .then((res) => {
                    // Display file when upload success
                    if(res.data.success) {
                        fileListObj.status = "done"
                        fileListObj.thumbUrl = res.data.file_link
                        fileListObj.file_id = res.data.file_id
                    } else {
                        fileListObj.status = "error"
                    }
                })
                .catch(() => {
                    // Catch any probably error
                    fileListObj.status = "error"
                })
            },

            handleThumbnailRemove() {
                // Remove uploaded file if success
                axios.delete(this.thumbnail_processing_url, {"params": {
                    "user_id": window.localStorage.getItem("user_id"),
                    "token": window.localStorage.getItem("token"),
                    "product_id": this.product_id
                }}).then((res) => {
                    if(res.data.success) {
                        this.thumbnail_file_list = []
                    }
                })
            },

            handlePhotographRemove(data) {
                // If data.file_id exist, means back-end has this file in its local storage
                // Then need to send delete request first
                if(data.file_id) {
                    // Remove uploaded file if success
                    axios.delete(this.photograpth_processing_url, {"params": {
                        "user_id": window.localStorage.getItem("user_id"),
                        "token": window.localStorage.getItem("token"),
                        "product_id": this.product_id,
                        "photograph_id": data.file_id
                    }}).then((res) => {
                        if(res.data.success) {
                            this.photograph_file_list.splice(this.photograph_file_list.findIndex(item => item.uid === data.uid), 1)
                        }
                    })
                } else {
                    this.photograph_file_list.splice(this.photograph_file_list.findIndex(item => item.uid === data.uid), 1)
                }
            },

            handlePreview(e) {
                this.preview_image = e.thumbUrl;
                this.preview_visible = true;
            },
            
            submitImage(e) {
                e.preventDefault();
                this.form.validateFieldsAndScroll((err) => {
                    if (!err) {
                        this.$router.push({path:`/product-detail/${this.product_id}`})
                    }
                    // else{
                    //     this.error_message = res.data.message
                    // }                                    
                    
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
    width: 1300px;
    margin-left: 30px;
}

</style>