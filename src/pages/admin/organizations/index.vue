<script setup lang="ts">
import { OrganizationTableSchema } from "~/schemas/organization";
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "admin.organizations",
  middleware: ["auth"],
});

const schema = OrganizationTableSchema();
</script>

<template>
  <DataTable v-bind="schema">Organizations</DataTable>
</template>
