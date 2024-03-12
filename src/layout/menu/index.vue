<template>
  <div>
    <template v-for="item in menuList" :key="item.path">
      <template v-if="item.children">
        <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
          <!-- 递归 -->
          <Menu :menu-list="item.children" />
        </el-sub-menu>
      </template>

      <el-menu-item
        v-if="item.path && item.path != '/'"
        :index="item.path"
        @click="goRoute"
      >
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps(['menuList'])
// 获取路由对象
let $router = useRouter()
// 点击菜单进行路由跳转
const goRoute = (vc: any) => {
  console.log('tiao', vc.index)

  $router.push({ path: vc.index })
}
</script>
<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped lang="scss"></style>
