<template>
  <div>
    <!-- 顶部：搜索过滤 -->
    <el-card style="margin-bottom: 20px;">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="display: flex; flex-wrap: wrap;">
        <el-form-item label="角色名称" style="margin-right: 20px;">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" style="margin-right: 20px;">
          <el-input v-model="searchForm.roleCode" placeholder="请输入角色编码"></el-input>
        </el-form-item>
        <el-form-item label="状态" style="margin-right: 20px;">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 200px">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right: 20px;">
          <el-button type="primary" @click="onSearch"><el-icon><Search /></el-icon>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onReset"><el-icon><RefreshRight /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 功能按钮和角色列表 -->
    <el-card class="table-card">
      <!-- 功能按钮 -->
      <el-row style="margin-bottom: 20px;">
        <el-col :span="24" style="display: flex; justify-content: flex-start;">
          <el-button type="primary" @click="openDialog('add')" v-hasPermi="['system:role:add']"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" @click="handleBatchDelete" v-hasPermi="['system:role:batchDelete']">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" fixed></el-table-column>
        <el-table-column prop="id" label="角色编号" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="150"></el-table-column>
        <el-table-column prop="roleCode" label="角色编码" width="150"></el-table-column>
        <el-table-column prop="description" label="角色描述" width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" min-width="180">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openDialog('edit', scope.row)" v-hasPermi="['system:role:edit']"><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button link type="primary" size="small" @click="handlePermission(scope.row)" v-hasPermi="['system:role:permission']"><el-icon><Setting /></el-icon>权限</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:role:delete']"><el-icon><Delete /></el-icon>删除</el-button>
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

    <!-- 新增/修改角色弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色编号">
          <el-input v-model="form.id" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="form.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 权限分配弹窗 -->
    <el-dialog title="分配权限" v-model="permissionDialogVisible" width="600px">
      <el-form :model="permissionForm">
        <el-form-item label="角色名称">
          <el-input v-model="permissionForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="permissionTree"
            :data="permissionTreeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="permissionForm.checkedKeys"
            :props="{ label: 'name', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermission">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script>
export default {
  name: 'Role',
  data() {
    return {
      // 搜索表单
      searchForm: {
        roleName: '',
        roleCode: '',
        status: '',
      },
      // 角色列表数据
      tableData: [
        {
          id: 1,
          roleName: '超级管理员',
          roleCode: 'ROLE_ADMIN',
          description: '系统最高权限，拥有所有权限',
          status: '1',
          createTime: '2023-10-01 12:00:00',
        },
        {
          id: 2,
          roleName: '普通用户',
          roleCode: 'ROLE_USER',
          description: '普通用户权限，仅有基本操作权限',
          status: '1',
          createTime: '2023-10-02 12:00:00',
        },
        {
          id: 3,
          roleName: '运营人员',
          roleCode: 'ROLE_OPERATOR',
          description: '运营人员权限，拥有内容管理权限',
          status: '1',
          createTime: '2023-10-03 12:00:00',
        },
        {
          id: 4,
          roleName: '财务人员',
          roleCode: 'ROLE_FINANCE',
          description: '财务人员权限，拥有财务管理权限',
          status: '0',
          createTime: '2023-10-04 12:00:00',
        },
        {
          id: 5,
          roleName: '市场人员',
          roleCode: 'ROLE_MARKET',
          description: '市场人员权限，拥有市场管理权限',
          status: '1',
          createTime: '2023-10-05 12:00:00',
        },
      ],
      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 5,
      },
      // 选中的角色
      selectedRoles: [],
      // 弹窗相关数据
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        id: '',
        roleName: '',
        roleCode: '',
        description: '',
        status: '1',
      },
      // 权限弹窗相关数据
      permissionDialogVisible: false,
      permissionForm: {
        roleId: '',
        roleName: '',
        checkedKeys: [],
      },
      // 权限树数据
      permissionTreeData: [
        {
          id: 1,
          name: '系统管理',
          children: [
            {
              id: 11,
              name: '用户管理',
              children: [
                { id: 111, name: '用户查询' },
                { id: 112, name: '用户新增' },
                { id: 113, name: '用户修改' },
                { id: 114, name: '用户删除' },
              ],
            },
            {
              id: 12,
              name: '角色管理',
              children: [
                { id: 121, name: '角色查询' },
                { id: 122, name: '角色新增' },
                { id: 123, name: '角色修改' },
                { id: 124, name: '角色删除' },
                { id: 125, name: '权限分配' },
              ],
            },
            {
              id: 13,
              name: '菜单管理',
              children: [
                { id: 131, name: '菜单查询' },
                { id: 132, name: '菜单新增' },
                { id: 133, name: '菜单修改' },
                { id: 134, name: '菜单删除' },
              ],
            },
          ],
        },
        {
          id: 2,
          name: '内容管理',
          children: [
            {
              id: 21,
              name: '文章管理',
              children: [
                { id: 211, name: '文章查询' },
                { id: 212, name: '文章新增' },
                { id: 213, name: '文章修改' },
                { id: 214, name: '文章删除' },
              ],
            },
            {
              id: 22,
              name: '分类管理',
              children: [
                { id: 221, name: '分类查询' },
                { id: 222, name: '分类新增' },
                { id: 223, name: '分类修改' },
                { id: 224, name: '分类删除' },
              ],
            },
          ],
        },
      ],
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
        roleName: '',
        roleCode: '',
        status: '',
      };
    },
    // 打开弹窗
    openDialog(type, row = {}) {
      this.dialogVisible = true;
      if (type === 'add') {
        this.dialogTitle = '新增角色';
        this.isEdit = false;
        this.form = {
          id: '',
          roleName: '',
          roleCode: '',
          description: '',
          status: '1',
        };
      } else if (type === 'edit') {
        this.dialogTitle = '修改角色';
        this.isEdit = true;
        this.form = { ...row };
      }
    },
    // 保存角色
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
      if (this.selectedRoles.length === 0) {
        this.$message.warning('请选择要删除的角色');
        return;
      }
      this.$confirm('确定要删除选中的角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.selectedRoles.forEach(role => {
          // 这里可以调用接口删除数据
          console.log(`删除角色：${role.roleName}`);
        });
        this.$message.success('删除成功');
        // 清空选中的角色
        this.selectedRoles = [];
      });
    },
    // 删除角色
    handleDelete(row) {
      this.$confirm(`确定要删除角色 ${row.roleName} 吗？`, '提示', {
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
      this.selectedRoles = selection;
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

    // 打开权限分配弹窗
    handlePermission(row) {
      this.permissionDialogVisible = true;
      this.permissionForm = {
        roleId: row.id,
        roleName: row.roleName,
        checkedKeys: [], // 这里应该从后端获取该角色已有的权限ID列表
      };
      // 模拟获取角色权限
      if (row.id === 1) { // 超级管理员
        this.permissionForm.checkedKeys = [111, 112, 113, 114, 121, 122, 123, 124, 125];
      } else if (row.id === 2) { // 普通用户
        this.permissionForm.checkedKeys = [111, 211, 221];
      } else if (row.id === 3) { // 运营人员
        this.permissionForm.checkedKeys = [211, 212, 213, 214, 221, 222, 223, 224];
      }
    },

    // 保存权限设置
    handleSavePermission() {
      // 获取选中的权限ID列表
      const checkedKeys = this.$refs.permissionTree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];

      console.log('保存权限设置：', {
        roleId: this.permissionForm.roleId,
        permissions: allCheckedKeys
      });
      
      // 这里可以调用接口保存权限数据
      this.$message.success('权限保存成功');
      this.permissionDialogVisible = false;
    }
  }
}
</script>