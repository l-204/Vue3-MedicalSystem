<template>
  <div class="chart-container">
    <div id="pie-chart" style="width: 100%; height: 30vh"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getColumnData } from "../api/analysis";

const renderPieChart = (cityList) => {
  const chart = echarts.init(document.getElementById("pie-chart"));
  const options = {
    title: { text: "院内药品各生产厂商城市分布图" },
    legend: {
      type: "scroll",
      orient: "vertical",
      left: "right",
      top: "center",
      data: cityList,
    },
    series: [
      {
        type: "pie",
        data: cityList,
        label: {
          show: true,
          formatter: "{d}%", // {b}表示name，{d}%表示百分比
        },
      },
    ],
  };
  chart.setOption(options);

  window.addEventListener("resize", function () {
    // 改变图表尺寸，在容器大小发生改变时需要手动调用
    chart.resize();
  });
};

const getCity = () => {
  // 获取所有药品的生产城市
  const tableName = "medicines";
  const keyName = "medicine_company";
  getColumnData(keyName, tableName).then((res) => {
    const cityData = res.map((item) => item.medicine_company);
    // 使用 Set 来筛选出不同的城市
    const uniqueCity = new Set(cityData);
    // 遍历 Set 中的每个城市，统计不同城市在数组中出现的次数
    const cityCount = {};
    uniqueCity.forEach((city) => {
      const count = cityData.filter((value) => value === city).length;
      cityCount[city] = count;
    });
    //将cityCount格式化为饼图数据源
    const cityList = Object.keys(cityCount).map((key) => {
      return { value: cityCount[key], name: key };
    });

    renderPieChart(cityList); // 将城市数据传入 renderPieChart 方法
  });
};

getCity(); // 饼图
</script>

<style></style>
