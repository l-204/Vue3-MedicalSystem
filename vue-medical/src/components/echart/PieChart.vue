<template>
  <div class="chart-container" style="width: 100%; height: 100%">
    <div
      id="pie-chart"
      style="width: 100%; height: 100%; background-color: var(--bPageBgColor)"
    ></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { getColumnData } from "../../api/analysis";
import { EleResize } from "../../utils/esresize"; // 图表自适应

const renderPieChart = (cityList) => {
  const domName = document.getElementById("pie-chart");
  const chart = echarts.init(domName);

  // 自适应
  const listener = function () {
    chart.resize();
  };
  EleResize.on(domName, listener);

  const options = {
    title: {
      text: "院内药品各生产厂商城市分布图", // 主标题文本
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
    // legend: {
    //   type: "scroll",
    //   orient: "vertical",
    //   left: "right",
    //   top: "center",
    //   data: cityList,
    // },
    series: [
      {
        type: "pie",
        radius: "50%",
        center: ["50%", "50%"],
        data: cityList,
        label: {
          show: true,
          // position: 'inside',
          formatter: "{b} {c}家", // {b}表示名称, {c}表示值, {d}表示百分比
        },
      },
    ],
    // roseType: 'area',
  };
  chart.setOption(options);
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
