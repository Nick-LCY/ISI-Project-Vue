<template>
  <div>
    <a-button @click="showToken">
      Confirm
    </a-button>
  </div>
</template>
<script>
  export default {
    methods: {
      showToken(){
        console.log(window.localStorage.getItem('token'))
      }
    },
  };
</script>
