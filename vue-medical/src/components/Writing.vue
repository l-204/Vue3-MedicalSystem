<template>
  <div class="editor">
    <el-form v-model="form" style="display: flex; flex-direction: column; height: 100%">
      <el-form-item>
        <el-input v-model.number="form.to_id" placeholder="请输入用户id"
          input-style="border-bottom: 1px solid var(--el-input-border-color)"><template
            #prefix>收件人：</template></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.topic" placeholder="请输入邮件主题"
          input-style="border-bottom: 1px solid var(--el-input-border-color)"><template
            #prefix>主&emsp;题：</template></el-input>
      </el-form-item>
      <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
      </div>
      <div style="overflow-y: auto; height: 100%">
        <Editor v-model="form.content" :defaultConfig="editorConfig" @onCreated="handleCreated" />
      </div>
      <div style="text-align: left; padding: 10px">
        <el-button type="primary" @click="handleSubmit()" icon="Promotion">发送</el-button>
        <el-button @click="handleSave()" icon="MessageBox">存草稿</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {
  onBeforeUnmount,
  ref,
  reactive,
  shallowRef,
  onMounted,
  toRefs,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getUserIdList } from "@/api/user";
import { setEmail } from "@/api/email";
import { ElMessage } from "element-plus";

const props = defineProps({ emailForm: Object });
onMounted(() => console.log(props));
const { emailForm } = toRefs(props);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const form = reactive({
  from_id: userInfo.user_id,
  to_id: "",
  topic: "",
  content: "",
  attachment: "",
  state: "",
  ...emailForm.value,
});

const toolbarConfig = {
  // toolbarKeys,
  excludeKeys: ["fullScreen"],
};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

let userIdList = [];
getUserIdList().then((res) => {
  userIdList = userIdList.concat(res);
});

const handleSubmit = async () => {
  if (userIdList.indexOf(+form.to_id) === -1)
    return ElMessage.error("找不到该用户！");
  Object.assign(form, { state: "未读" });
  setEmail(form)
    .then(() => ElMessage.success("发送成功！"))
    .catch((err) => ElMessage.error("发送失败！"));
};

const handleSave = () => {
  if (userIdList.indexOf(+form.to_id) === -1)
    return ElMessage.error("找不到该用户！");
  Object.assign(form, { state: "草稿" });
  setEmail(form)
    .then(() => ElMessage.success("存入成功！"))
    .catch((err) => ElMessage.error("存入失败！"));
};
</script>

<style>
@media (max-width: 768px) {
  .editor {
    margin-left: 0 !important;
  }
}

.editor {
  width: 100%;
  height: 100%;
}

/* 编辑器和文本框的背景颜色和文本颜色 */
.w-e-toolbar {
  background-color: var(--bPageBgColor) !important;
  color: var(--bTextColor) !important;
}

.w-e-text-container {
  background-color: var(--bPageBgColor) !important;
  color: var(--bTextColor) !important;
  /* overflow-y:auto !important; */
}

/* 去掉输入框边框 */
.editor .el-input__wrapper {
  box-shadow: 0 0 0 0 !important;
}
</style>
