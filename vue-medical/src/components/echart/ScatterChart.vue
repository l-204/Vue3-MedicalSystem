<template>
  <div class="chart-container" style="width: 100%; height: 100%">
    <div
      id="scatter-chart"
      style="width: 100%; height: 100%; background-color: var(--bPageBgColor)"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getColumnData } from "../../api/analysis";
import { EleResize } from "../../utils/esresize"; // 图表自适应

const renderScatterChart = (ageList) => {
  const domName = document.getElementById("scatter-chart");
  const chart = echarts.init(domName);

  // 自适应
  const listener = function () {
    chart.resize();
  };
  EleResize.on(domName, listener);

  const options = {
    title: {
      text: "院内患者各年龄段人数分布图", // 主标题文本
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
