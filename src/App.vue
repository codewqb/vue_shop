<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    components: {}
  }

</script>

<style lang="less">
  @import './assets/css/base.css';

  html,
  body,
  #app {
    height: 100%;
    min-width: 1360px;
  }

</style>
