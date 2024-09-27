<script setup>
// vue
import { ref, computed } from 'vue';
// 引入组件
import LayoutHeader from './header.vue';
import LayoutAside from './aside.vue';
// 引入状态
import { useStore } from "@/store/index";
const store = useStore();
// 折叠状态
const isCollapse = computed(() => store.isCollapse)
// 移动端状态
const isMobile = computed(() => store.isMobile);
// 检测屏幕宽度是否小于 768px
const checkMobile = () => {
  const isMobileValue = window.innerWidth < 768;
  // 修改状态
  store.setIsMobile(isMobileValue);
};
// 初始化时检测一次屏幕宽度
checkMobile();
// 监听窗口大小变化
window.addEventListener("resize", checkMobile);
</script>

<template>
  <el-container style="height:100%;">
    <el-aside :width="isCollapse ? (isMobile ? '0' : '64px') : '210px'">
      <layout-aside></layout-aside>
    </el-aside>
    <el-container style="border-left: 1px solid var(--el-menu-border-color)">
      <el-header>
        <layout-header></layout-header>
      </el-header>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
/* 隐藏垂直导航栏滚动条 */
.el-aside::-webkit-scrollbar {
  display: none;
}

.el-aside {
  height: 100%;
  z-index: 101;
  background-color: var(--bMainBgColor);
  /* 边框阴影 */
  box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.2);
  /* 过渡动画 */
  transition: width 0.2s ease;
  white-space: nowrap;
}

.el-header {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid var(--el-menu-border-color);
  text-align: center;
  border-radius: 0;
  background-color: var(--bPageBgColor);
}

.el-main {
  background-color: var(--bMainBgColor);
  /* 视口高度减去小于导航条的高度 */
  /* height: calc(100vh - 60px); */
  padding: 0 !important;
}
</style>