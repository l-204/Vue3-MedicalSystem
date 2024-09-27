<script setup>
import { onMounted, computed, ref } from "vue";
import { useStore } from "@/store/index";
const store = useStore();
const isMobile = computed(() => store.isMobile);

const userInfo = ref({});
const getUser = () => {
    try {
        userInfo.value = JSON.parse(localStorage.getItem("userInfo"));
        store.setUser(userInfo.value);
    } catch (error) {
        console.error(error);
    } finally {
        // 页面加载完成后设置加载状态为 false
        store.setLoading(false);
    }
};
onMounted(getUser);
</script>

<template>
    <!-- 上部分 -->
    <div class="user">
        <el-avatar class="avatar" :size="isMobile ? 100 : 150" :src="userInfo.avatar" >
            {{ userInfo.username }}
        </el-avatar>
        <div class="userinfo">
            <el-icon>
                <User />
            </el-icon> &nbsp;{{ userInfo.username }}
            <br /><br />
            <el-icon>
                <CreditCard />
            </el-icon> &nbsp;{{ userInfo.identity }}
        </div>
    </div>
    <!-- 下部分 -->
    <div class="footer">
        <el-icon>
            <Link />
        </el-icon> 上次登录时间：{{ userInfo.last_login_at }}
    </div>
</template>

<style scoped>
 .user {
    display: flex;
    flex-grow: 1;
    /* padding-top: 40px; */
}
.user .avatar{
    margin: auto;
    font-size: 2rem;
}

 .user .userinfo {
    text-align: left;
    margin: auto;
    font-size: clamp(1rem, 4vw, 1.5rem);
}

 .footer {
    border-top: 1px solid var(--el-border-color);
    padding: 15px 0;
    font-size: clamp(0.7rem, 3vw, 1rem);
}
</style>