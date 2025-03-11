<template>
    <div>
      <!-- 顶部：搜索过滤 -->
      <el-card style="margin-bottom: 20px;">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="display: flex; flex-wrap: wrap;">
          <el-form-item label="字典名称" style="margin-right: 20px;">
            <el-input v-model="searchForm.dictName" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典类型" style="margin-right: 20px;">
            <el-input v-model="searchForm.dictType" placeholder="请输入字典类型"></el-input>
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
  
      <!-- 功能按钮和字典列表 -->
      <el-card class="table-card">
        <!-- 功能按钮 -->
        <el-row style="margin-bottom: 20px;">
          <el-col :span="24" style="display: flex; justify-content: flex-start;">
            <el-button type="primary" @click="openDialog('add')" v-hasPermi="['system:dict:add']">
              <el-icon><Plus /></el-icon>新增
            </el-button>
            <el-button type="danger" @click="handleBatchDelete" v-hasPermi="['system:dict:batchDelete']">
              <el-icon><Delete /></el-icon>批量删除
            </el-button>
          </el-col>
        </el-row>
  
        <!-- 字典列表 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="dictName" label="字典名称" width="180"></el-table-column>
          <el-table-column prop="dictType" label="字典类型" width="180"></el-table-column>
          <el-table-column prop="description" label="描述" min-width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                {{ scope.row.status === '1' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleDictData(scope.row)" v-hasPermi="['system:dict:data']">
                <el-icon><List /></el-icon>字典数据
              </el-button>
              <el-button link type="primary" size="small" @click="openDialog('edit', scope.row)" v-hasPermi="['system:dict:edit']">
                <el-icon><EditPen /></el-icon>修改
              </el-button>
              <el-button link type="danger" size="small" @click="handleDelete(scope.row)" v-hasPermi="['system:dict:delete']">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px; text-align: right;"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </el-card>
  
      <!-- 新增/修改字典弹窗 -->
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
        <el-form :model="form" label-width="100px">
          <el-form-item label="字典名称">
            <el-input v-model="form.dictName" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典类型">
            <el-input v-model="form.dictType" placeholder="请输入字典类型"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio value="1">启用</el-radio>
              <el-radio value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSave">确定</el-button>
          </div>
        </template>
      </el-dialog>
  
      <!-- 字典数据弹窗 -->
      <el-dialog :title="dictDataTitle" v-model="dictDataVisible" width="800px">
        <div class="dict-data-header">
          <el-button type="primary" @click="openDictDataDialog('add')">
            <el-icon><Plus /></el-icon>新增
          </el-button>
        </div>
        <el-table :data="dictDataList" style="width: 100%">
          <el-table-column prop="label" label="字典标签" width="180"></el-table-column>
          <el-table-column prop="value" label="字典键值" width="180"></el-table-column>
          <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                {{ scope.row.status === '1' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="openDictDataDialog('edit', scope.row)">
                <el-icon><EditPen /></el-icon>修改
              </el-button>
              <el-button link type="danger" size="small" @click="handleDictDataDelete(scope.row)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
  
      <!-- 字典数据项编辑弹窗 -->
      <el-dialog :title="dictDataDialogTitle" v-model="dictDataFormVisible" width="500px">
        <el-form :model="dictDataForm" label-width="100px">
          <el-form-item label="字典标签">
            <el-input v-model="dictDataForm.label" placeholder="请输入字典标签"></el-input>
          </el-form-item>
          <el-form-item label="字典键值">
            <el-input v-model="dictDataForm.value" placeholder="请输入字典键值"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="dictDataForm.orderNum" :min="0" :max="999"></el-input-number>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="dictDataForm.status">
              <el-radio value="1">启用</el-radio>
              <el-radio value="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="dictDataForm.remark" type="textarea" :rows="3" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dictDataFormVisible = false">取消</el-button>
            <el-button type="primary" @click="handleDictDataSave">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dic',
    data() {
      return {
        // 搜索表单
        searchForm: {
          dictName: '',
          dictType: '',
          status: ''
        },
        // 表格数据
        tableData: [
          {
            id: 1,
            dictName: '用户性别',
            dictType: 'sys_user_sex',
            description: '用户性别列表',
            status: '1',
            createTime: '2023-10-01 12:00:00'
          },
          {
            id: 2,
            dictName: '菜单状态',
            dictType: 'sys_menu_status',
            description: '菜单状态列表',
            status: '1',
            createTime: '2023-10-01 12:00:00'
          }
        ],
        // 分页
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 2
        },
        // 选中的数据
        selectedItems: [],
        // 弹窗数据
        dialogVisible: false,
        dialogTitle: '',
        form: {
          dictName: '',
          dictType: '',
          status: '1',
          description: ''
        },
        // 字典数据弹窗
        dictDataVisible: false,
        dictDataTitle: '',
        currentDict: null,
        dictDataList: [],
        // 字典数据表单
        dictDataFormVisible: false,
        dictDataDialogTitle: '',
        dictDataForm: {
          label: '',
          value: '',
          orderNum: 0,
          status: '1',
          remark: ''
        }
      }
    },
    methods: {
      // 查询
      onSearch() {
        console.log('搜索条件：', this.searchForm)
      },
      // 重置
      onReset() {
        this.searchForm = {
          dictName: '',
          dictType: '',
          status: ''
        }
      },
      // 打开弹窗
      openDialog(type, row) {
        this.dialogVisible = true
        if (type === 'add') {
          this.dialogTitle = '新增字典'
          this.form = {
            dictName: '',
            dictType: '',
            status: '1',
            description: ''
          }
        } else {
          this.dialogTitle = '修改字典'
          this.form = { ...row }
        }
      },
      // 保存
      handleSave() {
        console.log('保存字典：', this.form)
        this.$message.success('保存成功')
        this.dialogVisible = false
      },
      // 删除
      handleDelete(row) {
        this.$confirm('确认删除该字典吗？', '提示', {
          type: 'warning'
        }).then(() => {
          console.log('删除字典：', row)
          this.$message.success('删除成功')
        })
      },
      // 批量删除
      handleBatchDelete() {
        if (this.selectedItems.length === 0) {
          this.$message.warning('请选择要删除的数据')
          return
        }
        this.$confirm(`确认删除选中的 ${this.selectedItems.length} 条数据吗？`, '提示', {
          type: 'warning'
        }).then(() => {
          console.log('批量删除：', this.selectedItems)
          this.$message.success('删除成功')
        })
      },
      // 选择变更
      handleSelectionChange(selection) {
        this.selectedItems = selection
      },
      // 分页大小变更
      handleSizeChange(val) {
        this.pagination.pageSize = val
        // 重新加载数据
      },
      // 当前页变更
      handleCurrentChange(val) {
        this.pagination.currentPage = val
        // 重新加载数据
      },
      // 打开字典数据管理
      handleDictData(row) {
        this.dictDataVisible = true
        this.dictDataTitle = `字典数据 - ${row.dictName}`
        this.currentDict = row
        // 模拟加载字典数据
        this.dictDataList = [
          {
            id: 1,
            label: '男',
            value: '1',
            orderNum: 1,
            status: '1',
            remark: '性别男'
          },
          {
            id: 2,
            label: '女',
            value: '2',
            orderNum: 2,
            status: '1',
            remark: '性别女'
          }
        ]
      },
      // 打开字典数据编辑
      openDictDataDialog(type, row) {
        this.dictDataFormVisible = true
        if (type === 'add') {
          this.dictDataDialogTitle = '新增字典数据'
          this.dictDataForm = {
            label: '',
            value: '',
            orderNum: 0,
            status: '1',
            remark: ''
          }
        } else {
          this.dictDataDialogTitle = '修改字典数据'
          this.dictDataForm = { ...row }
        }
      },
      // 保存字典数据
      handleDictDataSave() {
        console.log('保存字典数据：', this.dictDataForm)
        this.$message.success('保存成功')
        this.dictDataFormVisible = false
        // 重新加载字典数据列表
        this.handleDictData(this.currentDict)
      },
      // 删除字典数据
      handleDictDataDelete(row) {
        this.$confirm('确认删除该字典数据吗？', '提示', {
          type: 'warning'
        }).then(() => {
          console.log('删除字典数据：', row)
          this.$message.success('删除成功')
          // 重新加载字典数据列表
          this.handleDictData(this.currentDict)
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .table-card {
    margin-bottom: 20px;
  }
  
  .dict-data-header {
    margin-bottom: 20px;
  }
  
  .dialog-footer {
    text-align: right;
  }
  </style>