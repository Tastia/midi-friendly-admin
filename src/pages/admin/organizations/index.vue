<script setup lang="ts">
import { OrganizationTableSchema } from "~/schemas/organization";

const schema = OrganizationTableSchema();
</script>

<template>
  <DataTable v-bind="schema">Organizations</DataTable>
</template>

<route lang="yaml">
name: organizations
</route>
