<script setup lang="ts">
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "admin.restaurants",
  middleware: ["auth"],
});

const schema = RestaurantTableSchema();
</script>

<template>
  <DataTable v-bind="schema"> Restaurants </DataTable>
</template>
