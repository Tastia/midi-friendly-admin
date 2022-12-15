<template>
  <div>
    <NCard
      :bordered="!borderless"
      content-style="padding: 0;"
      class="datagrid"
      :segmented="{ content: true }"
    >
      <template #header>
        <div
          class="flex flex-col !lg:flex-row !lg:items-center !lg:justify-between w-full gap-4"
        >
          <div class="flex flex-col gap-1">
            <div><slot /></div>
            <span class="text-sm text-gray-500 font-light dark:text-gray-400"
              >{{ gridContent.nbSelected }} selected</span
            >
          </div>
          <div
            class="flex flex-col gap-4 !md:flex-row !md:items-center !md:gap-3"
          >
            <FilterInput
              v-if="searchQuery?.length"
              v-model="gridControls.filters.searchQuery"
              :filter="{
                inputType: 'text',
                key: '##searchQuery',
                placeholder: 'Search here...',
              }"
              :table-key="tableKey ?? $route.name?.toString()"
              focus-sync
            />
            <!-- <NInput
                        v-if="searchQuery?.length"
                        v-model:value="reactiveFilters.searchQuery"
                        placeholder="Search here..."
                    /> -->
            <n-dropdown
              v-if="mappedActions?.length"
              :options="mappedActions"
              trigger="hover"
            >
              <NButton secondary type="primary" icon-placement="right">
                Actions
                <template #icon>
                  <NIcon>
                    <mdi-chevron-down />
                  </NIcon>
                </template>
              </NButton>
            </n-dropdown>

            <FilterPanel
              v-if="filters?.length"
              v-model="gridControls.filters.panelFilters"
              :input-filters="filters"
            >
              <template #default="{ nbActive }">
                <NButton
                  v-if="nbActive < 1"
                  secondary
                  type="primary"
                  class="w-full !md:w-auto"
                >
                  <template #icon>
                    <NIcon><mdi-filter /></NIcon
                  ></template>
                </NButton>
                <NButton
                  v-else
                  secondary
                  type="primary"
                  class="w-full !md:w-auto"
                >
                  <template #icon>
                    <NIcon><mdi-filter /></NIcon
                  ></template>
                  ({{ nbActive }})
                </NButton>
              </template>
            </FilterPanel>

            <NTooltip>
              <template #trigger>
                <NButton secondary type="primary" @click="FetchGridData">
                  <template #icon>
                    <NIcon>
                      <mdi-refresh />
                    </NIcon>
                  </template>
                </NButton>
              </template>
              Refresh data
            </NTooltip>
          </div>
        </div>
      </template>

      <div ref="gridContainer" class="flex flex-col gap-0">
        <NSpin :show="gridConfig.loading">
          <ag-grid-vue
            ref="gridRef"
            class="ag-theme-material w-full h-[56vh]"
            :column-defs="gridConfig.columnDefs"
            :row-data="gridContent.data"
            :default-col-def="gridConfig.defaultColDef"
            :grid-options="gridConfig?.gridOptions"
            row-selection="multiple"
            animate-rows
            enable-range-selection
            enable-cell-text-selection
            auto-params-refresh
            suppress-pagination-panel
            @sortChanged="HandleSortEvent"
            @selectionChanged="HandleSelectionEvent"
            @gridReady="HandleGridReadyEvent"
          />
        </NSpin>
      </div>
      <template #action>
        <div
          class="flex w-full flex-col !md:flex-row !md:justify-between !md:items-center gap-4"
        >
          <div
            class="flex items-center w-full gap-3 justify-between !md:justify-start"
          >
            <NSelect
              v-model:value="gridControls.pagination.pageSize"
              :render-tag="RenderPaginationSizeOpt"
              class="max-w-32"
              placeholder="Page size"
              :options="
                [50, 100, 250, 500].map((i) => ({
                  label: i,
                  value: i,
                }))
              "
            />
            <span
              >{{
                gridControls.pagination.pageSize *
                  gridControls.pagination.pageIndex -
                (gridControls.pagination.pageSize - 1)
              }}
              -
              {{
                gridControls.pagination.pageSize *
                gridControls.pagination.pageIndex
              }}
              of {{ gridControls.pagination.rowTotalCount }}</span
            >
          </div>
          <div class="w-full flex justify-center !md:justify-end">
            <n-pagination
              v-model:page="gridControls.pagination.pageIndex"
              :page-count="gridControls.pagination.pageTotalCount"
              :page-sizes="[10, 20, 30, 40]"
              :page-slot="isMobile ? 3 : 8"
            />
          </div>
        </div>
      </template>
    </NCard>
  </div>
</template>

<script setup lang="tsx">
import {
  DataSource,
  TableFilter,
  TableAction,
  Column,
  StaticFilter,
  TableRowAction,
  OptimizedQueryFields,
} from "./types";
import { useClientTable } from "./useClientTable";
import { useServerTable } from "./useServerTable";
import { useResizeObserver } from "@vueuse/core";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { AgGridVue } from "ag-grid-vue3";
import { useThemeVars } from "naive-ui";
import { ref, computed, PropType, watch } from "vue";
import FilterInput from "./FilterInput.vue";
import FilterPanel from "./FilterPanel.vue";
import { useIsMobile } from "~/composables/useIsMobile";
import { useAppStore } from "~/stores/app.store";
import { ChangeRgbaOpacity } from "~/utils/data/color";

const isMobile = useIsMobile();
const appStore = useAppStore();
const themeVars = useThemeVars();

// eslint-disable-next-line no-undef
const props = defineProps({
  optimizeQuery: {
    type: Array as PropType<OptimizedQueryFields[]>,
    required: false,
    default: () => [],
  },
  remote: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  tableKey: {
    type: String as PropType<string>,
    required: false,
    default: () => Date.now().toString(),
  },
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
    default: () => [],
  },
  otherFilters: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => [],
  },
  filters: {
    type: Array as PropType<TableFilter[]>,
    required: false,
    default: () => [],
  },
  staticFilters: {
    type: Array as PropType<StaticFilter[]>,
    required: false,
    default: () => [],
  },
  searchQuery: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => [],
  },
  datasource: {
    type: Function as PropType<DataSource<{ [key: string]: any }>>,
    required: true,
    default: () => () => Promise.resolve([]),
  },
  persistFilters: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  enableSelection: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  rowActions: {
    type: Function as PropType<TableRowAction<{ [key: string]: any }>>,
    required: false,
    default: () => [],
  },
  actions: {
    type: Array as PropType<TableAction[]>,
    required: false,
    default: () => [],
  },
  columnFitMode: {
    type: String as PropType<"fill" | "fit">,
    required: false,
    default: "",
  },
  borderless: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
});

const {
  gridConfig,
  gridControls,
  gridContent,
  FetchGridData,
  HandleSortEvent,
  HandleSelectionEvent,
  HandleGridReadyEvent,
  mappedActions,
} = props.remote ? useServerTable(props) : useClientTable(props);

// OTHER
const gridContainer = ref<HTMLDivElement | null>(null);
const gridRef = ref<typeof AgGridVue | null>(null);
useResizeObserver(
  gridContainer,
  () =>
    gridConfig.mounted &&
    props.columnFitMode === "fill" &&
    gridConfig?.gridApi?.sizeColumnsToFit()
);
const RenderPaginationSizeOpt = ({
  option,
}: {
  option: { label: string; value: any };
}) => <div>{option.value} rows</div>;
const borderColor = computed(() =>
  appStore.isDark
    ? ChangeRgbaOpacity(themeVars.value.borderColor, 0.1)
    : themeVars.value.borderColor
);
</script>

<style lang="scss">
@import "ag-grid-community/dist/styles/ag-grid.scss";
@import "ag-grid-community/dist/styles/ag-theme-material/sass/ag-theme-material-mixin";

.ag-theme-material {
  --ag-foreground-color: v-bind("themeVars.textColorBase");
  --ag-background-color: v-bind("themeVars.modalColor");
  --ag-header-background-color: v-bind("themeVars.modalColor");
  --ag-header-foreground-color: v-bind("themeVars.textColorBase");
  --ag-border-color: v-bind("borderColor");
  --ag-row-hover-color: v-bind("themeVars.bodyColor");
  --ag-column-hover-color: v-bind("themeVars.bodyColor");
  --ag-border-radius: v-bind("themeVars.borderRadius");
  --ag-cell-horizontal-border: none;
  --ag-cell-horizontal-border: transparent;
  --ag-material-accent-color: v-bind("themeVars.primaryColor");
  --ag-header-cell-moving-background-color: v-bind("themeVars.primaryColor");
  --ag-selected-tab-underline-color: v-bind("themeVars.primaryColor");
  --ag-input-focus-border-color: v-bind("themeVars.primaryColor");
  ::-webkit-scrollbar {
    width: calc(v-bind("themeVars.scrollbarWidth") * 1.5);
    height: calc(v-bind("themeVars.scrollbarWidth") * 1.5);
  }

  ::-webkit-scrollbar-thumb {
    background: v-bind("themeVars.scrollbarColor");
    border-radius: 20px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 20px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: v-bind("themeVars.primaryColor");
  }

  .ag-row,
  .ag-header,
  .ag-header-cell,
  .ag-header-group-cell,
  .ag-row,
  .ag-pinned-left-header,
  .ag-horizontal-left-spacer,
  .ag-horizontal-right-spacer {
    border-left: none;
    border-right: none;
    border-top: none;
    min-height: 55px;
    font-weight: 300;
    font-family: "Lato";
  }

  .ag-row-hover,
  .ag-row-selected,
  .ag-header-cell-hover,
  .ag-header-cell:hover {
    background: v-bind("themeVars.bodyColor") !important;
  }

  .ag-floating-filter:hover {
    background: v-bind("themeVars.modalColor") !important;
  }

  .ag-header .ag-header-cell {
    font-weight: 900 !important;
  }

  .ag-header-cell:hover {
    background: v-bind("themeVars.bodyColor");
  }

  .ag-icon-checkbox-checked,
  .ag-icon-checkbox-indeterminate {
    font-size: 22px;
    color: v-bind("themeVars.primaryColor") !important;
  }

  .ag-icon,
  .ag-header-icon {
    color: v-bind("themeVars.primaryColor") !important;
  }

  .ag-tool-panel-wrapper {
    background: v-bind("themeVars.borderColor");
    color: v-bind("themeVars.textColorBase");
    margin-left: 5px;
    // border: 2px solid v-bind("themeVars.borderColor");
  }

  .ag-group,
  .ag-filter-toolpanel-group {
    background: v-bind("themeVars.modalColor");
  }

  .ag-cell-focus {
    border: transparent !important;
    background: v-bind("themeVars.avatarColor");
  }
}
</style>
