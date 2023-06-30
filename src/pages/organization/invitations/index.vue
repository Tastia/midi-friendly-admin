<script setup lang="ts">
import { InvitationTableSchema } from "@/schemas/invitation";

definePageMeta({
  name: "organization.invitations",
  middleware: ["auth"],
});

const userStore = useUserStore();
const schema = InvitationTableSchema(userStore.activeOrganizationId as string);
</script>

<template>
  <CoreDataTable v-bind="schema">Invitations</CoreDataTable>
</template>
