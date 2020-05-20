<template>
<div>
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图区域 -->
<el-card class="box-card">
  <el-input placeholder="请输入内容"  style="width: 400px">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
<!-- 表单区域 -->
  <el-table
    ref="singleTable"
    border
    stripe
    :data="tableData"
    highlight-current-row
    style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column
      property="order_number"
      label="订单编号"
      width="200">
    </el-table-column>
    <el-table-column
      property="order_price"
      label="订单价格"
      width="120">
    </el-table-column>
    <el-table-column
      property="order_pay"
      label="是否付款">
      <template slot-scope="scope">
        <el-tag type="danger">{{scope.row.order_pay==0? '未付款' : "已付款"}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      property="is_send"
      label="是否发货">
    </el-table-column>
    <el-table-column
      label="下单时间"
      width="200">
      <template slot-scope="scope">
       {{scope.row.create_time | dateFormat}}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      width="200">
      <template >
       <el-button
          size="mini"
          icon="el-icon-edit"
          type="primary"
          @click="showDialog"
          >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-location"
         @click="showProgressBox"
         >订单进度</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
  </el-pagination>
</el-card>
<!-- 修改地址的对话框 -->
<el-dialog title="修改地址" :visible.sync="dialogFormVisible" @close="addressDialogClosed">
  <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" >
    <el-form-item label="省市区/县" prop="address1" >
      <el-cascader
      :options="cityData"
      v-model="addressForm.address1"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="address2" >
       <el-input v-model="addressForm.address2" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog> 

<!-- 展示物流进度的对话框 -->
<el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="50%"
  >
  <!-- timeline时间线 -->
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  
</el-dialog>
</div>

</template>

<script>
import cityData from './citydata'
export default {
  data(){
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
           { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
           { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      progressVisible: false,
      progressInfo: []
      
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
   async getOrderList() {
     const {data: res} = await this.$http.get('orders',{
        params:this.queryInfo
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      this.tableData = res.data.goods
      this.total = res.data.total
      this.$message.success('获取订单列表成功！')
      
    },
    handleSizeChange(newSize) {
    this.queryInfo.pagesize = newSize
    this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    showDialog() {
      this.dialogFormVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgress() {
      console.log(111)
       const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      console.log(res)
     //const {data: res} = await this.$http.get('/kuaidi/804909574412544580')
        console.log(22222)
     if(res.meta.status !== 200) {
      return this.$http.error('获取物流进度失败！')
     }
  
     this.progressInfo = res.data
     this.$http.success('获取物流进度成功！')
     this.progressVisible = true
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }

      this.progressInfo = res.data

      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
  
}
</script>
<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

 
</style>