<template>
  <div class="chart-container">
    <div id="scatter-chart" style="width: 100%; height: 30vh"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getColumnData } from "../api/analysis";

const renderScatterChart = (ageList) => {
  const chart = echarts.init(document.getElementById("scatter-chart"));
  const options = {
    title: { text: "院内患者各年龄段人数分布图" },
    xAxis: {
      data: ["0-19", "20-39", "40-59", "60-79", "80-99", "100-119"],
    },
    yAxis: {},
    series: [
      {
        type: "scatter",
        data: ageList,
        label: {
          show: true, // 显示标签
          position: "top", // 标签位置
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

const getAge = () => {
  // 获取所有患者的年龄
  const tableName = "patients";
  const keyName = "age";
  getColumnData(keyName, tableName).then((res) => {
    const ageData = res.map((item) => item.age);
    const ageNumber1 = ageData.filter((num) => num >= 0 && num <= 19).length;
    const ageNumber2 = ageData.filter((num) => num >= 20 && num <= 39).length;
    const ageNumber3 = ageData.filter((num) => num >= 40 && num <= 59).length;
    const ageNumber4 = ageData.filter((num) => num >= 60 && num <= 79).length;
    const ageNumber5 = ageData.filter((num) => num >= 80 && num <= 99).length;
    const ageNumber6 = ageData.filter((num) => num >= 100 && num <= 119).length;

    const ageList = [
      ageNumber1,
      ageNumber2,
      ageNumber3,
      ageNumber4,
      ageNumber5,
      ageNumber6,
    ];
    renderScatterChart(ageList); // 将年龄数据传入 renderBarChart 方法
  });
};

getAge(); // 散点图
</script>

<style></style>
