<template>
  <n-tooltip placement="bottom" :disabled="disableTooltip">
    <template #trigger>
      <div
        class="h-8 w-8 grid place-items-center rounded-lg cursor-pointer bg-gray-200/25 hover:bg-gray-300/25 overflow:hidden dark:(bg-gray-700/25 hover:bg-gray-600/25 overflow-hidden)"
        :class="buttonClass"
        @click="appStore.toggleTheme()"
      >
        <Transition
          :name="appStore.isDark ? 'slide-fade' : 'slide-fade-reverse'"
          mode="out-in"
        >
          <mdi-white-balance-sunny
            v-if="appStore.isDark"
            class="transition-all ease-in-out duration-150 transform"
          />
          <ic-baseline-dark-mode
            v-else
            class="transition-all ease-in-out duration-150 transform"
          />
        </Transition>
      </div>
    </template>
    <span>{{ appStore.isDark ? "Light" : "Dark" }}</span>
  </n-tooltip>
</template>

<script setup lang="ts">
const appStore = useAppStore();
withDefaults(
  defineProps<{ buttonClass?: string; disableTooltip?: boolean }>(),
  { disableTooltip: false, buttonClass: "" }
);
</script>
