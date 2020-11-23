<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体内容部分 -->
    <el-card>
      <!-- 搜索区域 -->
      <!-- gutter是element-ui中layout布局提供的设置每一栏之间的间隔的属性 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input
            v-model="query"
            clearable
            @clear="getUsersList"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button></el-col
        >
      </el-row>

      <!-- 表格区域 -->
      <!-- element-ui提供的表格组件   data绑定所有的数据，prop接受的是每个数据的键，lable是第一列的类型  stripe是隔行变色 border是给表格加边框-->
      <el-table :data="userslist" style="width: 100%" stripe border>
        <!-- 饿了么提供的自定义索引号 type='index' :index='x' 从x开始 -->
        <!-- 不写:index默认从1开始，值还可以是个方法 -->
        <el-table-column type="index" :index="1" label="#"></el-table-column>

        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_status" label="状态">
          <!--slot-scope 作用域插槽   scope.row可以获取所有的数据  scope.row.mg_status获取每一行的状态 -->
          <template slot-scope="scope">
            <!-- 状态开关  饿了么提供的switch开关 -->
            <!-- @change后面绑定的事件是可以传参的，如果不传参，默认接收的是开关状态(true/false)  这里我们传scope.row（点击的那个开关那一行的所有数据）-->
            <el-switch
              @change="toogleStatus(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 修改 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>

            <!-- 饿了么的tooltip文字提示组件 -->
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-star-off"
                circle
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <!-- layout里每个属性都是分页的一个小组件(功能) -->
      <!-- pagenum 当前页面在第几页，pagesize 当前每页多少条 [1，2，3，4]设置分页里有哪些可选项  total是数据总数  数据在data里-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
      width="50%"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100%"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button @click="addUsersData">确认</el-button>
        </span>
      </el-form>
    </el-dialog>

    <!-- 修改按钮弹出框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="50%"
    >
      <el-form
        :model="editRuleForm"
        :rules="rules"
        ref="editRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editRuleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBtnUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色弹出框 -->
    <el-dialog
      title="角色分配"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="rolesDialogClose"
    >
      <div v-if="userInfo">
        <div>用户名称：{{ userInfo.username }}</div>
        <div>用户角色：{{ userInfo.role_name }}</div>
        <div>
          角色列表：
          <!-- form表单里的下拉框 -->
          <el-select v-model="selectedRoles" clearable placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBtnUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",

  created() {
    //这里不要忘了加this
    this.getUsersList();
  },

  data() {
    //邮箱的自定义校验规则
    var chkEmial = (rule, value, callback) => {
      var emailPattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!emailPattern.test(value)) return callback(new Error("邮箱格式错误"));
      callback();
    };

    //手机号的自定义校验规则
    var chkMobile = (rule, value, callback) => {
      var mobilePattern = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (!mobilePattern.test(value))
        return callback(new Error("手机格式错误，请重新输入"));
      callback();
    };

    return {
      query: "", // query是接口文档里的查询参数
      pagenum: 1, //当前页码
      pagesize: 3, //当前每页条数
      userslist: [], //页面表格数据，是个数组
      total: 0, //总数据条数

      // 三个弹框的显示状态，初始化不显示
      dialogVisible: false,
      editDialogVisible: false,
      addRolesDialogVisible: false,

      //添加用户弹窗表单数据
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      editRuleForm:{}, //修改按钮弹窗表单数据

      // 分配角色按钮弹窗
       userInfo: null,
      selectedRoles: "",
      rolesList: [],

      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],

        // 自定义邮箱、手机校验规则
        email: [{ validator: chkEmial, trigger: "blur" }],
        mobile: [{ validator: chkMobile, trigger: "blur" }],
      },


    };
  },

  methods: {
    // 发请求获取页面表格数据
    async getUsersList() {
      const { data: res } = await this.$http.get("/users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      console.log(res);
      // 如果请求失败
      // this.$message.error()是element-ui提供的错误提示组件
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      //请求成功,把数据库的数据渲染到页面上
      this.userslist = res.data.users;
      this.total = res.data.total; //数据总数
    },
    
    //编辑操作
    handleEdit() {

    },

    //删除操作
    handleDelete() {},

    //当前每页显示多少条val打印的就是几
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      //把当前页面显示的条数赋值给pagesize  调用请求
      this.pagesize = val;
      this.getUsersList();
    },

    //当前在第几页val打印的就是几
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUsersList();
    },

    //switch开关状态改变触发的回调函数
    // 发请求  async和await配合使用
    async toogleStatus(val) {
      const { data: res } = await this.$http({
        // 注意：发请求里请求类型是method，vue里的方法是methods
        method: "PUT",
        // 这个地址是动态路由，真正发请求时一定要换算为真实的值
        // url:'/users/:uId/state/:type'
        url: `/users/${val.id}/state/${val.mg_state}`,
      });
      //把res打印看看
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      //请求成功
      return this.$message.success(res.meta.msg);
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin: 15px 0;
}
.el-table {
  margin: 10px 0;
}
</style>