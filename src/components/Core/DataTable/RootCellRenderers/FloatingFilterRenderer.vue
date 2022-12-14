<template>
  <div ref="cellRef">
    <NConfigProvider
      :theme="appStore.theme"
      :theme-overrides="appStore.themeOverrides"
    >
      <div
        class="w-full flex items-center justify-center !font-normal"
        :style="{ width: `${width}px` }"
      >
        <!-- text -->
        <NInput
          v-if="params.filterConfig.type === 'text'"
          v-model:value="filterValue"
        />

        <!-- select -->
        <NSelect
          v-if="params.filterConfig.type === 'select'"
          v-model:value="filterValue"
          :options="mappedOptions"
          :placeholder="params.filterConfig.placeholder ?? 'Select value(s)'"
          multiple
          clearable
          filterable
          max-tag-count="responsive"
          :loading="evalOptions"
        />

        <!-- date -->

        <!-- date range -->
        <NDatePicker
          v-if="
            [
              'date',
              'datetime',
              'daterange',
              'datetimerange',
              'month',
              'year',
              'day',
            ].includes(params.filterConfig.type)
          "
          v-model:value="filterValue"
          :placeholder="params.filterConfig.placeholder"
          :type="params.filterConfig.type"
          update-value-on-close
        />

        <NTimePicker
          v-if="params.filterConfig.type === 'time'"
          v-model:value="filterValue"
          :placeholder="params.filterConfig.placeholder"
          :type="params.filterConfig.type"
        />
        <!--  -->

        <NCheckbox
          v-if="params.filterConfig.type === 'checkbox'"
          v-model:checked="filterValue"
          size="large"
        />
      </div>
    </NConfigProvider>
  </div>
</template>

<script setup lang="tsx">
import { asyncComputed, useElementSize } from "@vueuse/core";
import { NConfigProvider } from "naive-ui";
import { useAppStore } from "~/stores/app.store";

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
});

const appStore = useAppStore();
const filterValue = ref(null);
const cellRef = ref(null);

const { width, height } = useElementSize(cellRef);

// SELECT FIELD OPTIONS
const evalOptions = ref(false);
const mappedOptions = asyncComputed(
  async () =>
    typeof props.params.filterConfig.options === "function"
      ? await props.params.filterConfig.options()
      : props.params.filterConfig.options,
  [],
  evalOptions
);
watch(
  () => filterValue.value,
  (val) => props.params.SetFilterValue(props.params.column.colDef.field, val)
);
</script>
