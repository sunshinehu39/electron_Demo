<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// 导入disDrag
import disDrag from "./utils/disDrag.js";

export default {
  // 通过mixins加载
  mixins: [disDrag],
};
</script>

<style>
</style>
