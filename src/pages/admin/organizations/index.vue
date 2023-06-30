<script setup lang="ts">
import { OrganizationTableSchema } from "~/schemas/organization";

definePageMeta({
  name: "admin.organizations",
  middleware: ["auth"],
});

const schema = OrganizationTableSchema();
</script>

<template>
  <CoreDataTable v-bind="schema">Organizations</CoreDataTable>
</template>
