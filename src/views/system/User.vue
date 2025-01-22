<template>
  <div>
    <!-- 顶部：搜索过滤 -->
    <el-card style="margin-bottom: 20px;">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 200px">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮和用户列表 -->
    <el-card>
      <!-- 功能按钮 -->
      <el-row style="margin-bottom: 20px;">
        <el-col :span="24">
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="用户编号" width="100"></el-table-column>
        <el-table-column prop="username" label="用户名称" width="120"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="120"></el-table-column>
        <el-table-column prop="department" label="部门" width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)" v-hasPermi="['system:user:edit']">修改</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
            <!-- <el-dropdown size="small">
              <el-button size="small" type="text">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="handleResetPwd">重置密码</el-dropdown-item>
                <el-dropdown-item command="handleAuthRole">分配角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top: 20px; text-align: right;"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      // 搜索表单
      searchForm: {
        username: '',
        phone: '',
        status: '',
      },
      // 用户列表数据
      userList: [
        {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          department: '技术部',
          phone: '13800138000',
          status: '1',
          createTime: '2023-10-01 12:00:00',
        },
        {
          id: 2,
          username: 'user1',
          nickname: '用户1',
          department: '市场部',
          phone: '13800138001',
          status: '0',
          createTime: '2023-10-02 12:00:00',
        },
      ],
      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 2,
      },
      // 选中的用户
      selectedUsers: [],
    };
  },
  methods: {
    // 查询
    onSearch() {
      console.log('查询条件：', this.searchForm);
      // 这里可以调用接口获取数据
    },
    // 重置
    onReset() {
      this.searchForm = {
        username: '',
        phone: '',
        status: '',
      };
    },
    // 新增用户
    handleAdd() {
      this.$message.success('点击了新增按钮');
      // 这里可以跳转到新增页面或打开弹窗
    },
    // 批量删除
    handleBatchDelete() {
      if (this.selectedUsers.length === 0) {
        this.$message.warning('请选择要删除的用户');
        return;
      }
      this.$confirm('确定要删除选中的用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message.success('删除成功');
        // 这里可以调用接口删除数据
      });
    },
    // 编辑用户
    handleEdit(row) {
      this.$message.success(`编辑用户：${row.username}`);
      // 这里可以跳转到编辑页面或打开弹窗
    },
    // 删除用户
    handleDelete(row) {
      this.$confirm(`确定要删除用户 ${row.username} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$message.success('删除成功');
        // 这里可以调用接口删除数据
      });
    },
    // 表格选中项改变
    handleSelectionChange(selection) {
      this.selectedUsers = selection;
    },
    // 分页大小改变
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      // 这里可以调用接口获取分页数据
    },
    // 分页改变
    handlePageChange(currentPage) {
      this.pagination.currentPage = currentPage;
      // 这里可以调用接口获取分页数据
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
</style>