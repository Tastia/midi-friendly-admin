import { VNodeChild } from "vue";

export type NavigationMenuItem = {
  label: string | (() => VNodeChild);
  icon?: string;
  key: string;
  type?: "divider" | "group";
  children?: Array<NavigationMenuItem>;
};

export interface MenuItem {
  label: string;
  icon?: string;
  path?: string;
  slug?: string;
  items?: MenuItem[];
  permissions?: string[] | string;
}

export interface MenuItemGroup {
  label?: string;
  icon?: string;
  items: MenuItem[];
}

export interface MenuItemSection {
  label?: string;
  permissions?: string | Array<string>;
  entityKey?: "organization";
  icon: string;
  items?: MenuItemGroup[];
  slug?: string;
  condition?: (userStore: ReturnType<typeof useUserStore>) => boolean;
}
