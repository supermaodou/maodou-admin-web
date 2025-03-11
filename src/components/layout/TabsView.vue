<template>
    <div class="tabs-container">
        <el-tabs :model-value="activeTab" @update:model-value="$emit('update:activeTab', $event)" type="card" closable
            @tab-remove="handleTabRemove" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.title" :name="tab.path"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'TabsView',
    props: {
        tabs: Array,
        activeTab: String
    },
    emits: ['update:activeTab', 'tab-remove', 'tab-click'],
    methods: {
        handleTabRemove(path) {
            this.$emit('tab-remove', path);
        },
        handleTabClick(tab) {
            this.$emit('tab-click', tab);
        }
    }
}
</script>

<style scoped>
.tabs-container {
    background-color: #ffffff;
    padding: 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 40px;
    width: 100%;
}

.el-tabs {
    margin-top: 0;
    height: 100%;
}

.el-tabs :deep(.el-tabs__header) {
    margin: 0;
}

.el-tabs :deep(.el-tabs__item) {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding: 0 20px;
}

.el-tabs :deep(.el-tabs__nav) {
    border: none;
}

.el-tabs :deep(.el-tabs__item.is-active) {
    background-color: #f5f7fa;
    border-bottom-color: #f5f7fa;
}
</style>