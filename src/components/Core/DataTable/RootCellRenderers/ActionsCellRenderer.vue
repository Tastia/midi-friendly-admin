<template>
  <div :style="{ width: `${width}px` }">
    <NConfigProvider
      :theme-overrides="appStore.themeOverrides"
      :theme="appStore.theme"
    >
      <div :style="{ width: `${width}px` }" class="flex">
        <div class="flex gap-2 items-center">
          <template v-if="rowActions?.length">
            <NTooltip
              v-for="({ icon, tooltip, link, action }, key) in rowActions"
              :key="key"
            >
              <template #trigger>
                <component
                  :is="link ? 'router-link' : 'div'"
                  v-bind="{
                    ...(link ? { to: link } : {}),
                  }"
                  v-on="{
                    click: () => action?.(),
                  }"
                >
                  <NIcon size="18" class="mt-2">
                    <span class="iconify cursor-pointer" :data-icon="icon" />
                  </NIcon>
                </component>
              </template>
              {{ tooltip }}
            </NTooltip>
          </template>
          <template v-else>N/A</template>
        </div>
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { TableApi, TableRowAction } from "../types";
import { useElementSize } from "@vueuse/core";
import { computed, onMounted, ref, defineProps, PropType } from "vue";
// import { usePermission } from "~/composables/usePermission";
import { useAppStore } from "~/stores/app.store";

interface CellRendererParams {
  value: any;
  data: { [key: string]: any };
  eGridCell: HTMLElement;
  tableApi: TableApi;
  _rowActions: TableRowAction;
}

const props = defineProps({
  params: {
    type: Object as PropType<CellRendererParams>,
    required: true,
  },
});

const appStore = useAppStore();
const cellContainerRef = ref(props.params.eGridCell);
const { width } = useElementSize(cellContainerRef);
const rowActions = computed(() =>
  props.params
    ._rowActions(props.params)
    .filter(Boolean)
    .map((action) => ({
      ...action,
      _enable: ref(true), // usePermission(...(action?.permissions ?? [])),
      _render: computed(
        () => !!(action?.condition?.(props.params.data) ?? true)
      ),
    }))
    .filter((action) => action._enable.value && action._render.value)
);
</script>
