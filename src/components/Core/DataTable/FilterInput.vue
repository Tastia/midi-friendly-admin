<template>
  <label v-if="filter.inputType != 'checkbox' && filter.label" class="mb-2">{{
    filter.label
  }}</label>

  <NInput
    v-if="filter.inputType === 'text' && !focusSync"
    v-model:value="fieldState"
    clearable
    :placeholder="filter.placeholder ?? 'Search value'"
  />

  <NInput
    v-if="filter.inputType === 'text' && focusSync"
    v-model:value="focusSyncVal"
    clearable
    :placeholder="filter.placeholder ?? 'Search value'"
    :on-change="onChange"
  />

  <NSelect
    v-if="filter.inputType === 'select'"
    v-model:value="fieldState"
    tag
    clearable
    multiple
    filterable
    max-tag-count="responsive"
    :options="options"
    :loading="evalOptions || debounceLoader"
    :placeholder="filter?.placeholder ?? 'Select value(s)'"
  />

  <NDatePicker
    v-if="
      [
        'date',
        'datetime',
        'daterange',
        'datetimerange',
        'month',
        'year',
        'quarter',
      ].includes(filter.inputType)
    "
    v-model:value="fieldState"
    update-value-on-close
    :placeholder="filter?.placeholder ?? 'Select date'"
    :type="filter?.inputType"
  />

  <NTimePicker
    v-if="filter.inputType === 'time'"
    v-model:value="fieldState"
    :placeholder="filter?.placeholder ?? 'Select time'"
    :type="filter?.inputType"
  />

  <NCheckbox
    v-if="filter.inputType === 'checkbox'"
    v-model:checked="fieldState"
    size="large"
    :label="filter.label"
  />

  <div v-if="filter.inputType === 'checkboxGroup'">
    <NCheckboxGroup v-if="!evalOptions" v-model:value="fieldState">
      <div class="flex flex-wrap gap-3">
        <NCheckbox
          v-for="(option, index) in options"
          :key="index"
          :value="option?.value ?? option"
          :label="option?.label ?? option"
        />
      </div>
    </NCheckboxGroup>
    <n-spin v-if="evalOptions" size="small" />
  </div>

  <div v-if="filter.inputType === 'radioGroup'">
    <NRadioGroup
      v-if="!evalOptions"
      v-model:value="fieldState"
      :name="filter.key"
    >
      <div class="gap-3 flex flex-wrap justify-start">
        <NRadio
          v-for="({ label, value }, optionId) in options"
          :key="optionId"
          :value="value"
        >
          {{ label }}
        </NRadio>
      </div>
    </NRadioGroup>
    <n-spin v-if="evalOptions" size="small" />
  </div>
</template>

<script setup lang="ts">
import { Filter, FilterType } from "./types";
import { debouncedWatch, asyncComputed } from "@vueuse/core";
import { ref, watch, PropType, computed } from "vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  filter: {
    type: Object as PropType<Filter>,
    required: true,
  },
  modelValue: {
    type: [String, Array, Number, Boolean, Object, Array, null] as PropType<
      string | number | boolean | object | any[] | null
    >,
    required: true,
  },
  debounceTiming: {
    type: Number as PropType<number>,
    default: 1000,
  },
  tableKey: {
    type: String as PropType<string | undefined | null>,
    required: true,
  },
  persist: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  focusSync: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const debounceLoader = ref(false);
const fieldState = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});

const focusSyncVal = ref(props.modelValue);
const onChange = (value: any) => emit("update:modelValue", value);
// watch(() => fieldState.value, () => debounceLoader.value = true)
// debouncedWatch(() => fieldState.value, (value) => (debounceLoader.value = false, emit('update:modelValue', props.filter.format ? props.filter.format(value) : value)), { immediate: true, debounce: 1000 })

// IF FIELD === SELECTION
const evalOptions = ref(false);
const options = asyncComputed(
  async () =>
    typeof props.filter.options === "function"
      ? await props.filter.options()
      : props.filter.options,
  [],
  evalOptions
);
</script>
