<template>
  <NTooltip>
    <template #trigger>
      <div class="w-auto" @click="isOpen = true">
        <slot :nb-active="countAppliedFilters" />
      </div>
    </template>
    <div class="flex flex-col justify-center items-center">
      <span>Open filters</span>
      <span>({{ countAppliedFilters }}) active</span>
    </div>
  </NTooltip>

  <keep-alive>
    <n-drawer
      v-model:show="isOpen"
      display-directive="show"
      :width="width < 502 ? width : 502"
    >
      <n-drawer-content
        :native-scrollbar="false"
        :footer-style="{ justifyContent: 'flex-start' }"
        closable
      >
        <template #header>
          <div class="flex items-center justify-start py-2">
            <n-icon class="mr-2">
              <i:mdi-filter-variant />
            </n-icon>
            <span
              >Filters
              {{
                countAppliedFilters > 0 ? `(${countAppliedFilters})` : null
              }}</span
            >
          </div>
        </template>
        <div
          id="filtersContainer"
          class="filtersContainer"
          style="z-index: 3000 !important"
        >
          <Form
            ref="formRef"
            :form-options="filtersSchema"
            :form-data="modelValue"
          >
            <template #actions></template>
          </Form>
        </div>

        <template #footer>
          <div class="flex items-center justify-start gap-4">
            <NButton type="error" class="w-full" @click="ResetFilters">
              <template #icon>
                <n-icon>
                  <i:system-uicons:reset />
                </n-icon>
              </template>
              RESET
            </NButton>

            <NButton type="primary" class="w-full" @click="ApplyFilters">
              <template #icon>
                <n-icon>
                  <i:la:search />
                </n-icon>
              </template>
              SEARCH
            </NButton>
          </div>
        </template>
      </n-drawer-content>

      <div id="temporaryFiltersContainer" class="!hidden"></div>
    </n-drawer>
  </keep-alive>
</template>

<script setup lang="ts">
import { MapFiltersToSchema } from "./tableUtils";
import { TableFilter, FilterState } from "./types";
import { Form } from "@chronicstone/vue-sweetforms";
import { useWindowSize } from "@vueuse/core";
import { useThemeVars } from "naive-ui";
import { PropType, ref, reactive, computed, watch, onMounted } from "vue";

const themeVars = useThemeVars();

const emit = defineEmits(["update:modelValue", "resetFilters"]);
const props = defineProps({
  inputFilters: {
    type: Array as PropType<TableFilter[]>,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: Object as PropType<FilterState>,
    default: () => ({}),
    required: true,
  },
});

interface FiltersFormRef {
  formData: { [key: string]: any };
  $reset: () => void;
  $clear: () => void;
}

const isOpen = ref(false);
const { width, height } = useWindowSize();

const formRef = ref<FiltersFormRef | null>(null);
const filtersState = computed(() =>
  !formRef.value ? {} : formRef.value?.formData
);
const filtersSchema = reactive({
  gridSize: 8,
  fieldSize: 8,
  fields: MapFiltersToSchema(props.inputFilters),
});

const isArray = (value: any) => Array.isArray(value);

const countAppliedFilters = computed(
  () =>
    Object.entries(props.modelValue).filter(
      ([key, value]) =>
        value != null &&
        value != "" &&
        ((isArray(value) && (value as any)?.length > 0) || !isArray(value)) &&
        props.inputFilters.some((filter) => filter.key === key)
    ).length
);

const ApplyFilters = () => emit("update:modelValue", { ...filtersState.value });
const ResetFilters = () => {
  formRef.value?.$clear?.();
  ApplyFilters();
};
</script>

<style>
.v-binder-follower-container {
  z-index: 3000 !important;
}

.filtersContainer >>> form {
  padding: 25px;
}
</style>
