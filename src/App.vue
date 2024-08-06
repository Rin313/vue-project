<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item index="0">
      <el-image style="height:100%;" src="/logo.svg" alt="Element logo"/>
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">创建任务</el-menu-item>
    <el-menu-item index="2">加入任务</el-menu-item>
  </el-menu>
  <div class="div" style="display: flex; justify-content: flex-end;">
    <el-button type="primary" :icon="Plus" size="large" @click="add()" circle  v-show="select1"/>
  </div>
  <el-table :data="tableData" style="width: 100%" v-show="select1">
<!--    <el-table-column type="selection" width="55" />-->
    <el-table-column property="name" width="720" show-overflow-tooltip>
      <template #header>
        <Menu style="width: 1.5em; height: 1.5em;" />
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button-group class="ml-4">
          <el-button type="primary" :icon="Edit" @click="edit(scope.row.id)"/>
          <el-button type="primary" :icon="Delete" @click="del(scope.row.id)"/>
          <el-button type="primary" :icon="Share" @click="copy('/invite','🎉 嘿，我刚刚发布了一个新任务，快来加入吧！🚀\n👉 点击这里加入任务: http://${window.location.host}/addParTask?key=${data}\n快来一起完成吧！💪✨',{'id': scope.row.id})"/>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-table :data="tableData" style="width: 100%" v-show="select2">
    <!--    <el-table-column type="selection" width="55" />-->
    <el-table-column property="name" width="720" show-overflow-tooltip>
      <template #header>
        <Menu style="width: 1.5em; height: 1.5em;" />
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button-group class="ml-4">
          <el-button type="primary" :icon="Delete" @click="delParTask(scope.row.id)"/>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
import {ok,error,input,confirm,upload,fetchGet,fetchPost,table,shareLink,copy} from '/src/assets/baseFetch.js'
import {Plus, Delete, Edit, Share, Menu} from '@element-plus/icons-vue'
const activeIndex = ref('1')
const select1 = computed(() => {
  return activeIndex.value === '1';
})
const select2 = computed(() => {
  return activeIndex.value === '2';
})
const tableData = ref([]);

if (new URLSearchParams(window.location.search).has('key')) {
  shareLink("/addParTask");
  activeIndex.value = '2';
  table("/getParTask",tableData);
} else table("/getTask",tableData);

function handleSelect(key) {
  activeIndex.value = key;
  if (activeIndex.value === '1')
    table("/getTask",tableData);
  else
    table("/getParTask",tableData);
}

function add() {
  input('/addTask','name')
      .then(() => {
        ok();
        table("/getTask",tableData);
      }).catch(() => {/*不处理异常会报错*/});
}

function del(id) {
  confirm('/deleteTask',{'id': id})
      .then(() => {
        ok();
        table("/getTask",tableData);
      }).catch(() => {/*不处理异常会报错*/});
}

function edit(id) {
  input('/updateTask','name',{'id':id})
      .then(() => {
        ok();
        table("/getTask",tableData);
      }).catch(() => {/*不处理异常会报错*/});
}



function delParTask(id) {
  confirm('/deleteParTask', {'id': id})
      .then(() => {
        ok();
        table("/getParTask",tableData);
      }).catch(() => {/*不处理异常会报错*/});
}
</script>
<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>


