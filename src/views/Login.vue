<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo区域 -->
      <div class="login-logo">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 表单区域 -->
      <div>
        <!-- 为了表单里能输入内容 -->
        <!-- 在表单el-form中加上:model='form'，在el-input中加上v-model='form.name' -->
        <!-- 这里定义好的model在下面export中一定要有 -->
        <el-form
          :model="form"
          :rules="rules"
          ref="LoginForm"
          class="login-form"
        >
          <el-form-item prop="username">
            <!-- 属性方法插入图标 -->
            <el-input
              v-model="form.username"
              prefix-icon="el-icon-s-custom"
              style="font-size: 18px"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="form.password" clearable type="password">
              <!-- 插槽的方法插入图标 -->
              <i
                slot="prefix"
                class="el-input__icon el-icon-lock"
                style="font-size: 18px"
              ></i>
            </el-input>
          </el-form-item>

          <el-form-item class="login-form-btn">
            <el-button type="primary" @click="loginSubmit">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // name的值一般跟当前文件名一样
  name: "Login",
  created() {
    console.log(this.$root);
  },
  data() {
    return {
      //   form里的参数要跟文档里要求的一样
      form: {
        username: "admin",
        password: "123456",
      },

      //校验规则，名字和data上面的属性名称保持一致
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //登录的方法
    loginSubmit() {
      // $refs是组件实例里的一个对象，如果要在vue里操作某个dom节点，需要在dom里加上ref='xx'，然后就可以通过this.$refs.xx来获取这个dom节点，validate是element-ui里的一个form methods
      //validate	对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.LoginForm.validate(async (a, b) => {
        //验证输入的格式是否符合上面定的规则
        //不符合
        if (!a) return this.$message.error("登录失败，请检查输入内容");

        //async是跟着await就近的函数写的

        //符合
        // 使用对象的结构得到的res就是键为data的值
        const { data: res } = await this.$http.post("/login", {
          username: this.form.username,
          password: this.form.password,
        });

        // this.$message.error('xx')是element-ui提供的提示组件
        // res.meta.status是请求失败时请求里的信息
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

        // 登陆成功后把token值保存在本地
        window.localStorage.setItem("heima_token", res.data.token);

        // 编程式导航
        // this.$router.push(path): 相当于点击路由链接(可以返回到当前路由界面)
        this.$router.push("/home");

        // console.log(res);

        // this.$http
        //   .post("/login", {
        //     username: this.form.username,
        //     password: this.form.password,
        //   })
        //   .then(
        //     (res) => {
        //       console.log("请求成功");
        //     },
        //     (err) => {
        //       console.log("请求失败");
        //     }
        //   );
      });
    },

    // resetFields	对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    resetLoginForm() {
      console.log(this);
      this.$refs.LoginForm.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;

  .login-logo {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    border: 1px solid rgb(213, 208, 208);
    box-shadow: 0 0 6px rgb(213, 208, 208);
    background-color: #fff;
    box-sizing: border-box;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .login-form-btn {
      text-align: right;
    }
  }
}
</style>