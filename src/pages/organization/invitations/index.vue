<script setup lang="ts">
import { InvitationTableSchema } from "@/schemas/invitation";
import { DataTable } from "@chronicstone/vue-sweettools";

definePageMeta({
  name: "organization.invitations",
  middleware: ["auth"],
});

const userStore = useUserStore();
const schema = InvitationTableSchema(userStore.activeOrganizationId as string);
</script>

<template>
  <DataTable v-bind="schema">Invitations</DataTable>
</template>
