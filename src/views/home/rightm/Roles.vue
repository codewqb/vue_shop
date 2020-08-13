<template>
  <div>
    <!-- 面包屑导航 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisiable=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级权限 -->
            <el-row
              :class="['bdbottom',index1 === 0 ? 'bdtop' : '','vc']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="delRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限跟三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop','vc']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="delRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button
                @click="showEditRole(scope.row.id)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              >编辑</el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button
                @click="delRoleById(scope.row.id)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              >删除</el-button>
            </el-tooltip>
            <!-- 分配权限按钮 -->
            <!-- 文字提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showRightDialog(scope.row)"
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisiable" width="50%" @close="addRoleClose">
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="50%" @close="editRoleClose">
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        :rules="editRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="editRightVisible" width="50%" @close="editRightClose">
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="RightTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'

import { getRoleList, postAddRole, getRoleInfo, editRoleInfo, deleteRole, deleteRight, getRightTree, setRight } from 'network/rightm'

export default {
  name: 'Roles',
  components: {
    BreadCrumb
  },
  data() {
    return {
      list: ['权限管理', '角色列表'],
      // 角色列表
      roleList: [],
      // 控制添加角色对话框的显示与隐藏
      addRoleVisiable: false,
      // 添加角色表单数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑对话框的显示与隐藏
      editRoleVisible: false,
      // 查询角色的信息
      editRoleForm: {},
      // 查询角色表单规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      editRightVisible: false,
      // 所有权限列表
      RightTree: [],
      // 树形控件属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点的id值数组
      defkeys: [],
      // 分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      getRoleList().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.message.error('获取角色列表失败');
        } else {
          this.roleList = res.data;
        }
      })
    },
    // 添加角色对话框的关闭，重置表单
    addRoleClose() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 添加角色表单预验证添加用户
    addRole() {
      this.$refs.addRoleFormRef.validate(valid => {
        if (!valid) {
          return false
        } else {
          // 验证通过，发送请求
          this.postAddRole(this.addRoleForm);
        }
      });
    },
    // 添加角色提交请求
    postAddRole(data) {
      postAddRole(data).then(res => {
        // console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败');
        } else {
          // 隐藏对话框
          this.addRoleVisiable = false;
          // 更新列表
          this.getRoleList();
          this.$message.success('添加角色成功');
        }
      })
    },
    // 展示修改角色对话框
    showEditRole(id) {
      // console.log(id);
      getRoleInfo(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('查询角色信息失败')
        } else {
          this.editRoleForm = res.data
          this.editRoleVisible = true;
        }
      })
    },
    // 编辑角色对话框的关闭，重置表单
    editRoleClose() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 编辑角色表单预验证添加用户
    editRole() {
      this.$refs.editRoleFormRef.validate(valid => {
        if (!valid) {
          return false;
        } else {
          // 验证通过，发送请求
          this.editRoleInfo(this.editRoleForm);
        }
      });
    },
    // 编辑角色提交请求
    editRoleInfo(data) {
      editRoleInfo(data).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败');
        } else {
          // 隐藏对话框
          this.editRoleVisible = false;
          // 更新列表
          this.getRoleList();
          // 提示成功
          this.$message.success('更新角色信息成功');
        }
      })
    },
    // 根据id删除角色
    delRoleById(id) {
      // console.log(id);
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.deleteRole(id)
      }, err => {
        this.$message.info('已经取消删除');
      })
    },
    // 删除角色请求
    deleteRole(id) {
      deleteRole(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('删除角色失败');
        } else {
          // 更新列表
          this.getRoleList();
          // 提示成功
          this.$message.success('删除角色成功');
        }
      })
    },
    // 根据id删除对应的权限
    delRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        // console.log(roleId, rightId);
        this.deleteRight(role, rightId)
      }, err => {
        this.$message.info('已经取消删除');
      })
    },
    // 删除权限请求
    deleteRight(role, rightId) {
      deleteRight(role, rightId).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('删除权限失败');
        } else {
          // 提示成功
          this.$message.success('删除权限成功');
          role.children = res.data
        }
      })
    },
    // 展示分配角色对话框
    showRightDialog(role) {
      this.roleId = role.id
      this.getRightTree();
      // 调用递归获取三级权限id
      this.getRightId(role, this.defkeys);
      this.editRightVisible = true;
    },
    // 获取所有权限列表数据
    getRightTree() {
      getRightTree().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败');
        } else {
          this.RightTree = res.data;
        }
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的id，
    // 并保存到defkeys数组中
    getRightId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      } else {
        node.children.forEach(item => {
          this.getRightId(item, arr)
        });
      }
    },
    // 分配权限对话框的关闭，重置defkeys数组
    editRightClose() {
      this.defkeys = [];
    },
    // 点击为角色分配权限
    editRight() {
      const keyArr = [...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedNodes()];
      const idStr = keyArr.join(',');
      setRight(this.roleId, idStr).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('分配权限失败');
        } else {
          this.getRoleList();
          this.$message.success('分配权限成功');
          this.editRightVisible = false;
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vc {
  display: flex;
  align-items: center;
}
</style>