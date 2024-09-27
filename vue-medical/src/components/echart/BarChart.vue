<template>
  <div class="chart-container" style="width: 100%; height: 100%">
    <div
      id="bar-chart"
      style="width: 100%; height: 100%; background-color: var(--bPageBgColor)"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getColumnData } from "@/api/analysis";
import { EleResize } from "@/utils/esresize"; // 图表自适应

// 配置柱状图信息
const renderBarChart = (titleList) => {
  const domName = document.getElementById("bar-chart");
  const chart = echarts.init(domName);

  // 自适应
  const listener = function () {
    chart.resize();
  };
  EleResize.on(domName, listener);

  const options = {
    title: {
      text: "院内医师各职称人数分布图", // 主标题文本
      x: "center",
      y: "bottom",
      textStyle: {
        //主标题文本样式
        fontFamily: "SimSun",
        fontSize: 22,
        fontStyle: "normal",
        fontWeight: "600",
      },
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
  };

  chart.setOption(options);
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
