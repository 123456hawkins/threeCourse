<template>
  <div class="container" id="allContainer">
    <div class="menuContainer">
      <el-menu class="el-menu-demo" :router="true" :ellipsis="true" :default-active="$route.path"
        active-text-color="#12100d" background-color="#f3f3f3" text-color="#000000" mode="horizontal">
        <Menu :menuList="routeList[0].children"></Menu>
      </el-menu>
    </div>



    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"></component>
      </transition>
    </router-view>

  </div>
</template>
<script setup lang="ts">
import Menu from './menu/index.vue'
import { RouterView } from 'vue-router'
import { routeList } from '@/router/routes'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const $route = useRoute()
onMounted(() => {
  console.log('routeList', routeList);

})
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;

  .menuContainer {
    height: 60px;
    box-sizing: border-box;
  }

  .routerViewContainer {
    height: 90%;
    box-sizing: border-box;
  }
}
</style>
