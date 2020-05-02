<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 侧边栏区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
          <div class="toggle-button" @click="toggleButton">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
           
          >
          <!-- 一级菜单 -->
          <!-- 这里的index值会决定是否一起折叠或收缩，只接受字符串故加了一个+'' -->
            <el-submenu :index="item.id + ''" v-for = "item in menuList" :key="item.id">
              <!-- 一级菜单的模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconList[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单区 -->
              <el-menu-item :index="'/' + subItem.path" v-for = "subItem in item.children" :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span> 
                </template>
              </el-menu-item>
              
            </el-submenu>
          </el-menu>
        
      </el-aside>

      <!-- 内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList(),
    //初始化获取activePath的值来确定初始化的高亮
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      iconList:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      //是否折叠
      isCollapse: false,
      //被激活的链接地址
      activePath: ''
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear("token");
      this.$router.push("/login");
    },
    async getMenuList() {
     const result =  await this.$http.get('menus')
     console.log(result);
     if(result.data.meta.status!== 200) return this.$message.error('列表获取失败')
     const {data} = result.data
     console.log(data);
     this.menuList = data
    },
    toggleButton () {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState (activePath) {
      //点击后将activePath传进来的值保存到sessionStorage中
      window.sessionStorage.setItem('activePath',activePath)
      //同时更新data里存的activePath的值
      this.activePath = activePath
    }
  }
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  padding-left:0;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer
}
</style>