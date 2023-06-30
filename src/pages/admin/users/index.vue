<script setup lang="ts">
import { UserTableSchema } from "~/schemas/user";
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "admin.users",
  middleware: ["auth"],
});

const tableSchema = UserTableSchema();
</script>

<template>
  <DataTable v-bind="tableSchema">Users</DataTable>
</template>
