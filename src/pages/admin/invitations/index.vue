<script setup lang="ts">
import { InvitationTableSchema } from "~/schemas/invitation";

const schema = InvitationTableSchema();
</script>

<template>
  <DataTable v-bind="schema">Invitations</DataTable>
</template>

<route lang="yaml">
name: invitations
</route>
