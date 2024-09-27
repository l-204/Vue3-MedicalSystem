<script setup>
// vue
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDark, useToggle } from "@vueuse/core";
// element-plus
import { ElMessage, ElMessageBox } from "element-plus";
// 组件
import MessageBell from "@/components/MessageBell.vue";
// 其它
import { brief } from "@/data/brief";
import { removeToken } from '@/utils/auth'
import { useStore } from "@/store/index";
// 暗黑模式
const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: "useDarkKEY",
  // 暗黑class名字
  valueDark: "dark",
  // 高亮class名字
  valueLight: "light",
});
const toggle = useToggle(isDark);
// 路由面包屑
const router = useRouter();
const route = useRoute();
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
// 状态
const store = useStore();
// 用户信息状态
const userInfo = computed(() => store.userInfo);
// 折叠状态
const isCollapse = computed(() => store.isCollapse);
const handleFold = () => {
  localStorage.setItem("isCollapse", isCollapse.value);
  store.toggleCollapse();
}
// 移动端状态
const isMobile = computed(() => store.isMobile);
// 执行退出登录操作
const logout = () => {
  // 清空 localStorage 中的数据，如用户信息、token等
  localStorage.clear();
  // 清除 token 
  removeToken();
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

<template>
  <div class="horizontal-menu">
    <!-- 导航栏左侧 -->
    <div class="left">
      <!-- 折叠按钮 -->
      <el-button @click="handleFold" link type="primary" :icon="isCollapse ? 'Expand' : 'Fold'"></el-button>
      <!-- 面包屑（目录） -->
      <el-breadcrumb class="title" separator-icon="DArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(crumb, index) in breadcrumbs" :key="index">
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
        <el-button :icon="isDark ? 'Moon' : 'Sunny'" @click="toggle()" circle></el-button>
        <!-- 简介 -->
        <el-button icon="Notification" @click="help" circle></el-button>
        <!-- 退出登录 -->
        <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="WarningFilled" icon-color="#E6A23C"
          title="确定退出登录吗?" @confirm="logout">
          <template #reference>
            <el-button icon="SwitchButton" circle></el-button>
          </template>
        </el-popconfirm>
      </div>
      <!-- 头像 -->
      <el-avatar style="margin: auto 10px" :src="userInfo.avatar">{{ userInfo.username }}</el-avatar>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  .horizontal-menu .left .title {
    display: none;
  }
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
</style>