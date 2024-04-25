<template>
  <div class="LoginContainer">
    <img
      id="LoginBackground"
      class="LoginBackground"
      src="../assets/Background.jpg"
    />

    <div id="RegisterForm" class="LoginForm">
      <el-form
        :model="registerForm"
        status-icon
        :rules="registerRuleList"
        ref="registerFormRef"
        v-loading="loading"
      >
        <div class="title">注&emsp;册</div>
        <el-form-item prop="username">
          <el-input
            clearable
            input-style="border-bottom: 1px solid var(--el-input-border-color)"
            v-model="registerForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            input-style="border-bottom: 1px solid var(--el-input-border-color)"
            type="password"
            v-model="registerForm.password"
            autocomplete="off"
            placeholder="密码"
            prefix-icon="Unlock"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="checkpassword">
          <el-input
            clearable
            input-style="border-bottom: 1px solid var(--el-input-border-color)"
            type="password"
            v-model="registerForm.checkpassword"
            autocomplete="off"
            placeholder="确认密码"
            prefix-icon="Unlock"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleRegister(registerFormRef)"
            size="large"
            >注 册
          </el-button>
        </el-form-item>
        <p style="text-align: right">
          已有账号？立即前往<a href="#" @click="toLogin">登录</a>
        </p>
      </el-form>
    </div>

    <div id="LoginForm" class="LoginForm">
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRuleList"
        ref="loginFormRef"
        v-loading="loading"
      >
        <div class="title">登&emsp;录</div>

        <el-form-item prop="username">
          <el-input
            clearable
            input-style="border-bottom: 1px solid var(--el-input-border-color)"
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            input-style="border-bottom: 1px solid var(--el-input-border-color)"
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
            placeholder="密码"
            prefix-icon="Unlock"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="verify">
          <el-input
            clearable
            input-style="border-bottom: 1px solid var(--el-input-border-color)"
            v-model="loginForm.verify"
            autocomplete="off"
            placeholder="验证码"
            prefix-icon="Unlock"
            size="large"
          >
            <template #append>
              <SIdentify @verify="handleVerify"></SIdentify>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin(loginFormRef)"
            size="large"
            >登 录</el-button
          >
        </el-form-item>
        <p style="text-align: right">
          还没账号？立即前往<a href="#" @click="toRegister">注册</a>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { Login } from "../api/login";
import { Register } from "../api/register";
import { ElMessage } from "element-plus";
import SIdentify from "../components/Sidentify.vue";
import { formatTime } from "../utils/formatTime";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store/index";

// 验证码校验
let validateVerify = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入验证码"));
  } else if (value !== imgCode.value) {
    callback(new Error("验证码不正确!"));
  } else {
    callback();
  }
};
let validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (registerForm.checkpassword !== "") {
      registerFormRef.validateField("checkpassword");
    }
    callback();
  }
};
let validateCheckPassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const router = useRouter();
const imgCode = ref("");
const loading = ref(false);

// form
const loginFormRef = ref();
const registerFormRef = ref();
const loginForm = reactive({ username: "", password: "", verify: "" });
const registerForm = reactive({
  username: "",
  password: "",
  checkpassword: "",
});
const loginRuleList = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verify: [{ validator: validateVerify, trigger: "blur" }],
});
const registerRuleList = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  checkpassword: [{ validator: validateCheckPassword, trigger: "blur" }],
});

// 触发子组件emit的函数，可以获取子组件传递的值
const handleVerify = (value) => {
  // 将子组件传递的 imgCode 传递过来，用于判断验证码是否正确
  imgCode.value = value;
};
const handleLogin = async (loginFormRef) => {
  if (!loginFormRef) return;

  const results = await loginFormRef.validate();
  if (results) {
    // 发送登录请求
    Login(loginForm).then((res) => {
      loading.value = !loading.value;
      // 获取token
      const token = res.token;
      localStorage.setItem("token", token);
      // 删除密码
      delete res.userInfo.password;
      // 处理时间格式
      formatTime([res.userInfo]);
      // 保存用户信息到本地
      const userInfo = JSON.stringify(res.userInfo);
      localStorage.setItem("userInfo", userInfo);
      loading.value = !loading.value;
      // 登录成功弹窗
      ElMessage.success(res.message);
      // 跳转至首页
      router.push("/home");
    });
  } else return ElMessage.error("登录失败");
};
const handleRegister = async (registerFormRef) => {
  if (!registerFormRef) return;
  const results = await registerFormRef.validate();
  if (results) {
    Register(registerForm).then((res) => {
      // 登录成功弹窗
      ElMessage.success(res.message);
      // 跳转至登录窗口
      toLogin();
    });
  } else return ElMessage.error("注册失败");
};
const toRegister = () => {
  const LoginBackground = document.getElementById("LoginBackground");
  const LoginForm = document.getElementById("LoginForm");
  const RegisterForm = document.getElementById("RegisterForm");
  LoginForm.style.display = "none";
  RegisterForm.style.display = "inherit";
  LoginBackground.style.transform = "translateX(100%)";
  RegisterForm.style.transform = "translateX(-100%)";
};
const toLogin = () => {
  const LoginBackground = document.getElementById("LoginBackground");
  const LoginForm = document.getElementById("LoginForm");
  const RegisterForm = document.getElementById("RegisterForm");
  RegisterForm.style.display = "none";
  LoginForm.style.display = "inherit";
  LoginBackground.style.transform = "translateX(0)";
};
</script>

<style>
/* 添加媒体查询，当窗口宽度小于 300px 时隐藏 .item2 */

.LoginContainer {
  position: absolute;
  display: flex;
  background-color: var(--el-bg-color-overlay);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 1000px;
  height: 500px;
}

@media (max-width: 1100px) {
  .LoginContainer {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .LoginBackground {
    display: none;
  }
  #RegisterForm {
    transform: translateX(0) !important;
  }
}

.LoginBackground {
  width: 50%;
  height: 100%;
  z-index: 99;
  transition: transform 0.5s ease;
}

#RegisterForm {
  display: none;
  transition: transform 0.5s ease;
}

#RegisterForm .el-input__wrapper {
  box-shadow: 0 0 0 0 !important;
}

#LoginForm .el-input__wrapper {
  box-shadow: 0 0 0 0 !important;
}

#RegisterForm {
  transition: transform 0.5s ease;
}

.LoginContainer .LoginForm {
  width: 50%;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.LoginContainer .title {
  font-size: 26px;
  font-family: "Microsoft YaHei";
}

.LoginContainer .el-button {
  width: 100%;
  border-radius: 20px;
}

.LoginContainer .el-form .el-form-item {
  width: 300px;
  margin: 0 auto;
  padding: 20px 0;
}

/* 删除验证码边框边距 */
.LoginContainer .LoginForm .el-input-group__append,
.el-input-group__prepend {
  padding: 0;
}
</style>
