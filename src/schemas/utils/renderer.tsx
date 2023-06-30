import {
  NAvatar,
  NAvatarGroup,
  NDataTable,
  NDropdown,
  NEllipsis,
  NPopover,
  NTag,
  NTooltip,
} from "naive-ui";
import { InvitationType, InvitationUsage } from "@/types/invitation";
import { CredentialsProviders, User } from "@/types/user";

export const RenderBoolean = (value: boolean) => (
  <span
    class={`iconify ${value ? "text-green-500" : "text-red-500"}`}
    data-icon={value ? "mdi:check" : "mdi:close"}
  />
);

export const RenderEllipsisText = (value: string) => (
  <NEllipsis>{value}</NEllipsis>
);

export const RenderUser = (fullName: string, avatar?: string) => (
  <NTooltip>
    {{
      default: () => <span>{fullName}</span>,
      trigger: () =>
        avatar ? (
          <NAvatar round src={avatar} />
        ) : (
          <NAvatar round>
            {fullName
              .split(" ")
              .map((w: string) => w.charAt(0))
              .join("")}
          </NAvatar>
        ),
    }}
  </NTooltip>
);

export const RenderUserStack = (users: User[]) => {
  function createDropdownOptions(
    options: Array<{ name: string; src?: string }>
  ) {
    return options.map((option, index) => ({
      key: index,
      label: option.name,
    }));
  }

  function mapUsersAvatar(users: User[], max = 3) {
    return users.map((user) => ({
      name: `${user.firstName} ${user.lastName}`,
      src: user?.avatar ?? "",
    }));
  }
  return (
    <NAvatarGroup options={mapUsersAvatar(users)} size={40} max={3}>
      {{
        avatar: ({ option }: { option: { name: string; src?: string } }) =>
          RenderUser(option.name, option.src),
        rest: ({
          options,
          rest,
        }: {
          options: { name: string; src?: string }[];
          rest: number;
        }) => (
          <NDropdown options={createDropdownOptions(options)} placement="top">
            <NAvatar>+{{ rest }}</NAvatar>
          </NDropdown>
        ),
      }}
    </NAvatarGroup>
  );
};

export const RenderCredentialsType = (type: `${CredentialsProviders}`) => {
  const providerIcon =
    type === CredentialsProviders.email
      ? "material-symbols:alternate-email"
      : type === CredentialsProviders.facebook
      ? "logos:facebook"
      : type === CredentialsProviders.google
      ? "logos:google-icon"
      : type === CredentialsProviders.linkedin
      ? "logos:linkedin-icon"
      : "material-symbols:error";
  return <span class="iconify text-sm font-black" data-icon={providerIcon} />;
};

export const RenderInvitationType = (value: InvitationType) => (
  <NTag type={value === InvitationType.email ? "info" : "warning"}>
    {formatKey(value)}
  </NTag>
);

export const RenderEmailList = (value: string[] | undefined) => {
  if (!value?.length) return "N/A";
  const columns = [{ title: "Email address", key: "email" }];
  return (
    <NPopover width={350} style="padding: 0" z-index={100}>
      {{
        trigger: () => (
          <div class="h-full pt-1">
            <NTag class="w-auto">
              {{
                default: () => <span>{value.length}</span>,
                icon: () => (
                  <span
                    class="iconify text-sm"
                    data-icon="mdi:email-multiple"
                  ></span>
                ),
              }}
            </NTag>
          </div>
        ),
        default: () => (
          <NDataTable
            bordered={true}
            maxHeight={250}
            data={value.map((email) => ({ email }))}
            columns={columns}
          />
        ),
      }}
    </NPopover>
  );
};

export const RenderInvitationUsage = (usages: InvitationUsage[]) => {
  const columns = [
    {
      title: "Invitation email",
      key: "email",
      render: (item: InvitationUsage) => formatNullableText(item.email),
    },
    {
      title: "Date",
      key: "usageDate",
      render: (item: InvitationUsage) => formatDateTime(item.usageDate),
    },
    {
      title: "Linked account",
      key: "linkedAccount",
      render: (item: InvitationUsage) => (
        <div class="flex flex-col gap-2">
          <div>
            {item.linkedAccount.firstName} {item.linkedAccount.lastName}
          </div>
          <div class="text-gray-500 flex items-center gap-1">
            <span>{item.linkedAccount.credentials.email}</span>
            <span class="text-black dark:text-white">
              [{RenderCredentialsType(item.linkedAccount.credentials.type)}]
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <NPopover width={600} style="padding: 0" z-index={100}>
      {{
        trigger: () => (
          <div class="pt-1">
            <NTag>
              {{
                default: () => <span>{usages.length}</span>,
                icon: () => (
                  <span class="iconify text-sm" data-icon="mdi:user"></span>
                ),
              }}
            </NTag>
          </div>
        ),
        default: () => (
          <NDataTable
            bordered={true}
            maxHeight={250}
            data={usages}
            columns={columns}
          />
        ),
      }}
    </NPopover>
  );
};
