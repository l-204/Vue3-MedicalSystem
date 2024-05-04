<template>
  <MenuPage>
    <div id="container">
      <el-button @click="show()">状态</el-button>
    </div>
  </MenuPage>
</template>


<script setup>
import { useDark } from "@vueuse/core";
const isDark = useDark({
      // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
      storageKey: "useDarkKEY",
      // 暗黑class名字
      valueDark: "dark",
      // 高亮class名字
      valueLight: "light",
    });
const show = () => {
  console.log(isDark.value)
}
</script>

<style>

</style>