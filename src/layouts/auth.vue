<template>
  <div
    class="w-full h-screen overflow-hidden flex relative"
    :style="{
      backgroundColor: themeVars.bodyColor,
      color: themeVars.textColorBase,
    }"
  >
    <img
      v-if="!appStore.isDark"
      src="@/assets/images/LogoLight.svg"
      class="absolute top-6 left-6 h-12"
    />
    <img
      v-else
      src="@/assets/images/LogoDark.svg"
      class="absolute top-6 left-6 h-12"
    />
    <LayoutToggleTheme disable-tooltip button-class="absolute top-6 right-6" />

    <div class="w-0 !ld:3/5 !lg:w-2/3 grid place-items-center h-full">
      <img src="@/assets/images/illuHome.svg" class="h-1/2" />
    </div>

    <div
      class="w-full !md:2/5 !lg:w-1/3 px-16 py-32 flex flex-col gap-6 text-gray-800 dark:text-gray-200 authForm"
      :style="{ backgroundColor: themeVars.modalColor }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { useReactifiedApi } from "~/composables/useReactifiedApi";

const appStore = useAppStore();
const themeVars = useThemeVars();
useReactifiedApi();
</script>
