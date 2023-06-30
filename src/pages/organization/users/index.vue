<script setup lang="ts">
import { UserTableSchema } from "~/schemas/user";
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "organization.users",
  middleware: ["auth"],
});

const userStore = useUserStore();
const tableSchema = UserTableSchema(userStore.activeOrganizationId as string);
</script>

<template>
  <DataTable v-bind="tableSchema">Users</DataTable>
</template>
