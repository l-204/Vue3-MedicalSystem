<template>
  <Layout>
    <div class="container">
          <div class="UserContent">
            <div class="head">
              <el-button @click="dialogFormVisible = true" icon="Edit">修改信息</el-button>
            </div>

            <el-dialog title="个人信息" v-model="dialogFormVisible" :before-close="handleClose">
              <el-form :model="form" :rules="ruleList" ref="formRef" style="max-width: 600px; margin: auto">
                <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                  <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                  <el-radio-group v-model="form.gender">
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                    <el-radio value="保密">保密</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                  <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone_number" :label-width="formLabelWidth">
                  <el-input v-model="form.phone_number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份" prop="identity" :label-width="formLabelWidth">
                  <el-input disabled v-model="form.identity" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="工号" prop="job_number" :label-width="formLabelWidth">
                  <el-input v-model="form.job_number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-model="form.avatar" label="修改头像" :label-width="formLabelWidth">
                  <input @change="handleFileChange" type="file" id="file-input" accept="image/*"
                    style="display: none" />
                  <label for="file-input">
                    <div class="uploadBorder">
                      <el-image :src="form.avatar" style="width: 100px; height: 100px" fit="cover">
                        <template #error>
                          <div class="default">
                            <el-icon>
                              <Plus />
                            </el-icon>
                          </div>
                        </template>
                      </el-image>
                    </div>
                  </label>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="handleReset(formRef)">重 置</el-button>
                <el-button type="primary" @click="handleUpdate(formRef)">确 定</el-button>
              </div>
            </el-dialog>

            <el-descriptions :column="1" size="large" border style="flex-grow: 1">
              <el-descriptions-item label-align="center" align="center">
                <template #label>
                  <el-icon>
                    <Picture />
                  </el-icon>
                  头像
                </template>
                <el-avatar :src="userInfo.avatar" :size="100" style="font-size: clamp(1rem, 3vw, 1.5rem)">{{
                form.username
              }}</el-avatar>
              </el-descriptions-item>
              <el-descriptions-item label-align="center" align="center" v-for="item in descriptions">
                <template #label>
                  <el-icon>
                    <component :is="item.icon"></component>
                  </el-icon>
                  {{ item.label }}
                </template>
                {{ userInfo[item.key] }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
  </Layout>
</template>

<script setup>
import Layout from "@/layout/index.vue";
import { updateUser, setAvatar } from "@/api/user";
import { uploadAvatar } from "@/api/file";
import { computed, ref, reactive } from "vue";
import { useStore } from "@/store/index";
import { formatTime } from "@/utils/formatTime";
import { ElMessage } from "element-plus";

// store 状态
const store = useStore();
const isMobile = computed(() => store.isMobile);
// 变量
const userInfo = computed(() => store.userInfo);
// console.log(userInfo.value)
const user_id = userInfo.value.user_id;
// 声明响应式变量来存储图片文件和图片预览的 URL
const imageFile = ref(null);

const dialogFormVisible = ref(false);
const formLabelWidth = ref("120px");
const iconList = [
  "PriceTag",
  "User",
  "Male",
  "Message",
  "Cellphone",
  "CreditCard",
  "Paperclip",
  "Clock",
  "Clock",
];
const labelList = [
  "id",
  "用户名",
  "性别",
  "邮箱",
  "手机号",
  "身份",
  "工号",
  "注册时间",
  "上一次登录时间",
];
const descriptions = ref({});
const form = reactive({ ...userInfo.value, avatar: "" });
const formRef = ref();
const ruleList = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  email: [{ type: "email", message: "邮箱格式有误", trigger: "blur" }],
  phone_number: [
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号格式有误",
      trigger: "blur",
    },
  ],
  job_number: [
    {
      pattern: /^5013\d{4}$/,
      message: "工号格式：5013+4位编号",
      trigger: "blur",
    },
  ],
});
// 函数
// 获取用户信息
const getUserInfo = () => {
  delete form.avatar;
  const combinedArray = iconList.map((icon, index) => ({
    key: Object.keys(form)[index],
    value: Object.values(form)[index],
    icon: icon,
    label: labelList[index],
  }));
  // 将结果赋值给展示列表
  descriptions.value = combinedArray;
};
// 调用
getUserInfo();
const handleClose = () => {
  Object.assign(form, { ...userInfo.value, avatar: "" });
  dialogFormVisible.value = false;
};
// 编辑用户
const handleUpdate = async (formRef) => {
  if (!formRef) return;
  try {
    // 使用 await 等待表单验证结果
    const results = await formRef.validate();
    if (results) {
      // 修改头像
      Object.assign(form, await uploadImage(form));
      // 使用 await 等待 EditUser 函数的结果
      updateUser(form).then((res) => {
        formatTime([res]);
        delete res.password;
        localStorage.setItem("userInfo", JSON.stringify(res));
        store.setUser(res);
        dialogFormVisible.value = false;
      });
    } else {
      ElMessage.error("修改失败");
    }
  } catch (error) {
    console.error(error);
  }
};
// 重置表单
const handleReset = (formRef) => {
  if (!formRef) return;
  formRef.resetFields();
};
// 处理文件选择事件
const handleFileChange = (event) => {
  const file = event.target.files[0];
  // 将选择的文件保存到 avatar 变量中
  imageFile.value = file;
  // 将文件转换为预览的 URL
  form.avatar = URL.createObjectURL(file);
};

// 上传图片
const uploadImage = async (form) => {
  // console.log(form.value.avatar)
  // 检查是否选择了图片文件
  if (imageFile.value && imageFile.value !== "") {
    const formData = new FormData();
    formData.append("file", imageFile.value);
    // 更新数据库头像
    const res = await uploadAvatar(user_id, formData);
    if (res.data === undefined) return ElMessage.error(res.error);
    form.avatar = res.data.img_url.img_url;
    setAvatar(user_id, form.avatar);
  }
  return form;
};
</script>

<style scoped>
.container{
  padding: 50px
}
.UserContent .head {
  text-align: right;
  margin-bottom: 30px;
}

.UserContent .avatar {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--el-border-color-darker);
}

.UserContent .uploadBorder {
  /* padding: 30px 0; */
  text-align: center;
  border: 1px dashed var(--el-border-color);
  display: inline-block;
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  vertical-align: top;
}

.UserContent .uploadBorder:hover {
  cursor: pointer;
  border: 1px dashed var(--el-color-primary);
}

.demo-image__error .el-image {
  padding: 0 5px;
  max-width: 100px;
  max-height: 100px;
  width: 100%;
  height: 100%;
}

.UserContent .default {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

@media (max-width: 768px) {
  .el-dialog {
    width: 90% !important;
  }
}
</style>