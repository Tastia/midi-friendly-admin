<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme-overrides="appStore.themeOverrides"
      :theme="appStore.theme"
    >
      <div :style="{ width: `${width}px` }">
        <NCheckbox
          :checked="rowSelectedState"
          :on-update:checked="UpdateSelection"
          size="large"
        />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";
import { computed, PropType, ref, watch, WritableComputedRef } from "vue";
import { useAppStore } from "~/stores/app.store";

const props = defineProps({
  params: {
    type: Object as PropType<{
      eGridCell: HTMLElement;
      GetSelectionApi: () => {
        selectAll: WritableComputedRef<boolean>;
        selected: WritableComputedRef<{ [key: string]: any; _id: string }[]>;
      };
      data: { [key: string]: any };
      selectionKey: string;
    }>,
    required: true,
  },
});

const appStore = useAppStore();
const cellContainerRef = ref(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef);

const selectionApi = props.params.GetSelectionApi();
const rowSelectedState = computed(
  () =>
    selectionApi.selectAll.value ||
    selectionApi.selected.value.some(
      (row) =>
        row?.[props.params.selectionKey] ===
        props.params.data?.[props.params.selectionKey]
    )
);

const UpdateSelection = (value: boolean) => {
  console.log({ value });
  // if (selectionApi.selectAll.value) return;
};
</script>
