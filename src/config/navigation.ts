import { MenuItemSection } from "@/types/_navigation";

const GeneralSection: MenuItemSection = {
  label: "Home",
  icon: "ph:house-line-duotone",
  slug: "general.home",
};

const AdminSection: MenuItemSection = {
  label: "Administration",
  icon: "ph:shield-check-duotone",
  slug: "admin",
  condition: (userStore) => {
    console.log(!!userStore.user?.admin);
    return !!userStore.user?.admin;
  },
  items: [
    {
      label: "Business & entities",
      items: [
        {
          label: "Organizations",
          icon: "ph:shield-check-duotone",
          slug: "admin.organizations",
        },
        {
          label: "Restaurants",
          icon: "ph:shield-check-duotone",
          slug: "admin.restaurants",
        },
        {
          label: "Lunch grouos",
          icon: "ph:shield-check-duotone",
          slug: "admin.lunchGroups",
        },
      ],
    },
    {
      label: "Users & access",
      items: [
        {
          label: "Users",
          icon: "ph:user-duotone",
          slug: "admin.users",
        },
        {
          label: "Invitations",
          icon: "ph:envelope-duotone",
          slug: "admin.invitations",
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          label: "Worker tasks",
          icon: "ph:shield-check-duotone",
          slug: "admin.workerTasks",
        },
      ],
    },
  ],
};

const OrganizationSection: MenuItemSection = {
  label: "Organization",
  icon: "ph:buildings-duotone",
  slug: "organization",
  entityKey: "organization",
  condition: (userStore) => !!userStore.organizations?.length,
  items: [
    {
      label: "Administration",
      items: [
        {
          label: "Users",
          icon: "ph:user-duotone",
          slug: "organization.users",
        },
        {
          label: "Invitations",
          icon: "ph:envelope-duotone",
          slug: "organization.invitations",
        },
      ],
    },
  ],
};

export const NavMenuItems = [AdminSection, OrganizationSection];
