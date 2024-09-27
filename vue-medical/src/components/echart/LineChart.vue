<template>
  <div class="chart-container" style="width: 100%; height: 100%">
    <div
      id="line-chart"
      style="width: 100%; height: 100%; background-color: var(--bPageBgColor)"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getTableData } from "@/api/table";
import { EleResize } from "@/utils/esresize"; // 图表自适应

const renderLineChart = (result) => {
  // 获取键数组
  const keys = Object.keys(result);
  // 使用map()方法将键和值分别存储到两个数组中（只保留月日）
  const xAxisData = keys.map((key) => key.replace(/^\d+\//, ""));
  const yAxisData = keys.map((key) => result[key]);

  const domName = document.getElementById("line-chart");
  const chart = echarts.init(domName);

  // 自适应
  const listener = () => chart.resize();
  EleResize.on(domName, listener);

  const options = {
    title: {
      text: "近一周内就诊患者人数分布图", // 主标题文本
      x: "center",
      y: "bottom",
      textStyle: {
        //主标题文本样式
        fontFamily: "SimSun",
        fontSize: 22,
        fontWeight: "bolder",
      },
    },
    toolbox: {
      feature: {
        saveAsImage: { title: "导出图片", show: true }, // 导出图片
        myFull: {
          // 全屏
          show: true,
          title: "全屏",
          icon: "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
          onclick: (e) => {
            // 全屏查看
            if (domName.requestFullScreen) {
              // HTML W3C 提议
              domName.requestFullScreen();
            } else if (domName.msRequestFullscreen) {
              // IE11
              domName.msRequestFullScreen();
            } else if (domName.webkitRequestFullScreen) {
              // Webkit
              domName.webkitRequestFullScreen();
            } else if (domName.mozRequestFullScreen) {
              // Firefox
              domName.mozRequestFullScreen();
            }
            // 退出全屏
            if (domName.requestFullScreen) {
              document.exitFullscreen();
            } else if (domName.msRequestFullScreen) {
              document.msExitFullscreen();
            } else if (domName.webkitRequestFullScreen) {
              document.webkitCancelFullScreen();
            } else if (domName.mozRequestFullScreen) {
              document.mozCancelFullScreen();
            }
          },
        },
      },
    },

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
