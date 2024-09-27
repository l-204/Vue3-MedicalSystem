<template>
  <Layout>
      <div class="container">
          <el-card body-style="height:100%;" style="margin-bottom: 20px; height: 40vh" v-for="item in chartList">
            <component :is="item"></component>
          </el-card>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/layout/index.vue";
import PieChart from "@/components/echart/PieChart.vue";
import ScatterChart from "@/components/echart/ScatterChart.vue";
import BarChart from "@/components/echart/BarChart.vue";

const chartList = [PieChart, ScatterChart, BarChart];
</script>

<style scoped>
.container{
  padding:20px;
}
</style>
