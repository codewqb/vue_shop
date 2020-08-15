<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cate-opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类级联选择器 -->
          <el-cascader
            :options="allCateList"
            :props="casProps"
            v-model="selectedCate"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" @click="addParams" :disabled="isDisabled">添加参数</el-button>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="addAttribute" :disabled="isDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'

import { getAllCateList, getParamsList } from 'network/goodsm'

export default {
  name: 'Params',
  components: {
    BreadCrumb
  },
  data() {
    return {
      list: ['商品管理', '参数列表'],
      // 所有分类列表
      allCateList: [],
      // 选择商品分类级联选择器配置对象
      casProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选择的分类id值
      selectedCate: [],
      // 被激活的页签名字
      activeName: 'many',
      // 动态参数列表
      manyParamslist: [],
      // 静态属性列表
      onlyParamslist: []
    }
  },
  created() {
    this.getAllCateList();
  },
  computed: {
    // 控制按钮是否被禁用
    isDisabled() {
      if (this.selectedCate.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    // 所选择分类的id
    cateId() {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2];
      } else {
        return null;
      }
    }

  },
  methods: {
    // 获取所有分类列表
    getAllCateList() {
      getAllCateList().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类列表失败');
        } else {
          this.allCateList = res.data;
        }
      })
    },
    // 级联选择框选项改变时触发
    handleChange() {
      // console.log(this.selectedCate);
      if (this.selectedCate.length !== 3) {
        this.selectedCate = [];
        return
      } else {
        this.getParamsList();
      }
    },
    // 获取参数列表
    getParamsList() {
      getParamsList(this.cateId, this.activeName).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败');
        }
        if (this.activeName === 'many') {
          this.manyParamslist = res.data
        } else {
          this.onlyParamslist = res.data
        }

      })
    },
    // tab 标签被点击触发此函数
    handleTabClick() {
      console.log(this.activeName);
      if (this.selectedCate.length !== 3) {
        this.selectedCate = [];
        return
      } else {
        this.getParamsList();
      }
    },
    // 添加参数
    addParams() {
      
    },
    // 添加属性
    addAttribute() {

    }
  }

}
</script>
<style lang="less" scoped>
.cate-opt {
  margin: 15px 0;
}
</style>