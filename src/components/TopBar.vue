<template>
        <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-menu
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px'}"
      >
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
                <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <span slot="title"><a-icon type="setting"/>Electronics</span>
          <a-menu-item key="electronics 1">Electronics</a-menu-item>
          <a-menu-item key="electronics 2">Clothing</a-menu-item>
        </a-sub-menu>  
         <a-input-search id="search-box" placeholder="input search text" style="width: 200px" @search="onSearch"  />
         <a-avatar id="user-icon" icon="user"/>
      </a-menu>
      <!-- <div id="search-box">
       <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch"  />
      </div> -->
    </a-layout-header>
</template>

<style scoped>
    #user-icon {
        margin-left: 20px;
    }
</style>

<script>
export default {
    name: 'TopBar',
}
</script>