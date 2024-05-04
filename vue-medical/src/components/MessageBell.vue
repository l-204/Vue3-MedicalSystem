<template>
  <div class="MessageBellContainer">
    <el-popover
      placement="bottom"
      :width="isMobile ? 270 : 370"
      trigger="hover"
      popper-style="padding: 0;"
    >
      <div class="popoverBorder">
        <div class="popoverContainer">
          <el-card
            class="emailCardItem"
            body-style="display: flex;"
            style="border: none; border-radius: 0"
            shadow="never"
            v-for="item in emailList"
            :key="item.id"
            @click="handleRoute(item.id)"
          >
            <el-avatar
              :src="item.from_avatar"
              style="flex-shrink: 0"
              :size="50"
              >{{ item.from_id }}</el-avatar
            >
            <div class="emailCardItemCenter">
              <div style="text-overflow: ellipsis; overflow: hidden">
                <strong>发件人：{{ item.from_name }}</strong>
              </div>
              <!-- p1 -->
              <div style="text-overflow: ellipsis; overflow: hidden">
                <strong>主题：{{ item.topic }}</strong>
              </div>
              <div style="font-size: 10px; line-height: 20px">
                <em>{{ item.send_at }}</em>
              </div>
            </div>
          </el-card>
          <div
            style="width: 100%; margin: auto; text-align: center; padding: 20px"
          >
            没有未读邮件呢......
          </div>
        </div>
      </div>
      <template #reference>
        <el-badge
          :value="emailList.length"
          :max="99"
          :offset="[-15, 15]"
          :hidden="!emailList.length"
        >
          <el-button icon="Bell" circle class="shake"></el-button>
        </el-badge>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { email } from "../mock/email";
import { computed, onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store/index";
import { getUserEmail } from "../api/email";
import { formatTime } from "../utils/formatTime";

const store = useStore();
    const router = useRouter();

    const isMobile = computed(() => store.isMobile);
    const emailList = ref([]);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userList = ref([])
    let min_id = 0;
    let max_id = 0;
    // 获取邮箱信息
    getUserEmail()
      .then((res) => {
        // 过滤出未读邮件
        const toData = res.filter(
          (item) => item.to_id === userInfo.user_id && item.state === "未读"
        );
        // 格式化对象中的时间属性
        formatTime(toData);
        // 保存到 emailList 中
        emailList.value = toData;
      })
      .catch((err) => console.log(err));

    const handleRoute = (id) => {
      // 跳转到未读邮件对应的页面
      router.push({ name: "Email", query: { emailId: id } });
    };
</script>

<style>
.popoverBorder {
  max-height: 280px;
  overflow: auto;
}
.popoverContainer {
  background-color: var(--el-popover-bg-color);
  display: flex;
  flex-direction: column;
}
.popoverContainer .emailCardItem:hover {
  cursor: pointer;
  background-color: var(--selectRowBgColor);
}
.popoverContainer .emailCardItemCenter {
  color: var(--bTextColor);
  white-space: nowrap;
  overflow: hidden;
  margin-left: 10px;
  font-size: 12px;
}
/* 铃铛动画效果 */
.shake:hover {
  animation: shake 0.5s;
  /* 设置摇晃动画的持续时间 */
}

@keyframes shake {
  0% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(-15deg);
  }

  40% {
    transform: rotate(15deg);
  }

  60% {
    transform: rotate(-15deg);
  }

  80% {
    transform: rotate(15deg);
  }

  100% {
    transform: rotate(0deg);
  }
}
</style>
