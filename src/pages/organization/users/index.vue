<script setup lang="ts">
import { UserTableSchema } from "~/schemas/user";

definePageMeta({
  name: "organization.users",
  middleware: ["auth"],
});

const userStore = useUserStore();
const tableSchema = UserTableSchema(userStore.activeOrganizationId as string);
</script>

<template>
  <CoreDataTable v-bind="tableSchema">Users</CoreDataTable>
</template>
