import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '@/utils/auth';

const routes: Array<RouteRecordRaw> = [
    // 默认跳转至首页
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: {
            breadcrumb: '首页'
        },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login/index.vue'),
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('@/views/User/index.vue'),
        meta: {
            breadcrumb: '个人中心'
        },
    },
    // 信息管理
    {
        path: '/information',
        name: 'Information',
        component: () => import('@/views/Information/index.vue'),
        meta: {
            breadcrumb: '信息管理'
        },
    },
    // 邮件管理
    {
        path: '/email',
        name: 'Email',
        component: () => import('@/views/Email/index.vue'),
        meta: {
            breadcrumb: '邮件管理'
        },
    },
    // 统计分析
    {
        path: '/analysis',
        name: 'Analysis',
        component: () => import('@/views/Analysis/index.vue'),
        meta: {
            breadcrumb: '统计分析'
        },
    },
    // 院内导航
    {
        path: '/map',
        name: 'Map',
        component: () => import('@/views/Map/index.vue'),
        meta: {
            breadcrumb: '院内导航'
        },
    },
    // 系统设置
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/Setting/index.vue'),
        meta: {
            breadcrumb: '系统设置'
        },
    },
    // 测试模块
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/Test/index.vue'),
        meta: {
            breadcrumb: '测试模块'
        },
    },
    // 404页面
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/views/Error/index.vue'),
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
