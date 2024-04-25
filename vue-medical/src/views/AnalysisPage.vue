<template>
  <div>
    <!-- 调用菜单组件 -->
    <MenuPage>
      <template #default>
        <!-- 这里是需要显示在 el-main 中的内容 -->
        <div class="Container">
          <div class="AnalyseContainer">
            <el-row>
              <el-col>
                <el-card style="margin-bottom: 20px" v-for="item in chartList">
                  <component :is="item"></component>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </MenuPage>
  </div>
</template>

<script setup>
import MenuPage from "../components/MenuPage.vue";
import PieChart from "../components/PieChart.vue";
import ScatterChart from "../components/ScatterChart.vue";
import BarChart from "../components/BarChart.vue";

const chartList = [PieChart, ScatterChart, BarChart]

</script>

<style></style>
