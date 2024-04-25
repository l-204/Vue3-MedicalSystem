<template>
  <div>
    <!-- 调用菜单组件 -->
    <MenuPage>
      <template #default>
        <!-- 这里是需要显示在 el-main 中的内容 -->
        <!-- 抽屉 -->
        <el-drawer v-model="isOpen" title="写信" size="100%" :z-index="103">
          <Writing />
        </el-drawer>

        <el-drawer v-model="isRead" title="邮件" size="100%" :z-index="103">
          <div style="font-size: 30px">
            <strong>{{ targetEmail.topic }}</strong>
          </div>
          <div style="display: flex; margin: 20px auto">
            <el-avatar :src="targetEmail.from_avatar" style="flex-shrink: 0">{{
              targetEmail.from[0]
            }}</el-avatar>
            <div style="margin: auto 10px; font-size: 0.8rem">
              <div style="margin: auto">
                {{ targetEmail.from }}
                <span style="color: var(--el-text-color-secondary)">{{
                  targetEmail.send_at
                }}</span>
              </div>
              <div style="margin: 5px auto">
                <span style="color: var(--el-text-color-secondary)"
                  >发送给：&nbsp;</span
                >
                {{ targetEmail.to }}
              </div>
            </div>
          </div>
          <div
            style="
              border-bottom: 1px solid var(--el-border-color);
              border-top: 1px solid var(--el-border-color);
              margin: 20px auto;
              padding: 60px 10px;
              font-size: 14px;
              font-family: 'SimSun';
              /* background-color: red; */
            "
          >
            {{ targetEmail.content }}
          </div>
          <div style="display: flex">
            <el-button icon="ChatLineRound">回复</el-button>
            <el-button icon="TopRight">转发</el-button>
          </div>
        </el-drawer>

        <el-container style="height: 100%">
          <el-aside id="emailAside" style="width: 180px">
            <el-menu :default-active="defaultIndex">
              <!-- 顶部标题 -->
              <div
                class="emailTop"
                style="display: flex; flex-direction: column; padding: 10px"
              >
                <el-input
                  v-model="from"
                  input-style="border-radius: 40px"
                  prefix-icon="Search"
                  placeholder="搜索邮箱"
                  clearable
                ></el-input>
                <el-button
                  @click="isOpen = true"
                  style="
                    margin: 10px 0;
                    font-size: 16px;
                    box-shadow: var(--el-box-shadow-lighter);
                    color: #67c23a;
                  "
                  size="large"
                  icon="EditPen"
                >
                  <span id="emailWriteButton">写信</span></el-button
                >
              </div>
              <!-- 导航栏主体 -->
              <template v-for="(item, index) in menuList" :key="item.id">
                <el-tooltip
                  effect="dark"
                  :content="item.name"
                  placement="right"
                  :disabled="!isMobile"
                >
                  <el-menu-item
                    :index="item.index"
                    @click="handlePage(item.id)"
                    style="justify-content: center"
                  >
                    <el-icon><component :is="item.icon"></component></el-icon>
                    <template #title>
                      <span
                        id="emailLabel"
                        style="font-family: SimSun; font-size: 16px"
                      >
                        <strong>{{ item.name }}</strong>
                      </span>
                    </template>
                  </el-menu-item>
                </el-tooltip>
              </template>
            </el-menu>
          </el-aside>
          <el-main style="display: flex; height: 100%">
            <div
              class="emailList"
              style="
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
                width: 300px;
                background-color: var(--bPageBgColor);
                margin: 0;
                overflow: auto;
              "
            >
              <div
                class="emailOperations"
                style="
                  padding: 10px;
                  border-bottom: 1px solid var(--el-border-color);
                "
              >
                <el-button
                  icon="Filter"
                  size="small"
                  style="border: none; font-size: 14px"
                  >筛选</el-button
                >
              </div>
              <!-- 有未读邮件时 -->
              <div
                class="emailItem"
                v-for="item in emailList"
                @click="handleOpen(item.id)"
              >
                <el-avatar :src="item.from_avatar" style="flex-shrink: 0">{{
                  item.from_name
                }}</el-avatar>
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    margin: auto 20px auto 10px;
                    white-space: nowrap;
                    overflow: hidden;
                    font-size: clamp(0.7rem, 0.489rem + 1.05vw, 0.8rem);
                    color: var(--el-text-color-primary);
                  "
                >
                  <div style="text-overflow: ellipsis; overflow: hidden">
                    {{ item.from_name }}
                  </div>
                  <div
                    style="
                      margin: 5px 0;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    "
                  >
                    {{ item.topic }}
                  </div>
                  <div
                    style="
                      color: var(--el-text-color-secondary);
                      text-overflow: ellipsis;
                      overflow: hidden;
                    "
                  >
                    {{ item.content }}
                  </div>
                </div>
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 0;
                    font-size: clamp(0.7rem, 0.489rem + 1.05vw, 0.8em);
                    color: var(--el-text-color-primary);
                  "
                >
                  <div
                    style="
                      align-items: flex-start;
                      flex-grow: 1;
                      color: var(--el-text-color-secondary);
                    "
                  >
                    {{ item.send_at.split(" ")[0] }}
                  </div>
                  <div
                    style="align-items: flex-end; text-align: right"
                    @click=""
                  >
                  <el-dropdown trigger="click">
        <span>
          <el-icon
                      style="
                        transform: rotate(90deg);
                        vertical-align: text-bottom;
                      "
                      ><MoreFilled
                    /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu style="font-size:clamp(0.7rem, 0.489rem + 1.05vw, 0.8em);">
            <el-dropdown-item icon="Finished">多选</el-dropdown-item>
            <el-dropdown-item icon="Delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
                  </div>
                </div>
              </div>
              <!-- 没有邮件时 -->
              <div
                style="
                  display: flex;
                  flex-grow: 1;
                  justify-content: center;
                  align-items: center;
                  color: var(--el-text-color-regular);
                  padding: 20px;
                "
              >
                这里没有邮件呢....
              </div>
            </div>
            <!-- 未点击邮件时 -->
            <div
              v-if="!targetId"
              class="emailContent"
              style="
                display: flex;
                flex-direction: column;
                background-color: var(--bMainPageColor);
                flex-grow: 1;
                text-align: center;
                justify-content: center;
              "
            >
              <div>
                <img
                  src="../assets/email.svg"
                  style="width: 200px; height: 200px"
                />
              </div>
              <div
                style="
                  font-size: 20px;
                  padding-bottom: 10px;
                  color: var(--el-text-color-regular);
                "
              >
                未选中邮件
              </div>
              <div style="color: var(--el-text-color-regular)">
                请先选择要阅读的文件
              </div>
            </div>
            <!-- 点击邮件时 -->
            <div
              v-else
              style="
                padding: 40px;
                background-color: var(--bPageBgColor);
                width: 100%;
              "
              class="emailContent"
            >
              <div>
                <div style="font-size: 30px">
                  <strong>{{ targetEmail.topic }}</strong>
                </div>
                <div style="display: flex; margin: 20px auto">
                  <el-avatar
                    :src="targetEmail.from_avatar"
                    style="flex-shrink: 0"
                    >{{ targetEmail.from[0] }}</el-avatar
                  >
                  <div style="margin: auto 10px; font-size: 0.8rem">
                    <div style="margin: auto">
                      {{ targetEmail.from }}
                      <span style="color: var(--el-text-color-secondary)">{{
                        targetEmail.send_at
                      }}</span>
                    </div>
                    <div style="margin: 5px auto">
                      <span style="color: var(--el-text-color-secondary)"
                        >发送给：&nbsp;</span
                      >
                      {{ targetEmail.to }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="
                  border-bottom: 1px solid var(--el-border-color);
                  border-top: 1px solid var(--el-border-color);
                  margin: 20px auto;
                  padding: 60px 10px;
                  font-size: 14px;
                  font-family: 'SimSun';
                  /* background-color: red; */
                "
              >
                {{ targetEmail.content }}
              </div>
              <div style="display: flex">
                <el-button icon="ChatLineRound">回复</el-button>
                <el-button icon="TopRight">转发</el-button>
              </div>
            </div>
          </el-main>
        </el-container>
      </template>
    </MenuPage>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import MenuPage from "../components/MenuPage.vue";
import Writing from "../components/Writing.vue";
// 邮箱管理
import { emailMenuItem } from "../data/itemList";
import { useStore } from "../store/index";
import { getEmail, getEmailUser } from "../api/email";
import { formatTime } from "../utils/formatTime";

// router
const route = useRoute();
// store
const store = useStore();
const isMobile = computed(() => store.isMobile);
// data
const menuList = emailMenuItem;
const isOpen = ref(false);
const isRead = ref(false);
const defaultIndex = ref("1");
// 邮件分类
const emailList = ref([]); // 显示邮件列表
const InBoxData = ref([]); // 收件箱列表
const UnreadData = ref([]); // 未读邮件列表
const DraftboxData = ref([]); // 草稿箱列表
const SentData = ref([]); // 已发送邮箱列表
const DustbinData = ref([]); // 垃圾箱列表
const targetId = ref(0); // 邮件id
const from = ref(""); // 发件人
const targetEmail = ref({}); // 显示邮件
// 提取用户信息
let min_id = 0;
let max_id = 0;
const userList = ref([]) 

// 获取邮件信息
getEmail()
  .then(res => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(InBoxData)
    formatTime(res);
    emailList.value = res

    // 提取所有邮件的用户id，统计邮件所有用户id的范围
    let allId = res.reduce((acc, email) => {
      acc.push(email.from);
      acc.push(email.to);
      return acc;
    }, []);
    // 获取id范围后将作为post参数，用于只发送一次请求的情况下获取所有邮件的用户信息
    min_id = Math.min(...allId);
    max_id = Math.max(...allId);

    // 获取所有邮件的用户信息
  getEmailUser(min_id, max_id).then(res => {
    userList.value = res
    // 创建一个新的 emailList 数组，其中每个邮件对象都包含了from和to对应的username, avatar, email
const newEmailList = emailList.value.map(email => {
    const { username: from_name, avatar: from_avatar, email: from_email } = userList.value.find(user => user.user_id === email.from) || {};
    const { username: to_name, avatar: to_avatar, email: to_email } = userList.value.find(user => user.user_id === email.to) || {};
    return { ...email, from_name, from_avatar, from_email, to_name, to_avatar, to_email };
});
  // 将原来的emailList修改为新的emailList
  emailList.value = newEmailList
  }).then(() => {
    // 邮件分类
// 收件箱
InBoxData.value = emailList.value.filter(
      (item) =>
        item.to === userInfo.user_id &&
        (item.state === "已读" || item.state === "未读")
    );
    // 未读邮件
    UnreadData.value = emailList.value.filter(
      (item) => item.to === userInfo.user_id && item.state === "未读"
    );
    // 草稿箱
    DraftboxData.value = emailList.value.filter((item) => item.state === "草稿");
    // 已发送
    SentData.value = emailList.value.filter(
      (item) =>
        item.from === userInfo.user_id &&
        (item.state === "已读" || item.state === "未读")
    );
    // 垃圾箱
    DustbinData.value = emailList.value.filter((item) => item.state === "垃圾");
    // 默认展示收件箱
  emailList.value = InBoxData.value
  }).then(() => {
    // 从其它页面点击未读邮件通知时
    if (route.query.emailId) {
      // 设置导航栏为未读邮件，并获取要展开的邮件id，打开该未读邮件后标记为已读
      defaultIndex.value = "2";
      emailList.value = UnreadData.value;
      targetId.value = +route.query.emailId;

      const targetData = emailList.value.filter(
        (item) => item.id == targetId.value
      );
      targetEmail.value = targetData[0];
    }
  })  

  })
  
// 从当前页面点击未读邮件通知时
onBeforeRouteUpdate((to, from, next) => {
  // 如果目标路由中包含 emailId 查询参数

  if (to.query.emailId) {
    // 设置导航栏为未读邮件，并获取要展开的邮件id，打开该未读邮件后标记为已读
    defaultIndex.value = "2";
    emailList.value = UnreadData.value;
    targetId.value = +to.query.emailId; // 转化为数字类型
    const targetData = emailList.value.filter(
      (item) => item.id == targetId.value
    );
    // console.log(targetData)
    targetEmail.value = targetData[0];
  }
  next();
});

const handleOpen = (id) => {
  targetId.value = id;
  const targetData = emailList.value.filter(
    (item) => item.id == targetId.value
  );
  targetEmail.value = targetData[0];
  if (isMobile.value) {
    isRead.value = true;
  } else {
    isRead.value = false;
  }
};

const handlePage = (id) => {
  switch (id) {
    case 1:
      emailList.value = InBoxData.value;
      console.log(emailList.value)
      break;
    case 2:
      emailList.value = UnreadData.value;
      break;
    case 3:
      emailList.value = DraftboxData.value;
      break;
    case 4:
      emailList.value = SentData.value;
      break;
    case 5:
      emailList.value = DustbinData.value;
      break;
    default:
      break;
  }
};
</script>

<style>
@media (max-width: 1000px) {
  #emailAside {
    width: 64px !important;
  }
  #emailWriteButton {
    display: none !important;
  }
  #emailLabel {
    display: none !important;
  }
}
@media (max-width: 768px) {
  .emailContent {
    display: none !important;
  }
  .emailList {
    width: 100% !important;
  }
}

.emailList {
  border-left: 1px solid var(--el-border-color);
  border-right: 1px solid var(--el-border-color);
}

.emailTop .el-input__wrapper {
  border-radius: 100px;
  /* border: 0; */
  /* box-shadow: 0 0 0 0px; */
}

.emailList .emailItem {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.emailList .emailItem:hover {
  cursor: pointer;
  background-color: var(--el-color-primary-light-9);
}
</style>
