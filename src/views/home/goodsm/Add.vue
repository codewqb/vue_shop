<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="+activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="allCateList"
                :props="casProps"
                v-model="addForm.goods_cat"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'
import { getAllCateList,getParamsList } from 'network/goodsm'
export default {
  name: 'Add',
  components: {
    BreadCrumb
  },
  data() {
    return {
      list: ['商品管理', '添加商品'],
      // 步骤条状态索引
      activeIndex: '0',
      // 添加商品的表单对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: []
      },
      // 表单验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' },
        ], goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' },
        ], goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' },
        ], goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' },
        ], goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' },
        ]
      },
      // 商品分类列表
      allCateList: [],
      // 选择商品分类级联选择器配置对象
      casProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }

    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return +this.addForm.goods_cat[2];
      }
      return null
    }
  },
  created() {
    this.getAllCateList();
  },
  methods: {
    // 获取所有分类列表
    getAllCateList() {
      getAllCateList().then(res => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类列表失败');
        } else {
          this.allCateList = res.data;
        }
      })
    },
    // 商品分类选项改变
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return
      } else {
        this.getAllCateList();
      }
    },
    // 阻止页签的切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类');
        return false;
      }
    },
    // tab 被选中时触发
    tabClicked() {
      getParamsList(this.cateId,'many').then(res => {
        console.log(res);
      })
    }
  },
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
</style>