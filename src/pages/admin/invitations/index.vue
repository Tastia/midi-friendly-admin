<script setup lang="ts">
import { InvitationTableSchema } from "@/schemas/invitation";
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "admin.invitations",
  middleware: ["auth"],
});

const schema = InvitationTableSchema();
</script>

<template>
  <DataTable v-bind="schema">Invitations</DataTable>
</template>
