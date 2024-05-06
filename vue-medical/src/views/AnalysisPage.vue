<template>
  <div>
    <!-- 调用菜单组件 -->
    <MenuPage>
      <template #default>
        <!-- 这里是需要显示在 el-main 中的内容 -->
        <div class="Container">
          <el-card body-style="height:100%;" style="margin-bottom: 20px; height: 40vh" v-for="item in chartList">
            <component :is="item"></component>
          </el-card>
        </div>
      </template>
    </MenuPage>
  </div>
</template>

<script setup>
import MenuPage from "../components/MenuPage.vue";
import PieChart from "../components/echart/PieChart.vue";
import ScatterChart from "../components/echart/ScatterChart.vue";
import BarChart from "../components/echart/BarChart.vue";

const chartList = [PieChart, ScatterChart, BarChart];
</script>

<style></style>
