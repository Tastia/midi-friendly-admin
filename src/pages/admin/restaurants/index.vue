<script setup lang="ts">
definePageMeta({
  name: "admin.restaurants",
  middleware: ["auth"],
});

const schema = RestaurantTableSchema();
</script>

<template>
  <CoreDataTable v-bind="schema" />
</template>
