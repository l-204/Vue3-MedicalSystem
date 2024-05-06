<template>
  <div>
    <!-- 调用菜单组件 -->
    <MenuPage>
      <template #default>
        <!-- 这里是需要显示在 el-main 中的内容 -->
        <!-- 抽屉 -->
        <el-drawer v-model="isOpen" title="写信" size="100%">
          <Writing :emailForm="emailForm" />
        </el-drawer>

        <el-drawer v-model="isRead" title="邮件" size="100%">
          <div style="font-size: 30px">
            <strong>{{ targetEmail.topic }}</strong>
          </div>
          <div style="display: flex; margin: 20px auto">
            <el-avatar :src="targetEmail.from_avatar" style="flex-shrink: 0">{{
          targetEmail.from_name[0]
        }}</el-avatar>
            <div style="margin: auto 10px; font-size: 0.8rem">
              <div style="margin: auto">
                {{ targetEmail.from_name }}
                <span style="color: var(--el-text-color-secondary)">{{
          targetEmail.send_at
        }}</span>
              </div>
              <div style="margin: 5px auto">
                <span style="color: var(--el-text-color-secondary)">发送给：&nbsp;</span>
                {{ targetEmail.to_name }}
              </div>
            </div>
          </div>
          <div style="
              border-bottom: 1px solid var(--el-border-color);
              border-top: 1px solid var(--el-border-color);
              margin: 20px auto;
              padding: 60px 10px;
              font-size: 14px;
              font-family: 'SimSun';
            ">
            <div v-html="targetEmail.content"></div>
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
              <div class="emailTop" style="display: flex; flex-direction: column; padding: 10px">
                <el-button @click="handleWriting" style="
                    margin: 10px 0;
                    font-size: 16px;
                    box-shadow: var(--el-box-shadow-lighter);
                    color: #67c23a;
                  " size="large" icon="EditPen">
                  <span id="emailWriteButton">写信</span></el-button>
              </div>
              <!-- 导航栏主体 -->
              <template v-for="(item, index) in menuList" :key="item.id">
                <el-tooltip effect="dark" :content="item.name" placement="right" :disabled="!isMobile">
                  <el-menu-item :index="item.index" @click="handlePage(item.id)" style="justify-content: center">
                    <el-icon>
                      <component :is="item.icon"></component>
                    </el-icon>
                    <template #title>
                      <span id="emailLabel" style="font-family: SimSun; font-size: 16px">
                        <strong>{{ item.name }}</strong>
                      </span>
                    </template>
                  </el-menu-item>
                </el-tooltip>
              </template>
            </el-menu>
          </el-aside>
          <el-main style="display: flex; height: 100%">
            <div class="emailList" style="
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
                width: 300px;
                background-color: var(--bPageBgColor);
                margin: 0;
              ">
              <!-- 上方按钮 -->
              <div class="emailOperations">
                <el-input v-model="from_id" prefix-icon="Search" placeholder="搜索邮件主题" clearable></el-input>
                <div style="margin: 10px auto">
                  <el-button icon="Select" size="small" style="
                      border: none;
                      font-size: 14px;
                      float: left;
                      margin: auto;
                    " v-show="openCheckbox" @click="handleSelectAll">全选</el-button>
                  <el-button icon="CloseBold" size="small" style="
                      border: none;
                      font-size: 14px;
                      float: right;
                      margin: auto;
                    " v-show="openCheckbox" @click="handleCancelSelect">取消</el-button>
                </div>
              </div>
              <!-- 邮件列表 -->
              <div style="overflow: auto; flex-grow: 1">
                <!-- 有未读邮件时 -->
                <div class="emailItem" v-for="item in emailList" @click="handleOpen(item)">
                  <el-checkbox v-model="item.checked" style="margin: auto 10px" @click="handleStopPropagation"
                    v-show="openCheckbox" />
                  <el-avatar :src="item.from_avatar" style="flex-shrink: 0">{{
          item.from_name
        }}</el-avatar>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      flex-grow: 1;
                      margin: auto 20px auto 10px;
                      white-space: nowrap;
                      overflow: hidden;
                      font-size: clamp(0.7rem, 0.489rem + 1.05vw, 0.8rem);
                      color: var(--el-text-color-primary);
                    ">
                    <div style="text-overflow: ellipsis; overflow: hidden">
                      {{ item.from_name }}
                    </div>
                    <div style="
                        margin: 5px 0;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      ">
                      {{ item.topic }}
                    </div>
                    <div style="
                        color: var(--el-text-color-secondary);
                        text-overflow: ellipsis;
                        overflow: hidden;
                      ">
                      <!-- 用正则表达式删去html标签 -->
                      {{ item.content.replace(/<[^>]*>/g, "") }}
                    </div>
                  </div>
                  <div style="
                      display: flex;
                      flex-direction: column;
                      flex-shrink: 0;
                      font-size: clamp(0.7rem, 0.489rem + 1.05vw, 0.8em);
                      color: var(--el-text-color-primary);
                    ">
                    <div style="
                        align-items: flex-start;
                        flex-grow: 1;
                        color: var(--el-text-color-secondary);
                      ">
                      {{ item.send_at.split(" ")[0] }}
                    </div>
                    <div style="align-items: flex-end; text-align: right">
                      <el-dropdown trigger="click">
                        <span @click="handleStopPropagation">
                          <el-icon style="
                              transform: rotate(90deg);
                              vertical-align: text-bottom;
                            ">
                            <MoreFilled />
                          </el-icon>
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu style="
                              font-size: clamp(
                                0.7rem,
                                0.489rem + 1.05vw,
                                0.8em
                              );
                            ">
                            <el-dropdown-item icon="Finished" @click="handleSelect(item)">多选</el-dropdown-item>
                            <el-dropdown-item icon="RefreshLeft" @click="handleCancel(item)"
                              v-if="selectedIndex === 4">撤回</el-dropdown-item>
                            <el-dropdown-item icon="RefreshLeft" @click="handleRecover(item)"
                              v-if="selectedIndex === 5">恢复</el-dropdown-item>
                            <el-dropdown-item icon="Delete" @click="handleDelete(item)"
                              v-if="selectedIndex !== 4">删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <!-- 没有邮件时 -->
                <div style="
                    display: flex;
                    flex-grow: 1;
                    justify-content: center;
                    align-items: center;
                    color: var(--el-text-color-regular);
                    padding: 20px;
                  ">
                  这里没有邮件呢....
                </div>
              </div>
              <!-- 下方按钮 -->
              <div style="display: flex; padding: 10px" v-show="openCheckbox">
                <el-button icon="View" size="small" style="border: none; font-size: 14px; flex-grow: 1"
                  v-show="openCheckbox && selectedIndex === 2" @click="handleReadSelected">已读</el-button>
                <el-button icon="Position" size="small" style="border: none; font-size: 14px; flex-grow: 1"
                  v-show="openCheckbox && selectedIndex === 3" @click="handleSendSelected">发送</el-button>
                <el-button icon="RefreshLeft" size="small" style="border: none; font-size: 14px; flex-grow: 1"
                  v-show="openCheckbox && selectedIndex === 4" @click="handleCancelSelected">撤回</el-button>
                <el-button icon="RefreshLeft" size="small" style="border: none; font-size: 14px; flex-grow: 1"
                  v-show="openCheckbox && selectedIndex === 5" @click="handleRecoverSelected">恢复</el-button>
                <el-button icon="Delete" size="small" style="border: none; font-size: 14px; flex-grow: 1"
                  v-show="openCheckbox && selectedIndex !== 4" @click="handleDeleteSelected">删除</el-button>
              </div>
            </div>
            <!-- 未点击邮件时 -->
            <div v-if="!targetId" class="emailContent" style="
                display: flex;
                flex-direction: column;
                background-color: var(--bMainPageColor);
                flex-grow: 1;
                text-align: center;
                justify-content: center;
              ">
              <div>
                <img src="../assets/email.svg" style="width: 200px; height: 200px" />
              </div>
              <div style="
                  font-size: 20px;
                  padding-bottom: 10px;
                  color: var(--el-text-color-regular);
                ">
                未选中邮件
              </div>
              <div style="color: var(--el-text-color-regular)">
                请先选择要阅读的文件
              </div>
            </div>
            <!-- 点击邮件时 -->
            <div v-else style="
                padding: 40px;
                background-color: var(--bPageBgColor);
                width: 100%;
              " class="emailContent">
              <div>
                <div style="font-size: 30px">
                  <strong>{{ targetEmail.topic }}</strong>
                </div>
                <div style="display: flex; margin: 20px auto">
                  <el-avatar :src="targetEmail.from_avatar" style="flex-shrink: 0">{{ targetEmail.from_name[0]
                    }}</el-avatar>
                  <div style="margin: auto 10px; font-size: 0.8rem">
                    <div style="margin: auto">
                      {{ targetEmail.from_name }}
                      <span style="color: var(--el-text-color-secondary)">{{
          targetEmail.send_at
        }}</span>
                    </div>
                    <div style="margin: 5px auto">
                      <span style="color: var(--el-text-color-secondary)">发送给：&nbsp;</span>
                      {{ targetEmail.to_name }}
                    </div>
                  </div>
                </div>
              </div>
              <div style="
                  border-bottom: 1px solid var(--el-border-color);
                  border-top: 1px solid var(--el-border-color);
                  margin: 20px auto;
                  padding: 60px 10px;
                  font-size: 14px;
                  font-family: 'SimSun';
                ">
                <div v-html="targetEmail.content"></div>
              </div>
              <div style="display: flex">
                <el-button icon="Position" @click="handleSend" v-show="targetEmail.state === '草稿'">发送</el-button>
                <el-button icon="EditPen" @click="handleEdit" v-show="targetEmail.state === '草稿'">编辑</el-button>
                <el-button icon="ChatLineRound" @click="handleReply" v-show="(targetEmail.state === '未读' ||
          targetEmail.state === '已读') &&
          targetEmail.from_id !== userInfo.user_id
          ">回复</el-button>
                <el-button icon="TopRight" @click="handleShare" v-show="(targetEmail.state === '未读' ||
          targetEmail.state === '已读') &&
          targetEmail.from_id !== userInfo.user_id
          ">转发</el-button>
              </div>
            </div>
          </el-main>
        </el-container>
      </template>
    </MenuPage>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef, computed, onMounted } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { ElMessage } from "element-plus";
import MenuPage from "../components/MenuPage.vue";
import Writing from "../components/Writing.vue";
// 邮箱管理
import { emailMenuItem } from "../data/itemList";
import { useStore } from "../store/index";
import { getUserEmail, setSelectedEmail } from "../api/email";
import { deleteData } from "../api/table";
import { formatTime } from "../utils/formatTime";

// router
const route = useRoute();
// store
const store = useStore();
const isMobile = computed(() => store.isMobile);
// data
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const menuList = emailMenuItem;
const isOpen = ref(false);
const isRead = ref(false);
const openCheckbox = ref(false);
const defaultIndex = ref("1");
const selectedIndex = ref("1");
const emailListData = ref([]); // 所有邮件列表数据
const emailList = ref([]); // 当前导航邮件列表
const targetId = ref(0); // 邮件id
const from_id = ref(""); // 发件人
const targetEmail = ref({}); // 显示邮件数据
const emailForm = reactive({});
const readedEmail = ref([]);

// 获取邮件信息
getUserEmail()
  .then((res) => {
    formatTime(res);
    emailListData.value = res;
    // 邮件分类
    // 默认展示收件箱
    emailList.value = emailListData.value.filter(
      (item) =>
        item.to_id === userInfo.user_id &&
        (item.state === "已读" || item.state === "未读")
    );
  })
  .then(() => {
    // 从其它页面点击未读邮件通知时
    if (route.query.emailId) {
      // 获取要展开的邮件id
      targetId.value = +route.query.emailId; // 转化为数字类型
      // 更新本地所有邮件列表
      emailListData.value = emailListData.value.map((email) => {
        if (email.id === targetId.value) {
          return { ...email, state: "已读" };
        }
        return email;
      });
      // 从所有邮件列表中找出对应的邮件存储到targetEmail中展示
      const targetData = emailListData.value.filter(
        (item) => item.id === targetId.value
      );
      targetEmail.value = targetData[0];
      // 默认跳转到收件箱所以不需要跳转
      // 将需要更新状态的邮件Id添加到已读邮件列表中
      readedEmail.value.push(targetId.value);
      // console.log(readedEmail.value);
    }
  });

// 从当前页面点击未读邮件通知时
onBeforeRouteUpdate((to, from, next) => {
  // 如果目标路由中包含 emailId 查询参数

  if (to.query.emailId) {
    // 获取要展开的邮件id
    targetId.value = +to.query.emailId; // 转化为数字类型
    // 更新本地所有邮件列表
    emailListData.value = emailListData.value.map((email) => {
      if (email.id === targetId.value) {
        return { ...email, state: "已读" };
      }
      return email;
    });
    // 从所有邮件列表中找出对应的邮件存储到targetEmail中展示
    const targetData = emailListData.value.filter(
      (item) => item.id === targetId.value
    );
    targetEmail.value = targetData[0];
    // 跳转到收件箱
    defaultIndex.value = "2";
    handlePage(1);
    console.log(defaultIndex.value);

    // 将需要更新状态的邮件Id添加到已读邮件列表中
    readedEmail.value.push(targetId.value);

    // 发送批量更新请求到服务器
    // batchUpdateEmailState(emailsToUpdate);
  }
  next();
});
// 展开邮件
const handleOpen = (item) => {
  targetId.value = item.id;
  const targetData = emailList.value.filter(
    (email) => email.id === targetId.value
  );
  targetEmail.value = targetData[0];
  // 如果是移动端则以抽屉形式展开
  isMobile.value ? (isRead.value = true) : (isRead.value = false);
};
// 邮件类型路由
const handlePage = (id) => {
  selectedIndex.value = id;
  switch (id) {
    case 1:
      emailList.value = emailListData.value.filter(
        (item) =>
          item.to_id === userInfo.user_id &&
          (item.state === "已读" || item.state === "未读")
      );
      break;
    case 2:
      emailList.value = emailListData.value.filter(
        (item) => item.to_id === userInfo.user_id && item.state === "未读"
      );
      break;
    case 3:
      emailList.value = emailListData.value.filter(
        (item) => item.state === "草稿"
      );
      break;
    case 4:
      emailList.value = emailListData.value.filter(
        (item) =>
          item.from_id === userInfo.user_id &&
          (item.state === "已读" || item.state === "未读")
      );
      break;
    case 5:
      emailList.value = emailListData.value.filter(
        (item) => item.state === "垃圾"
      );
      break;
    default:
      break;
  }
};
// 写信
const handleWriting = () => {
  Object.assign(emailForm, {});
  console.log(emailForm);
  isOpen.value = !isOpen.value;
};
// 发送
const handleSend = () => { };
// 编辑
const handleEdit = () => {
  Object.assign(emailForm, targetEmail);
  console.log(emailForm);
  isOpen.value = !isOpen.value;
};
// 回复
const handleReply = () => { };
// 转发
const handleShare = () => { };
// 阻止冒泡
const handleStopPropagation = (e) => e.stopPropagation();
// 下拉菜单部分
// 多选
const handleSelect = (item) => {
  openCheckbox.value = true; // 打开多选框
  item.checked = true; // 默认选中
};
// 删除
const handleDelete = async (item) => {
  const selectedEmails = emailList.value.filter(
    (email) => email.id === item.id
  );
  // 显示未被标记为"垃圾"的邮件
  emailList.value = emailList.value.filter((email) => email.id !== item.id);
  // 发送请求到后端...
  const response = await setSelectedEmail(selectedEmails);
  ElMessage.success(response.message); // 显示后端返回的消息
  const data = await getUserEmail();
  formatTime(data);
  emailListData.value = data;
};
// 撤回
const handleCancel = () => { };
// 恢复
const handleRecover = () => { };
// 上方按钮
// 全选
const handleSelectAll = () => {
  const allChecked = emailList.value.every((item) => item.checked);
  emailList.value.forEach((item) => {
    item.checked = !allChecked;
  });
};
// 取消
const handleCancelSelect = () => {
  openCheckbox.value = false; // 关闭多选框
  emailList.value.forEach((email) => (email.checked = false)); // 清空选中状态
};
// 下方按钮
// 删除所有选中
const handleDeleteSelected = async () => {
  // 获取选中的邮件，并获取这些邮件的Id
  const selectedEmails = emailList.value.filter((email) => email.checked);
  // 显示未被标记为"垃圾"的邮件
  emailList.value = emailList.value.filter((email) => !email.checked);
  // 发送请求到后端...
  const response = await setSelectedEmail(selectedEmails);
  ElMessage.success(response.message); // 显示后端返回的消息
  const data = await getUserEmail();
  formatTime(data);
  emailListData.value = data;
};
// 已读所有选中
const handleReadSelected = () => { };
// 发送所有选中
const handleSendSelected = () => { };
// 撤回所有选中
const handleCancelSelected = () => { };
// 恢复所有选中
const handleRecoverSelected = () => { };
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

.emailOperations {
  padding: 10px;
  /* display:flex; */
  border-bottom: 1px solid var(--el-border-color);
}

.emailOperations .el-input__wrapper {
  border-radius: 100px;
  /* transition:width 0.5s; */
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

/* 大小 */
.emailList .emailItem .el-checkbox__inner {
  width: 20px;
  height: 20px;
  position: relative;
}

/* 对勾样式 */
.emailList .emailItem .el-checkbox__inner::after {
  top: 4px;
  left: 7px;
}
</style>
