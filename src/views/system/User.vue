<template>
  <div>
    <!-- 顶部：搜索过滤 -->
    <el-card style="margin-bottom: 20px;">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="display: flex; flex-wrap: wrap;">
        <el-form-item label="用户名称" style="margin-right: 20px;">
          <el-input v-model="searchForm.username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" style="margin-right: 20px;">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="状态" style="margin-right: 20px;">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 200px">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 20px;">
          <el-button type="primary"  @click="onSearch"><el-icon><Search /></el-icon>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset"><el-icon><RefreshRight /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮和用户列表 -->
    <el-card class="table-card">
      <!-- 功能按钮 -->
      <el-row style="margin-bottom: 20px;">
        <el-col :span="24" style="display: flex; justify-content: flex-start;">
          <el-button type="primary" @click="openDialog('add')" v-hasPermi="['system:user:add']"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" @click="handleBatchDelete" v-hasPermi="['system:user:batchDelete']">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" fixed></el-table-column>
        <el-table-column prop="id" label="用户编号" width="100"></el-table-column>
        <el-table-column prop="username" label="用户名称" width="150"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="150"></el-table-column>
        <el-table-column prop="department" label="部门" width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
              {{ scope.row.status === '0' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openDialog('edit', scope.row)" v-hasPermi="['system:user:edit']"><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:user:delete']"><el-icon><Delete /></el-icon>删除</el-button>
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

    <!-- 新增/修改用户弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form">
        <el-form-item label="用户编号">
          <el-input v-model="form.id" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="form.department"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.createTime" :disabled="isEdit"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { userApi } from '@/api'

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
      tableData: [],
      // 修改分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      // 选中的用户
      selectedUsers: [],
      // 弹窗相关数据
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        id: '',
        username: '',
        nickname: '',
        department: '',
        phone: '',
        status: '',
        createTime: '',
      },
    };
  },
  // 添加生命周期钩子
  created() {
    this.fetchUserList()
  },
  methods: {
    // 获取用户列表数据
    async fetchUserList() {
      try {
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...this.searchForm
        }
        const res = await userApi.getUserList(params)
        this.tableData = res || []
        this.pagination.total = res.length || 0
      } catch (error) {
        console.error('获取用户列表失败：', error)
        this.$message.error('获取用户列表失败')
      }
    },
    // 查询
    async onSearch() {
      this.pagination.currentPage = 1
      await this.fetchUserList()
    },
    // 重置
    async onReset() {
      this.searchForm = {
        username: '',
        phone: '',
        status: '',
      }
      await this.onSearch()
    },
    // 打开弹窗
    openDialog(type, row = {}) {
      this.dialogVisible = true;
      if (type === 'add') {
        this.dialogTitle = '新增用户';
        this.isEdit = false;
        this.form = {
          id: '',
          username: '',
          nickname: '',
          department: '',
          phone: '',
          status: '',
          createTime: '',
        };
      } else if (type === 'edit') {
        this.dialogTitle = '修改用户';
        this.isEdit = true;
        this.form = { ...row };
      }
    },
    // 保存用户
    handleSave() {
      if (this.isEdit) {
        this.$message.success('修改成功');
        // 这里可以调用接口保存修改的数据
      } else {
        this.$message.success('新增成功');
        // 这里可以调用接口保存新增的数据
      }
      this.dialogVisible = false;
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
        this.selectedUsers.forEach(user => {
          // 这里可以调用接口删除数据
          console.log(`删除用户：${user.username}`);
        });
        this.$message.success('删除成功');
        // 清空选中的用户
        this.selectedUsers = [];
      });
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
    async handleSizeChange(size) {
      this.pagination.pageSize = size
      await this.fetchUserList()
    },
    // 分页改变
    async handlePageChange(currentPage) {
      this.pagination.currentPage = currentPage
      await this.fetchUserList()
    },
  },
}
</script>

<style scoped>
/* 搜索表单靠左排列 */
.search-form {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}

/* 搜索表单表单项之间的间距 */
.search-form .el-form-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

/* 功能按钮靠左排列 */
.action-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

/* 功能按钮之间的间距 */
.action-buttons .el-button {
  margin-right: 10px;
}

/* 表格卡片样式，确保占满区域 */
.table-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 表格卡片内容区域，使其填充满父容器 */
.table-card .el-card__body {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

/* 确保表格宽度100% */
.el-table {
  width: 100% !important;
}
</style>