<template>
<div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card class="box-card">
  <!-- 搜索框 -->
  <el-row :gutter="10">
    <el-col :span="8">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearSearch"  class="input-with-select">
         <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </el-col>

    <el-col :span="4"> 
      <el-button type="primary" @click="goToAddPage">添加商品</el-button>
    </el-col>
  </el-row>
   <!-- table表格区域 -->
   <el-table
    border
    stripe
    :data="tableData"
    style="width: 100%">
    <el-table-column
      type="index"
      >
    </el-table-column>
    <el-table-column
      prop="goods_name"
      label="商品名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_price"
      label="商品价格(元)"
      width="180">
    </el-table-column>
    <el-table-column
      prop="goods_weight"
      label="商品重量">
    </el-table-column>
    <el-table-column
      label="创建时间">
      <template slot-scope="scope"> 
        {{scope.row.add_time | dateFormat}}
      </template>
    </el-table-column>
     <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-edit"
          type="primary"
          >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="deleteItem(scope.row.goods_id)"
         >删除</el-button>
      </template>
    </el-table-column>
  </el-table> 

   <!--分页区  -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
 
</el-card>
</div>
</template>

<script>
export default {
  data(){
    return {
      queryInfo: {
        //查询参数
        query: '',
        //当前页码
        pagenum: 1,
        //每页显示的条数
        pagesize: 8
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getListData()
  },
  methods: {
   async getListData() {
     const {data: res} = await this.$http.get(`goods`, {params:this.queryInfo})
     this.tableData = res.data.goods
     console.log(res.data.goods);
     this.total = res.data.total
     if(res.meta.status !== 200) {
      return this.$message.error('获取数据失败！')
     }
     this.$message.success('获取数据成功！')
    },
    //每页显示条数的事件，用来显示改变每页显示数据的条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getListData()
    },
    //当前页码变动触发的函数，用来显示相应的页码的内容
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getListData()

    },
    search() {
      this.getListData()
    },
    async deleteItem(id) {

      const confirmResult = await this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)

      if(confirmResult !== 'confirm'){
        return this.$message.info('取消删除！')
      }
      const {data: res} = await this.$http.delete(`goods/${id}`)
      if(res.meta.status !== 200){
       return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')

      this.getListData()
        
    },
    clearSearch() {
      this.getListData()
    },
    goToAddPage() {
      this.$router.push('/addGoods')
    }
  }
}
</script>
<style lang="less" scoped>
 
</style>