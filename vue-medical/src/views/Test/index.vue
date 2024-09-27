<template>
  <Layout>
    <el-card style="width:500px;height:80vh;margin:20px auto;overflow:auto;">
        <template #header>
          <el-icon>
            <DataLine />
          </el-icon> 进度报告
        </template>
        <div style="height: 100%; display: flex; flex-direction: column">
          <el-card style="width:100%;margin:10px;flex-grow: 1;" v-for="item in progressItem" :key="item.id">
            <template #header>
              <div>
                <el-icon>
                  <component :is="item.icon" />
                </el-icon> {{ item.title }}
              </div>
            </template>
            <div style="margin:10px auto;">√ 已实现：{{ item.implement }}</div>
            <div>× 未实现：{{ item.unimplement }}</div>
          </el-card>
        </div>
      </el-card>
  </Layout>
</template>
<script setup>
import { progressItem } from '@/data/itemList';
import Layout from '@/layout/index.vue';
/**
 * 1. 邮件管理模块：；尚未实现：
 * 2. 系统设置模块：系统监控
 * 3. Echart图表：文字自适应
 * 4. 项目结构优化
 */
</script>
