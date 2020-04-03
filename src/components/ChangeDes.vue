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
            <h3 class="header">To edit or delete the old description(s)</h3>
            <a-table
            v-if="attributes.length"
            :columns="columns"
            :dataSource="attributes"
            :row-key="attribute => attribute.key"
            :pagination="false">
                <template
                v-for="col in ['attribute_name', 'attribute_value']"
                :slot="col"
                slot-scope="text, record"
                >
                    <div :key="col">
                        <a-input
                        v-if="record.editable"
                        style="margin: -5px 0"
                        :value="text"
                        @change="e => handleChange(e.target.value, record.key, col)"
                        />
                        <template v-else>{{text}}</template>
                    </div>
                </template>
                <template slot="operation" slot-scope="text, record">
                    <span v-if="record.editable">
                        <a @click="() => onSave(record.key)">Save</a>
                        <a
                        :disabled="new_attributes.length+attributes.length<=2"
                        @click="() => onDelete(record.key)"
                        >
                            Delete
                        </a>

                    </span>
                    <span v-else>
                        <a @click="() => onEdit(record.key)">Edit</a>
                    </span>
                </template>                
            </a-table>


            <br><br>


            <h3 class="header">To add new description(s)</h3>
            <a-table
            :columns="columns"
            :dataSource="new_attributes"
            :row-key="attribute => attribute.key"
            :pagination="false">
                <a-input
                slot="attribute_name" 
                slot-scope="text, record" 
                v-model="record.attribute_name"
                placeholder="Product attribute name"
                @change="e => nameChange(e.target.value, record.key)"
                />
                <a-textarea
                slot="attribute_value" 
                slot-scope="text, record" 
                v-model="record.attribute_value"
                placeholder="Product attribute value"
                @change="e => valueChange(e.target.value, record.key)"
                />
                <template slot="operation" slot-scope="text, record">
                    <a
                    :disabled="new_attributes.length+attributes.length<=2"
                    @click="() => onDeleteNew(record.key)"
                    >
                        Delete
                    </a>
                </template>
                
            </a-table>
            <a-button class="add" @click="handleAdd">Add an attribute</a-button>
            <!-- <a-button class="add" @click="handleAdd">Add an attribute</a-button> -->
            <br><br>

            <a-button type="primary" @click="submitDetail">Next</a-button>



		</a-layout-content>
	</a-layout>
</template>

<script>
    import axios from 'axios';
    const columns = [
            {
                title: 'Attribute Name',
                dataIndex: 'attribute_name',
                scopedSlots: { customRender: 'attribute_name'},
            },
            {
                title: 'Attribute Value',
                dataIndex: 'attribute_value',
                scopedSlots: { customRender: 'attribute_value'},
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                scopedSlots: { customRender: 'operation'},
            }
        ];
    const attributes = [];
    export default {
        name: 'ChangeDes',
        props: ['product_id', 'product_descriptions'],
        data() {
            this.cacheData = attributes.map(item => ({ ...item }));
            return {
                des_current: 0,  
                success: true,
                submit: false,
                error_message: '',
                p_id: this.product_id,
                p_dess: this.product_descriptions,
                
                columns,
                attributes,
                new_attributes: [],
                count: 0,

                des_url: 'http://localhost:9981/product_description',
                
            }
        },

        beforeCreate() {
            this.$nextTick(function() {
				for (var p_des of this.p_dess) {
                    var d = {};
                    d.key = p_des.id;
                    d.attribute_name = p_des.attribute_name;
                    d.attribute_value = p_des.attribute_value;
                    d.editable = false;
					this.attributes.push(d);
				}
                this.cacheData = attributes.map(item => ({ ...item }));
				// console.log(this.attributes)
            })
                
                
        },

        methods: {

            submitDetail() {
                for (var a of this.attributes) {
                    // console.log(a);
                    if (a.attribute_name === '' || a.attribute_value === '') {
                        this.success = false;
                        this.error_message = 'Please fill in all the fields!';
                        break;
                    }
                    else this.success = true;
                }
                for (a of this.new_attributes) {
                    // console.log(a);
                    if (a.attribute_name === '' || a.attribute_value === '') {
                        this.success = false;
                        this.error_message = 'Please fill in all the fields!';
                        break;
                    }
                    else this.success = true;
                }
                if (this.success) {
                    var product_descriptions = [];
                    for (a of this.new_attributes) {
                        var des = {};
                        des.attribute_name = a.attribute_name;
                        des.attribute_value = a.attribute_value;
                        product_descriptions.push(des);
                    }
                    axios
                    .post(
                        this.des_url,
                        {
                            product_id: this.p_id,
                            product_descriptions: product_descriptions,
                            user_id: window.localStorage.getItem("user_id"),
                            token: window.localStorage.getItem("token")
                        }
                    )
                    .then((res) => {
                        this.success = res.data.success;
                        if(this.success) {
                            this.$message.success('Add descriptions success');
                            var current = 2;
                            this.$emit('submitDesBtn', {current});
                        }
                        else this.error_message = res.data.message;
                    })
                }
            },

            onEdit(key) {
                const newData = [...this.attributes];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.editable = true;
                    this.attributes = newData;
                }   
            },
            onSave(key) {
                const newData = [...this.attributes];
                const newCacheData = [...this.cacheData];
                const target = newData.filter(item => key === item.key)[0];
                const targetCache = newCacheData.filter(item => key === item.key)[0];
                // console.log(targetCache);
                if (target && targetCache) {
                    target.editable = false;
                    this.attributes = newData;
                    Object.assign(
                        targetCache,
                        target
                    );
                    this.cacheData = newCacheData;

                    var product_descriptions = [];
                    var attr = {};
                    attr.id = target.key;
                    attr.attribute_name = target.attribute_name;
                    attr.attribute_value = target.attribute_value;
                    product_descriptions.push(attr);
                    // console.log(product_descriptions);
                    axios
                    .patch(
                        this.des_url,
                        {
                            product_id: this.p_id,
                            product_descriptions: product_descriptions,
                            user_id: window.localStorage.getItem("user_id"),
                            token: window.localStorage.getItem("token")
                        }
                    )
                    .then((res) =>{
                        this.success = res.data.success
                        if(this.success){
                            this.$message.success('Change Success');
                        }
                        else{
                            this.error_message = res.data.message
                        }
                    })
                }
            },

            onDelete(key) {
                const newData = [...this.attributes];
                const target = newData.filter(item => key === item.key)[0];
                var des_id = target.key;
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
                        this.attributes = attributes.filter(attribute => attribute.key !== key);
                    }
                    else{
                        this.error_message = res.data.message
                    }
                })                
            },

            handleChange(value, key, column) {
                const newData = [...this.attributes];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.attributes = newData;
                }
            },
            handleAdd() {
                const { count, new_attributes } = this;
                const newData = {
                    key: count,
                    attribute_name: '',
                    attribute_value: '',
                };
                this.new_attributes = [...new_attributes, newData];
                this.count = count + 1;
            },
            onDeleteNew(key) {
                const newData = [...this.new_attributes];
                this.new_attributes = newData.filter(attribute => attribute.key !== key);
            },
            nameChange(value, key) {
                const newData = [...this.attributes];
                const target = newData.filter(attribute => key === attribute.key)[0];
                if (target) {
                    target['attribute_name'] = value;
                    this.attributes = newData;
                }
            },
            valueChange(value, key) {
                const newData = [...this.attributes];
                const target = newData.filter(attribute => key === attribute.key)[0];
                if (target) {
                    target['attribute_value'] = value;
                    this.attributes = newData;
                }
            },
        }	
    }
</script>

<style scoped>
.son-steps {
  width: 700px;
  margin-left: 330px;
}

.son-steps-content {
  margin-top: 30px;
}

.header {
    /*background-color: white;*/
    color: #FF7F50;
    margin-left: 8px;
}
</style>