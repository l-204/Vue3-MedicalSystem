<template>
  <Layout>
    <div class="container">
          <div class="SettingContent">
            <el-row>
              <el-col :sm="9" :md="8" :lg="6" :xl="6">
                <el-card class="rightContent">
                  <el-icon>
                    <Key />
                  </el-icon> 权限管理 <el-divider></el-divider><br />
                  <el-form v-if="identity == '管理员'">
                    <el-form-item label="选择用户">
                      <el-select v-model="user" @change="checkRight()">
                        <el-option v-for="(item, index) in userList" :key="index" :value="item.username"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="管理员权限">
                      <el-switch v-model="isAdmin" @change="confirmRight()"></el-switch>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
  </Layout>
</template>

<script setup>
import Layout from "@/layout/index.vue";
import { ref } from "vue";
import { getTableData } from "@/api/table";
import { updateRight } from "@/api/setting";
import { ElMessage, ElMessageBox } from "element-plus";

const userList = ref([]);
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const id = ref(userInfo.user_id); //保存当前用户id
const user = ref(userInfo.username); //将选择框默认值设为当前用户
const username = ref(userInfo.username); //保存当前用户名
const identity = ref("");
const isAdmin = ref(true);
const selectedUserInfo = ref({});

getTableData("users")
  .then((res) => {
    userList.value = res;
    const userData = res.find((item) => item.user_id === id.value);
    identity.value = userData.identity;
  })
  .catch((err) => console.log(err));

const checkRight = () => {
  // 根据当前选择的用户来更新isAdmin的状态
  const selectedUser = user.value;
  // 找出当前选择的用户的信息
  selectedUserInfo.value = userList.value.find(
    (item) => item.username === selectedUser
  );
  // 获取当前用户id，用于后续更改用户的身份
  id.value = selectedUserInfo.value.user_id;
  // 根据用户身份决定开关状态
  selectedUserInfo.value.identity == "管理员"
    ? (isAdmin.value = true)
    : (isAdmin.value = false);
};

const confirmRight = () => {
  if (isAdmin.value == false) {
    ElMessageBox.confirm("确定收回该用户的管理员权限吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        isAdmin.value = false;
        selectedUserInfo.value.identity = "普通用户";
        updateRight(id.value, isAdmin.value);
        if (user.value == username.value) {
          // 获取当前身份
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          // 将修改的身份保存到本地
          userInfo.identity = "普通用户";
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          identity.value = "普通用户";
        }
        ElMessage.success("收回成功");
      })
      .catch(() => {
        isAdmin.value = true;
        ElMessage.info("已取消收回");
      });
  } else {
    selectedUserInfo.value.identity = "管理员";
    updateRight(id.value, isAdmin.value);
  }
};
</script>

<style scoped>
.container{
  padding:20px;
}
.SettingContent .rightContent {
  border-radius: 20px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
}
</style>
