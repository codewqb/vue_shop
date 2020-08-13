<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'
import { getRightList } from 'network/rightm'
export default {
  name: 'Rights',
  components: {
    BreadCrumb
  },
  data() {
    return {
      list: ['权限管理', '权限列表'],
      // 权限列表
      rightList: []
    }
  },
  created() {
    this.getRightList();
  },
  methods: {
    // 权限列表获取
    getRightList() {
      getRightList().then(res => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败');
        } else {
          this.rightList = res.data;
          console.log(res.data);
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
</style>

