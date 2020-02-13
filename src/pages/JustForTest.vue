<template>
  <div>
    <a-button @click="showConfirm">
      Confirm
    </a-button>
  </div>
</template>
<script>
  export default {
    methods: {
      showConfirm() {
        this.$confirm({
          title: 'Do you Want to delete these items?',
          content:  <div style="color:red;">Some descriptions</div>,
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
          class: 'test',
        });
      },
    },
  };
</script>
