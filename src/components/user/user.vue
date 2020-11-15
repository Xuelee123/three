<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加与搜索区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter.native="getUserList">
              <el-button slot="append"  icon="el-icon-search" @click="getUserList" ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisiable=true">添加用户</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-upload
              class="upload-demo"
              style="display:inline"
              action="#"
              :file-list="[]"
              :before-upload="eventImport"
              :http-request="httpRequest"
              :show-file-list="false"
              >
              <el-button size="small" type="primary">上传json</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 第一列 -->
        <el-table-column prop="username" label="姓名666" width="100"></el-table-column>
        <!-- 第二列 -->
        <el-table-column prop="email" label="邮箱666" width="150"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
        <!-- 状态列 -->
        <el-table-column label="状态" width="150"> 
          <template slot-scope="scope">
            <!-- 这里的change事件是随着v-model的值变化触发的 -->
            <!-- scope.row 是这一行的数据-->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <!-- 修改按钮 scope.row.id就是按钮所在行的id -->
            <el-button
              type="primary"
              @click="showEditDialog(scope.row.id)"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              @click="removeUserById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 tooltip文字提示-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
             <el-button
              type="danger"
              @click="exportData(scope.row)"
              icon="el-icon-document"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :inline="true" :visible.sync="addDialogVisiable" width="50%" @close="addDialogClose">
      <!-- 内容主体区域 -->
      <div style="font-size: 20px">xxx区域:</div>
      <el-form :model="addForm" :rules="addFormRules" :inline="true"  ref="addForm" label-width="80px">
        <div style="margin-left:80px; border:1px dashed #000">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱333" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
          </div>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisiable"
      width="50%"
      @close="eidtDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="eidtFormRules"
        ref="editaddFormRef"
        label-width="100px"
        class="demo-addForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClose">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  data() {
    //验证邮箱的规则
    const checkEmail = (rule, value, cb) => {
      //
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        //合法对象
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证号码的规则
    const checkmobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        //合法对象
        return cb();
      }
      cb(new Error("请输入合法的号码"));
    };
    return {
      queryInfo: {
        query: "",
        //当前的 页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 10
      },
      addForm: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },
      //增加对话框的校验规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      },
      userList: [],
      total: 0,
      //控制对话框的显示与隐藏
      addDialogVisiable: false,
      editDialogVisiable: false,
      editForm: {},
      //修改对话框的校验规则
      eidtFormRules: {
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      },
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      //角色列表
      rolesList: [],
      //已选中的id值
      selectedRoleId: ''
    };
  },
  created() {
    // 初始化就调用获取用户列表的方法
    this.getUserList();
  },
  methods: {
    async httpRequest(){
      console.log('执行的次数', 111111111111111111)
       const { data } = await this.$http.post("users", this.needResult);
       console.log('返回值========', data)
        if (data.meta.status !== 201) {
          return this.$message.error("导入用户失败！");
        }
        this.$message.success("导入用户成功！");
      // this.$emit('import')
    },
    // 处理函数
    async eventImport(file) {
      const res = await this.importData(file)
      console.log('导入的json数据=====', typeof(res))
      const needResult = JSON.parse(res)
      this.needResult = needResult
      console.log(6666666)
      // this.httpRequest(needResult)
      return false
    },
    //导入函数，返回json数据
    async importData(data) {
        return new Promise(
          function(resolve, reject) {
            const reader = new FileReader()
            reader.readAsText(data)
            reader.onload = function() {
              // const str = e.target.result
              // const jsonData = JSON.parse(decodeURIComponent(window.atob(str)))
              resolve(this.result)
            }
          }
        )
      },
    //导出json
    exportData(row){
      const data = JSON.stringify(row)
      const blob = new Blob([data], {type: ''})
      FileSaver.saveAs(blob, 'hahaha.json')
    },
    // 获取用户列表的方法
    async getUserList() {
      const { data } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (data.meta.status !== 200)
        return this.$message.error("获取用户列表数据失败");
      this.total = data.data.total;
      // 这里讲data里的用户列表给赋值
      this.userList = data.data.users;
      console.log(data.data.users)
    },
    //监听switch开关状态的改变,put是改变状态的请求
    async userStateChange(userinfo) {
      //console.log(userinfo);这里userinfo获取的是前端的发过来的 
      //put请求改变状态
      const { data } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      //这个data是发送修改请求后返回的值
      //console.log(data);
      if (data.meta.status !== 200) {
        //如果更新状态失败了，要前端的mg_state状态值要改变回原样
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新状态数据成功");
    },
    //监听pageSize改变的事件
    handleSizeChange(newSize) {
      console.log( '==================',this.queryInfo)
      console.log( '==================85858',this.queryInfo.pagenum)
      console.log( '==================9999999',newSize)
      this.queryInfo.pagesize = newSize;
      //重新获取一下数据
      this.getUserList();
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage)
      this.queryInfo.pagenum = newPage;
      //重新获取一下数据
      this.getUserList();
    },
    //监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addForm.resetFields();
    },
    //点击按钮，添加新用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        //这个valid是一个布尔值，通过了表单的验证就是true
        //否则就是false
        if (!valid) return;
        //通过了就可以发起添加用户的请求
        console.log(this.addForm.mobile);
        const { data } = await this.$http.post("users", this.addForm);
        if (data.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        //隐藏添加用户的对话框
        this.addDialogVisiable = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      //发送请求获取那一行的数据
      const { data } = await this.$http.get("users/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      //将那一行的数据赋值给editForm对象故这里的editForm里的对象的名字需要和data.data里面的一样
      this.editForm = data.data;
      this.editDialogVisiable = true;
    },
    //监听修改用户对话框的关闭事件
    eidtDialogClosed() {
      this.$refs.editaddFormRef.resetFields();
    },
    editUser() {
      this.$refs.editaddFormRef.validate(async valid => {
        if (!valid) return;
        //通过了就发起修改用户信息数据的请求
        const { data } = await this.$http.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        });
        if (data.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
       
        //隐藏修改用户的对话框
        this.editDialogVisiable = false;
        //重新获取用户列表数据
        this.getUserList();
        this.$message.success("更新用户信息成功");
      });
    },
    //删除用户
    async removeUserById(id) {
      //先弹框提示是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //如果用户确认删除，则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      //console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data } = await this.$http.delete("users/" + id);
      if (data.meta.status !== 200) {
        return this.$message.error("删除用户信息失败");
      }
      this.$message.success("删除用户信息成功");
      this.getUserList();
    },
    //设置角色
    async setRole(user) {
      this.userInfo = user
      // 在展示对话框之前，获取所有角色的列表
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = data.data

      this.setRoleDialogVisible = true
    },
    //点击确定将分配角色
  async saveRoleInfo() {
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色！')
      }
      //如果用户已经选择了要分配的角色，则发请求改变角色
    const {data} = await this.$http.put(`users/${this.userInfo.id}/role`,
      {
          rid: this.selectedRoleId
       })
       console.log(data);
       if(data.meta.status !== 200) {
         return this.$message.error('更新角色失败！')
       }
        this.$message.success('更新角色成功！')
       this.getUserList();
       this.setRoleDialogVisible = false
  },
  setRoleDialogClose() {
      this.selectedRoleId= ''
      this.userInfo= {}


  }
  }
};
</script>
<style lang="less" scoped>
</style>