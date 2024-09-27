<script setup>
import { activityItem } from "@/data/itemList";
</script>

<template>
    <el-timeline>
              <el-timeline-item v-for="(activity, index) in activityItem" :key="index" :timestamp="activity.timestamp"
                :type="activity.type" :icon="activity.icon">{{ activity.content }}
              </el-timeline-item>
            </el-timeline>
</template>

<style scoped>

</style>