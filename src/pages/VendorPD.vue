<!-- for E5&6 -->


<template>
  <a-layout id="components-layout-demo-fixed">
    <TopBar></TopBar>

    <a-layout-content id="content">
      <a-breadcrumb :style="{ margin: '16px 0' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb>
      
      <div id="main-content">

        <a-row v-if="status === 'done'" type="flex" justify="space-around">
          <a-col :span="8">
            <a-carousel autoplay>
              <div><img src="..\\assets\\thumbnail.jpg"></div>
              <div><img src="..\\assets\\photo1.jpg"></div>
              <div><img src="..\\assets\\photo2.jpg"></div>
              <div><img src="..\\assets\\photo3.jpg"></div>
              <div><img src="..\\assets\\photo4.jpg"></div>
            </a-carousel>
          </a-col>

          <a-col :span="16" class="info">
            <a-divider>{{product.name}}</a-divider>
            <a-row type="flex" justify="space-around">
              <a-col :span="7" class="basic_info">
                <p>ID: {{product.id}}</p>
                <p>Price: ${{product.price}}</p>
                <p>Rating: <a-rate :defaultValue="getValue()" disabled allowHalf/></p>
                <p class="cate">Category: {{product.category}}</p>
              </a-col>
              <a-col :span="15" class="description">
                <p>Other Properties:</p>
                <a-tabs tabPosition="left">
                  <a-tab-pane v-for="des in product.product_descriptions" :tab=des.attribute_name :key=des.id>{{des.attribute_value}}</a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row v-if="status === 'edit'" type="flex" justify="space-around">
          <a-form></a-form>

          <a-col :span="8">
            <a-form></a-form>
          </a-col>

          <a-col :span="16" class="info">
            <p>
                <a-input class="editName" :value=product.name @change="changeName"></a-input>
            </p>
            <a-row type="flex" justify="space-around">
              <a-col :span="7" class="basic_info">
                <p>Price: ${{product.price}}</p>
                <p>Rating: <a-rate :defaultValue="getValue()" disabled allowHalf/></p>
                <p class="cate">
                    Category: <a-input class="editCate" :value=product.category @change="changeCate"></a-input>
                </p>
              </a-col>
              <a-col :span="15" class="description">
                <p>Other Properties:</p>
                <a-form :form="form">
                    <!-- <a-list-item slot="renderItem" slot-scope="item">
                        <a-input-group>
                            

							<a-select>
								<a-select-option :value="item.id">{{item.attribute_name}}</a-select-option>
							</a-select>

							<a-textarea
							:defaultValue="item.attribute_value"
							style="width: 60%; margin-left: 8px"
							autosize
							@change="changeAttrValue"
							/>
						</a-input-group>
                    </a-list-item> -->
                    <a-form-item
						v-for="(k, index) in form.getFieldValue('keys')"
						:key="k"
						v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
						:label="index === 0 ? 'Properties' : ''"
						:required="true">
						<a-input-group 
							compact
							v-decorator="[
							`names[${k}]`,
							{validateTrigger: ['change', 'blur'],
							rules: [{
								required: true,
								message: 'Please input product\'s description or delete this field.',
								},],
							},]"
						>
							<a-select defaultValue="Option1">
								<a-select-option value="Option1">Option1</a-select-option>
								<a-select-option value="Option2">Option2</a-select-option>
							</a-select>

							<a-textarea
							placeholder="product description"
							style="width: 60%; margin-right: 8px"
							autosize
							/>
							
							<a-icon
							v-if="form.getFieldValue('keys').length > 2"
							class="dynamic-delete-button"
							type="minus-circle-o"
							:disabled="form.getFieldValue('keys').length === 1"
							@click="() => remove(k)"
							/>
						</a-input-group>
					</a-form-item>
                </a-form>
              </a-col>
            </a-row>
          </a-col>
        </a-row> 

        <br><br><br> 

        <a-row>
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

      <div class="edit">
        <a-button v-if="status === 'done'" type="primary" size="large" @click="editPD">Edit</a-button>
        <a-button v-if="status === 'edit'" type="primary" size="large" @click="submit">Submit</a-button>
      </div>
    </a-layout-content>

  </a-layout>
</template>



<script>
  import moment from 'moment';
  import axios from 'axios';
  import TopBar from '@/components/TopBar.vue';

  export default {
    name: "product-detail",
    components:{
      TopBar,

    },
    data() {
      return {
        // dis: '',
        status: 'done',
        product: {},
        collapsed: false,
        moment,

        pagination: {
            // onChange: page => {console.log(page);},
            pageSize: 3,
        },

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
        get_product_url: 'http://rest.apizza.net/mock/6e6f588e3cad8e88bda115251aed8406/product',

        formItemLayout: {
          labelCol: {span: 4},
          wrapperCol: {span: 16},
        },
        formItemLayoutWithOutLabel: {
          wrapperCol: {span: 16, offset: 4},
        },
      };
    },

    beforeCreate() {
			this.form = this.$form.createForm(this, { name: 'add_product' });
			this.form.getFieldDecorator('keys', { initialValue: [0,1], preserve: true });
	},
    created(){
      var id = this.$route.params.id;
      axios
        .get(this.get_product_url+'?id='+id)
        .then((res) =>{ this.product = res.data;
                        // eslint-disable-next-line no-console
                        console.log(this.product)
                        })
    },

    // computed: {
    //     disable: function() {
    //         var d = this.dis;
    //         if (this.status == 'done')
    //             d = false;
    //         else
    //             d = true;
    //         return d;
    //     }
    // },

    methods: {
      getValue() {
        var star = 0;
        for (var i = this.reviews.length - 1; i >= 0; i--) {
           star += this.reviews[i].rate;
        }
        star = star/this.reviews.length;
        return star; 
      },
      editPD() {
        this.status = 'edit';
      },
      submit() {
        this.status = 'done';
      },
      changeName(e) {
        this.product.name = e.target.value;
      },
      changeCate(e) {
        this.product.category = e.target.value;
      },
      // changeAttrValue(e) {
      //   this.product.product_descriptions.attribute_value = e.target.value;
      //   console.log(e.target.value);
      // },

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

  .cate {
    font-size: 15px;
  }

  .description {
    border-left: 2px solid rgb(220, 220, 220);
    padding: 10px;
    margin: 0;
    height: 330px;
  }

  .ant-tabs {
    height: 200px;
  }

  .ant-carousel {
    width: 100%;
    padding-right: 15px;
  }


  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 250px;
    line-height: 250px;
    overflow: hidden;
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

	.editName {
		font-size: 30px;
		font-weight: bold;
		text-align: center;
		height: 65px;
	}

	.editPrice {
		width: 70%;
		margin-left: 3px;
		font-size: 20px;
	}

	.editCate {
		width: 70%;
		margin-left: 3px;
		font-size: 15px;
	}

</style>