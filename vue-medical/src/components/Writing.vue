<template>
  <div class="editor">
    <el-input
      input-style="border-bottom: 1px solid var(--el-input-border-color)"
      ><template #prefix>收件人：</template></el-input
    >
    <el-input
      input-style="border-bottom: 1px solid var(--el-input-border-color)"
      ><template #prefix>主&emsp;题：</template></el-input
    >
    <Toolbar
      style=""
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    // console.log(editorRef.config)

    // 内容 HTML
    const valueHtml = ref("<p>hello</p>");

    // 模拟 ajax 异步获取内容
    onMounted(() => {
      setTimeout(() => {
        valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
      }, 1500);
    });

    const toolbarConfig = {};
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

    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
    };
  },
};
</script>

<style>
@media (max-width: 768px) {
  .editor {
    margin-left: 0 !important;
  }
}

.editor {
  /* position:absolute; */
  width: 100%;
  height: 100%;
  /* border: 1px solid #ccc; */
  /* margin:60px 0 0 64px; */
}

/* 编辑器和文本框的背景颜色和文本颜色 */
.w-e-toolbar {
  background-color: var(--bPageBgColor) !important;
  color: var(--bTextColor) !important;
}

.w-e-text-container {
  background-color: var(--bPageBgColor) !important;
  color: var(--bTextColor) !important;
}

/* 去掉输入框边框 */
.editor .el-input__wrapper {
  box-shadow: 0 0 0 0 !important;
}
</style>
