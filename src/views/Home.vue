<template>
  <el-container>
    <el-header>
      <!-- 头部区域， 分为左右两个部分 -->
      <div class="logo-left">
        <img src="../assets/heima.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '64px' : '200px'">
        <!--给menu加上router  router是menu上的一个属性  表示是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!--设置 :default-active='xx'  默认xx（是个路由）就会高亮 -->
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          router
        >
          <div class="toggle-menu" @click="collapse = !collapse">|||</div>
          <!-- item.id.toString()    1 + ''   String()-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <!-- <i :class="item.icon"></i>工作里面一般的后端们都会把图标返回给我们 -->
              <i :class="iconList[item.id]"></i>
              <span class="icon-text">{{ item.authName }}</span>
            </template>

            <!-- menu-item的index属性值就是点击该导航跳转的路由地址 -->
            <!-- 打印item可以发现在他的children里面有个path属性的值就是一个路由 -->
            <!-- 注意index需要写成:index -->
            <el-menu-item
              v-for="childItem in item.children"
              :index="'/' + childItem.path"
              :key="childItem.id"
              @click="goNewPage('/' + childItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ childItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--welcome页面的路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  //   一进页面就要请求数据渲染左侧导航栏
  created() {
    //在钩子函数里调用请求数据的函数
    this.getMenuList();
    //
    if (this.$route.redirectedFrom === "/home") {
      this.activePath = "";
    } else {
      this.activePath = window.sessionStorage.getItem("activePath") || "/users";
    }
  },
  data() {
    return {
      menuList: [],
      activePath: "",
      collapse: false, //这个是是否折叠和展开的变量
      iconList: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
    };
  },

  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      //   console.log(res);
      //   请求失败时
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      //请求成功
      this.menuList = res.data;
    },
    loginOut() {
      //退出功能不用发请求，只需要删除token值，有路由导航守卫，可以控制页面的访问权限
      window.localStorage.clear(); //清空所有token
      this.$router.push("/login"); //让页面跳转到登录页面
    },

    goNewPage(val) {
      this.activePath = val;
      window.sessionStorage.setItem("activePath", val);
    },
  },
};
</script>

<style lang="less" scoped>
// scoped 是表示当前页面的样式，只在当前页面生效，其他页面即使使用了同名的样式，也不会被覆盖； 莹这样写代码，就会在生成dom结构的时候，给每个dom节点，添加一个自定义带有一个hash字符串的属性，然后vue在给每个样式 添加一个属性选择器
// 比如我们代码里面写的是 el-container 但是最终的效果是 el-container[data-v-adfefw21]
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-left {
    margin-left: -20px;
    font-size: 21px;
    display: flex;
    align-items: center;
    // vertical-align: middle;
    // line-height: 60px;
    img {
      height: 60px;
    }
    span {
      color: #fff;
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #373d41;
}
.el-menu {
  border-right: none;
  .toggle-menu {
    padding: 5px 0;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    // 每个字符的间距  em rem px
    letter-spacing: 0.2em;
    background-color: rgb(84, 83, 83);
  }

  .toggle-menu {
    color: #fff;
  }
}
.el-submenu {
  .icon-text {
    margin-left: 8px;
  }
  .iconfont {
    font-size: 20px;
  }
}
</style>