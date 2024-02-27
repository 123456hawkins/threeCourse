<template>
  <div class="container">
    <div class="menuContainer">
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item
          v-for="(item, index) in routeList"
          :key="index"
          v-show="item.path !== '/'"
          >{{ item.name }}</el-menu-item
        >
      </el-menu>
    </div>
    <div class="routerViewContainer">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { routeList } from './router/routes'
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  .menuContainer {
    height: 10%;
    box-sizing: border-box;
  }
  .routerViewContainer {
    height: 90%;
    box-sizing: border-box;
  }
}
</style>
