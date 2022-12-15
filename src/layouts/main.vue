<script setup lang="ts">
useReactifiedApi();
</script>

<template>
  <n-layout has-sider class="h-[100vh]">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
    >
      <SideNav />
    </n-layout-sider>
    <n-layout :native-scrollbar="false">
      <n-layout-header
        style="background: transparent !important"
        :inverted="false"
        position="left"
      >
        <Header :inverted="false" />
      </n-layout-header>
      <n-layout-content
        content-style="padding: 24px; margin-bottom: auto;min-height: 80vh;"
      >
        <router-view v-slot="{ Component, route }">
          <Component :is="Component" :key="route.path" />
        </router-view>
      </n-layout-content>
      <n-layout-footer position="static" class="!bg-transparent">
        <div class="pb-2 px-[24px] flex items-center gap-1">
          COPYRIGHT ©{{ new Date().getFullYear() }}
          <NButton type="primary" text>
            <a href="" target="_blank">TASTIA</a>
          </NButton>
          , All rights Reserved
        </div>
      </n-layout-footer>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>
