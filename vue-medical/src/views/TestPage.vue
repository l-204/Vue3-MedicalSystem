<template>
  <div>
    <!-- <el-button @click="handleRoute">跳转到4</el-button> -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="vertical" @select="handleRoute">
      <el-menu-item index="1">Home</el-menu-item>
      <el-menu-item index="1">Processing Center</el-menu-item>
      <el-menu-item index="3">Info</el-menu-item>
      <el-menu-item index="4">Orders</el-menu-item>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";
const activeIndex = ref<string>("1");
const handleRoute = () => {
  activeIndex.value = "4"; // 将activeIndex的值设置为点击的菜单项的index
  console.log(activeIndex.value);
};
// 菜单激活的路由

// 路由监听
onBeforeRouteUpdate(() => {
  activeIndex.value = "4";
});
</script>
