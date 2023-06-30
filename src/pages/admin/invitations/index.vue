<script setup lang="ts">
import { InvitationTableSchema } from "@/schemas/invitation";

definePageMeta({
  name: "admin.invitations",
  middleware: ["auth"],
});

const schema = InvitationTableSchema();
</script>

<template>
  <CoreDataTable v-bind="schema">Invitations</CoreDataTable>
</template>
