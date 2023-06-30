<script setup lang="ts">
import { UserTableSchema } from "~/schemas/user";

definePageMeta({
  name: "admin.users",
  middleware: ["auth"],
});

const tableSchema = UserTableSchema();
</script>

<template>
  <CoreDataTable v-bind="tableSchema">Users</CoreDataTable>
</template>
