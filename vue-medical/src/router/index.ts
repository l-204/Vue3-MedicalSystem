import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// 最外层页
import Login from '../views/LoginPage.vue';
import Home from '../views/HomePage.vue';
import User from '../views/UserPage.vue';
import Information from '../views/InformationPage.vue';
import Email from '../views/EmailPage.vue'
import Analysis from '../views/AnalysisPage.vue';
import Map from "../views/MapPage.vue";
import Setting from '../views/SettingPage.vue';
import TestPage from "../views/TestPage.vue";
import NotFound from '../views/NotFound.vue';

import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '../utils/auth';

const routes: Array<RouteRecordRaw> = [
    // 默认跳转至首页
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            breadcrumb: '首页'
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/user',
        name: 'User',
        component: User,
        meta: {
            breadcrumb: '个人中心'
        },
    },
    // 信息管理
    {
        path: '/information',
        name: 'Information',
        component: Information,
        meta: {
            breadcrumb: '信息管理'
        },
    },
    // 邮件管理
    {
        path: '/email',
        name: 'Email',
        component: Email,
        meta: {
            breadcrumb: '邮件管理'
        },
    },
    // 统计分析
    {
        path: '/analysis',
        name: 'Analysis',
        component: Analysis,
        meta: {
            breadcrumb: '统计分析'
        },
    },
    // 院内导航
    {
        path: '/map',
        name: 'Map',
        component: Map,
        meta: {
            breadcrumb: '院内导航'
        },
    },
    // 系统设置
    {
        path: '/setting',
        name: 'Setting',
        component: Setting,
        meta: {
            breadcrumb: '系统设置'
        },
    },
    // 测试模块
    {
        path: '/test',
        name: 'test',
        component: TestPage,
        meta: {
            breadcrumb: '测试模块'
        },
    },
    // 404页面
    {
        path: '/404',
        name: 'NotFound',
        component: NotFound
      },
      {
        path: "/:catchAll(.*)", // 不识别的path自动匹配404
        redirect: '/404',
      },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 设置路由守卫
router.beforeEach((to, _from, next) => {
    const token = getToken();

    if (to.path === '/register' || to.path === '/login') {
        // 如果用户访问注册或登录路径，则不需要判断登录状态
        next();
    } else if (!token) {
        // Token不存在，执行其他处理逻辑，比如跳转到登录页面
        next('/login');
    } else {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp! * 1000 < Date.now()) {
                    // Token已过期，清除 localStorage 数据和 Token 数据
                    localStorage.clear();
                    removeToken();
                    // 执行其他过期处理逻辑，比如跳转到登录页面
                    next('/login');
                } else {
                    // Token未过期，继续进行路由跳转
                    next();
                }
            } catch (error) {
                console.error('Token解析失败', error);
                next('/login');
            }
        }
    }
});

export default router;
