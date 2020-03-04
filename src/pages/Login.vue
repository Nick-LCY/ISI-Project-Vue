<template>
    <TopBar 
    @clickLoginBtn="login_visible = true" 
    @loginFinish="loginFinish" 
    v-bind:login_visible=login_visible
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
        login_visible : true
      }
    },
    methods:{
      loginFinish(){
        this.login_visible = false
        this.$router.push({path:'/'})
      }
    }
    

  };
</script>
