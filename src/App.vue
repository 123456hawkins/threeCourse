<template>
  <div class="container">
    <div class="menuContainer">
      <el-scrollbar>
        <el-menu
          class="el-menu-demo"
          :router="true"
          :default-active="$route.path"
          active-text-color="#12100d"
          background-color="#f3f3f3"
          text-color="#000000"
          mode="horizontal"
        >
          <template v-for="(item, index) in routeList" :key="item.path">
            <el-menu-item v-if="!item.meta.hidden" :index="item.path">{{
              item.name
            }}</el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="routerViewContainer">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { routeList } from './router/routes'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const $route = useRoute()
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
