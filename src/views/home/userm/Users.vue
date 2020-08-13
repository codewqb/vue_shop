<template>
  <div>
    <!-- 面包屑导航区域 -->
    <bread-crumb :list="list"></bread-crumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="usersQuery.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisiable=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
              <el-button
                @click="showEditDialog(scope.row.id)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button
                @click="delUserById(scope.row.id)"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <!-- 文字提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersQuery.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisiable" width="50%" @close="addDialogClose">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="50%" @close="setRoleClose">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <br />
        <p>当前的角色：{{userInfo.role_name}}</p>
        <br />
        <p>
          分配新角色：
          <el-select v-model="selectedId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole(userInfo.id,selectedId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadCrumb from 'components/content/breadcrumb/BreadCrumb'
import { getUserList, changeUserState, postAddUser, getUserInfo, editUserInfo, deleteUser, setRole } from 'network/userm'
import { getRoleList } from 'network/rightm'
export default {
  name: 'Users',
  components: {
    BreadCrumb
  },
  data() {
    // 验证用户邮箱
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (emailReg.test(value)) {
        // 合法邮箱
        return callback();
      } else {
        return callback(new Error('请输入合法邮箱'));
      }
    };
    // 验证用户电话
    var checkMobile = (rule, value, callback) => {
      const mobileReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      if (mobileReg.test(value)) {
        // 合法电话
        return callback();
      } else {
        return callback(new Error('请输入合法电话'));
      }
    };
    return {
      list: ['用户管理', '用户列表'],
      // 用户列表信息
      usersQuery: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前页显示多少条数据
        pagesize: 2
      },
      usersList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisiable: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询用户的信息
      editForm: {},
      // 查询用户表单规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleVisible: false,
      // 需要分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      roleList: [],
      // 所选角色的id
      selectedId: ''
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表数据
    getUserList() {
      getUserList(this.usersQuery).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败')
        } else {
          this.usersList = res.data.users;
          this.total = res.data.total;
        }
      });
    },
    // 改变pageSize
    handleSizeChange(newSize) {
      this.usersQuery.pagesize = newSize;
      // 更新列表
      this.getUserList();
    },
    // 改变页码值
    handleCurrentChange(newPage) {
      this.usersQuery.pagenum = newPage;
      // 更新列表
      this.getUserList();
    },
    // 修改用户状态
    changeUserState(userinfo) {
      // console.log(userinfo);
      changeUserState(userinfo).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('设置状态失败');
        } else {
          return this.$message.success('设置状态成功');
        }
      })
    },
    // 添加用户对话框的关闭，重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户表单预验证添加用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return false
        } else {
          // 验证通过，发送请求
          this.postAddUser(this.addForm);
        }
      });
    },
    // 添加用户提交请求
    postAddUser(param) {
      postAddUser(param).then(res => {
        // console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败');
        } else {
          // 隐藏对话框
          this.addDialogVisiable = false;
          // 更新列表
          this.getUserList();
          this.$message.success('添加用户成功');
        }
      })
    },
    // 展示修改用户对话框
    showEditDialog(id) {
      // console.log(id);
      getUserInfo(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        } else {
          this.editForm = res.data
          this.editDialogVisible = true;
        }
      })
    },
    // 修改用户对话框的关闭，重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户表单预验证添加用户
    editUser() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return false;
        } else {
          // 验证通过，发送请求
          this.editUserInfo(this.editForm);
        }
      });
    },
    // 修改用户提交请求
    editUserInfo(data) {
      editUserInfo(data).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败');
        } else {
          // 隐藏对话框
          this.editDialogVisible = false;
          // 更新列表
          this.getUserList();
          // 提示成功
          this.$message.success('更新用户信息成功');
        }
      })
    },
    // 根据id删除用户
    delUserById(id) {
      console.log(id);
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.deleteUser(id)
      }, err => {
        this.$message.info('已经取消删除');
      })
    },
    // 删除用户请求
    deleteUser(id) {
      deleteUser(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error('删除用户失败');
        } else {
          // 更新列表
          this.getUserList();
          // 提示成功
          this.$message.success('删除用户成功');
        }
      })
    },
    // 展示分配角色对话框
    showSetRole(userinfo) {
      this.userInfo = userinfo;
      // 请求所有角色列表
      getRoleList().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.message.error('获取角色列表失败');
        } else {
          this.roleList = res.data;
        }
      })
      this.setRoleVisible = true;
    },
    // 分配新角色
    setRole(userid, roleid) {
      if (!this.selectedId) {
        return this.$message.error('请选择要分配的角色');
      }
      setRole(userid, roleid).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('分配角色失败');
        } else {
          this.getUserList();
          this.$message.success('分配角色成功');
          this.setRoleVisible = false;
        }
      })
    },
    // 关闭分配角色对话框
    setRoleClose() {
      this.selectedId = ''
    }

  }
}
</script>
<style lang="less" scoped>
</style>