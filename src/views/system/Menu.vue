<template>
  <div>
    <!-- 顶部：搜索过滤 -->
    <el-card style="margin-bottom: 20px;">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="display: flex; flex-wrap: wrap;">
        <el-form-item label="菜单名称" style="margin-right: 20px;">
          <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" style="margin-right: 20px;">
          <el-input v-model="searchForm.permission" placeholder="请输入权限标识"></el-input>
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

    <!-- 功能按钮和菜单列表 -->
    <el-card class="table-card">
      <!-- 功能按钮 -->
      <el-row style="margin-bottom: 20px;">
        <el-col :span="24" style="display: flex; justify-content: flex-start;">
          <el-button type="primary" @click="openDialog('add')" v-hasPermi="['system:menu:add']">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button type="info" @click="toggleExpand">
            <el-icon><ArrowDown v-if="!isExpandAll" /><ArrowUp v-else /></el-icon>
            {{ isExpandAll ? '收起' : '展开' }}
          </el-button>
        </el-col>
      </el-row>

      <!-- 菜单表格 -->
      <el-table
        ref="menuTable"
        :data="tableData"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="menuName" label="菜单名称" width="200"></el-table-column>
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="scope">
            <el-icon v-if="scope.row.icon">
              <component :is="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="80"></el-table-column>
        <el-table-column prop="permission" label="权限标识" width="180"></el-table-column>
        <el-table-column prop="path" label="路由地址" width="180"></el-table-column>
        <el-table-column prop="component" label="组件路径" width="180"></el-table-column>
        <el-table-column prop="menuType" label="菜单类型" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === 'M'">目录</el-tag>
            <el-tag type="success" v-else-if="scope.row.menuType === 'C'">菜单</el-tag>
            <el-tag type="info" v-else-if="scope.row.menuType === 'F'">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
              {{ scope.row.status === '1' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openDialog('add', scope.row)" v-hasPermi="['system:menu:add']">
              <el-icon><Plus /></el-icon>新增
            </el-button>
            <el-button link type="primary" size="small" @click="openDialog('edit', scope.row)" v-hasPermi="['system:menu:edit']">
              <el-icon><EditPen /></el-icon>修改
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:menu:delete']">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/修改菜单弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="menuTreeData"
            :props="{ label: 'menuName', value: 'id' }"
            placeholder="请选择上级菜单"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.menuType">
            <el-radio label="M">目录</el-radio>
            <el-radio label="C">菜单</el-radio>
            <el-radio label="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="form.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="图标" v-if="form.menuType !== 'F'">
          <el-input v-model="form.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum" :min="0" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="权限标识" v-if="form.menuType === 'F'">
          <el-input v-model="form.permission" placeholder="请输入权限标识"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" v-if="form.menuType !== 'F'">
          <el-input v-model="form.path" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" v-if="form.menuType === 'C'">
          <el-input v-model="form.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
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
export default {
  name: 'Menu',
  data() {
    return {
      // 搜索表单
      searchForm: {
        menuName: '',
        permission: '',
        status: '',
      },
      // 菜单表格数据（树形结构）
      tableData: [
        {
          id: 1,
          menuName: '系统管理',
          icon: 'Setting',
          orderNum: 1,
          permission: '',
          path: '/system',
          component: '',
          menuType: 'M',
          status: '1',
          children: [
            {
              id: 11,
              menuName: '用户管理',
              icon: 'User',
              orderNum: 1,
              permission: '',
              path: 'user',
              component: 'system/User',
              menuType: 'C',
              status: '1',
              children: [
                {
                  id: 111,
                  menuName: '用户查询',
                  icon: '',
                  orderNum: 1,
                  permission: 'system:user:query',
                  path: '',
                  component: '',
                  menuType: 'F',
                  status: '1',
                },
                {
                  id: 112,
                  menuName: '用户新增',
                  icon: '',
                  orderNum: 2,
                  permission: 'system:user:add',
                  path: '',
                  component: '',
                  menuType: 'F',
                  status: '1',
                },
              ],
            },
            {
              id: 12,
              menuName: '角色管理',
              icon: 'UserFilled',
              orderNum: 2,
              permission: '',
              path: 'role',
              component: 'system/Role',
              menuType: 'C',
              status: '1',
            },
          ],
        },
        {
          id: 2,
          menuName: '系统监控',
          icon: 'Monitor',
          orderNum: 2,
          permission: '',
          path: '/monitor',
          component: '',
          menuType: 'M',
          status: '1',
        },
      ],
      // 弹窗相关数据
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      form: {
        id: '',
        parentId: null,
        menuName: '',
        icon: '',
        orderNum: 0,
        permission: '',
        path: '',
        component: '',
        menuType: 'M',
        status: '1',
      },
      // 菜单树选择数据
      menuTreeData: [], // 将从 tableData 转换而来
      isExpandAll: false, // 添加展开/收起状态
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
        menuName: '',
        permission: '',
        status: '',
      };
    },
    // 打开弹窗
    openDialog(type, row = {}) {
      this.dialogVisible = true;
      if (type === 'add') {
        this.dialogTitle = row.id ? '新增子菜单' : '新增菜单';
        this.isEdit = false;
        this.form = {
          id: '',
          parentId: row.id || null,
          menuName: '',
          icon: '',
          orderNum: 0,
          permission: '',
          path: '',
          component: '',
          menuType: 'M',
          status: '1',
        };
      } else if (type === 'edit') {
        this.dialogTitle = '修改菜单';
        this.isEdit = true;
        this.form = { ...row };
      }
      // 更新菜单树数据
      this.updateMenuTreeData();
    },
    // 更新菜单树数据
    updateMenuTreeData() {
      // 将 tableData 转换为树形选择数据，去除按钮类型
      const convertToTreeSelect = (data) => {
        return data.filter(item => item.menuType !== 'F').map(item => {
          const node = {
            id: item.id,
            menuName: item.menuName,
          };
          if (item.children) {
            node.children = convertToTreeSelect(item.children);
          }
          return node;
        });
      };
      this.menuTreeData = convertToTreeSelect(this.tableData);
    },
    // 保存菜单
    handleSave() {
      console.log('保存菜单：', this.form);
      if (this.isEdit) {
        this.$message.success('修改成功');
      } else {
        this.$message.success('新增成功');
      }
      this.dialogVisible = false;
    },
    // 删除菜单
    handleDelete(row) {
      this.$confirm(`是否确认删除名称为"${row.menuName}"的菜单项?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        console.log('删除菜单：', row);
        this.$message.success('删除成功');
      });
    },

    // 展开/收起所有
    toggleExpand() {
      this.isExpandAll = !this.isExpandAll;
      this.toggleAllNodes(this.isExpandAll);
    },
    
    // 切换所有节点的展开/收起状态
    toggleAllNodes(expanded) {
      const table = this.$refs.menuTable;
      if (!table) return;
      
      const toggleNode = (data) => {
        data.forEach(row => {
          table.toggleRowExpansion(row, expanded);
          if (row.children && row.children.length > 0) {
            toggleNode(row.children);
          }
        });
      };
      
      toggleNode(this.tableData);
    }
  },
};
</script>

<style scoped>
.table-card {
  margin-bottom: 20px;
}

.el-dialog__body {
  padding: 20px;
}
</style>