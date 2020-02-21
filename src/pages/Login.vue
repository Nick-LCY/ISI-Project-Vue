<template>
    <Login v-bind:login_visible=login_visible />
</template>

<script>
import Login from '@/components/Login.vue';
export default {
    name: "product-detail",
    components:{
      Login,
    },
    data(){
        return{
            login_visible:true
        }
    },
    created:{
    },

}
</script>
