<template>
  <div class="flex gap-2 items-center" @click="SetSort">
    {{ params.displayName }}
    <transition name="fade">
      <mdi-arrow-up v-if="isSorting" />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { IHeaderParams } from "ag-grid-community";
import { useAppStore } from "~/stores/app.store";

// eslint-disable-next-line no-undef
const props = defineProps<{ params: IHeaderParams }>();

const sortDirection = ref<string>();
const appStore = useAppStore();
const SetSort = () => {
  props.params.progressSort();
};
</script>
