<template>
  <a-layout-header>

    <div class="right-align" style="float: right;">
      <div id="search-container">
        <a-input-search id="search-box" placeholder="input search text"/>
      </div>
      <div id="avatar-container">
        <a-avatar id="user-icon" icon="user" size="large"/>
      </div>
    </div>

    <a-menu theme="dark" mode="horizontal" style="line-height: 64px;">
      <a-sub-menu>
        <span slot="title"><a-icon type="sliders"/><b style="color: orange;">Filter</b></span>
        <a-menu-item key="electronics 1">Price descending</a-menu-item>
        <a-menu-item key="electronics 2">Price ascending</a-menu-item>
      </a-sub-menu>
      <a-sub-menu>
        <span slot="title">Electronics</span>
        <a-menu-item key="electronics 1">Electronics</a-menu-item>
        <a-menu-item key="electronics 2">Clothing</a-menu-item>
      </a-sub-menu>
      <a-sub-menu>
        <span slot="title"><a-icon type="right-circle"/>Electronics</span>
        <a-menu-item key="electronics 1">Electronics</a-menu-item>
        <a-menu-item key="electronics 2">Clothing</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-header>
</template>

<style scoped>
  .right-align {
    display: flex;
    width: 15vw;
    height: 64px;
    float: right;
  }
  #avatar-container {
    flex: 0 1 1;
    margin: 0 5px;
    display: flex;
    align-items: center;
  }
  #user-icon {
    top: 0;
  }
  #search-container {
    flex: 0 1 3;
    margin: 0 5px;
  }
</style>

<script>
  export default {
    name: 'TopBar',
  }
</script>