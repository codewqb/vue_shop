<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row class="bd">
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :show-row-hover="false"
        border
        :expand-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template #isOk="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color: lightgreen;"
          ></i>
          <i v-else class="el-icon-error" style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template #order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template #operate="scope">
          <!-- 编辑按钮 -->
          <el-button
            @click="showEditCate(scope.row.cat_id)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          >编辑</el-button>
          <!-- 删除按钮 -->
          <el-button
            @click="delCateById(scope.row.cat_id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateQuery.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="cateQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateVisiable" width="50%" @close="addCateClose">
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascader"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateVisiable" width="50%">
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'

import { getCateList, getParentCateList, postAddCate, getCateById, editCate, deleteCate } from 'network/goodsm'
export default {
  name: 'Categories',
  components: {
    BreadCrumb
  },
  data() {
    return {
      list: ['商品管理', '商品分类'],
      // 商品分类列表数据
      cateList: [],
      // 列表请求参数
      cateQuery: {
        // 分类级别
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 数据总条数
      total: 0,
      // 定义table列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //将当前页定义为模板列
          type: 'template',
          // 使用的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateVisiable: false,
      // 添加分类表单数据
      addCateForm: {
        // 要添加的分类名称
        cat_name: '',
        // 要添加的父级分类id
        cat_pid: 0,
        // 分类等级，默认添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 制定级联选择器的配置对象
      cascader: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true

      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editCateVisiable: false,
      // 编辑分类表单数据
      editCateForm: {},
      // 编辑分类表单规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类列表
    getCateList() {
      getCateList(this.cateQuery).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表失败');
        } else {
          this.cateList = res.data.result;
          this.total = res.data.total;
        }
      })
    },
    // 改变pagesize
    handleSizeChange(newPagesize) {
      this.cateQuery.pagesize = newPagesize;
      this.getCateList();
    },
    // 改变pagenum
    handleCurrentChange(newPagenum) {
      this.cateQuery.pagenum = newPagenum;
      this.getCateList();
    },
    // 展示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateVisiable = true;
    },
    // 获取父级分类列表
    getParentCateList() {
      getParentCateList().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级列表数据失败');
        } else {
          this.parentCateList = res.data;
          // console.log(this.parentCateList);
        }
      });
    },
    // 选择项改变时触发
    parentCateChange() {
      this.addCateForm.cat_level = this.selectedKeys.length;
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
      } else {
        this.addCateForm.cat_pid = 0;
      }
    },
    // 点击添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) {
          return false
        } else {
          // 验证通过，发送请求
          this.postAddCate();
        }
      });
    },
    // 添加分类请求
    postAddCate() {
      postAddCate(this.addCateForm).then(res => {
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败');
        } else {
          this.addCateVisiable = false;
          this.getCateList();
          this.$message.success('添加分类成功');
        }
      })
    },
    // 关闭对话框，重置表单
    addCateClose() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectedKeys = [];
    },
    // 展示编辑分类对话框
    showEditCate(id) {
      console.log(id);
      this.getParentCateList();
      getCateById(id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('查询分类失败');
        } else {
          this.editCateForm = res.data
          this.editCateVisiable = true;
        }
      })
    },
    // 编辑分类请求
    editCatePut() {
      editCate(this.editCateForm).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('更新分类失败');
        } else {
          // 隐藏对话框
          this.editCateVisible = false;
          // 更新列表
          this.getCateList();
          // 提示成功
          this.$message.success('更新分类成功');
        }
      })
    },
    // 
    editCate() {
      this.$refs.editCateFormRef.validate(valid => {
        if (!valid) {
          return false;
        } else {
          // 验证通过，发送请求
          this.editCatePut();
        }
      });
    },
    // 删除分类
    delCateById(id) {
      // console.log(id);
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.deleteCate(id);
      }, err => {
        this.$message.info('已经取消删除');
      })
    },
    // 删除分类请求
    deleteCate(id) {
      deleteCate(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('删除分类失败');
        } else {
          // 更新列表
          this.getCateList();
          // 提示成功
          this.$message.success('删除分类成功');
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.bd {
  margin-bottom: 15px;
}
</style>