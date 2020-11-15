<template>
<div>
  <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="goodsChosen">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
           <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <!-- <el-cascader 
          expand-trigger="hover" 
          :options="catelist" 
          :props="cateProps" 
          v-model="selectedKeys" 
          @change="handleChanged" 
          clearable 
          >
          </el-cascader> -->
           <el-select multiple collapse-tags v-model='selectedArray' @change='changeSelect' placeholder='请选择吧'>
            <el-checkbox v-model="checked" @change='selectAll'>全选</el-checkbox>
            <el-option v-for='(item, index) in options' :key='index' :label='item.label' :value='item.name'></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- tab页面区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addParams">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" >
               <template slot-scope="scope" >
                 <!-- 循环渲染tag标签 -->
                 <el-tag closable @close="handleClose(index, scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="index" >
                   {{item}}
                 </el-tag>
                 <!-- 输入的文本框 -->
                 <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
               </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addParams">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" >
               <template slot-scope="scope" >
                 <!-- 循环渲染tag标签 -->
                 <el-tag closable @close="handleClose(index, scope.row)" v-for="(item, index) in scope.row.attr_vals" :key="index" >
                   {{item}}
                 </el-tag>
                 <!-- 输入的文本框 -->
                 <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
               </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <!-- 属性名称列 -->
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>    
    </el-card>
    <!-- 添加属性的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="DialogVisible" width="50%" @close="addDialogClose">
       <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="decideAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="EditDialogVisible" width="50%" >
       <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="EditForm.attr_name"></el-input>
          </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="decideEditParams">确 定</el-button>
      </span>
      <!--  -->
    </el-dialog>    
</div>
</template>

<script>
export default {
  data(){
    return {
        selectedArray: [],
       options: [
        { name: '一一', label: 'one' },
        { name: '二二', label: 'tow' },
        { name: '三三', label: 'three' },
        { name: '四四', label: 'four' },
        { name: '五五', label: 'five' },
      ],
      catelist:[],
      //指定级联选择器的配置对象
      cateProps: {
        //value指定你所选中的值
        value: 'cat_id',
        //label显示你所看到值
        label: 'cat_name',
        //父子嵌套
        children: 'children'
      },
      selectedKeys: [],
      //被激活的页签名称
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      DialogVisible: false,
      //控制比编辑对话框的显示
      EditDialogVisible: false,
      //要添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      EditForm: {
        attr_name: ''
      },
      //添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入分类名称", trigger: "blur"}
        ]
      },
      //添加表单的验证规则对象
      EditFormRules: {
        attr_name: [
          { required: true, message: "请输入分类名称", trigger: "blur"}
        ]
      }
      

    }
  },
  created(){
    this.getCateList()
  },
  methods: {
    //删除扩展栏下的标签
    handleClose(index, row) {
      console.log(row.attr_vals)
      row.attr_vals.splice(index, 1)
      console.log(row.attr_vals)
      this.saveAttr_vals(row)
      console.log('删除操作');
    },
    //el-input 框的失焦或者按下enter键的回调
   async handleInputConfirm(row) {
      //解决input框中存在space空格问题
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      //如果输入的值不是空格则将其加入到数组中去
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      console.log('按下了或失焦了');
     this.saveAttr_vals(row)
    },
    //保存数据的函数
   async saveAttr_vals(row) {
      //发起请求保存数据
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
      {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if(res.meta.status !== 200) {
        return this.$message.error('修改数据失败！')
      }
      this.$message.success('修改数据成功！')
    },
    //显示input输入框
    showInput(row) {
      row.inputVisible = true
      //当页面重新渲染完毕后才会调用$nextTick函数
      //此时才能获取到页面中的input元素才不会报错，否则报错
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //修改属性名称的对话框
  decideEditParams() {
    this.$refs.EditFormRef.validate(async valid => {
      if(!valid) return
      const {data} = await this.$http.put(`categories/${this.cateId}/attributes/${this.EditForm.attr_id}`,{
        attr_name: this.EditForm.attr_name,
        attr_sel: this.activeName
      })

      if(data.meta.status !== 200) {
        return this.$message.error('修改参数失败！')
      }
      this.$message.success('修改参数成功！')
      this.getParamsData()
      this.EditDialogVisible = false
    })
  },
    //点击修改的对话框
  showEditDialog(info) {
    this.EditForm=info
    this.EditDialogVisible = true

  },
    //点击确认按钮，添加参数
    decideAddParams() {
      this.$refs.addFormRef.validate(
       async valid => {
          if(!valid) return 
        const {data} =await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        if(data.meta.status !== 201){
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功')
        this.DialogVisible = false
        this.getParamsData()
        }
      )
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    EditDialogClose() {
      this.$refs.EditFormRef.resetFields()
    },
    addParams() {
      this.DialogVisible = true
    },
     //获取商品分类数据
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      //获取商品分类成功则将数据赋值给catelist
    
      this.catelist = data.data
      
    },
    //选择项发生变化了会触发的函数
    handleChanged() {
      this.getParamsData()
    },
   async getParamsData() {
      //证明选中的不是三级分类
      if(this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        return
      }
      //根据所选分类的id和当前所处的的面板 来获取对应的参数
      const {data} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params: {
            sel: this.activeName
          }
        })
        if(data.meta.status !== 200) {
          return this.$message.error('获取参数列表失败！')
        }
      
      data.data.forEach(item => {item.attr_vals= item.attr_vals? item.attr_vals.split(' ') : []
      //控制文本框的显示与隐藏
      item.inputVisible = false
      //控制input框的内容
      item.inputValue = ''
      })
      
        if(this.activeName === 'many'){
          this.manyTableData = data.data
        } else {
          this.onlyTableData = data.data
        }
    },
    //tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
      console.log(this.activeName);

    },
    removeParams(attr_id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //点击了确定按钮就开始发送请求
          console.log(11111);
          const res = await this.$http.delete(
            `categories/${this.cateId}/attributes/${attr_id}`
          )
         
          console.log(res);
          const {data: result} = res
          
          // 删除的业务逻辑
      // const { data: result } = await this.$http.delete(
      //   `categories/${this.cateId}/attributes/${attr_id}`
      // )
          
          

          if(result.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }
          this.$message.success('删除参数成功！')

          this.getParamsData()

          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          });
          
          
    }
   
  
  }, 
  //计算属性用来判断是否需要禁用button
   computed:{
      isBtnDisabled() {
        if(this.selectedKeys.length !== 3) {
          return true
        } else{
          return false
        }
      },
      //当前选中的三级分类id
      cateId() {
        if(this.selectedKeys.length === 3){
          return this.selectedKeys[2]
        }
        return null
      },
      titleText() {
        if(this.activeName === 'many'){
          return '动态参数'
        } 
        return '静态属性'
      }
    },
    
}
</script>
<style lang="less" scoped>
 .goodsChosen{
   margin: 15px 0
 }
 .input-new-tag{
   width: 100px;
   
 }
 .el-tag{
   margin:0 10px;
 }
</style>