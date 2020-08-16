<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="goodsQuery.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="106px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template v-slot="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsQuery.pagenum"
        :page-sizes="[8,10,15,20]"
        :page-size="goodsQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'

import { getGoodsList, deleteGoods } from 'network/goodsm'
export default {
  name: 'Goods',
  components: {
    BreadCrumb
  },
  data() {
    return {
      list: ['商品管理', '商品列表'],
      // 商品列表数据
      goodsList: [],
      // 商品列表参数
      goodsQuery: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 总数据条数
      total: 0
    }
  },
  created() {
    // console.log(1111);
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      getGoodsList(this.goodsQuery).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败');
        } else {
          this.goodsList = res.data.goods;
          this.total = res.data.total;

        }
      })
    },
    // 改变pagesize
    handleSizeChange(newSize) {
      this.goodsQuery.pagesize = newSize;
      this.getGoodsList();
    },
    // 改变pagenum
    handleCurrentChange(newPage) {
      this.goodsQuery.pagenum = newPage;
      this.getGoodsList();
    },
    // 删除商品
    delGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.deleteGoods(id);
      }, err => {
        this.$message.info('已取消删除');
      })
    },
    // 删除商品请求
    deleteGoods(id) {
      deleteGoods(id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败');
        } else {
          this.getGoodsList();
          this.$message.success('删除成功');
        }
      })
    },
    // 添加商品按钮跳转页面
    addGoods() {
      this.$router.push('/goods/add');
    }
  }
}
</script>
<style lang="less" scoped>
</style>