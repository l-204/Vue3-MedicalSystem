<script setup>
import { ref, computed } from 'vue';
// 引入菜单列表
import { menuItem } from '@/data/itemList';
// 引入状态
import { useStore } from "@/store/index";
const store = useStore();
// 折叠状态
const isCollapse = computed(() => store.isCollapse)
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
    <!-- 垂直导航栏 -->
    <el-menu :router="true" :default-active="$route.path">
        <!-- 顶部标题 -->
        <div class="top">
            <img class="logo" src="@/assets/img/logo.jpg" />
            <div v-if="!isCollapse" class="title">
                <strong>医疗管理系统</strong>
            </div>
        </div>
        <!-- 导航栏主体 -->
        <template v-for="child1 in menuItem" :key="child1.id">
            <el-tooltip effect="dark" :content="child1.name" placement="right" :disabled="!isCollapse">
                <el-menu-item :index="child1.url">
                    <el-icon>
                        <component :is="child1.icon"></component>
                    </el-icon>
                    <template #title v-if="!isCollapse">
                        <span class="menuItemTitle">
                            <strong>{{ child1.name }}</strong>
                        </span>
                    </template>
                </el-menu-item>
            </el-tooltip>
        </template>
        <template v-if="isMobile">
            <!-- 简介 -->
            <el-menu-item @click="help">
                <el-icon>
                    <Notification />
                </el-icon>
                <span class="menuItemTitle"><strong>院内简介</strong></span>
            </el-menu-item>
            <!-- 退出登录 -->
            <el-menu-item @click="logout">
                <el-icon>
                    <SwitchButton />
                </el-icon>
                <span class="menuItemTitle"><strong>退出登录</strong></span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<style scoped>
.el-container{
    height:100%;
}
.el-menu {
    border: none !important;
    height: 100% !important;
}

/* 垂直导航栏顶部 */
.el-menu .top {
    display: flex;
    padding: 15px;
}

/* 垂直导航栏顶部logo */
.el-menu .top .logo {
    width: 35px;
    height: 35px;
    border-radius: 50%;
}

/* 垂直导航栏顶部标题 */
.el-menu .top .title {
    text-align: center;
    color: var(--bTextColor);
    font-family: "SimSun";
    font-size: 20px;
    margin: auto;
}

.el-menu .menuItemTitle {
    font-family: SimSun;
    font-size: 16px;
    padding-left: 10px;
}
</style>