<template>
<div>
   <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
      title="添加商品信息"
      type="info"
      center
      :closable="false"
      show-icon>
      </el-alert>
        <!-- 步奏条 -->
      <el-steps :space="200" :active="+activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
               <el-cascader 
                expand-trigger="hover" 
                :options="cateList" 
                :props="cateProps" 
                v-model="addForm.goods_cat" 
                @change="handleChanged" 
                clearable 
                >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>  
          <el-tab-pane label="商品参数" name="1">
             <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
               <el-checkbox-group v-model="item.attr_vals" >
                <el-checkbox border :label="item" v-for="(item, index) in item.attr_vals" :key="index"></el-checkbox>
               </el-checkbox-group>
             </el-form-item>  
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
               <el-input v-model="item.attr_vals" > </el-input>
             </el-form-item>  
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台api地址
            handlePreview是指定预览的事件的回调
            handleRemove是指定删除的事件的回调
            handSuccess是文件上传成功的钩子
             -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handSuccess"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
             <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" class="btn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>  
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
    title="预览"
    :visible.sync="dialogVisible"
    width="50%"
    >
    <img :src="previewPath" alt="">
    </el-dialog>
    
 
</div>
</template>

<script>
import _ from 'lodash'
export default {
  data(){
    return {
      activeIndex:0,
      addForm:{
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        //选中后id组成的数组
        goods_cat: [],
        //图片的数组
        pics: [],
        //商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules:{
        goods_name: [
           { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
           { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_number: [
           { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_weight: [
           { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_cat: [
           { required: true, message: '哈哈哈哈', trigger: 'blur' },
        ],
      },
      //商品分类列表
      cateList: [],
      cateProps:{
        //value指定你所选中的值
        value: 'cat_id',
        //label显示你所看到值
        label: 'cat_name',
        //父子嵌套
        children: 'children'
      },
      //动态参数列表数据
      manyTableData:[],
      //静态参数列表数据
      onlyTableData:[],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      
      //图片上传组件的headers请求头对象
      headerObj: {
       Authorization: window.sessionStorage.getItem('token')
    },
    previewPath: '',
    dialogVisible: false
      
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有商品分类数据
    async getCateList() {
      const {data: res} = await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类数据失败！')
      }
      this.$message.success('获取商品分类数据成功！')
      this.cateList = res.data
      console.log(res.data);
    },
    //级联选择器选中项变化，就会触发这个函数
    handleChanged() {
      console.log(this.addForm.goods_cat);
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
      }
      
    },
    beforeLeave(activeName, oldActiveName) {
      if(this.addForm.goods_cat.length !== 3&&oldActiveName=='0'){
        this.$message.error('请先选择商品的分类！')
        return false
      }

    },
    async tabClick() {
      //如果当前点击到的是商品分类才回去发请求即activeIndex为‘1’
      if(this.activeIndex == '1') {
      const {data: res} = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: {sel: 'many'}
          }
        )
        if(res.meta.status !== 200){
          return this.$message.error('获取参数数据失败！')
        }

        res.data.forEach((item)=>{
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyTableData = res.data
        console.log(res.data);
         
        this.$message.success('获取参数数据成功！')
      } else if(this.activeIndex == '2') {
        const {data: res} = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: {sel: 'only'}
          }
        )
        console.log(res.data);
        if(res.meta.status !== 200){
          return this.$message.error('获取参数数据失败！')
        }

        this.onlyTableData = res.data
      }
    },
    //预览的事件的回调
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    //删除的事件的回调
    handleRemove(file) {
      //file就是将要被移除的图片
      //1、获取将要被移除的临时路径
      const filePath = file.response.data.tmp_path
      //2、从pic数组中找到这个图片对应的索引值
      const index = this.addForm.pics.findIndex(item=> item.pic === filePath)
      //3、调用数组的splice方法把对应的图片删除
      this.addForm.pics.splice(index, 1)
    },
    //监听图片上传成功的事件
    handSuccess(response) {
      //1、拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      //2、将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    //添加商品
    add() {
      this.$refs.addFormRef.validate( async valid=>{
        if(!valid) return this.$message.error('请填写必要的表单项！')
        //执行添加的业务逻辑
        //lodash执行深度克隆
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach(item=>{
          const newItem = {attr_id: item.attr_id, attr_val: item.attr_vals.join('')}
          this.addForm.attrs.push(newItem)
        })
        this.onlyTableData.forEach(item=>{
          const newItem = {attr_id: item.attr_id, attr_val: item.attr_vals}
          this.addForm.attrs.push(newItem)
        })

        form.attr = this.addForm.attrs
        //发起请求添加商品
        const {data: res} = await this.$http.post('goods', form)
        if(res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
        console.log(form)
      })
    }
  }
}
</script>
<style lang="less" scoped>
 .el-checkbox{
   margin: 0 5px 0 0 !important
 }
 img{
   width: 100%
 }
 .btn{
   margin-top: 5px
 }
</style>