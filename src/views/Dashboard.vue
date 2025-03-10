<template>
  <div class="dashboard-container">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>总用户数</span>
              <el-icon class="icon"><User /></el-icon>
            </div>
          </template>
          <div class="card-value">1,234</div>
          <div class="card-footer">
            较上月 <span class="up">+12.5%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>订单总量</span>
              <el-icon class="icon"><ShoppingCart /></el-icon>
            </div>
          </template>
          <div class="card-value">856</div>
          <div class="card-footer">
            较上月 <span class="up">+8.2%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>月收入</span>
              <el-icon class="icon"><Money /></el-icon>
            </div>
          </template>
          <div class="card-value">￥45,678</div>
          <div class="card-footer">
            较上月 <span class="down">-2.3%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>活跃用户</span>
              <el-icon class="icon"><UserFilled /></el-icon>
            </div>
          </template>
          <div class="card-value">526</div>
          <div class="card-footer">
            较上月 <span class="up">+5.6%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div ref="salesChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <div ref="userPieChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'Dashboard',
  setup() {
    const salesChart = ref(null)
    const userPieChart = ref(null)

    onMounted(() => {
      // 初始化销售趋势图表
      const sales = echarts.init(salesChart.value)
      sales.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['订单量', '销售额']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
        },
        yAxis: [
          {
            type: 'value',
            name: '订单量',
            min: 0,
            max: 250
          },
          {
            type: 'value',
            name: '销售额',
            min: 0,
            max: 25000
          }
        ],
        series: [
          {
            name: '订单量',
            type: 'bar',
            data: [120, 132, 101, 134, 90, 180, 210]
          },
          {
            name: '销售额',
            type: 'line',
            yAxisIndex: 1,
            data: [12000, 13200, 10100, 13400, 9000, 18000, 21000]
          }
        ]
      })

      // 初始化用户分布饼图
      const userPie = echarts.init(userPieChart.value)
      userPie.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '用户分布',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '华东地区' },
              { value: 735, name: '华北地区' },
              { value: 580, name: '华南地区' },
              { value: 484, name: '西南地区' },
              { value: 300, name: '其他地区' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })

      // 监听窗口大小变化，调整图表大小
      window.addEventListener('resize', () => {
        sales.resize()
        userPie.resize()
      })
    })

    return {
      salesChart,
      userPieChart
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.data-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;

    .icon {
      font-size: 20px;
      color: #409EFF;
    }
  }

  .card-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    margin: 10px 0;
  }

  .card-footer {
    font-size: 14px;
    color: #909399;

    .up {
      color: #67C23A;
    }

    .down {
      color: #F56C6C;
    }
  }
}

.card-header {
  font-weight: bold;
  color: #303133;
}
</style>