<template>
  <el-container id="home">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="~assets/imgs/heima.png" alt />
        <h1>电商后台管理系统</h1>
      </div>
      <el-button @click="quit" type="info">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 菜单折叠 -->
        <div class="taggle-btn" @click="taggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="getActivePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->

            <el-menu-item :index="'/'+data.path" v-for="data in item.children" :key="data.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{data.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from 'network/home';
export default {
  name: 'Home',
  components: {

  },
  data() {
    return {
      menuList: [], // 左侧菜单数据
      icons: {

        '125': 'fas fa-users',
        '103': 'fas fa-dice-d6',
        '101': 'fas fa-shopping-bag',
        '102': 'fas fa-receipt',
        '145': 'fas fa-money-bill',
      }, // 一级菜单字体图标
      isCollapse: false, // 菜单折叠状态
      // 菜单状态高亮
      activePath: ''
    }
  },
  created() {
    // 请求左侧菜单数据
    this.getMenuList();
  },
  computed: {
    getActivePath() {
      const p = this.$route.path.split('/')[1];
      return this.activePath = '/' + p;
    }
  },
  methods: {
    // 实现退出功能
    quit() {
      // 清空token
      window.sessionStorage.clear();
      // 跳转登录页 编程式导航
      this.$router.push('/login');
    },
    // 请求左侧菜单数据
    getMenuList() {
      getMenuList().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        } else {
          this.menuList = res.data;
        }
      })
    },
    // 实现左侧菜单的折叠与展开
    taggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }

  }
}
</script>
<style lang="less" scoped>
#home {
  height: 100%;
}
.el-header {
  display: flex;
  padding: 0;
  justify-content: space-between;
  background-color: #373d41;
  div {
    display: flex;
    align-items: center;
    h1 {
      font-size: 20px;
      color: #fff;
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .taggle-btn {
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    // 字符间隔
    letter-spacing: 0.2em;
    cursor: pointer;
    background-color: #4a5064;
  }
}
.el-menu {
  border-right: none;
}
.el-menu .fas {
  width: 15px;
  text-align: center;
  margin-right: 10px;
}
.el-main {
  background-color: #eaedf1;
}
</style>