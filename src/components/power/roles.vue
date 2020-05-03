<template>
<div>
 <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
       <!-- 卡片视图区域 -->
    <el-card class="box-card">
       <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe >
          <!-- 展开列 -->
          <el-table-column type="expand" >
            <template  slot-scope="scope"> 
              <!-- 按行操作 -->
              <el-row  :class="['vcenter',index1===0 ? 'dbtop' : '', 'dbbottom']" v-for="(item1, index1) in scope.row.children" :key="item1.id" >
                  <!-- 第一列 渲染一级权限 -->
                  <el-col :span="5" >
                    <!-- 里面按列依次向下排列下去 -->
                    <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第二列渲染二、三级权限 -->
                  <el-col :span="19">
                    <!-- 通过for循环，嵌套渲染二级权限 --> <!-- 按行操作 -->
                    <el-row :class="[ index2 === 0 ? '' : 'dbtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id" >
                      
                       <!-- 第二列的二级权限 -->
                       <el-col :span="6">
                         <!-- 将第一权限里面的第二级权限按列排列 -->
                         <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)"> {{item2.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                       </el-col>
                       <!-- 第二列的三级权限 -->
                       <el-col :span="18"> 
                            <el-tag v-for="item3 in item2.children" :key='item3.id' type="warning" closable @close="removeRightById(scope.row, item3.id)"> {{item3.authName}}</el-tag>
                       </el-col>
                    </el-row>
                  </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-search">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-card>
     <!-- 分配权限的对话框  show-checkbox是复选框 这里定义拿到的key是id node-key="id"-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" @close="setRightDialogClose" width="50%" >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" show-checkbox :props="treeProps" node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>  
</div>
</template>

<script>
export default {
  data(){
    return {
      //所有角色列表数据
      roleList: [],
      //分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      roleId: '',
      //获取权限的数据
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点的id值
      defKeys: []
    }
  },
  methods: {
    async getRoleList() {
      const {data} = await this.$http.get('roles')
      if(data.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.roleList = data.data
    },
    //根据id删除对应的权限
   async removeRightById(role, id) {
    //弹框提示用户是否要删除
    const confirmResult = await this.$confirm(
      '此操作要永久删除文件，是否继续?',
      '提示',
       {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    ).catch(err => err)
    if(confirmResult !== 'confirm') {
      return this.$message.info('取消了删除！')
    }
    const { data } = await this.$http.delete(
      `roles/${role.id}/rights/${id}`
    )
    if(data.meta.status !== 200) {
    return  this.$message.error('删除权限失败！')
    }
    role.children = data.data
  },
  //展示分配权限的对话框
  async showSetRightDialog(role) {
    
     this.roleId = role.id
    // //获取所有权限的数据
    const { data } = await this.$http.get('rights/tree')
    if(data.meta.status !== 200) {
      return this.$message.error('获取权限数据失败！')
    }
    //将获取到的权限数据保存到data里面
    this.rightsList = data.data
    // //递归获取三级节点的Id
    this.getLeafKeys(role, this.defKeys)
    this.setRightDialogVisible = true
    
  },
  //通过递归获取角色下所有的三级权限的id，并保存到defKeys数组中
  getLeafKeys(node, arr) {
    //如果当前node节点不包含children属性，则是三级节点
    if(!node.children) {
      return arr.push(node.id)
    }
    node.children.forEach(item => this.getLeafKeys(item,arr))
  },
  //监听分配权限对话框的关闭事件
  setRightDialogClose() {
    console.log(111)
    this.defKeys = []
  },
  //点击为角色分配权限 getCheckedKeys获取全选 getHalfCheckedKeys获取半选的函数， 拿到的第id
 async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
    
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRoleList()
      
      this.setRightDialogVisible = false
    }
  },
  created() {
    this.getRoleList()
  },
  
}
</script>
<style lang="less" scoped>
 .el-tag {
   margin: 7px
 }
 .dbtop {
   border-top: 1px solid #eee
 }
 .dbbottom {
   border-bottom: 1px solid #eee;
 }
 .vcenter {
   display: flex;
   align-items: center;
 }
 
</style>