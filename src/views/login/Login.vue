<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像图标 -->
      <div class="logo-box">
        <img src="@/assets/imgs/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" prefix-icon="fas fa-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="fas fa-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login-btns">
          <el-button @click="submitLoginForm" type="primary">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入网络请求
import { postLoginForm } from 'network/login';
export default {
  name: 'Login',
  data() {
    return {
      // 表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // /验证密码是否合法
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 表单重置
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 表单预验证
    // validate()传一个回调函数，回调函数有两个参数
    // 第一个参数是一个布尔值
    submitLoginForm() {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return false
        } else {
          this.postForm()
        }
      });
    },
    // 请求数据
    postForm() {
      postLoginForm(this.loginForm).then(res => {
        if (res.meta.status !== 200) {
          return this.$message({
            message: '登录失败',
            type: 'error'
          });
        } else {
          this.$message({
            message: '登录成功',
            type: 'success',
            duration: 2000
          });
          // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
          //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
          //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
          window.sessionStorage.setItem('token', res.data.token);
          // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
          this.$router.push('/home')
        }
      })
    }

  },
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    // 头像图标样式
    .logo-box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    // 表单样式
    .login-form {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      // 输入框样式
      // 按钮样式
      .login-btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>