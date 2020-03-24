<!-- for A6&7 -->

<template>
  <a-layout id="components-layout-demo-fixed">

    <TopBar></TopBar>

    <a-layout-content id="content">
      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>

      
      <a-alert
      v-if="!success"
      message="Error"
      :description="error_message"
      type="error"
      showIcon
      />
      
      <div id="main-content">

        <a-row v-if="status === 'done'" type="flex" justify="space-around">
          <a-col :span="8">
            <a-carousel autoplay>
              <div><img :src="product.thumbnail_location"></div>
              <div v-for="photo in product.product_photographs" v-bind:key="photo.id">
                <img :src="photo.file_location">
              </div>
            </a-carousel>
            <!-- <a-carousel autoplay arrows dotsClass="slick-dots slick-thumb">
              <a slot="customPaging" slot-scope="props">
                <img :src="getImgUrl(props.i)" />
              </a>
              <div v-for="item in 5" v-bind:key="item">
                <img :src="baseUrl+'abstract0'+item+'.jpg'" />
              </div>
            </a-carousel> -->
          </a-col>

          <a-col :span="16" class="info">
            <a-divider>{{product.name}}</a-divider>
            <a-row type="flex" justify="space-around">
              <a-col :span="7" class="basic_info">
                <p v-if="is_vendor === 'true'">ID: {{product.id}}</p>
                <p>Category: {{product.category}}</p>
                <p>Price: ${{product.price}}</p>
                <p>Rating: <a-rate :defaultValue="getValue()" disabled allowHalf/></p>
                <p v-if="is_vendor === 'false' || is_vendor === null">
                  <a-button type="primary" size="large" @click="addToCart">Add to Cart</a-button>
                </p>
              </a-col>
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




        <a-row v-if="status === 'edit'">
          <div class=steps>
              <a-steps :current="current">
                  <a-step v-for="item in steps" :key="item.title" :title="item.title" />
              </a-steps>
          </div>

          <div class="steps-content" v-if="current === 0">
            <ProductBasic
            @submitBasicBtn="changeCurrentB"
            :product_id="product.id"
            :product_name="product.name"
            :product_category="product.category"
            :product_price="product.price"
            ></ProductBasic>
          </div>

          <div class="steps-content" v-if="current === 1">
            <div class="son-steps">
              <a-steps size="small" :current="des_current">
                <a-step title="Change" description="Change the old descriptions" />
                <a-step title="Add/Delete" description="Add new descriptions or delete the old ones" />
              </a-steps>
            </div>
            <div class="son-steps-content" v-if="des_current === 0">
              <ChangeDes
              @submitChangeDesBtn="changeDesCurrent"
              :product_id="product.id"
              :product_descriptions="product.product_descriptions"
              >
              </ChangeDes>
            </div>
            <div class="son-steps-content" v-if="des_current === 1">
              <ProductDescription
              @submitDesBtn="changeCurrentD"
              :product_id="product.id"
              :product_descriptions="product.product_descriptions"
              >
              </ProductDescription>
            </div>
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
        </a-row>






        <br><br><br> 

        <a-row v-if="status === 'done'">
          <a-col>
            <a-list
            class="comment-list"
            :header="`${reviews.length} reviews`"
            itemLayout="horizontal"
            :dataSource="reviews"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-comment :author="item.author" :avatar="item.avatar">
                  <a-rate v-model="item.rate" disabled allowHalf/>
                  <p slot="content">{{item.content}}</p>
                  <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                    <span>{{item.datetime.fromNow()}}</span>
                  </a-tooltip>
                </a-comment>
              </a-list-item>
            </a-list>
          </a-col>
        </a-row>

      </div>

      <div v-if="is_vendor === 'true'" class="edit">
        <a-button v-if="status === 'done'" type="primary" size="large" @click="editPD">Edit</a-button>
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
  import moment from 'moment';
  import axios from 'axios';
  import TopBar from '@/components/TopBar.vue';
  import ProductBasic from '@/components/ProductBasicInfo.vue';
  import ProductDescription from '@/components/ProductDescription.vue';
  import ChangeDes from '@/components/ChangeDes.vue';

  export default {
    name: "product-detail",
    components:{
      TopBar,
      ProductBasic,
      ProductDescription,
      ChangeDes,
    },
    data() {
      return {
        product: {},
        collapsed: false,
        moment,
        value: 3.5,
        reviews: [
          {
            author: 'Jennifer Chun',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Good.',
            datetime: moment().subtract(1, 'days'),
            rate: 4,
          },
          {
            author: 'Monica Lyu',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Great.',
            datetime: moment().subtract(2, 'days'),
            rate: 4.5,
          },
          {
            author: 'Nick Lin',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: 'Just so so.',
            datetime: moment().subtract(6, 'days'),
            rate: 2.5,
          },
        ],
        get_product_url: 'http://localhost:9981/product',
        add_url:'http://localhost:9981/shopping_cart',
        check_duplicate_url:'http://localhost:9981/shopping_cart',
        thumbnail_processing_url: 'http://localhost:9981/thumbnail',
        photograpth_processing_url: 'http://localhost:9981/photograph',
        success:true,
        error_message:'',

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
        des_current: 0,

        thumbnail_file_list: [],
        photograph_file_list: [],
        preview_visible: false,
        preview_image: '',

        is_vendor: '',
        status: 'done',
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
      };
    },

    beforeCreate() {
      this.form = this.$form.createForm(this, { name: 'change_product' });
    },

    created(){
      var is_vendor = window.localStorage.getItem('is_vendor');
      this.is_vendor = is_vendor;
      var id = this.$route.params.id;
      axios
        .get(this.get_product_url+'?id='+id)
        .then((res) =>{
          this.product = res.data;
          var thumb = {
            uid: '-1',
            name: 'thumb',
            status: 'done',
            url: res.data.thumbnail_location
          }
          this.thumbnail_file_list.push(thumb);
          for (var p of res.data.product_photographs) {
            var photo = {
              uid: '-'+p.id,
              name: 'photograph'+p.id,
              status: 'done',
              url: p.file_location
            }
            this.photograph_file_list.push(photo);
          }
                        // eslint-disable-next-line no-console
                        // console.log(this.product)
                      })
    },
    methods: {
      getValue() {
        var star = 0;
        for (var i = this.reviews.length - 1; i >= 0; i--) {
           star += this.reviews[i].rate;
        }
        star = star/this.reviews.length;
        return star; 
      },
      addToCart() {
        const user_id = window.localStorage.getItem('user_id')
        const token = window.localStorage.getItem('token')
        const is_login = window.localStorage.getItem('is_login')
        const product_id = this.product.id
        if(is_login){
          axios
          .get(
              this.add_url, 
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
                this.add_url,
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
          this.login_visible = true
        }
      },


      editPD() {
        this.status = 'edit';
      },
      cancel() {
        this.status = 'done';
        this.current = 0;
        location. reload();
      },

      changeCurrentB(value) {
        this.current = value.current;
        this.product.name = value.name;
        this.product.category = value.category;
        this.product.price = value.price;
        console.log(this.current);
      },

      changeCurrentD(value) {
        this.current = value.current;
        // this.product.product_descriptions = value.pdess;
        console.log(this.current);
      },
      changeDesCurrent(value) {
        this.des_current = value.des_current;
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
                        // this.$router.push({path:`/product-detail/${this.product_id}`})
                        location. reload()
                    }
                    // else{
                    //     this.error_message = res.data.message
                    // }                                    
                    
                })
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
    border-top: 3px dashed rgb(1,1,1);
  }

  

  .ant-carousel img {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    vertical-align: middle;
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

  .ant-carousel {
    width: 100%;
    padding-right: 15px;
  }

/*  .ant-carousel >>> .slick-dots {
    height: auto;
  }
  .ant-carousel >>> .slick-slide img {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 80%;
  }*/
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 250px;
    line-height: 250px;
    overflow: hidden;
  }
  /*.ant-carousel >>> .slick-thumb {
    bottom: -45px;
  }
  .ant-carousel >>> .slick-thumb li {
    width: 60px;
    height: 45px;
  }
  .ant-carousel >>> .slick-thumb li img {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
  }
  .ant-carousel >>> .slick-thumb li.slick-active img {
    filter: grayscale(0%);
  }*/

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

.son-steps {
  width: 700px;
  margin-left: 330px;
}

.son-steps-content {
  margin-top: 30px;
}

</style>