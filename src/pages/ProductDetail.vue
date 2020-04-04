<template>
  <a-layout id="components-layout-demo-fixed">

    <TopBar
    v-bind:login_box_visible=login_box_visible
    @LoginFinish="CloseLoginBox" 
    >
    </TopBar>

    <a-layout-content id="content">

      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>Product Detail</a-breadcrumb-item>
        <a-breadcrumb-item>{{product.name}}</a-breadcrumb-item>
      </a-breadcrumb>

      <a-alert
      v-if="!success"
      message="Error"
      :description="error_message"
      type="error"
      showIcon
      />
      
      <div id="main-content">
        <!-- Product information -->
        <a-row v-if="status === 'done'" type="flex" justify="space-around">
          <!-- Product thumbnail and photographs -->
          <a-col class="carousel" :span="8">
            <a-carousel arrows dotsClass="slick-dots slick-thumb">
              <a slot="customPaging" slot-scope="props">
                <img :src="carousel[props.i]" />
              </a>
              <div v-for="i in carousel.length" v-bind:key="i">
                <img :src="carousel[i-1]" />
              </div>
            </a-carousel>
          </a-col>
          <!-- Product text information -->
          <a-col :span="16" class="info">
            <!-- Product basic information -->
            <a-divider>{{product.name}}</a-divider>
            <a-row type="flex" justify="space-around">
              <a-col :span="7" class="basic_info">
                <p v-if="is_vendor === 'true'">ID: {{product.id}}</p>
                <p>Category: {{product.category}}</p>
                <p>Price: ${{product.price}}</p>
                <p>Rating: <a-rate :value="product.rating" disabled allowHalf/></p>
                <p v-if="is_vendor === 'false' || is_vendor === null">
                  <a-button type="primary" size="large" @click="addToCart">Add to Cart</a-button>
                </p>
              </a-col>
              <!-- Product descriptions -->
              <a-col :span="15" class="description">
                <p>Other Properties:</p>
                <a-tabs tabPosition="left">
                  <a-tab-pane
                  v-for="des in product.product_descriptions"
                  :tab="des.attribute_name"
                  :key="des.id"
                  >
                    {{des.attribute_value}}
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <!-- Product edit page -->
        <a-row v-if="status === 'edit'">
          <!-- Steps -->
          <div class=steps>
              <a-steps :current="current">
                  <a-step v-for="item in steps" :key="item.title" :title="item.title" />
              </a-steps>
          </div>
          <!-- Edit product basic info -->
          <div class="steps-content" v-if="current === 0">
            <ProductBasic
            @submitBasicBtn="changeCurrentB"
            :product_id="product.id"
            :product_name="product.name"
            :product_category="cate"
            :product_price="product.price"
            ></ProductBasic>
          </div>
          <!-- Edit product descriptions -->
          <div class="steps-content" v-if="current === 1">
            <changeDes
            @submitDesBtn="changeCurrentD"
            :product_id="product.id"
            :product_descriptions="product.product_descriptions">
            </changeDes>
          </div>
          <!-- Edit product thumbnail and photographs -->
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
                <img
                alt="example"
                style="box-sizing: border-box; width: 100%; padding: 15px;"
                :src="preview_image"
                />
              </a-modal>
              <!-- Thumbnail Upload Field -->
              <a-form-item label="Thumbnail Image" 
                v-bind="formItemLayout">
                <a-upload
                  v-decorator="[
                    'thumbnail',
                    { rules:
                      [{
                        required: !this.thumbnail_file_list.length,
                        message: 'Please upload thumbnail image' }] }
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
        </a-row>
        <br><br><br> 
        <!-- Reviews -->
        <a-row v-if="status === 'done'">
          <a-col>
            <a-list
            class="comment-list"
            :header="`${reviews.length} reviews`"
            itemLayout="horizontal"
            :dataSource="reviews"
            :pagination="pagination"
            >
              <a-list-item v-if="reviews.length" slot="renderItem" slot-scope="item">
                <a-comment v-if="item.my == true" :author="item.author+' (My review) '">
                  <p v-if="!is_show" slot="content">{{item.content}}</p>
                  <a-textarea v-if="is_show" :rows="4" @change="textChange" :value="item.content">
                  </a-textarea>
                  <a-tooltip slot="datetime">
                    <span>{{item.datetime}}</span>
                  </a-tooltip>
                  <a-rate
                  :tooltips="desc"
                  :value="item.rate"
                  :allowClear="false"
                  @change="starChange"
                  :disabled="!is_show"
                  />
                  <span v-if="is_show" class="ant-rate-text">{{desc[item.rate - 1]}}</span>
                  <br><br>
                  <a-button v-if="!is_show" @click="changeFeedback">Change Feedback</a-button>
                  <a-button v-if="is_show" type="primary" @click="submitFeedback">Submit</a-button>
                </a-comment>
                <a-comment v-if="item.my == false" :author="item.author">
                  <p slot="content">{{item.content}}</p>
                  <a-tooltip slot="datetime">
                    <span>{{item.datetime}}</span>
                  </a-tooltip>
                  <a-rate v-model="item.rate" disabled />
                </a-comment>
              </a-list-item>
            </a-list>
          </a-col>
        </a-row>
      </div>
      <!-- Edit button and Cancel button -->
      <div v-if="is_vendor === 'true'" class="edit">
        <a-button v-if="status === 'done'" type="primary" size="large" @click="edit">Edit</a-button>
        <a-popconfirm placement="top" okText="Yes" cancelText="No" @confirm="cancel">
          <template slot="title">
            <p>Are you sure to give up current and later pages modification?</p>
          </template>
          <a-button v-if="status === 'edit'" type="danger" size="large">Cancel</a-button>
        </a-popconfirm>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
  import axios from 'axios'
  import TopBar from '@/components/TopBar.vue'
  import ProductBasic from '@/components/ProductBasicInfo.vue'
  import ChangeDes from '@/components/ChangeDes.vue'
  import category_processing from '@/config/category.js'

  export default {
    name: "product-detail",
    components:{
      TopBar,
      ProductBasic,
      ChangeDes,
    },
    data() {
      return {
        login_box_visible:false,
        is_vendor: '',

        options: category_processing.options,
        cate: '',

        success:true,
        error_message:'',

        product: {},
        carousel: [],

        reviews: [],
        my_review: [],
        is_show: false,
        desc: ['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful'],
        pagination: {pageSize: 10,},

        status: 'done',
        current: 0,
        steps: [
            {
                title: 'Change product\'s basic information',
            },
            {
                title: 'Change product\'s description',
            },
            {
                title: 'Change product\'s thumbnail and photographs',
            },
        ],

        thumbnail_file_list: [],
        photograph_file_list: [],
        preview_visible: false,
        preview_image: '',
        
        formItemLayout: {
          labelCol: {span: 4},
          wrapperCol: {span: 16},
        },
        formItemLayoutWithOutLabel: {
          wrapperCol: {span: 16, offset: 4},
        },
        formTailLayout: {
            labelCol: {span: 4},
            wrapperCol: {span: 8, offset: 4},
        },
        
        product_url: 'http://localhost:9981/product',
        shopping_cart_url:'http://localhost:9981/shopping_cart',
        thumbnail_processing_url: 'http://localhost:9981/thumbnail',
        photograpth_processing_url: 'http://localhost:9981/photograph',
        review_url: 'http://localhost:9981/review',
        reviews_url: 'http://localhost:9981/reviews',
      };
    },

    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'change_product' });
    },

    created(){
      const u_id = window.localStorage.getItem('user_id');
      var is_vendor = window.localStorage.getItem('is_vendor');
      this.is_vendor = is_vendor;
      var id = this.$route.params.id;
      // Get product info
      axios
      .get(this.product_url+'?id='+id)
      .then((res) => {
        this.cate = res.data.category;
        category_processing.matchCategoryName([res.data], this.options, 1);
        this.product = res.data;
        this.carousel.push(res.data.thumbnail_location);
        var thumb = {
          uid: '-1',
          name: 'thumb',
          status: 'done',
          url: res.data.thumbnail_location
        }
        this.thumbnail_file_list.push(thumb);
        for (var p of res.data.product_photographs) {
          this.carousel.push(p.file_location);
          var photo = {
            uid: '-'+p.id,
            name: 'photograph'+p.id,
            status: 'done',
            url: p.file_location,
            file_id: p.id
          }
          this.photograph_file_list.push(photo);
        }
      })
      // Get reviews
      axios
      .get(this.reviews_url+'?product_id='+id)
      .then((res) => {
        this.reviews = res.data.reviews;
        for (var i = this.reviews.length - 1; i >= 0; i--) {
          console.log(i);
          if (this.reviews[i].user_id == u_id) {
            var r = this.reviews.splice(i, 1);
            console.log(r)
            r[0].my = true;
          }
          else {this.reviews[i].my = false;}
        }
        if (r) {this.reviews.unshift(r[0]);}
        console.log(this.reviews);
      })
    },

    methods: {
      CloseLoginBox(value){
        this.login_box_visible = value
      },
      
      addToCart() {
        const user_id = window.localStorage.getItem('user_id')
        const token = window.localStorage.getItem('token')
        const is_login = window.localStorage.getItem('is_login')
        const product_id = this.product.id
        if(is_login){
          axios
          .get(
              this.shopping_cart_url, 
              {
                  params: {
                    user_id: user_id,
                    token: token
                  }
              }
          )
          .then((res) =>{
          this.success = res.data.success
          if(this.success){
            const items = res.data.shopping_cart_items
            for (var item of items){
              if(item.id == product_id){
                this.success =  false
                this.error_message = 'The product has already existed'
              }
            }
            if(this.success){
              axios
              .post(
                this.shopping_cart_url,
                {
                    user_id: user_id,
                    token: token,
                    product_id: product_id,
                    quantity: 1
                }
              ) 
              .then((res) =>{
                this.success = res.data.success
                if(!this.success){
                  this.error_message = res.data.message
                }
                else{
                  this.$message.success('This product has been added to your shopping cart')
                }
              })       
            }
          }
          else{
            this.error_message = res.data.message
          }
          })
        }
        else{
          this.login_box_visible = true
        }
      },
      
      // Go to edit page
      edit() {
        this.status = 'edit';
      },
      // Go back to view page
      cancel() {
        this.status = 'done';
        this.current = 0;
        location. reload();
      },

      // Finish editing basic info and go to next step
      changeCurrentB(value) {
        this.current = value.current;
      },
      // Finish editing descriptions and go to next step
      changeCurrentD(value) {
        this.current = value.current;
      },
      // Finish all steps and go back to view page
      submitImage(e) {
        e.preventDefault();
        this.form.validateFieldsAndScroll((err) => {
            if (!err) {
                location. reload()
            }                                   
        })
      },

      // Upload thumbnail
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
        formatData.append("product_id", this.product.id)
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
      // Upload photograph
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
        formatData.append("product_id", this.product.id)
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
      // Remove thumbnail
      handleThumbnailRemove() {
        // Remove uploaded file if success
        axios.delete(this.thumbnail_processing_url, {"params": {
            "user_id": window.localStorage.getItem("user_id"),
            "token": window.localStorage.getItem("token"),
            "product_id": this.product.id
        }}).then((res) => {
            if(res.data.success) {
                this.thumbnail_file_list = []
            }
        })
      },
      // Remove photograph
      handlePhotographRemove(data) {
          // If data.file_id exist, means back-end has this file in its local storage
          // Then need to send delete request first
          if(data.file_id) {
              // Remove uploaded file if success
              axios.delete(this.photograpth_processing_url, {"params": {
                  "user_id": window.localStorage.getItem("user_id"),
                  "token": window.localStorage.getItem("token"),
                  "product_id": this.product.id,
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
      // Preview image
      handlePreview(e) {
        this.preview_image = e.thumbUrl;
        this.preview_visible = true;
      },

      // To determine if the edit feedback area shows or not
      changeFeedback() {
        this.is_show = !this.is_show;
        console.log(this.is_show);
      },
      // Change feedback content
      textChange(e) {
        for (var r of this.reviews) {
          if (r.my == true) {
            r.content = e.target.value;
          }
        }
      },
      // Change rating
      starChange(e) {
        for (var r of this.reviews) {
          if (r.my == true) {
            r.rate = e;
          }
        }
      },
      // Submit changed feedback
      submitFeedback() {
        for (var r of this.reviews) {
          if (r.my == true) {
            if (!r.content) {this.$message.error('Please enter your feedback before submitting!');}
            else if (r.rate == 0) {this.$message.error('Please give your rate!');}
            else {
              axios
              .patch(
                this.review_url,
                {
                  po_no: r.po_no,
                  product_id: this.$route.params.id,
                  content: r.content,
                  stars: r.rate,
                  token: window.localStorage.getItem("token")
                }
              )
              .then((res) =>{
                this.success = res.data.success
                if(this.success){
                  this.is_show = false;
                  this.$message.success('Change feedback successfully');
                  location. reload();
                }
                else{
                  this.error_message = res.data.message
                }

              })
              
            }
          }
        }
        
      },
    },
  };
</script>

<style scoped>
  #content {
    padding: 0 50px;
    margin-top: 16px;
    margin-bottom: 50px;
  }
  #components-layout-demo-fixed .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 24px 16px 0;
    float: left;
  }
  #content-box {
    padding: 0 50px;
  }
  #main-content {
    background: #fff;
    padding: 24px;
  }
  .ant-divider {
    padding-bottom: 10px;
    font-size: 30px;
    font-weight: bold;
  }
  .ant-divider.ant-divider-horizontal.ant-divider-with-text::before,
  .ant-divider.ant-divider-horizontal.ant-divider-with-text::after
  {
    border-top: 1px solid rgb(1,1,1);
  }
  .info {
    text-align: left;
    font-size: 20px;
    padding-left: 15px;
  }
  .description {
    border-left: 2px solid rgb(220, 220, 220);
    padding: 10px;
    margin: 0;
  }
  .ant-tabs {
    height: 200px;
  }
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 400px;
    line-height: 250px;
    overflow: hidden;
  }
  .ant-carousel >>> .slick-dots {
    height: auto;
  }
  .ant-carousel >>> .slick-slide img {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 60%;
  }
  .ant-carousel >>> .slick-thumb {
    bottom: -45px;
  }
  .ant-carousel >>> .slick-thumb li {
    width: 100px;
    height: 80px;
  }
  .ant-carousel >>> .slick-thumb li img {
    height: 100%;
    filter: grayscale(100%);
  }
  .ant-carousel >>> .slick-thumb li.slick-active img {
    filter: grayscale(0%);
  }
  #box-container{
   margin:0 auto;
   height: 100vh;
   width: 100vw;
   position: fixed;
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1;
   background-color: rgba(0, 0, 0, 0.5)
  }
  #search-box{
   margin-top: -20vh;
   width: 60vw;
  }
  .edit {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: 'tnum';
    position: fixed;
    right: 100px;
    bottom: 50px;
    z-index: 10;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  .steps-content {
    margin-top: 16px;
    min-height: 200px;
    padding-top: 50px;
  }
  .steps {
    width: 1300px;
    margin-left: 30px;
  }

  .ant-comment-content-detail p {
    font-size: 15px;
  }

  .ant-comment >>> .ant-comment-content-author-name {
    font-size: 12px;
  }

  .ant-comment >>> .ant-comment-nested {
    margin-left: 10px;
  }

  .ant-comment >>> .ant-comment-inner {
    padding-bottom: 0px;
  }
</style>