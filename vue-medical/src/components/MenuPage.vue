<template>
  <div>
    <el-container>
      <el-aside :width="isCollapse ? (isMobile ? '0' : '64px') : '210px'">
        <!-- 垂直导航栏 -->
        <el-menu :router="true" :default-active="$route.path">
          <!-- 顶部标题 -->
          <div class="top">
            <img class="logo" src="../assets/logo.jpg" />
            <div v-if="!isCollapse" class="title">
              <strong>医疗管理系统</strong>
            </div>
          </div>
          <!-- 导航栏主体 -->
          <template v-for="child1 in menuList" :key="child1.id">
            <el-tooltip
              effect="dark"
              :content="child1.name"
              placement="right"
              :disabled="!isCollapse"
            >
              <el-menu-item :index="child1.url">
                <el-icon><component :is="child1.icon"></component></el-icon>
                <template #title v-if="!isCollapse">
                  <span
                    style="
                      font-family: SimSun;
                      font-size: 16px;
                      padding-left: 10px;
                    "
                    ><strong>{{ child1.name }}</strong></span
                  >
                </template>
              </el-menu-item>
            </el-tooltip>
          </template>
          <template v-if="isMobile">
            <el-menu-item @click="toggle()">
              <!-- 切换主题 -->
              <el-icon><component :is="isDark ? 'Moon' : 'Sunny'" /></el-icon>
              <span
                style="font-family: SimSun; font-size: 16px; padding-left: 10px"
                ><strong>切换主题</strong></span
              >
            </el-menu-item>
            <el-menu-item @click="help">
              <!-- 简介 -->
              <el-icon><Notification /></el-icon>
              <span
                style="font-family: SimSun; font-size: 16px; padding-left: 10px"
                ><strong>院内简介</strong></span
              >
            </el-menu-item>
            <el-menu-item @click="logout">
              <!-- 退出登录 -->
              <el-icon><SwitchButton /></el-icon>
              <span
                style="font-family: SimSun; font-size: 16px; padding-left: 10px"
                ><strong>退出登录</strong></span
              >
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-container style="border-left: 1px solid var(--el-menu-border-color)">
        <el-header>
          <!-- 水平导航栏 -->
          <div class="horizontal-menu">
            <!-- 导航栏左侧 -->
            <div class="left">
              <!-- <el-icon><Fold /></el-icon> -->
              <!-- 折叠按钮 -->
              <el-button
                @click="handleFold()"
                link
                type="primary"
                icon="Fold"
                :class="isCollapse ? 'fold' : 'unfold'"
              >
              </el-button>
              <!-- 面包屑（目录） -->
              <el-breadcrumb class="title" separator-icon="DArrowRight">
                <el-breadcrumb-item :to="{ path: '/' }"
                  >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item
                  v-for="(crumb, index) in breadcrumbs"
                  :key="index"
                >
                  <router-link :to="crumb.to">{{ crumb.label }}</router-link>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <!-- 导航栏右侧 -->
            <div class="right">
              <!-- 图标 -->
              <div class="icon" v-if="!isMobile">
                <!-- 通知 -->
                <MessageBell />
                <!-- 主题 -->
                <el-button
                  :icon="isDark ? 'Moon' : 'Sunny'"
                  @click="toggle()"
                  circle
                ></el-button>
                <!-- 简介 -->
                <el-button icon="Notification" @click="help" circle></el-button>
                <!-- 退出登录 -->
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="WarningFilled"
                  icon-color="#E6A23C"
                  title="确定退出登录吗?"
                  @confirm="logout()"
                >
                  <template #reference>
                    <el-button icon="SwitchButton" circle></el-button>
                  </template>
                </el-popconfirm>
              </div>
              <!-- 头像 -->
              <el-avatar style="margin: auto 10px" :src="userInfo.avatar">{{
                userInfo.username
              }}</el-avatar>
            </div>
          </div>
        </el-header>

        <el-main>
          <slot></slot>
        </el-main>
      </el-container>
    </el-container>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, ref } from "vue";
import { useStore } from "../store/index";
import { brief } from "../data/brief";
import { menuItem } from '../data/itemList'
import { useDark, useToggle } from "@vueuse/core";
import MessageBell from "../components/MessageBell.vue";
import { useRouter, useRoute } from 'vue-router'

const menuList = menuItem
    const isCollapse = ref(localStorage.getItem("isCollapse") === "true")

    const isDark = useDark({
      // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
      storageKey: "useDarkKEY",
      // 暗黑class名字
      valueDark: "dark",
      // 高亮class名字
      valueLight: "light",
    });

    const toggle = useToggle(isDark);
    // route
    const router = useRouter();
    const route = useRoute();
    // 获取 store 实例
    const store = useStore();

    // 将 isMobile 状态映射到组件中
    const isMobile = computed(() => store.isMobile);
    // 将 userInfo 状态映射到组件中
    const userInfo = computed(() => store.userInfo);

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

    const breadcrumbs = computed(() => {
      const matchedRoutes = route.matched;
      const breadcrumbs = [];

      matchedRoutes.forEach((route) => {
        const breadcrumb = {
          label: route.meta.breadcrumb || route.name,
          to: route.path,
        };

        if (breadcrumb.label == "首页") return;
        else breadcrumbs.push(breadcrumb);
      });
      return breadcrumbs;
    })

    // 折叠
    const handleFold = () => {
      isCollapse.value = !isCollapse.value;
      localStorage.setItem("isCollapse", isCollapse.value);
    }
    // 执行退出登录操作
    const logout = () => {
      // 清空localStorage中的数据，如用户信息、token等
      localStorage.clear();
      // 退出提示
      ElMessage.success("退出成功");
      // 跳转至登录页面
      router.push("/login");
    }
    // 弹出帮助
    const help = () => {
  ElMessageBox.alert(brief, '简介', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
  })
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .horizontal-menu .left .title {
    display: none;
  }
}

.el-aside {
  height: 100%;
  top: 0;
  z-index: 101;
  background-color: var(--el-menu-bg-color);
  /* 边框阴影 */
  box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.2);
  /* 过渡动画 */
  transition: width 0.3s ease;
  white-space: nowrap;
}
/* 隐藏垂直导航栏滚动条 */
.el-aside::-webkit-scrollbar {
  display: none;
}

/* 垂直导航栏顶部 */
.el-aside .top {
  display: flex;
  padding: 15px;
}

.el-menu {
  border: none !important;
}

/* 垂直导航栏顶部logo */
.el-aside .top .logo {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

/* 垂直导航栏顶部标题 */
.el-aside .top .title {
  text-align: center;
  color: var(--bTextColor);
  font-family: "SimSun";
  font-size: 20px;
  margin: auto;
}

.el-header {
  width: 100%;
  top: 0;
  height: 60px;
  border-bottom: 1px solid var(--el-menu-border-color);
  text-align: center;
  border-radius: 0;
  background-color: var(--bPageBgColor);
}

.el-main {
  background-color: var(--bMainBgColor);
  /* 视口高度减去小于导航条的高度 */
  height: calc(100vh - 60px);
  padding: 0 !important;
}

/* 导航栏左侧布局 */
.horizontal-menu .left {
  display: flex;
  float: left;
  margin: auto;
  height: 60px;
}

/* 展开动画 */
.horizontal-menu .left .fold {
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  transition: transform 0.3s ease;
}

/* 折叠动画 */
.horizontal-menu .left .unfold {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* 导航栏左侧标题 */
.horizontal-menu .left .title {
  text-align: left;
  color: grey;
  font-family: "SimSun";
  font-size: 20px;
  margin: auto;
}

/* 隐藏图标边框 */
.horizontal-menu .left .el-button {
  font-size: 30px;
  margin: auto;
  border: none;
}

/* 导航栏右侧布局 */
.horizontal-menu .right {
  display: flex;
  float: right;
  height: 60px;
  margin: auto;
}

.horizontal-menu .right .icon {
  display: flex;
  margin: auto;
}

.horizontal-menu .right .icon .el-button {
  margin: 10px;
}

/* 荧光绿 #3EF7E1 */
/* 宝石蓝 #409EFF */
.Container {
  padding: 20px;
}
</style>
../data/brief../data/menuList../data/itemList