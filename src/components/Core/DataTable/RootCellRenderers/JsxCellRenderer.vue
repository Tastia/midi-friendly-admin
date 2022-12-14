<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme-overrides="appStore.themeOverrides"
      :theme="appStore.theme"
    >
      <div :style="{ width: `${width}px` }">
        <Component :is="RenderedCell" />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { ref } from "vue";
import { useAppStore } from "~/stores/app.store";

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
});

const appStore = useAppStore();
const cellContainerRef = ref(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef);

const RenderedCell = renderVNode(
  props.params?._cellRenderer,
  props.params.value,
  props.params.data,
  props.params
);
</script>
