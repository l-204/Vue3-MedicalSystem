<script setup>
import { ref } from 'vue';

const images = ref([
  new URL("@/assets/img/1.jpg", import.meta.url).href,
  new URL("@/assets/img/2.webp", import.meta.url).href,
  new URL("@/assets/img/3.png", import.meta.url).href,
  new URL("@/assets/img/4.jpg", import.meta.url).href,
]);
</script>

<template>
<el-carousel trigger="click" height="100%" style="height: 100%" autoplay :interval="3000" arrow="always">
              <el-carousel-item v-for="(item, index) in images" style="height: 100%" :key="index">
                <img :src="item" width="100%" height="100%" alt="carousel" />
              </el-carousel-item>
            </el-carousel>
</template>

<style scoped></style>