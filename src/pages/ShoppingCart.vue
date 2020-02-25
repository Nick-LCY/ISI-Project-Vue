<template>
    <a-layout>
        <TopBar @clickSearchBtn="search_visible = true" @clickLoginBtn="login_visible = true" @loginFinish="login_visible = false" v-bind:login_visible=login_visible></TopBar>
        <a-layout-content>
        <a-breadcrumb id="breadcrumb">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>Shopping Cart</a-breadcrumb-item>
        </a-breadcrumb>
        </a-layout-content>
    </a-layout>

</template>

<script>
import TopBar from '@/components/TopBar.vue'
export default {
    name:'shopping-cart',
    components:{
      TopBar,
    },
    
}
</script>

<style scoped>
#breadcrumb {
   margin: 32px 0;
}

</style>