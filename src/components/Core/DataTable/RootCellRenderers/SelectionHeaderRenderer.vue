<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme-overrides="appStore.themeOverrides"
      :theme="appStore.theme"
    >
      <div :style="{ width: `${width}px` }">
        <NCheckbox v-model:checked="selectAll" size="large" />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { ref, watch } from "vue";
import { useAppStore } from "~/stores/app.store";

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
});

const appStore = useAppStore();
const cellContainerRef = ref(props.params.eGridHeader);
const { width } = useElementSize(cellContainerRef);

const selectAll = ref(false);
watch(
  () => selectAll.value,
  (val) => props.params.SetGlobalSelection(val)
);
</script>
