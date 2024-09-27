<script setup>
import { progressItem } from "@/data/itemList";
</script>

<template>
    <div style="height: 100%; display: flex; flex-direction: column">
              <div style="flex-grow: 1;padding-bottom:20px;" v-for="item in progressItem" :key="item.id">
                <div>
                  <el-icon>
                    <component :is="item.icon" />
                  </el-icon> {{ item.title }}
                </div>
                <el-progress :percentage="item.percentage" :status="item.status"></el-progress>
              </div>
            </div>
</template>

<style scoped>

</style>