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

            <a-table
            :columns="columns"
            :dataSource="attributes"
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
                <template slot="operation" slot-scope="record">
                    <a :disabled="attributes.length<=2" @click="() => onDelete(record.key)">Delete</a>
                </template>
                
            </a-table>
            <a-button class="add" @click="handleAdd">Add an attribute</a-button>
            <br><br>
            <a-button type="primary" @click="submitDetail">Next</a-button>

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
                columns: [
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
                ],
                attributes: [
                    {
                        key: '0',
                        attribute_name: '',
                        attribute_value: '',
                    },
                    {
                        key: '1',
                        attribute_name: '',
                        attribute_value: '',
                    },
                ],
                count: 2,
                des_url: 'http://localhost:9981/product_description',
            }
        },
        
        methods: {
            submitDetail() {
                for (var a of this.attributes) {
                    console.log(a);
                    if (a.attribute_name === '' || a.attribute_value === '') {
                        this.success = false;
                        this.error_message = 'Please fill in all the fields!';
                        break;
                    }
                    else this.success = true;
                }
                if (this.success) {
                    var product_descriptions = [];
                    for (a of this.attributes) {
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
                            this.$message.success('Add descriptions successfully');
                            var current = 2;
                            this.$emit('submitDesBtn', {current});
                        }
                        else this.error_message = res.data.message;
                    })
                }
            },
            onDelete(key) {
                const attributes = [...this.attributes];
                this.attributes = attributes.filter(attribute => attribute.key !== key);
            },
            handleAdd() {
                const { count, attributes } = this;
                const newData = {
                    key: count,
                    attribute_name: '',
                    attribute_value: '',
                };
                this.attributes = [...attributes, newData];
                this.count = count + 1;
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
.add {
    margin-top: 10px;
    margin-left: 1200px;
}
</style>