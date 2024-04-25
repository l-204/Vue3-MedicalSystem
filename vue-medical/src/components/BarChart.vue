<template>
  <div class="chart-container">
    <div id="bar-chart" style="width: 100%; height: 30vh"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getColumnData } from "../api/analysis";

// 配置柱状图信息
const renderBarChart = (titleList) => {
  const chart = echarts.init(document.getElementById("bar-chart"));
  const options = {
    title: {
      text: "院内医师各职称人数分布图",
    },
    xAxis: {
      data: titleList.map((item) => item.name),
    },
    yAxis: {},
    series: [
      {
        type: "bar",
        data: titleList,
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
// 获取医师职称
const getTitle = () => {
  // 获取所有医生的职称
  const tableName = "doctors";
  const keyName = "title";
  getColumnData(keyName, tableName).then((res) => {
    const titleData = res.map((item) => item.title);
    // 使用 Set 来筛选出不同的职称
    const uniqueTitle = new Set(titleData);
    // 遍历 Set 中的每个职称，统计不同职称在数组中出现的次数
    const titleCount = {};
    uniqueTitle.forEach((title) => {
      const count = titleData.filter((value) => value === title).length;
      titleCount[title] = count;
    });
    //将titleCount格式化为柱状图数据源
    const titleList = Object.keys(titleCount).map((key) => {
      return { value: titleCount[key], name: key };
    });

    renderBarChart(titleList); // 将职称数据传入 renderBarChart 方法
  });
};

getTitle(); // 柱状图
</script>

<style></style>
