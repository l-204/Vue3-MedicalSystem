<template>
  <Layout>
    <div class="container" v-loading="isLoading">
      <el-row :gutter="20">
        <!-- 个人信息 -->
        <el-col :md="12" :lg="10" :xl="10">
          <el-card body-style="height:100%;display:flex;flex-direction:column;">
            <UserInfo />
          </el-card>
        </el-col>
        <!-- 近一周内就诊人数分布图 -->
        <el-col :md="12" :lg="14" :xl="14">
          <el-card body-style="height:100%">
            <LineChart />
          </el-card>
        </el-col>
      </el-row>
      <!-- 第二行 -->
      <el-row :gutter="20">
        <!-- 轮播图 -->
        <el-col :md="10" :lg="10" :xl="10">
          <el-card body-style="padding: 0;height: 100%;">
            <Carousel />
          </el-card>
        </el-col>
        <!-- 开发进度 -->
        <el-col :sm="12" :md="7" :lg="7" :xl="7">
          <el-card body-style="flex-grow:1;overflow:auto;" style="display: flex; flex-direction: column">
            <template #header>
              <el-icon>
                <DataLine />
              </el-icon> 开发进度
            </template>
            <Progress />
          </el-card>
        </el-col>
        <!-- 开发日志 -->
        <el-col :sm="12" :md="7" :lg="7" :xl="7">
          <el-card body-style="flex-grow:1;overflow:auto" style="display: flex; flex-direction: column">
            <template #header>
              <el-icon>
                <Memo />
              </el-icon> 开发日志
            </template>
            <TimeLine />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </Layout>
</template>

<script setup>
import { computed } from 'vue';
// 引入组件
import Layout from "@/layout/index.vue";
import UserInfo from './userInfo.vue';
import LineChart from "@/components/echart/LineChart.vue";
import Carousel from './carousel.vue';
import Progress from './progress.vue';
import TimeLine from './timeline.vue';
// 引入状态
import { useStore } from "@/store/index";
const store = useStore();
const isLoading = computed(() => store.isLoading);
// 进入页面时设置加载状态为 true
store.setLoading(true);
</script>

<style scoped>
/* 荧光绿 #3EF7E1 */
/* 宝石蓝 #409EFF */
.container {
  padding: 20px;
}
.container .el-card {
  border-radius: 10px;
  height: 40vh;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}
</style>
