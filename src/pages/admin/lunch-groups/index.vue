<script setup lang="ts">
import { LunchGroupTableSchema } from "@/schemas/lunchGroup";
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "admin.lunchGroups",
  middleware: ["auth"],
});

const schema = LunchGroupTableSchema();
</script>

<template>
  <DataTable v-bind="schema">Lunch groups</DataTable>
</template>
