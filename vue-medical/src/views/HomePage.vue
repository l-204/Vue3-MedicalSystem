<template>
  <!-- 调用菜单组件 -->
  <MenuPage>
    <template #default>
      <!-- 这里是需要显示在 el-main 中的内容 -->
      <div class="Container" v-loading="isLoading">
        <!-- 内容 -->
        <div class="HomeContent">
          <!-- 第一行 -->
          <el-row :gutter="20">
            <!-- 个人信息 -->
            <el-col :md="12" :lg="10" :xl="10">
              <el-card body-style="height:100%;display:flex;flex-direction:column;">
                <!-- 上部分 -->
                <div class="user" style="flex-grow: 1">
                  <el-avatar :size="isMobile ? 100 : 150" :src="userInfo.avatar"
                    style="margin: auto; font-size: 2rem">{{ userInfo.username }}</el-avatar>
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
              </el-card>
            </el-col>
            <!-- 常用功能 -->
            <el-col :md="12" :lg="14" :xl="14">
              <!-- 折线图 -->
              <el-card body-style="height:100%">
                <LineChart />
              </el-card>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row :gutter="20">
            <!-- 轮播图 -->
            <el-col :md="10" :lg="10" :xl="10">
              <el-card body-style="padding: 0;height: 100%;">
                <el-carousel trigger="click" height="100%" style="height: 100%" autoplay :interval="3000"
                  arrow="always">
                  <el-carousel-item v-for="(item, index) in images" style="height: 100%" :key="index">
                    <img :src="item" width="100%" height="100%" alt="" />
                  </el-carousel-item>
                </el-carousel>
              </el-card>
            </el-col>
            <!-- 开发进度 -->
            <el-col :sm="12" :md="7" :lg="7" :xl="7">
              <el-card body-style="flex-grow:1;" style="display: flex; flex-direction: column">
                <template #header>
                  <el-icon>
                    <DataLine />
                  </el-icon> 开发进度
                </template>
                <div style="height: 100%; display: flex; flex-direction: column">
                  <div style="flex-grow: 1" v-for="item in progressItem" :key="item.id">
                    <div>
                      <el-icon>
                        <component :is="item.icon" />
                      </el-icon> {{ item.title }}
                    </div>
                    <el-progress :percentage="100" status="success"></el-progress>
                  </div>
                </div>
              </el-card>
            </el-col>
            <!-- 开发日志 -->
            <el-col :sm="12" :md="7" :lg="7" :xl="7">
              <el-card body-style="flex-grow:1;overflow:auto" style="display: flex; flex-direction: column">
                <template #header>
                  <el-icon>
                    <Memo />
                  </el-icon> 开发日志
                </template>
                <el-timeline>
                  <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp"
                    :type="activity.type" :icon="activity.icon">{{ activity.content }}
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
  </MenuPage>
</template>

<script setup>
import MenuPage from "../components/MenuPage.vue";
import LineChart from "../components/echart/LineChart.vue";
import { useStore } from "../store/index";
import { onMounted, computed, ref } from "vue";
import { activityItem, progressItem } from "../data/itemList";

const store = useStore();
const isLoading = computed(() => store.isLoading);
const isMobile = computed(() => store.isMobile);
// 进入页面时设置加载状态为 true
store.setLoading(true);
const userInfo = ref({});
const images = ref([
  new URL("../assets/1.jpg", import.meta.url).href,
  new URL("../assets/2.webp", import.meta.url).href,
  new URL("../assets/3.png", import.meta.url).href,
  new URL("../assets/4.jpg", import.meta.url).href,
]);
const activities = activityItem;
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

<style>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

.HomeContent .el-card {
  border-radius: 10px;
  height: 40vh;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.HomeContent .user {
  display: flex;
  /* padding-top: 40px; */
}

.HomeContent .user .userinfo {
  text-align: left;
  margin: auto;
  font-size: clamp(1rem, 4vw, 1.5rem);
}

.HomeContent .footer {
  border-top: 1px solid var(--el-border-color);
  padding: 15px 0;
  font-size: clamp(0.7rem, 3vw, 1rem);
}
</style>
