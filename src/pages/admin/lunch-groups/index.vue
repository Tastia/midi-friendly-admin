<script setup lang="ts">
import { LunchGroupTableSchema } from "@/schemas/lunchGroup";

definePageMeta({
  name: "admin.lunchGroups",
  middleware: ["auth"],
});

const schema = LunchGroupTableSchema();
</script>

<template>
  <CoreDataTable v-bind="schema">Lunch groups</CoreDataTable>
</template>
