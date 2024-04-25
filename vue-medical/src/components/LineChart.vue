<template>
  <div class="chart-container">
    <div id="line-chart" style="width: 100%; height: 275px"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getTableData } from "../api/table";

const renderLineChart = (result) => {
  // 获取键数组
  const keys = Object.keys(result);
  // 使用map()方法将键和值分别存储到两个数组中（只保留月日）
  const xAxisData = keys.map((key) => key.replace(/^\d+\//, ""));
  const yAxisData = keys.map((key) => result[key]);

  const chart = echarts.init(document.getElementById("line-chart"));
  const options = {
    title: { text: "近一周内就诊患者人数分布图" },
    xAxis: { type: "category", data: xAxisData },
    yAxis: { type: "value" },
    series: [
      {
        data: yAxisData,
        type: "line",
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

const getDay = () => {
  const tableName = "patients";
  getTableData(tableName).then((res) => {
    // 获取患者就诊时间字段created_at
    const patientsData = res.map((item) => item.created_at);
    // 转化为时间戳
    const timestamps = patientsData.map(
      (date) => new Date(date).getTime() / 1000
    );
    // 获取当前时间戳（秒级）
    const now = Date.now() / 1000;
    // 计算7天前的时间戳（秒级）
    const target = now - 7 * 24 * 3600;
    // 定义结果对象
    const result = {};
    // 循环遍历7天内的每一天
    for (let i = 1; i <= 7; i++) {
      // 计算当前天数的时间戳范围
      const start = target + i * 24 * 3600;
      const end = target + (i + 1) * 24 * 3600;
      // 在时间戳数组中寻找符合条件的时间戳
      const filtered = timestamps.filter(
        (timestamp) => timestamp >= start && timestamp < end
      );
      // 将当前天数和对应的时间戳数组存储到结果对象中
      const date = new Date(start * 1000).toLocaleDateString();
      // 不加length就是符合这一天的所有时间戳，加上length就是符合这一天的天数
      result[date] = filtered.length;
    }
    renderLineChart(result);
  });
};

getDay(); // 折线图
</script>

<style></style>
