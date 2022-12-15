<script setup lang="ts">
import LogoLight from "~/assets/images/LogoLight.svg";
import LogoDark from "~/assets/images/LogoDark.svg";
const menuOptions = useNavigationMenu();
const activeItem = useRouteTitle();
const appStore = useAppStore();
</script>

<template>
  <div class="p-4">
    <img :src="appStore.isDark ? LogoDark : LogoLight" class="w-full h-auto" />
  </div>
  <div class="p-2 flex flex-col">
    <n-tabs type="segment">
      <n-tab name="oasis" tab="Admin" />
      <n-tab name="test" tab="Organization" />
    </n-tabs>
  </div>
  <n-menu
    :value="activeItem.key"
    :collapsed-width="128"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>
