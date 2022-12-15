<script setup lang="ts">
import { UserTableSchema } from "~/schemas/user";

const tableSchema = UserTableSchema();
</script>

<template>
  <DataTable v-bind="tableSchema">Users</DataTable>
</template>

<route lang="yaml">
name: users
</route>
