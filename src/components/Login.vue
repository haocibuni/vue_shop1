<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登录表单区域-->
      <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 用户名是否合法
        username: [
          {required: true, message: '请输入登录名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        //  密码是否合法
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    // 点击重置按钮 重置登录表单
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async value => {
        if (value === false) return;
        const {data: res} = await this.$http.post('login', this.loginForm)

        if (res.meta.status !== 200) return this.$message.error('登录失败');
        this.$message.success('登录成功');


        // 1.将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token);
        // 2.通过编程式导航跳转到主页
       await this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

}
</style>