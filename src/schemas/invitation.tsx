import { FormSchema } from "@chronicstone/vue-sweetforms";
import { UserController } from "~/api/controllers/user.controller";
import { DataTableSchema } from "~/components/Core/DataTable/types";
import {
  Invitation,
  InvitationTargetApp,
  InvitationType,
} from "~/types/invitation";
import { helpers, minValue } from "@vuelidate/validators";
import {
  RenderBoolean,
  RenderEmailList,
  RenderInvitationType,
  RenderInvitationUsage,
} from "./utils/renderer";
import { GetOrganizations } from "./utils/resolver";

export function InvitationTableSchema(): DataTableSchema<Invitation> {
  return {
    remote: false,
    columns: [
      { label: "Type", key: "type", render: RenderInvitationType, width: 110 },
      {
        label: "Is active",
        key: "isExpired",
        render: (value) => RenderBoolean(!value),
        width: 100,
      },
      {
        label: "Organization",
        key: "organization.name",
        render: formatNullableText,
      },
      { label: "Emails (email type)", key: "emails", render: RenderEmailList },
      {
        label: "Max usage (link type)",
        key: "maxUsage",
        render: formatNullableText,
      },
      { label: "Usage progress", key: "usage", render: RenderInvitationUsage },
      { label: "Created at", key: "createdAt", render: formatDate },
      { label: "Expire at", key: "expireAt", render: formatDate },
    ],
    datasource: UserController.getInvitations,
    actions: [
      {
        label: "Invite users",
        icon: "mdi:plus",
        action: ({ tableApi }) =>
          CreateInvitation().then(
            (shouldRefresh) => shouldRefresh && tableApi.value.refreshData()
          ),
      },
    ],
  };
}

export function InvitationFormSchema(): FormSchema {
  return {
    gridSize: 8,
    fieldSize: "8 md:4",
    maxWidth: "700px",
    title: "Invite users",
    fields: [
      {
        label: "Invitation type",
        key: "type",
        type: "select",
        options: [
          { label: "Email", value: "email" },
          { label: "Shareable link", value: "link" },
        ],
        required: true,
        size: 8,
      },
      {
        label: "Expiration date",
        key: "expireAt",
        type: "date",
        required: true,
        fieldParams: {
          dateDisabled: (current) =>
            new Date(current).getTime() < new Date().getTime(),
        },
        transform: (value) => new Date(value).toISOString(),
      },
      {
        label: "Organization",
        key: "organizationId",
        type: "select",
        options: GetOrganizations,
        required: true,
      },
      {
        label: "Max usage",
        key: "maxUsage",
        type: "slider",
        fieldParams: {
          min: 0,
          max: 100,
          step: 1,
        },
        size: 8,
        validators: () => ({
          min: helpers.withMessage(
            "An invitation must have at least 1 entry",
            minValue(1)
          ),
        }),
        dependencies: ["type"],
        condition: (deps) => deps?.type === "link",
      },
      {
        label: "Emails list",
        key: "emails",
        type: "textarea",
        fieldParams: {},
        size: 8,
        required: true,
        placeholder: "Please input a list of emails, separated by a line break",
        dependencies: ["type"],
        condition: (deps) => deps?.type === "email",
        validators: () => ({
          minEmails: helpers.withMessage(
            "You need to input at least 1 valid email",
            (value: string) =>
              value
                ?.split("\n")
                ?.map((email: string) => email.trim())
                ?.filter(isValidEmail)?.length > 0
          ),
        }),
        transform: (value: string) =>
          value
            ?.split("\n")
            ?.map((email: string) => email.trim())
            ?.filter(isValidEmail),
      },
      {
        key: "emailsPreview",
        label: "Parsed emails:",
        type: "info",
        dependencies: ["emails"],
        condition: (deps) => deps?.emails,
        content: (deps) => {
          const emails = (deps?.emails ?? "")
            .split("\n")
            .map((email: string) => email.trim())
            .filter(isValidEmail);

          return (
            <div>
              <ul>
                {emails.map((email: string) => (
                  <li>• {email}</li>
                ))}
              </ul>
            </div>
          );
        },
      },
    ],
  };
}

async function CreateInvitation() {
  try {
    const { formApi, messageApi } = useReactifiedApi();
    const { isCompleted, formData } = await formApi.createForm(
      InvitationFormSchema()
    );

    if (!isCompleted) return false;

    if (formData.type === InvitationType.email) {
      await UserController.sendInvitationToUsers({
        organizationId: formData.organizationId,
        targetApp: InvitationTargetApp.client,
        expireAt: formData.expireAt,
        emails: formData.emails,
      });

      messageApi.success(
        "Invitation successfuly sent! Users will receive an invitation by email."
      );
      return true;
    } else {
      const link = await UserController.createOpenInvitationLink({
        organizationId: formData.organizationId,
        targetApp: InvitationTargetApp.client,
        expireAt: formData.expireAt,
        maxUsage: formData.maxUsage,
      });
      navigator.clipboard.writeText(link);
      messageApi.success("Invitation link copied to clipboard!");
      return true;
    }
  } catch (err) {
    console.error(err);
  }
}
