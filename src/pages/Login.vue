<template>
    <TopBar 
    @loginFinish="this.login_page = false" 
    v-bind:login_page=login_page
    >
    </TopBar>
</template>
<script>
  import TopBar from '@/components/TopBar.vue'
  export default {
    name:'login',
    components:{
      TopBar,
    },
    data(){
      return{
        login_page:false
      }
    },
    created(){
      this.login_page = true
    },
    methods:{
    }
    

  };
</script>
