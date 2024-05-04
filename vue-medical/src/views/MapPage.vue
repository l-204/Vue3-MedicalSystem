<template>
    <MenuPage>
        <div id="container">
            <div id="panel"></div>
        </div>
    </MenuPage>
</template>


<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
/*在Vue3中使用时,需要引入Vue3中的shallowRef方法(使用shallowRef进行非深度监听,
因为在Vue3中所使用的Proxy拦截操作会改变JSAPI原生对象,所以此处需要区别Vue2使用方式对地图对象进行非深度监听,
否则会出现问题,建议JSAPI相关对象采用非响应式的普通对象来存储)*/
import { shallowRef, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { ref } from "vue";
import { useDark } from "@vueuse/core";

const isDark = useDark({
    // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
    storageKey: "useDarkKEY",
    // 暗黑class名字
    valueDark: "dark",
    // 高亮class名字
    valueLight: "light",
});
const path = ref([]);
const current_position = ref([]);
const mapStyle = computed(() => {
    return `amap://styles/${isDark.value ? 'darkblue' : 'normal'}`;
});


function initMap() {
    window._AMapSecurityConfig = {
        securityJsCode: '2904c2ada7ef3b2043fbe4513357a500',
    }
    AMapLoader.load({
        key: "69407aab7be61d697f495c5a779f672d", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins:[''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
        .then((AMap) => {
            const map = new AMap.Map("container", {  //设置地图容器id
                rotateEnable: true,
                pitchEnable: true,
                resizeEnable: true, //是否监控地图容器尺寸变化
                mapStyle: mapStyle.value, // 初始地图样式
                zoom: 19,
                pitch: 30,
                rotation: -20,
                viewMode: '3D', //开启3D视图,默认为关闭
                zooms: [2, 20],
                center: [110.372326, 21.273954], //初始化地图中心点位置
            });

            // 监听isDark状态的变化，更新地图样式
            watch(isDark, () => {
                map.setMapStyle(mapStyle.value);
            });

            // 添加插件
            AMap.plugin(['AMap.ControlBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.Driving'], function () {
                //异步同时加载多个插件
                // 添加地图插件
                map.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
                map.addControl(new AMap.ControlBar({ position: { bottom: '20px', right: '20px' } })); //添加控制罗盘控件，用来控制地图的旋转和倾斜
                // 构造定位类
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：5s
                    position: 'LT',    //定位按钮的停靠位置
                    offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
                });
                // 构造路线导航类
                var driving = new AMap.Driving({
                    map: map,
                    panel: "panel"
                });

                map.addControl(geolocation);
                geolocation.getCurrentPosition(function (status, result) {
                    if (status == 'complete') {
                        ElMessage.success('定位成功')
                        // 根据起终点名称规划驾车导航路线
                        driving.search(new AMap.LngLat(result.position.lng, result.position.lat), new AMap.LngLat(110.372326, 21.273954), function (status, result) {
                            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                            if (status === 'complete') {
                                ElMessage.success('绘制驾车路线完成')
                            } else {
                                ElMessage.error('获取驾车数据失败：' + result)
                            }
                        });
                    } else {
                        ElMessage.error('失败原因排查信息:' + result.message)
                        ElMessage.error('浏览器返回信息：' + result.originMessage)
                    }
                });
            });

        })
        .catch(err => console.log(err))
}

initMap()
</script>

<style>
#container {
    width: 100%;
    height: 100%;
}

#panel {
    z-index: 100;
    position: absolute;
    background-color: white;
    max-height: 50%;
    overflow-y: auto;
    top: 20px;
    right: 20px;
    width: 280px;
}
</style>